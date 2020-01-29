![.github/workflows/test.yml](https://github.com/bluelovers/ws-ypx/workflows/.github/workflows/test.yml/badge.svg)

# README.md

    `npx` equivalent in yarn

this module name is `ynpx` not `ypx`

---

> fist run (when not have cache), need a long wait

![image](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image.png)

> second run only need 5.x sec

![image_1](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image_1.png)

## install

```bash
npm install -g ynpx
```

## Usage

```
ynpx -p esm -p mocha --prefer-offline -- "!(node_modules)/**/*.{test,spec}.{ts,tsx}"
ynpx jest
```

---

> ynpx -q cowsay -- "workflows test"

![image_2](https://github.com/bluelovers/ws-ypx/raw/master/packages/ypx/docs/image_2.png)

### alias

> after install u can use alias name for start it

```
ypnx mocha
yypx mocha
ypx mocha
```

## other yarn tools

- [yarn-tool](https://www.npmjs.com/package/yarn-tool)

## links

- https://github.com/yarnpkg/yarn/issues/3937
