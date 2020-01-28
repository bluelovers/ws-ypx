#!/usr/bin/env node

import parse, { detailed, SymInputArgs } from 'yargs-parser-extra'
import YPX from '../index';
import { Arguments } from 'yargs-parser-extra'
import { inspect } from 'util'

let argv = parse(process.argv.slice(2), {
	alias: {
		package: ['p'],
		quiet: ['q'],
	},
	array: ['package'],
	boolean: [
		'preferOffline',
		'quiet',
	],
	normalize: [
		'cwd',
	]
}) as Arguments<{
	package: string[],
	quiet?: boolean,
	cwd?: string,
}>;

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
	throw new Error(`current not support this syntax, ${argv[SymInputArgs]}`)
}

YPX({
	...argv,
	package: p,
});
