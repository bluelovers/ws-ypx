![.github/workflows/test.yml](https://github.com/bluelovers/ws-ypx/workflows/.github/workflows/test.yml/badge.svg)

# README.md

    `npx` equivalent in yarn

this module name is `ynpx` not `ypx`

i wanna use `ypx` for module name, but there already has a fake one on npm modules

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

### alias

> after install u can use alias name for start it

```
ypnx mocha
yypx mocha
ypx mocha
```

## links

- https://github.com/yarnpkg/yarn/issues/3937
- 
