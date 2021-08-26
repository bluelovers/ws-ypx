import { sync as crossSpawnExtra } from 'cross-spawn-extra';
import { pathExistsSync, readJSON } from 'fs-extra';
import binExists from 'bin-exists';
import { dirname } from 'path';

export async function findCommand(name: string, cwd: string)
{
	let cp = await crossSpawnExtra('yarn', [
		'bin',
		name,
	].filter(v => v != null), {
		stripAnsi: true,
		cwd,
		env: process.env,
	});

	let bin = cp.stdout.toString()
		.replace(/^\s+|\s+$/g, '')
	;
	if (bin && pathExistsSync(bin))
	{
		return bin;
	}
}

export async function findCommand2(name: string, cwd: string)
{
	try
	{
		let file = require.resolve(name + '/package.json', {
			paths: [cwd]
		});

		let json = await readJSON(file);
		let dir = dirname(file);

		if (json.bin)
		{
			let bin: string;
			if (typeof json.bin === 'string')
			{
				bin = json.bin;
			}
			else
			{
				bin = Object.values(json.bin)[0] as string
			}


		}
	}
	catch (e)
	{

	}
}

export default findCommand
