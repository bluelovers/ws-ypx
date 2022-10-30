import { ITSRequiredWith } from 'ts-type';
import { IRuntimeCache } from './types';
import { async as crossSpawnExtra } from 'cross-spawn-extra';
import Bluebird from 'bluebird';
import { findCommand } from './findCommand';
import { dirname } from 'path';
import { IYPXArguments } from '@ynpx/ynpx-argv';

export async function installDependencies(argv: IYPXArguments, runtime: IRuntimeCache)
{
	let pkgs = argv.package.slice();

	if (!argv.ignoreExisting)
	{
		pkgs = await Bluebird.resolve(pkgs)
			.filter(async (name) => {

				let r: string;

				try
				{
					r = require.resolve(name + '/package.json', {
						paths: [argv.cwd]
					});
					runtime.skipInstall[name] = r;
					return false;
				}
				catch (e)
				{

				}

				if (r = await findCommand(name, argv.cwd))
				{
					runtime.skipInstall[name] = r;
					return false;
				}

				return true;
			})
		;
	}

	if (pkgs.length)
	{
		if (argv.noInstall)
		{
			pkgs.forEach(name => runtime.skipInstall[name] = undefined)
		}
		else
		{
			await crossSpawnExtra('yarn', [
				'add',
				...pkgs,
				(argv.quiet ? '--quiet' : null),
				(argv.preferOffline ? '--prefer-offline' : null),
				'--link-duplicates',
				'--no-node-version-check',
				'--ignore-optional',
				(argv.userconfig ? '--use-yarnrc' : null),
				(argv.userconfig ? argv.userconfig : null),
			].filter(v => v != null), {
				stripAnsi: true,
				cwd: runtime.tmpDir,
				stdio: argv.quiet ? undefined : 'inherit',
				env: process.env,
			});
		}
	}
}

export default installDependencies
