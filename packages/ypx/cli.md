# cli


```
Options:
  --version                        Show version number                 [boolean]
  --package, -p                    define the package to be installed    [array]
  --quiet, -q                      Suppressed any output from npx itself
                                   (progress bars, error messages, install
                                   reports)                            [boolean]
  --ignoreExisting                 skip check packages exists or not   [boolean]
  --noInstall                      skip install packages               [boolean]
  --preferOffline                  use network only if dependencies are not
                                   available in local cache            [boolean]
  --debugBin                       for cli test only                   [boolean]
  --userconfig, --useYarnrc, --rc  specifies a yarnrc file that Yarn should use
                                   (.yarnrc only, not .npmrc)           [string]
  -h                               Show help                           [boolean]

Examples:
  ypx.js mocha
  ypx.js -p esm ts-node mocha -- -r esm
```
