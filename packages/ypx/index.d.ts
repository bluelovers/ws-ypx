/**
 * Created by user on 2020/1/28.
 */
import { IYPXArgumentsInput } from './lib/types';
import { YpxError } from './lib/err';
export declare function YPX(_argv: IYPXArgumentsInput, inputArgv?: string[]): Promise<YpxError>;
export default YPX;
