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
		'prefer-offline': true,
		'emoji': true,
	}
}

export function buildConfig(userconfig: any = {})
{
	userconfig = defaultsDeep(userconfig, defaultConfig());

	let o = Object.entries(userconfig)
		.reduce((a, [k, v]) => {

			let ck = camelCase(k);

			a.rc.push(`${k} ${v}`);
			a.rc.push(`${ck} ${v}`);

			a.yml.push(`${ck}: ${v}`);

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
