/**
 * Created by user on 2020/1/30.
 */

export class YpxError extends Error
{
	override name = 'YpxError';

	constructor(public readonly exitCode?: number)
	{
		super(String(exitCode));
	}
}
