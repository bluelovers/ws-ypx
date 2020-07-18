import parseArgv from '../index';
import { Arguments } from 'yargs';
import { inspect } from 'util';

test(`test`, () =>
{
	let inputArgv = [
		'-p',
		'ncu2',
		'-p',
		'ncu',
		'ncu',
		'-u',
	];

	let actual = parseArgv(inputArgv);

	expect(actual).toMatchObject({
		package: ['ncu2', 'ncu'],
		_: ['ncu'],
		'--': ['-u'],
	});

	argvSnap(actual);

});

test(`test2`, () =>
{
	let inputArgv = [
		'-p',
		'ncu2',
		'-p',
		'ncu',
		'ncu',
		'--',
		'-u',
	];

	let actual = parseArgv(inputArgv);

	expect(actual).toMatchObject({
		package: ['ncu2', 'ncu'],
		_: ['ncu'],
		'--': ['-u'],
	});

	argvSnap(actual);

});

describe(`test snap`, () => {

	([
		[
			'-q',
			'--ignore-existing',
			'cowsay@latest',
			'--',
			'test'
		],
		[
			'cowsay',
			'-q',
			'--ignore-existing',
			'--',
			'test'
		],
		[
			'-q',
			'--ignore-existing',
			'cowsay',
			'--',
			'test'
		],
		[
			'speedtest',
			'--',
			'-q',
		],
		[
			'speedtest',
			'-q',
		],
		[
			'-p',
			'xxx',
			'yyy',
			'-p',
		],
		'-p esm -p ts-node -p mocha -- -r esm'.split(' '),
		'-p yo -p generator-eslint-typescript yo -- eslint:plugin'.split(' '),
	] as string[][]).forEach(inputArgv => {

		test(inspect(inputArgv), () => {

			let actual = parseArgv(inputArgv);

			argvSnap(actual);

		})

	})

})

function argvSnap(actual: Arguments)
{
	expect(actual).toMatchSnapshot({
		$0: expect.any(String),
	});
}
