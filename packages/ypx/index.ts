/**
 * Created by user on 2020/1/28.
 */

import crossSpawnExtra from 'cross-spawn-extra';
import createTemporaryDirectory from './lib/createTemporaryDirectory';
import { remove } from 'fs-extra';
import console from 'debug-color2/logger'
import findCommand from './lib/findCommand';
import { pathEnv } from 'path-env'
import initTemporaryPackage from './lib/initTemporaryPackage';
import { IYPXArgumentsInput, IRuntimeCache, IYPXArguments } from './lib/types';
import handleOptions from './lib/handleOptions';
import handleEnv from './lib/handleEnv';
import installDependencies from './lib/installDependencies';
import { inspect } from 'util';

export async function YPX(_argv: IYPXArgumentsInput, inputArgv?: string[])
{
	let argv = _argv as Required<IYPXArguments>;

	if (!argv.package?.length)
	{
		throw new Error(`package name is need`)
	}

	argv = await handleOptions(argv);

	let label = 'ypx';

	console.time(label);

	if (argv._.length > 1)
	{
		throw new Error(`command not invalid, ${argv._}`)
	}

	console.time(`installed`);

	let runtime: IRuntimeCache = {
		tmpDir: await createTemporaryDirectory(),
		created: false,
		skipInstall: {},
	};

	await initTemporaryPackage(runtime.tmpDir)
		.tapCatch(e =>
		{
			console.error(`failed create temp package, ${runtime.tmpDir}`)
		})
	;

	//console.dir(argv);

	await installDependencies(argv, runtime);

	if (Object.keys(runtime.skipInstall).length)
	{
		console.info(`skip install`, inspect(runtime.skipInstall), `or maybe u wanna use --ignore-existing`)
	}

	console.timeEnd(`installed`);

	let command = argv._[0] ?? argv.package[argv.package.length - 1];

	if (!(command in runtime.skipInstall))
	{
		await findCommand(command, runtime.tmpDir)
			.then(bin => {
				//console.debug(command, `=>`, bin);
				if (bin)
				{
					command = bin;
				}
			})
			.catch(err => null)
		;
	}

	let env = runtime.env = await handleEnv(argv, runtime);

	console.time(`exec`);

	console.debug(`[CWD]`, argv.cwd);
	console.debug(`[EXEC]`, command, argv['--']);
	await crossSpawnExtra(command, argv['--'], {
		stdio: 'inherit',
		env,
		cwd: argv.cwd,
	});

	console.timeEnd(`exec`);

	console.time(`remove temp package`);
	await remove(runtime.tmpDir);
	console.timeEnd(`remove temp package`);

	console.timeEnd(label);
}

export default YPX;
