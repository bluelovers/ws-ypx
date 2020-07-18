/**
 * Created by user on 2020/7/18.
 */

import yargs from 'yargs';
import { IYPXArguments } from 'ynpx/lib/types';

export function parseArgv(inputArgv: string[])
{
	let argv = parseArgvCore(inputArgv);

	if (argv._.length)
	{
		let found: number = -1;
		for (let i = 0; i < inputArgv.length; i++)
		{
			if (['--package', '-p'].includes(inputArgv[i - 1]))
			{
				continue;
			}

			if (inputArgv[i] === argv._[0])
			{
				let ls = inputArgv.slice(i, i + argv._.length)

				if (ls.every((value, index) => value === argv._[index]))
				{
					found = i+1;
					break;
				}
			}
		}

		if (found !== -1)
		{
			argv = parseArgvCore(inputArgv.slice(0, found))

			argv['--'] = inputArgv.slice(found);

			if (argv['--'][0] === '--')
			{
				argv['--'].shift();
			}
		}
	}

	return argv
}

export function parseArgvCore(inputArgv: string[])
{
	return yargs(inputArgv)
		.parserConfiguration({
			'populate--': true,
		})
		.example(`$0 mocha`, ``)
		.example(`$0 -p esm -p ts-node -p mocha -- -r esm`, ``)
		.example(`$0 -q cowsay -- "ynpx"`, ``)
		.option('package', {
			desc: `define the package to be installed`,
			alias: 'p',
			//array: true,
			string: true,
		})
		.option('quiet', {
			desc: `Suppressed any output from npx itself (progress bars, error messages, install reports)`,
			alias: 'q',
			boolean: true,
		})
		.option('ignoreExisting', {
			desc: `skip check packages exists or not`,
			boolean: true,
			conflicts: ['noInstall'],
		})
		.option('noInstall', {
			desc: `skip install packages`,
			boolean: true,
		})
		.option('preferOffline', {
			desc: `use network only if dependencies are not available in local cache`,
			boolean: true,
		})
		.option('debugBin', {
			desc: `for cli test only`,
			boolean: true,
		})
		.option('userconfig', {
			desc: `specifies a yarnrc file that Yarn should use (.yarnrc only, not .npmrc)`,
			alias: [
				'useYarnrc',
				'rc',
			],
			string: true,
			normalize: true,
		})
		.help(`h`)
		.showHelpOnFail(true)
		.argv as any as IYPXArguments
		;
}

export default parseArgv;
