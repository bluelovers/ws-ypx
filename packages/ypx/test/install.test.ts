/**
 * Created by user on 2020/1/29.
 */

import handleOptions from '../lib/handleOptions';
import createTemporaryDirectory, { newTemporary } from '../lib/createTemporaryDirectory';
import { pathExistsSync } from 'fs-extra';
import crossSpawnExtra from 'cross-spawn-extra';
import { crossSpawnOutput } from '../lib/util';
import initTemporaryPackage from '../lib/initTemporaryPackage';
import { join } from 'path';
import { say } from 'cowsay';

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
		env: process.env,
	});

	await crossSpawnExtra('yarn', [
		'run',
		'ynpx',
		'--debug-bin'
	], {
		cwd,
		stripAnsi: true,
		env: process.env,
	})
		.then(cp => {

			let output = cp.stdout.toString().replace(/^\s+|\s+$/g,'');

			//console.dir(cp);

			// @ts-ignore
			console.log(`cp.exitCode =>`, cp.exitCode);
			// @ts-ignore
			expect(cp.exitCode).not.toEqual(1);

			console.log(`output =>`, output);
			expect(output).toContain('ypx_');

		})
	;

	await actual.remove();

});

test(`cowsay`, async () =>
{
	let actual = await newTemporary();
	await initTemporaryPackage(actual.tmpDir);

	let cwd = actual.tmpDir;

	console.log(`target => `, cwd);

	await crossSpawnExtra('yarn', [
		'add',
		'ynpx',
	], {
		cwd,
		env: process.env,
	});

	await crossSpawnExtra('yarn', [
		'ynpx',
		'--',
		'-q',
		'--ignore-existing',
		'cowsay',
		'--',
		'test'
	], {
		cwd,
		stripAnsi: true,
		env: process.env,
	})
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			console.log(output);

			expect(output).toContain('< test >');
			expect(output).toContain('(oo)\\_______');

			expect(output).toStrictEqual(say({
				text: 'test',
			}))

		})
	;

	await actual.remove();
});

test(`cowsay@latest`, async () =>
{
	let actual = await newTemporary();
	await initTemporaryPackage(actual.tmpDir);

	let cwd = actual.tmpDir;

	console.log(`target => `, cwd);

	await crossSpawnExtra('node', [
		join(__dirname, '..', 'bin', 'ypx.js'),
		'-q',
		'--ignore-existing',
		'cowsay@latest',
		'--',
		'test'
	], {
		cwd,
		stripAnsi: true,
		env: process.env,
	})
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			console.log(output);

			expect(output).toContain('< test >');
			expect(output).toContain('(oo)\\_______');

			expect(output).toStrictEqual(say({
				text: 'test',
			}))

		})
	;

	await actual.remove();
});

test(`command not found: speedtest`, async () =>
{
	let actual = await newTemporary();

	let cwd = actual.tmpDir;

	console.log(`target => `, cwd);

	await crossSpawnExtra('yarn', [
		'add',
		'ynpx',
	], {
		cwd,
		env: process.env,
	});

	await crossSpawnExtra('yarn', [
		'run',
		'ynpx',
		'speedtest',
		'--',
		'-q',
	], {
		cwd,
		stripAnsi: true,
		env: process.env,
	})
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			console.log(output);

			// @ts-ignore
			expect(cp.exitCode).toEqual(1);

			expect(output).toContain('command not found');

		})
		.finally(() => {
			return actual.remove()
		})
	;

	await actual.remove();
});
