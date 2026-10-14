import { consoleLogger as console } from 'debug-color2/logger';

export function testLog(...args: any[])
{
	console.log(`[TEST:LOG]`, ...args);
}

export function testLogGray(...args: any[])
{
	console.gray.log(`[TEST:LOG]`, ...args);
}
