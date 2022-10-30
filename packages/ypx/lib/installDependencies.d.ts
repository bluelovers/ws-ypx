import { IRuntimeCache } from './types';
import { IYPXArguments } from '@ynpx/ynpx-argv';
export declare function installDependencies(argv: IYPXArguments, runtime: IRuntimeCache): Promise<void>;
export default installDependencies;
