/**
 * Created by user on 2020/1/30.
 */
import { SpawnASyncReturns, SpawnASyncReturnsPromise, ISpawnASyncError, SpawnSyncReturns, SpawnOptions, SpawnSyncOptions, CrossSpawnExtra } from 'cross-spawn-extra/core';
import { crlf } from 'crlf-normalize';

export const stripAnsi = CrossSpawnExtra.stripAnsi;

export function crossSpawnOutput(buf: SpawnSyncReturns["output"] | Buffer, options: {
	clearEol?: boolean,
	stripAnsi?: boolean,
} = {
	clearEol: true,
}): string
{
	let output = '';

	if (!Buffer.isBuffer(buf) && Array.isArray(buf))
	{
		output = buf
			.filter(function (b)
			{
				return !(!b || !b.length)
			})
			.map(function (b)
			{
				return b.toString();
			})
			.join("\n")
	}
	else
	{
		output = (buf || '').toString();
	}

	if (options.stripAnsi)
	{
		output = stripAnsi(output);
	}

	output = crlf(output);

	if (options.clearEol || options.clearEol == null)
	{
		output = output.replace(/\n+$/g, '');
	}

	return output;
}
