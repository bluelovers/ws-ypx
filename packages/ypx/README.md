![.github/workflows/test.yml](https://github.com/bluelovers/ws-ypx/workflows/.github/workflows/test.yml/badge.svg)

# ynpx

> `npx` equivalent in yarn with multi-package-manager support

this module name is `ynpx` not `ypx`

---

## Features

- **Multi-Package-Manager Support**: Auto-detect and use `pnpm`, `yarn`, or `npm`
- **Fast Execution**: Cache packages for faster subsequent runs
- **Temporary Environment**: Isolated temp directory for each execution
- **Flexible Configuration**: Support for `.yarnrc`, `.npmrc`, and custom configs

> First run (when not have cache), need a long wait

![image](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image.png)

> Second run only need 5.x sec

![image_1](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image_1.png)

## Install

```bash
npm install -g ynpx
# or
yarn global add ynpx
# or
pnpm add -g ynpx
```

## Usage

### Basic Usage

```bash
ynpx jest
ynpx -p esm -p mocha --prefer-offline -- "!(node_modules)/**/*.{test,spec}.{ts,tsx}"
```

### Package Manager Selection

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

| Option | Alias | Description |
|--------|-------|-------------|
| `--package` | `-p` | Specify packages to install |
| `--npmClient` | `--pm` | Specify package manager (npm, yarn, pnpm) |
| `--quiet` | `-q` | Suppress output |
| `--prefer-offline` | | Use offline cache first |
| `--ignore-existing` | | Skip checking if packages exist |
| `--no-install` | | Skip package installation |
| `--shamefully-hoist` | | Flat node_modules (for pnpm) |
| `--userconfig` | `--rc` | Specify yarnrc config file |
| `--cwd` | | Set working directory |

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
