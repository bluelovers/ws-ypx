/**
 * Created by user on 2020/1/27.
 */

///<reference types="jest"/>

import handleOptions from '../lib/handleOptions';
import createTemporaryDirectory, { newTemporary } from '../lib/createTemporaryDirectory';
import { pathExistsSync } from 'fs-extra';
import { join } from 'path';
import initTemporaryPackage from '../lib/initTemporaryPackage';

test(`handleOptions`, async (done) =>
{
	let actual = handleOptions({
		cwd: '__dirname',
	} as any);

	expect(actual).toHaveProperty('package');
	expect(actual).toHaveProperty('quiet');
	expect(actual).toHaveProperty('preferOffline');
	expect(actual).toMatchSnapshot()

	done();
});

test(`test temp dir`, async (done) =>
{
	let actual = await newTemporary();

	expect(actual.tmpDir).toContain('ypx_');
	expect(pathExistsSync(actual.tmpDir)).toBeTruthy();
	expect(typeof actual.remove).toStrictEqual('function');

	await initTemporaryPackage(actual.tmpDir);

	expect(pathExistsSync(join(actual.tmpDir, '.yarnrc'))).toBeTruthy();
	expect(pathExistsSync(join(actual.tmpDir, '.yarnrc.yml'))).toBeTruthy();
	expect(pathExistsSync(join(actual.tmpDir, 'yarn.lock'))).toBeTruthy();
	expect(pathExistsSync(join(actual.tmpDir, 'package.json'))).toBeTruthy();

	await expect(actual.remove()).resolves.not.toThrow();

	expect(pathExistsSync(actual.tmpDir)).toBeFalsy();

	done();
});
