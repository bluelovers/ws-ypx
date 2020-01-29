import Bluebird from 'bluebird';
import { writeFile, writeJSON } from 'fs-extra';
import { join } from "path";
import buildConfig from './initConfig';

export function initTemporaryPackage(tmpDir: string)
{
	let data = buildConfig();

	return Bluebird.all([
		writeFile(join(tmpDir, '.yarnrc'), data.rc),
		writeFile(join(tmpDir, '.yarnrc.yml'), data.yml),
		writeFile(join(tmpDir, 'yarn.lock'), ``),
		writeJSON(join(tmpDir, 'package.json'), {
			"license": "ISC",
		}),
	])
}

export default initTemporaryPackage
