import crossSpawnExtra from 'cross-spawn-extra';
import { pathExistsSync } from 'fs-extra';

export async function findCommand(name: string, cwd: string)
{
	let cp = crossSpawnExtra.sync('yarn', [
		'bin',
		name,
	].filter(v => v != null), {
		stripAnsi: true,
		cwd,
	});

	let bin = cp.stdout.toString()
		.replace(/^\s+|\s+$/g, '')
	;
	if (bin && pathExistsSync(bin))
	{
		return bin;
	}
}

export default findCommand
