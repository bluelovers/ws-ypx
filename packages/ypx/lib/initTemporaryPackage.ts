import Bluebird from 'bluebird';
import { writeFile, writeJSON } from 'fs-extra';
import { join } from "path";

export function initTemporaryPackage(tmpDir: string)
{
	return Bluebird.all([
		writeFile(join(tmpDir, '.yarnrc'), [
			`enableGlobalCache true`,
			`disable-self-update-check true`,
		].join('\n') + '\n'),
		writeFile(join(tmpDir, '.yarnrc.yml'), [
			`enableGlobalCache: true`,
			`disableSelfUpdateCheck: true`,
		].join('\n') + '\n'),
		writeFile(join(tmpDir, 'yarn.lock'), ``),
		writeJSON(join(tmpDir, 'package.json'), {
			"license": "ISC",
		}),
	])
}

export default initTemporaryPackage
