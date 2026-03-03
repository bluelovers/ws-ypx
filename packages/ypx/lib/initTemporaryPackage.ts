import Bluebird from 'bluebird';
import { writeFile, writeJSON } from 'fs-extra';
import { join } from "path";
import { buildConfig } from './initConfig';
import { IYPXArguments } from '@ynpx/ynpx-argv';

export function initTemporaryPackage(tmpDir: string, argv: Required<IYPXArguments>)
{
	let data = buildConfig(argv);

	return Bluebird.all([
		writeFile(join(tmpDir, '.yarnrc'), data.rc),
		writeFile(join(tmpDir, '.npmrc'), data.npmrc),
		writeFile(join(tmpDir, '.yarnrc.yml'), data.yml),
		writeFile(join(tmpDir, 'yarn.lock'), ``),
		writeJSON(join(tmpDir, 'package.json'), {
			"license": "ISC",
		}),
	])
}

export default initTemporaryPackage
