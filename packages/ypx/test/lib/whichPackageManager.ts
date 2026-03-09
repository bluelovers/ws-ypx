import which from 'which';
import { ITSTypeAndStringLiteral } from 'ts-type';

/**
 * 使用 which 依序檢查套件管理器列表，返回第一個可用的
 * Sequentially check package managers using which, return the first available one
 *
 * @param npmClients - 套件管理器列表 / Package manager list
 * @returns 可用的套件管理器名稱 / Available package manager name
 *
 * @deprecated use '@yarn-tool/detect-package-manager'
 */
export async function whichPackageManager(
	npmClients: IPackageManager[] | undefined,
): Promise<IPackageManager>
{
	/**
	 * 合併使用者指定的優先順序與預設順序
	 * Merge user-specified priority with default order
	 *
	 * @deprecated use '@yarn-tool/detect-package-manager'
	 */
	const clientsToCheck: IPackageManager[] = _handleClientsToCheck(npmClients);

	/**
	 * 依序檢查每個套件管理器是否可用
	 * Check each package manager sequentially for availability
	 *
	 * @deprecated use '@yarn-tool/detect-package-manager'
	 */
	for (const client of clientsToCheck)
	{
		const commandPath = await which(client).catch(() => null);
		if (commandPath)
		{
			return client;
		}
	}

	return clientsToCheck[0];
}

/**
 * @deprecated use '@yarn-tool/detect-package-manager'
 */
export const enum EnumPackageManager
{
	'yarn' = 'yarn',
	'npm' = 'npm',
	'pnpm' = 'pnpm',
}

/**
 * 支援的套件管理器類型
 * Supported package manager types
 *
 * @deprecated use '@yarn-tool/detect-package-manager'
 */
export type IPackageManager = ITSTypeAndStringLiteral<EnumPackageManager>;
/**
 * 預設的套件管理器優先順序
 * Default package manager priority order
 *
 * @deprecated use '@yarn-tool/detect-package-manager'
 */
const defaultClients: readonly IPackageManager[] = [
	EnumPackageManager.pnpm,
	EnumPackageManager.yarn,
	EnumPackageManager.npm,
];

/**
 * 合併使用者指定的優先順序與預設順序
 * Merge user-specified priority with default order
 *
 * @deprecated use '@yarn-tool/detect-package-manager'
 */
export function _handleClientsToCheck(npmClients?: IPackageManager[] | undefined): IPackageManager[]
{
	return npmClients?.length
		? [...new Set([...npmClients, ...defaultClients])]
		: defaultClients as IPackageManager[];
}
