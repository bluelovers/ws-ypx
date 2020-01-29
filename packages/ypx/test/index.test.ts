/**
 * Created by user on 2020/1/27.
 */

///<reference types="jest"/>

import handleOptions from '../lib/handleOptions';
import createTemporaryDirectory, { newTemporary } from '../lib/createTemporaryDirectory';
import { pathExistsSync } from 'fs-extra';

test(`handleOptions`, async () =>
{
	let actual = handleOptions({
		cwd: '__dirname',
	} as any);

	expect(actual).toHaveProperty('package');
	expect(actual).toHaveProperty('quiet');
	expect(actual).toHaveProperty('preferOffline');
	expect(actual).toMatchSnapshot()
});

test(`test temp dir`, async () =>
{
	let actual = await newTemporary();

	expect(actual.tmpDir).toContain('ypx_');
	expect(pathExistsSync(actual.tmpDir)).toBeTruthy();
	expect(typeof actual.remove).toStrictEqual('function');

	expect(actual.remove()).resolves.not.toThrow();

});
