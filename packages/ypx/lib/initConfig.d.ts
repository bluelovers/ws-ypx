export declare function defaultConfig(): {
    enableGlobalCache: boolean;
    'disable-self-update-check': boolean;
    'prefer-offline': boolean;
    emoji: boolean;
};
export declare function buildConfig(userconfig?: any): {
    rc: string;
    yml: string;
};
export default buildConfig;
