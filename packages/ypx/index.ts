/**
 * Created by user on 2020/1/28.
 */

import { async as crossSpawnExtra } from 'cross-spawn-extra';
import { createTemporaryDirectory } from './lib/createTemporaryDirectory';
import { remove } from 'fs-extra';
import { findCommand } from './lib/findCommand';
import { initTemporaryPackage } from './lib/initTemporaryPackage';
import { IYPXArgumentsInput, IRuntimeCache } from './lib/types';
import { handleOptions } from './lib/handleOptions';
import { handleEnv } from './lib/handleEnv';
import { installDependencies, whichPackageManager, IPackageManager } from './lib/installDependencies';
import { inspect } from 'util';
import { newLogger } from './lib/logger';
import binExists from 'bin-exists';
import Bluebird from 'bluebird';
import { YpxError } from './lib/err';
import { defaultPackageBin } from '@yarn-tool/get-pkg-bin';
import { AggregateErrorExtra } from 'lazy-aggregate-error';
import { IYPXArguments } from '@ynpx/ynpx-argv';
import { resolvePackage } from '@yarn-tool/require-resolve';
import { _processIfNeedInitTmpPkg } from './lib/core';

export async function YPX(_argv: IYPXArgumentsInput, inputArgv?: string[])
{
	let argv = _argv as Required<IYPXArguments>;

	if (!argv.package?.length)
	{
		throw new Error(`package name is needed`)
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
		needInitTmpPkg: true,
	};

	const consoleShow = newLogger({
		...argv,
		quiet: false,
	});

	const { console } = runtime;

	return Bluebird.resolve()
		.then(async () =>
		{
			let label = 'ypx';

			console.time(label);

			/**
			 * 檢測要使用的套件管理器並更新 argv.npmClient
			 * Detect package manager and update argv.npmClient
			 */
			const npmClient = await whichPackageManager(argv.npmClient as IPackageManager[]);
			if (!npmClient)
			{
				throw new Error(`no package manager found`)
			}
			argv.npmClient = [npmClient];

			console.debug(`[npmClient]`, npmClient);

			if (argv.package.length !== 1)
			{
				await _processIfNeedInitTmpPkg(argv, runtime);
			}
			else
			{
				runtime.needInitTmpPkg = null;
			}

			// console.debug(`[temp package]`, runtime.tmpDir);

			// @ts-ignore
			let command: string = argv._[0] ?? argv.package[argv.package.length - 1];
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
				/**
				 * 嘗試使用 resolvePackage + defaultPackageBin 搜尋 command
				 * Try to find command using resolvePackage + defaultPackageBin
				 */
				await Bluebird.resolve()
					.then(() =>
					{
						const pkgInfo = resolvePackage(command, {
							includeGlobal: true,
							cwd: runtime.needInitTmpPkg === false ? argv.cwd : runtime.tmpDir,
						});

						// console.dir(pkgInfo);

						console.debug(`detect a package ${pkgInfo.name}@${pkgInfo.pkg.version}`);
						console.dir({
							pkgRoot: pkgInfo.pkgRoot,
							bin: pkgInfo.pkg.bin,
							exports: pkgInfo.pkg.exports,
						});

						/**
						 * 若找到套件資訊，使用 defaultPackageBin 取得 bin 路徑
						 * If package info found, use defaultPackageBin to get bin path
						 */
						let bin = defaultPackageBin(pkgInfo, command);

						if (bin)
						{
							command = bin;
							cmd_exists = true;
							console.debug(`found command: ${command}`);

							runtime.needInitTmpPkg = false;
						}
						return bin;
					})
					.catch(e =>
					{
						return null as null
					})
					.then(async result =>
					{
						/**
						 * 若上述方法未找到，使用 findCommand 作為後備
						 * If above methods didn't find, use findCommand as fallback
						 */
						if (!cmd_exists)
						{
							runtime.needInitTmpPkg = true;
							await _processIfNeedInitTmpPkg(argv, runtime);

							return findCommand(command, runtime.tmpDir)
								.catch(e =>
								{
									return null as null
								})
								.then(bin2 =>
								{
									if (bin2)
									{
										command = bin2;
										cmd_exists = true;
									}
									else
									{
										cmd_exists = false;
										console.debug(`can't find command by 'yarn bin ${command}'`);
									}
									return bin2;
								});
						}
						return result;
					})
				;
			}
			else
			{
				runtime.needInitTmpPkg = true;
			}

			await _processIfNeedInitTmpPkg(argv, runtime);

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
					.catch(e =>
					{
						return null as null
					})
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

							console.debug(`can't find default package bin of ${command}`);
						}
					})
			}

			if (!cmd_exists)
			{
				await binExists(command)
					.catch(e =>
					{
						return null as null
					})
					.then(bool =>
					{

						if (bool)
						{
							console.warn(`found command '${command}', might not be a module bin`)
						}
						else
						{
							console.warn(`command not found: ${command}, might not be callable`)
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
					.catch(e =>
					{

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

			if (!argv.debugMode)
			{
				console.time(`remove temp package`);
				await removeTmpDir();
				console.timeEnd(`remove temp package`);
			}

			console.timeEnd(label);

			// @ts-ignore
			if (cp.exitCode)
			{
				// @ts-ignore
				return new YpxError(cp.exitCode)
			}
		})
		.tapCatch(async () =>
		{
			return removeTmpDir().catch(e =>
			{
				return null as null
			});
		})
		.tap(async () =>
		{
			return removeTmpDir().catch(e =>
			{
				return null as null
			});
		})
		;

	async function removeTmpDir()
	{
		if (!argv.debugMode)
		{
			return remove(runtime.tmpDir)
		}
	}
}

export default YPX;
