/**
 * Created by user on 2020/1/29.
 */

import { Console2 } from 'debug-color2'
import { IYPXArgumentsInput } from './types';

export function newLogger(argv: IYPXArgumentsInput)
{
	let console = new Console2(null, {
		label: true,
		time: true,
	});

	console.enabled = !argv.quiet;

	return console;
}

export default newLogger
