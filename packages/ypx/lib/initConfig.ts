/**
 * Created by user on 2020/1/30.
 */
import { cloneDeep, defaultsDeep } from 'lodash';
import { camelCase } from 'camel-case';

export function defaultConfig()
{
	return {
		'enableGlobalCache': true,
		'disable-self-update-check': true,
	}
}

export function buildConfig(userconfig: any = {})
{
	userconfig = defaultsDeep(userconfig, defaultConfig());

	let o = Object.entries(userconfig)
		.reduce((a, [k, v]) => {

			a.rc.push(`${k} ${v}`);
			a.yml.push(`${camelCase(k)}: ${v}`);

			return a
		}, {
			rc: [] as string[],
			yml: [] as string[],
		})
	;

	return {
		rc: o.rc.join('\n') + '\n',
		yml: o.yml.join('\n') + '\n',
	}
}

export default buildConfig
