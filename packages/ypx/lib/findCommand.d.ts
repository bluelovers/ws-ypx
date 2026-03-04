/**
 * 查找命令的二進制檔案路徑
 * Find command binary file path
 *
 * 使用 yarn bin 指令查找指定套件的二進制執行檔位置
 * Uses yarn bin command to find binary executable location for specified package
 *
 * @param {string} name - 套件名稱 / Package name
 * @param {string} cwd - 工作目錄 / Working directory
 * @returns {Promise<string>} 二進制檔案完整路徑 / Full path to binary file
 */
export declare function findCommand(name: string, cwd: string): Promise<string>;
export default findCommand;
