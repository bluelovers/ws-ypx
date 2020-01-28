# README.md

    `npx` equivalent in yarn

this module name is `ynpx` not `ypx`

i wanna use `ypx` for module name, but there already has a fake one on npm modules

## install

```bash
npm install -g ynpx
```

```
ynpx -p esm -p mocha --prefer-offline -- "!(node_modules)/**/*.{test,spec}.{ts,tsx}"
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
