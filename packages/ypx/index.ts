/**
 * Created by user on 2020/1/28.
 */

import crossSpawnExtra from 'cross-spawn-extra';
import createTemporaryDirectory from './lib/createTemporaryDirectory';
import { remove } from 'fs-extra';
import findCommand from './lib/findCommand';
import initTemporaryPackage from './lib/initTemporaryPackage';
import { IYPXArgumentsInput, IRuntimeCache, IYPXArguments } from './lib/types';
import handleOptions from './lib/handleOptions';
import handleEnv from './lib/handleEnv';
import installDependencies from './lib/installDependencies';
import { inspect } from 'util';
import newLogger from './lib/logger';
import binExists from 'bin-exists';
import Bluebird from 'bluebird';
import { YpxError } from './lib/err';
import { defaultPackageBin } from '@yarn-tool/get-pkg-bin';

export async function YPX(_argv: IYPXArgumentsInput, inputArgv?: string[])
{
	let argv = _argv as Required<IYPXArguments>;

	if (!argv.package?.length)
	{
		throw new Error(`package name is need`)
	}

	argv = await handleOptions(argv);

	if (argv._.length > 1)
	{
		throw new Error(`command not invalid, ${argv._}`)
	}

	let runtime: IRuntimeCache = {
		tmpDir: await createTemporaryDirectory(),
		created: false,
		skipInstall: {},
		console: newLogger(argv),
	};

	const consoleShow = newLogger({
		...argv,
		quiet: false,
	});

	const { console } = runtime;

	return Bluebird.resolve()
		.then(async () => {
			let label = 'ypx';

			console.time(label);
			console.time(`installed`);

			await initTemporaryPackage(runtime.tmpDir)
				.tapCatch(e =>
				{
					console.error(`failed create temp package, ${runtime.tmpDir}`)
				})
			;

			await installDependencies(argv, runtime);

			if (Object.keys(runtime.skipInstall).length)
			{
				console.info(`skip install`, inspect(runtime.skipInstall), `or maybe u wanna use --ignore-existing`)
			}

			console.timeEnd(`installed`);

			let command = argv._[0] ?? argv.package[argv.package.length - 1];
			let cmd_exists: boolean;

			if (/^[^@]+@.+/.test(command))
			{
				command = command
					.replace(/^([^@]+)@.+$/, '$1')
				;

				delete runtime.skipInstall[command];
			}

			if (!(command in runtime.skipInstall))
			{
				await findCommand(command, runtime.tmpDir)
					.catch(err => null)
					.then(bin =>
					{
						//console.debug(command, `=>`, bin);
						if (bin)
						{
							command = bin;
							cmd_exists = true;
						}
						else
						{
							cmd_exists = false;
						}
					})
				;
			}

			if (!cmd_exists)
			{
				let paths = [
					runtime.tmpDir,
					argv.cwd,
				].filter(v => v);

				await Bluebird.resolve()
					.then(v => defaultPackageBin({
						name: argv.package[argv.package.length - 1],
						paths: paths.length ? paths : undefined,
					}, command))
					//.tapCatch(err => console.error(err))
					.catch(err => null)
					.then(bin =>
					{
						//console.debug(command, `=>`, bin);
						if (bin)
						{
							command = bin;
							cmd_exists = true;
						}
						else
						{
							cmd_exists = false;
						}
					})
			}

			if (!cmd_exists)
			{
				await binExists(command)
					.catch(e => null)
					.then(bool => {

						if (bool)
						{
							console.warn(`found command '${command}', but it maybe not a module bin`)
						}
						else
						{
							console.warn(`command not found: ${command}, maybe will not callable`)
						}
					})
				;
			}

			let env = runtime.env = await handleEnv(argv, runtime);

			console.time(`exec`);

			console.debug(`[CWD]`, argv.cwd);
			if (argv.userconfig)
			{
				console.debug(`[RC]`, argv.userconfig);
			}
			console.debug(`[EXEC]`, command, argv['--']);
			let cp = await crossSpawnExtra(command, argv['--'], {
				stdio: 'inherit',
				env,
				cwd: argv.cwd,
			})
				.catch(e => {

					if (!cmd_exists && e.code === 'ENOENT')
					{
						consoleShow.magenta.error(`command not found: ${command}`);
						//console.error(e);
						console.timeEnd(`exec`);
						console.timeEnd(label);

						return Promise.reject(new YpxError(1));
					}

					return Promise.reject(e);
				})
			;

			console.timeEnd(`exec`);

			console.time(`remove temp package`);
			await remove(runtime.tmpDir);
			console.timeEnd(`remove temp package`);

			console.timeEnd(label);

			// @ts-ignore
			if (cp.exitCode)
			{
				// @ts-ignore
				return new YpxError(cp.exitCode)
			}
		})
		.tapCatch(async () => {
			await remove(runtime.tmpDir).catch(err => null);
		})
		.tap(async () => {
			await remove(runtime.tmpDir).catch(err => null);
		})
	;
}

export default YPX;
