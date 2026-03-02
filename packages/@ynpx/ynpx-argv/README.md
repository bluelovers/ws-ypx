# @ynpx/ynpx-argv

YNPX 命令列參數解析器，用於解析 ynpx 工具的命令列選項和參數。
Command line argument parser for YNPX tool, used to parse command line options and arguments.

## 安裝 (Installation)

```bash
# 使用 yarn / Using yarn
yarn add @ynpx/ynpx-argv

# 使用 yarn-tool / Using yarn-tool
yarn-tool add @ynpx/ynpx-argv

# yt 是 yarn-tool 的別名 / yt is an alias for yarn-tool
yt add @ynpx/ynpx-argv

# 使用 pnpm / Using pnpm
pnpm add @ynpx/ynpx-argv

# 使用 npm / Using npm
npm install @ynpx/ynpx-argv
```

## 功能 (Features)

- 解析 ynpx 命令列參數 / Parse YNPX command line arguments
- 支援 `-p/--package` 多套件指定 / Support `-p/--package` multiple package specification
- 自動處理 `--` 分隔的額外參數 / Auto-handle `--` separated extra arguments
- 提供完整的 TypeScript 型別支援 / Full TypeScript type support

## 使用範例 (Usage Examples)

```typescript
import parseArgv from '@ynpx/ynpx-argv';

// 基本使用 / Basic usage
const argv = parseArgv(['-p', 'lodash', 'mocha', '--', '-R', 'spec']);
console.log(argv.package); // ['lodash']
console.log(argv._);       // ['mocha']
console.log(argv['--']);   // ['-R', 'spec']

// 多套件指定 / Multiple packages
const argv2 = parseArgv(['-p', 'esm', '-p', 'ts-node', 'mocha']);
console.log(argv2.package); // ['esm', 'ts-node']
```

## 介面 (Interfaces)

### IYPXArgumentsCore

核心參數介面，定義支援的所有選項：
Core arguments interface defining all supported options:

| 選項 (Option) | 類型 (Type) | 說明 (Description) |
|--------------|------------|-------------------|
| `package` | `string[]` | 要安裝的套件列表 / List of packages to install |
| `quiet` | `boolean?` | 靜默模式 / Quiet mode |
| `preferOffline` | `boolean?` | 優先使用離線快取 / Prefer offline cache |
| `cwd` | `string?` | 工作目錄 / Working directory |
| `ignoreExisting` | `boolean?` | 忽略已存在檢查 / Skip existence check |
| `noInstall` | `boolean?` | 跳過安裝 / Skip installation |
| `userconfig` | `string?` | Yarn 設定檔路徑 / Yarn config file path |
| `debugBin` | `boolean?` | 除錯二進制模式 / Debug binary mode |
| `debugMode` | `boolean?` | 除錯模式 / Debug mode |

## API

### parseArgv(inputArgv: string[]): IYPXArguments

解析命令列參數並返回解析結果。
Parse command line arguments and return the parsed result.

### parseArgvCore(inputArgv: string[]): Argv

建立並配置 yargs 實例，返回未解析的 yargs 物件。
Create and configure yargs instance, return the unparsed yargs object.

## 相關項目 (Related Projects)

- [ynpx](https://github.com/bluelovers/ws-ypx) - 基於 Yarn 的 npx 替代工具 / Yarn-based npx alternative

