#!/usr/bin/env node

import { YPX } from '../index';
import { inspect } from 'util'
import Bluebird from 'bluebird';
import { updateNotifier } from '@yarn-tool/update-notifier';
import { YpxError } from '../lib/err';
import { parseArgv } from '@ynpx/ynpx-argv';

let inputArgv = process.argv.slice(2);

updateNotifier([__dirname, '..']);

let argv = parseArgv(inputArgv);

if (argv.debugBin)
{
	console.log(__filename);
	process.exit();
}

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
		// @ts-ignore
		p = [argv._.shift()];
	}
}

/*
if (argv._.length && argv['--'].length)
{
	throw new Error(`current not support this syntax, ${inputArgv}`)
}
 */

Bluebird.resolve()
	.then(() => YPX({
		...argv,
		package: p,
	}, inputArgv))
	.catch(YpxError, (e) =>
	{
		process.exit(e.exitCode);
	})
	.tapCatch((e) =>
	{
		process.exitCode ||= (e?.exitCode ?? 1);
	})
	.tap((e) =>
	{
		if (e && e instanceof YpxError)
		{
			process.exit(e.exitCode);
		}
	})
;
