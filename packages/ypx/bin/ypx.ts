#!/usr/bin/env node

import YPX from '../index';
import { inspect } from 'util'
import { IYPXArguments } from '../lib/types';
import yargs from 'yargs'
import Bluebird from 'bluebird';

let inputArgv = process.argv.slice(2);

export let argv = yargs(inputArgv)
	.parserConfiguration({
		'populate--': true,
	})
	.example(`$0 mocha`, ``)
	.example(`$0 -p esm ts-node mocha -- -r esm`, ``)
	.option('package', {
		desc: `define the package to be installed`,
		alias: 'p',
		array: true,
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
	.help(`h`)
	.showHelpOnFail(true)
	.argv as IYPXArguments
;

let { p = [] } = argv as typeof argv & {
	p: string[],
};

if (!p || !p.length)
{
	if (argv._.length !== 1)
	{
		throw new Error(`current not support this syntax, ${inspect(argv)}`)
	}
	else
	{
		p = [argv._.shift()];
	}
}

if (argv._.length && argv['--'].length)
{
	throw new Error(`current not support this syntax, ${inputArgv}`)
}

Bluebird.resolve(YPX({
		...argv,
		package: p,
	}, inputArgv))
	.tapCatch(e => {

	})
;
