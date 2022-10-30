/**
 * Created by user on 2020/1/29.
 */
import { IRuntimeCache } from './types';
import { IYPXArguments } from '@ynpx/ynpx-argv';
export declare function handleEnv(argv: IYPXArguments, runtime: IRuntimeCache, _env?: any): IRuntimeCache["env"];
export default handleEnv;
