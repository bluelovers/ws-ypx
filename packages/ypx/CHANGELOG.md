# Change Log

All notable changes to this project will be documented in this file.
See [Conventional Commits](https://conventionalcommits.org) for commit guidelines.

## [3.0.4](https://github.com/bluelovers/ws-ypx/compare/ynpx@3.0.3...ynpx@3.0.4) (2026-04-26)



### ♻️　Chores

* **deps:** update dpes ([9b8b839](https://github.com/bluelovers/ws-ypx/commit/9b8b83995e5555fa1f59365d5f670d8c15ba049b))



## [3.0.3](https://github.com/bluelovers/ws-ypx/compare/ynpx@3.0.2...ynpx@3.0.3) (2026-03-12)



### ♻️　Chores

* **deps:** update dpes ([1cb094a](https://github.com/bluelovers/ws-ypx/commit/1cb094ab05658d5bc567db5a635cfadeb42b5f8a))



## [3.0.2](https://github.com/bluelovers/ws-ypx/compare/ynpx@3.0.1...ynpx@3.0.2) (2026-03-09)



### 🚨　Tests

* **ypx:** 使用 _lazyTestEnvironment 統一測試環境初始化 ([705e843](https://github.com/bluelovers/ws-ypx/commit/705e843c27a63dfa0a01aa6ee8982ed3b71d74f0))



## [3.0.1](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.1.6...ynpx@3.0.1) (2026-03-09)


### BREAKING CHANGES

* **refactor:** ypx 測試框架重構，相關測試文件的路徑和結構有調整
* **ypx:** package.json 版本升級至 3.0.0，包含 API 變更
* **ypx:** 改用 npa.name 解析後的套件名稱而非直接取用原始參數
* **ypx:** 重構套件管理器偵測邏輯並更新依賴
* **ypx:** 預設 quiet 值由 false 改為 true
* **ypx:** 實作多套件管理器支援與自動偵測功能



### 🐛　Bug Fixes

* **ypx:** add node shebang for CLI executability ([e17b9e6](https://github.com/bluelovers/ws-ypx/commit/e17b9e6f9fded2805d399c347d783f2553b5ed0e))
* **ypx:** 修復套件命令處理邏輯並更新文檔 ([cba0c10](https://github.com/bluelovers/ws-ypx/commit/cba0c1057411b90bf687443088b822d9caeb99b5))
* **ypx:** 改用 npa.name 解析後的套件名稱而非直接取用原始參數 ([d16d671](https://github.com/bluelovers/ws-ypx/commit/d16d671f3d0851714993725c014d2fe535cd166a))


### ✨　Features

* **ypx:** 新增 verbose 選項並優化臨時套件初始化 ([554ff1a](https://github.com/bluelovers/ws-ypx/commit/554ff1ac250ea95fd8ef35b5905b46eb37a1af91))
* **ypx:** 禁用更新通知器並優化程式碼結構 ([30d7b8d](https://github.com/bluelovers/ws-ypx/commit/30d7b8d1e6096e535cbe98d79d4009d4c4aa3bd2))
* **ypx:** 實作多套件管理器支援與自動偵測功能 ([c6a3029](https://github.com/bluelovers/ws-ypx/commit/c6a30296de73e2bd32cdafb3529cf674994c7aaa))
* **ypx:** 支援 shamefullyHoist 選項並重構 initConfig 模組 ([93e3ba3](https://github.com/bluelovers/ws-ypx/commit/93e3ba37f88db5863b9380fef9c0de17fcca4fd3))


### 📦　Code Refactoring

* **ypx:** 重構套件管理器偵測邏輯並更新依賴 ([0e0c206](https://github.com/bluelovers/ws-ypx/commit/0e0c206e26ed4c08dfb02cda6d181196c28eff57))


### 📚　Documentation

* **ypx:** 添加全面的雙語文件與測試覆蓋 ([5a61e7e](https://github.com/bluelovers/ws-ypx/commit/5a61e7eba258bc450d45dc4efa91ef7343c4e242))


### 🚨　Tests

* **refactor:** 重構 ypx 測試框架以使用統一的測試輔助工具和設置 ([d4c63b4](https://github.com/bluelovers/ws-ypx/commit/d4c63b49de84f1ad5b65bd283c15208039b5979d))
* **ypx:** 添加 npm 用戶端測試與重構測試輔助工具 ([ceff328](https://github.com/bluelovers/ws-ypx/commit/ceff328802cafaa36e08c3f5ad44706e98090d48))


### 🛠　Build System

* update build ([d571d83](https://github.com/bluelovers/ws-ypx/commit/d571d8380cf173526bfbfe57b18c22ecc3df7337))


### ♻️　Chores

* **config:** 重構 Jest 配置支援懶加載並升級 monorepo 依賴項 ([2961a12](https://github.com/bluelovers/ws-ypx/commit/2961a1226f203b4ce319c33d5607528b10672ea9))
* **ypx:** comment out unused creation of empty `yarn.lock` in temporary package initialization ([182475d](https://github.com/bluelovers/ws-ypx/commit/182475dddc4da56ba53703e8c4ecfe13a0adfe1e))


### 🔖　Miscellaneous

* . ([22d405e](https://github.com/bluelovers/ws-ypx/commit/22d405ed37f3f9b4d0b5f55c33b422c527320bd5))



## [2.1.6](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.1.5...ynpx@2.1.6) (2022-10-30)



### 📦　Code Refactoring

* move type ([dd2ecd4](https://github.com/bluelovers/ws-ypx/commit/dd2ecd40eba0f0b6ac2b24b0dad083012d95f7e1))


### 📌　Dependencies

* update deps ([8dee994](https://github.com/bluelovers/ws-ypx/commit/8dee9945a2420f7665e596442f2993ee67bb9b02))


### 🔖　Miscellaneous

* . ([1b6ff6c](https://github.com/bluelovers/ws-ypx/commit/1b6ff6c55b21e3c5d2dfdcdb3c679a55cb051b9e))



## [2.1.5](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.1.4...ynpx@2.1.5) (2022-08-28)



### ✨　Features

* v8-compile-cache ([1f26a6e](https://github.com/bluelovers/ws-ypx/commit/1f26a6e60dcef3aba6f07edfc72d8f46de27f538))


### 🚨　Tests

* **snapshot:** update snapshot ([6f7fbd8](https://github.com/bluelovers/ws-ypx/commit/6f7fbd810780ad15428e89fe1ece7b08c4444a5c))



## [2.1.4](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.1.3...ynpx@2.1.4) (2022-08-16)


### 📌　Dependencies

* update deps ([2c93490](https://github.com/bluelovers/ws-ypx/commit/2c93490ac91621bc7a555ff1456f578aeb815faf))





## [2.1.3](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.1.2...ynpx@2.1.3) (2022-07-07)


### ♻️　Dependencies

* update deps ([10da3df](https://github.com/bluelovers/ws-ypx/commit/10da3df093bd7d4f7160159c96c669447cee9c04))





## [2.1.2](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.1.1...ynpx@2.1.2) (2022-02-06)


### ♻️　Chores

* **deps:** update deps ([c193f1a](https://github.com/bluelovers/ws-ypx/commit/c193f1a757522f881e9ab9498f97bfa38072148f))





## [2.1.1](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.10...ynpx@2.1.1) (2021-08-26)


### 🐛　Bug Fixes

* Error: Cannot find module 'err-indent/index' ([fd7f482](https://github.com/bluelovers/ws-ypx/commit/fd7f4821611050238a2e791f8d65b58be164193f))


### ✨　Features

* make error always has exitCode ([1646691](https://github.com/bluelovers/ws-ypx/commit/164669124b2c3efa850483dc45befc64f5ad2c81))
* **debug:** try record all error ([d74f2b6](https://github.com/bluelovers/ws-ypx/commit/d74f2b6e27d5e3f1a9d20616e6a8be92659cf395))


### 📦　Code Refactoring

* update import syntax ([e1b9944](https://github.com/bluelovers/ws-ypx/commit/e1b9944ab55fd0f3d0ca388aa099f2c7da0baa75))
* update import syntax ([4a670fb](https://github.com/bluelovers/ws-ypx/commit/4a670fb4aa61590cef7d8286455ffb20255ddbbf))


### 🚨　Tests

* update jest.config.js ([abf550b](https://github.com/bluelovers/ws-ypx/commit/abf550b4c2679dedbb8fc44eaa55d9b6897964c7))


### 🛠　Build System

* update typescript ([57edf35](https://github.com/bluelovers/ws-ypx/commit/57edf35ca7c88eb532b6fbe2fbde7cb62254d15f))


### ♻️　Chores

* **deps:** update deps and use tslib ([6e0fc19](https://github.com/bluelovers/ws-ypx/commit/6e0fc19200c8c3337e19b20a368bde7b58546d37))


### 🔖　Miscellaneous

* . ([8026a5e](https://github.com/bluelovers/ws-ypx/commit/8026a5ed60a08c6d476890d9b607e03364d5ed33))
* . ([b886f45](https://github.com/bluelovers/ws-ypx/commit/b886f453cf3411ac8f6c803a6e5185e5891bd054))
* . ([7fd8ae0](https://github.com/bluelovers/ws-ypx/commit/7fd8ae0405e63aaa8ba65cab65a67842bc60d2c3))
* . ([520979d](https://github.com/bluelovers/ws-ypx/commit/520979d707fec86960b3a19159d6bf82648b4090))
* Improve copy for warnings ([b8cfe3b](https://github.com/bluelovers/ws-ypx/commit/b8cfe3bf877bef056d2f96f852d3e9148c507cce))





## [2.0.10](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.9...ynpx@2.0.10) (2021-06-22)


### ♻️　Chores

* update deps ([7293e98](https://github.com/bluelovers/ws-ypx/commit/7293e9877a3213d7de6dd9349ccc947e1fd80415))





## [2.0.9](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.8...ynpx@2.0.9) (2021-06-05)


### 🚨　Tests

* fix test ([0e33e5d](https://github.com/bluelovers/ws-ypx/commit/0e33e5d19f5b9a1cef190d614f29165c465264c2))


### ♻️　Chores

* update deps ([1643697](https://github.com/bluelovers/ws-ypx/commit/1643697a9e6d8dc04415288167013cec8ad56623))





## [2.0.8](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.7...ynpx@2.0.8) (2021-05-17)


### 🔖　Miscellaneous

* Merge branch 'master' of https://github.com/bluelovers/ws-ypx ([35e92ff](https://github.com/bluelovers/ws-ypx/commit/35e92ff17be301846a7dbbcd577e2c4e1a38c27e))
* . ([1586118](https://github.com/bluelovers/ws-ypx/commit/15861185de7672cf12238a68c743ea8cb79e2f66))
* Update README.md ([70524ad](https://github.com/bluelovers/ws-ypx/commit/70524ad00a8f3f88ed893a6f4e459d5b3359f265))





## [2.0.7](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.6...ynpx@2.0.7) (2021-02-09)


### ♻️　Chores

* **deps:** update deps ([9b66a08](https://github.com/bluelovers/ws-ypx/commit/9b66a0842532a65874f486f00b21cef7b613eec0))


### 🔖　Miscellaneous

* . ([4d231b8](https://github.com/bluelovers/ws-ypx/commit/4d231b8e833f74b6b8c53ae08602d3da05dd7d8f))





## [2.0.6](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.5...ynpx@2.0.6) (2020-07-30)


### ♻️　Chores

* update deps ([7383161](https://github.com/bluelovers/ws-ypx/commit/7383161e852e251e01cf4885d9a7ef6cab8f2b73))





## [2.0.5](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.4...ynpx@2.0.5) (2020-07-23)


### ♻️　Chores

* update deps ([3320dc8](https://github.com/bluelovers/ws-ypx/commit/3320dc8717b5a762fab4ec0ba1d6af4b53383010))





## [2.0.4](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.3...ynpx@2.0.4) (2020-07-18)


### ✨　Features

* add debugMode ([5389c14](https://github.com/bluelovers/ws-ypx/commit/5389c1471972eea0a4959e4bcc0b7490b0295c1e))





## [2.0.3](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.2...ynpx@2.0.3) (2020-07-18)


### 🐛　Bug Fixes

* allow `-p yo -p generator-eslint-typescript yo -- eslint:plugin` ([645cede](https://github.com/bluelovers/ws-ypx/commit/645cedeafcdf52d98b66a537c2fedfd06bf443f3))





## [2.0.2](https://github.com/bluelovers/ws-ypx/compare/ynpx@2.0.1...ynpx@2.0.2) (2020-07-18)

**Note:** Version bump only for package ynpx





## [2.0.1](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.33...ynpx@2.0.1) (2020-07-18)


### ✨　Features

* support without use `--` https://github.com/bluelovers/ws-ypx/issues/5 ([303a303](https://github.com/bluelovers/ws-ypx/commit/303a30346efc14d25e790738b34244b9124942ac))


### 🛠　Build System

* disable use babel ([a7776ab](https://github.com/bluelovers/ws-ypx/commit/a7776abece957c18145aeac4615923fa746b934f))


### BREAKING CHANGES

* not allow pass base option after cmd





## [1.0.33](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.32...ynpx@1.0.33) (2020-06-17)


### 🐛　Bug Fixes

* try avoid Authentication failed when start lerna with ynpx ([abd13ff](https://github.com/bluelovers/ws-ypx/commit/abd13ff673ff1aa5adfde581b2be7de2c32afeca))


### ♻️　Chores

* update deps ([3abcf7e](https://github.com/bluelovers/ws-ypx/commit/3abcf7e3de2aa6945ec4997673c1476abe5f771c))


### 🔖　Miscellaneous

* builded ([cd0d79b](https://github.com/bluelovers/ws-ypx/commit/cd0d79b1c2d9760ddac8d0e686773d67fa6992b9))





## [1.0.32](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.31...ynpx@1.0.32) (2020-06-15)


### ♻️　Chores

*  update deps ([535df81](https://github.com/bluelovers/ws-ypx/commit/535df811492b6ce8d61be7e11d0a8db8109e8b56))


### Miscellaneous

* builded ([9367d66](https://github.com/bluelovers/ws-ypx/commit/9367d66a79b6e7606bdc02c69d5cec18d0d2c1aa))





## [1.0.31](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.30...ynpx@1.0.31) (2020-06-10)

**Note:** Version bump only for package ynpx





## [1.0.30](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.29...ynpx@1.0.30) (2020-06-10)

**Note:** Version bump only for package ynpx





## [1.0.29](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.28...ynpx@1.0.29) (2020-05-19)


### Bug Fixes

* regex ([2c8af74](https://github.com/bluelovers/ws-ypx/commit/2c8af74b377d97e7da2efe8602d6aa77d7c2a2ae))





## [1.0.28](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.27...ynpx@1.0.28) (2020-05-19)


### Bug Fixes

* support package with ver https://github.com/bluelovers/ws-ypx/issues/7 ([91d5043](https://github.com/bluelovers/ws-ypx/commit/91d5043cb73e79e9ab08a54d0d9371c62cb084cb))
* support tmp@^0.2.1 ([aa84d14](https://github.com/bluelovers/ws-ypx/commit/aa84d14c2090efe88717ac7905424785185c4c88))





## [1.0.27](https://github.com/bluelovers/ws-ypx/compare/ynpx@1.0.26...ynpx@1.0.27) (2020-04-10)

**Note:** Version bump only for package ynpx
