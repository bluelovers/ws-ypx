/**
 * Created by user on 2020/1/28.
 */

import crossSpawnExtra from 'cross-spawn-extra';
import createTemporaryDirectory from './lib/createTemporaryDirectory';
import { join, delimiter } from 'path';
import { writeFile, remove, writeJSON, pathExistsSync } from 'fs-extra';
import Bluebird from 'bluebird';
import { Arguments } from 'yargs-parser-extra'
import { ITSRequiredWith } from 'ts-type'
import console from 'debug-color2/logger'
import findCommand from './lib/findCommand';
import { pathString, pathEnv } from 'path-env'

export async function YPX(argv: ITSRequiredWith<Arguments<{
	package: string[],
	quiet?: boolean,
}>, 'package'> & {
	cwd?: string,
})
{
	if (!argv.package?.length)
	{
		throw new Error(`package name is need`)
	}

	let label = 'ypx';

	console.time(label);

	if (argv._?.length > 1)
	{
		throw new Error(`command not invalid, ${argv._}`)
	}

	argv.cwd = argv.cwd ?? process.cwd();

	let command = argv._[0];

	console.time(`installed`);

	let tmpDir = await createTemporaryDirectory();

	await Bluebird.all([
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
		.tapCatch(e =>
		{
			console.error(`failed create temp package, ${tmpDir}`)
		})
	;

	console.dir(argv);

	await crossSpawnExtra('yarn', [
		'add',
		...argv.package,
		(argv.quiet ? '--quiet' : null),
		(argv.preferOffline ? '--refer-offline' : null),
		'--link-duplicates',
		'--no-node-version-check',
		'--ignore-optional',
	].filter(v => v != null), {
		stripAnsi: true,
		cwd: tmpDir,
		stdio: 'inherit',
	});

	console.green.timeEnd(`installed`);

	await findCommand(command = command ?? argv.package[argv.package.length - 1], tmpDir)
		.then(bin => {
			//console.debug(command, `=>`, bin);
			command = bin;
		})
		.catch(err => null)
	;

	let paths = pathEnv()
		.path.append([tmpDir])
	;

	let env = paths.get.env();
	// @ts-ignore
	env.path = env.Path = env.PATH;

	//console.dir(env);
	//console.dir(paths.path.get.string());

	console.time(`exec`);

	console.debug(`[CWD]`, argv.cwd);
	console.debug(`[EXEC]`, command, argv['--'] ?? '');
	await crossSpawnExtra(command, argv['--'], {
		stdio: 'inherit',
		env: paths.get.env(),
		cwd: argv.cwd,
	});

	console.timeEnd(`exec`);

	console.time(`remove temp package`);
	await remove(tmpDir);
	console.timeEnd(`remove temp package`);

	console.green.timeEnd(label);
}

export default YPX;
