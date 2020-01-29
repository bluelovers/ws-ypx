/**
 * Created by user on 2020/1/29.
 */

import handleOptions from '../lib/handleOptions';
import createTemporaryDirectory, { newTemporary } from '../lib/createTemporaryDirectory';
import { pathExistsSync } from 'fs-extra';
import crossSpawnExtra from 'cross-spawn-extra';

jest.setTimeout(60 * 60 * 1000);

test(`test install`, async () =>
{
	let actual = await newTemporary();

	let cwd = actual.tmpDir;

	console.log(`target => `, cwd);

	await crossSpawnExtra('yarn', [
		'add',
		'ynpx'
	], {
		stdio: 'inherit',
		cwd,
	});

	await crossSpawnExtra('yarn', [
		'add',
		'ynpx',
	], {
		stdio: 'inherit',
		cwd,
	});

	await crossSpawnExtra('yarn', [
		'run',
		'ynpx',
		'--debug-bin'
	], {
		cwd,
		stripAnsi: true,
	})
		.then(cp => {

			let output = cp.stdout.toString().replace(/^\s+|\s+$/g,'');

			//console.dir(cp);

			// @ts-ignore
			//expect(cp.exitCode).not.toEqual(1);

			expect(output).toContain('ypx_');

		})
	;

	await actual.remove();

});
