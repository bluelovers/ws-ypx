/**
 * Created by user on 2020/1/29.
 */

import { handleOptions } from '../lib/handleOptions';
import { createTemporaryDirectory, newTemporary } from '../lib/createTemporaryDirectory';
import { pathExistsSync } from 'fs-extra';
import { crossSpawnExtra } from 'cross-spawn-extra';
import { crossSpawnOutput } from '../lib/util';
import { initTemporaryPackage } from '../lib/initTemporaryPackage';
import { join } from 'path';
import { say } from 'cowsay';
import { __SELF_YPX_BIN } from './__root';
import { runLocalBin } from './lib/util';
import { installDependencies } from '../lib/installDependencies';
import { IRuntimeCache } from '../lib/types';
import { whichPackageManagerSync, EnumPackageManager, IPackageManager } from '@yarn-tool/detect-package-manager';
import { _createTestEnvironment, _expectCowsayFromCp } from './lib/helpers/cowsay-test-helper';
import newLogger from '../lib/logger';
import { _lazyTestEnvironment } from './lib/helpers/setup';

test(`test install`, async () =>
{
	const { tmp: actual, tmpRunTsdxInstalled } = await _lazyTestEnvironment({
		autoInstallTsdx: true,
	});

	await tmpRunTsdxInstalled([
		'--debug-bin'
	])
		.then(cp => {

			let output = crossSpawnOutput(cp.output).replace(/^\s+|\s+$/g,'');

			//console.dir(cp);

			// @ts-ignore
			console.log(`cp.exitCode =>`, cp.exitCode);
			// @ts-ignore
			expect(cp.exitCode).not.toEqual(1);

			console.log(`output =>`, output);
			expect(output).toContain('ypx_');

		})
	;

	// await actual.remove();

});

test(`cowsay`, async () =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment({
		// autoInstallTsdx: true,
	});

	await tmpRunTsdxLocal([
		'-q',
		'--ignore-existing',
		'cowsay',
		'--',
		'test'
	])
		.then(cp => {

			return _expectCowsayFromCp({
				cp,
				text: 'test',
			})

		})
	;

	await actual.remove();
});

test(`cowsay@latest`, async () =>
{
	const { tmp: actual, tmpRunTsdxLocal } = await _lazyTestEnvironment({
		autoInstallTsdx: false,
	});

	await tmpRunTsdxLocal([
		'-q',
		'--ignore-existing',
		'cowsay@latest',
		'--',
		'test'
	])
		.then(cp => {

			return _expectCowsayFromCp({
				cp,
				text: 'test',
			})

		})
	;

	await actual.remove();
});

test(`command not found: speedtest`, async () =>
{
	const { tmp: actual, tmpRunTsdxInstalled, tmpRunTsdxLocal } = await _lazyTestEnvironment({
		autoInstallTsdx: false,
	});

	await tmpRunTsdxLocal([
		'speedtest',
		'--',
		'-q',
	])
		.then(cp => {

			let output = crossSpawnOutput(cp.output);

			console.log(output);

			// @ts-ignore
			expect(cp.exitCode).toEqual(1);

			expect(output).toMatch(/command not found|Couldn't find a package/);

		})
		.finally(() => {
			return actual.remove()
		})
	;

	await actual.remove();
});
