/**
 * Created by user on 2020/1/30.
 */

import { runLocalBin } from './util';
import { crossSpawnOutput } from '../lib/util';
import { writeFile } from 'fs-extra';
import { join } from 'path';

runLocalBin(['-h'])
	.then(async(cp) => {

		let output = crossSpawnOutput(cp.output)

		await writeFile(join(__dirname, '..', 'cli.md'), `# cli\n\n\n\`\`\`\n${output}\n\`\`\`\n`)

	})
;

