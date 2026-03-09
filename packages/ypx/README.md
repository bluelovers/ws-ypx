![.github/workflows/test.yml](https://github.com/bluelovers/ws-ypx/workflows/.github/workflows/test.yml/badge.svg)

# ynpx

> `npx` equivalent in yarn with multi-package-manager support (pnpm, yarn, npm)

此模組名稱為 `ynpx` 而非 `ypx`。YNPX 是 `npx` 的 Yarn 等價實現，支援多種套件管理器。
This module name is `ynpx` not `ypx`. YNPX is an `npx` equivalent in yarn with multi-package-manager support.

---

## Features

- **v3+ Auto-Detection**: From v3, automatically detect and use `pnpm`, `yarn`, or `npm` / 從 v3 開始，自動偵測並使用 pnpm、yarn 或 npm
- **Multi-Package-Manager Support**: Auto-detect and use `pnpm`, `yarn`, or `npm` / 自動偵測並使用 pnpm、yarn 或 npm
- **Fast Execution**: Cache packages for faster subsequent runs / 快取套件以加速後續執行
- **Temporary Environment**: Isolated temp directory for each execution / 每次執行時建立隔離的臨時目錄
- **Flexible Configuration**: Support for `.yarnrc`, `.npmrc`, and custom configs / 支援 .yarnrc、.npmrc 和自訂配置
- **Debug Mode**: Keep temp directories after execution for debugging / 調試模式：執行後保留臨時目錄以便除錯

> First run (when not have cache), need a long wait

![image](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image.png)

> Second run only need 5.x sec

![image_1](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image_1.png)

## Install

```bash
# 使用 npm 安裝 / Install with npm
npm install -g ynpx

# 使用 yarn 安裝 / Install with yarn
yarn global add ynpx

# 使用 pnpm 安裝 / Install with pnpm
pnpm add -g ynpx
```

## Usage

### Basic Usage

```bash
ynpx jest
ynpx -p esm -p mocha --prefer-offline -- "!(node_modules)/**/*.{test,spec}.{ts,tsx}"
```

### Package Manager Selection

> **v3+ Feature**: From v3, `ynpx` will auto-detect available package managers automatically.

By default, `ynpx` will auto-detect available package managers in the order: `pnpm` → `yarn` → `npm`.

You can specify a preferred package manager:

```bash
# Use npm specifically
ynpx --npmClient npm jest

# Use pnpm specifically  
ynpx --pm pnpm jest

# Try yarn first, fallback to npm
ynpx --npmClient yarn --npmClient npm jest
```

### Command Options

| Option | Alias | Description | 選項說明 |
|--------|-------|-------------|
| `--package` | `-p` | Specify packages to install | 指定要安裝的套件 |
| `--npmClient` | `--pm` | Specify package manager (npm, yarn, pnpm) | 指定套件管理器 (npm, yarn, pnpm) |
| `--quiet` | `-q` | Suppress output | 抑制輸出 |
| `--prefer-offline` | | Use offline cache first | 優先使用離線快取 |
| `--ignore-existing` | | Skip checking if packages exist | 跳過檢查套件是否存在 |
| `--no-install` | | Skip package installation | 跳過套件安裝 |
| `--shamefully-hoist` | | Flat node_modules (for pnpm) | 扁平化 node_modules (適用於 pnpm) |
| `--userconfig` | `--rc` | Specify yarnrc config file | 指定 yarnrc 配置文件 |
| `--cwd` | | Set working directory | 設定工作目錄 | 設定工作目錄 |
| `--debugMode` | | Keep temp directories after execution for debugging | 執行後保留臨時目錄以便除錯 |

### Examples

```bash
# Run mocha with TypeScript support
ynpx -p esm -p ts-node -p mocha -- -r esm

# Run in quiet mode
ynpx -q cowsay -- "ynpx"

# Use offline cache
ynpx --prefer-offline jest
```

> ynpx -q cowsay -- "workflows test"

![image_2](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image_2.png)

### Aliases

After install you can use alias names:

```bash
ynpx mocha
yypx mocha
ypx mocha
```

## Module Structure

The `ynpx` package consists of the following modules:

| Module | Description |
|--------|-------------|
| `createTemporaryDirectory` | Creates temp directories for package installation |
| `installDependencies` | Handles package installation with multi-PM support |
| `findCommand` | Locates package binaries |
| `handleEnv` | Manages environment variables and PATH |
| `handleOptions` | Processes CLI arguments |
| `initConfig` | Generates configuration files |
| `initTemporaryPackage` | Initializes temp package structure |
| `logger` | Provides colored console output |
| `types` | TypeScript type definitions |
| `util` | Utility functions |
| `err` | Custom error classes |

## Related Tools

- [yarn-tool](https://www.npmjs.com/package/yarn-tool)

## Links

- https://github.com/yarnpkg/yarn/issues/3937
- https://github.com/bluelovers/ws-ypx

## License

ISC
