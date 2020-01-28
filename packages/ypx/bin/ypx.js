#!/usr/bin/env node

var _yargsParserExtra = _interopRequireWildcard(require("yargs-parser-extra"));

var _index = _interopRequireDefault(require("../index"));

var _util = require("util");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function _getRequireWildcardCache() { if (typeof WeakMap !== "function") return null; var cache = new WeakMap(); _getRequireWildcardCache = function () { return cache; }; return cache; }

function _interopRequireWildcard(obj) { if (obj && obj.__esModule) { return obj; } if (obj === null || typeof obj !== "object" && typeof obj !== "function") { return { default: obj }; } var cache = _getRequireWildcardCache(); if (cache && cache.has(obj)) { return cache.get(obj); } var newObj = {}; var hasPropertyDescriptor = Object.defineProperty && Object.getOwnPropertyDescriptor; for (var key in obj) { if (Object.prototype.hasOwnProperty.call(obj, key)) { var desc = hasPropertyDescriptor ? Object.getOwnPropertyDescriptor(obj, key) : null; if (desc && (desc.get || desc.set)) { Object.defineProperty(newObj, key, desc); } else { newObj[key] = obj[key]; } } } newObj.default = obj; if (cache) { cache.set(obj, newObj); } return newObj; }

let argv = (0, _yargsParserExtra.default)(process.argv.slice(2), {
  alias: {
    package: ['p'],
    quiet: ['q']
  },
  array: ['package'],
  boolean: ['preferOffline', 'quiet'],
  normalize: ['cwd']
});
let {
  p = []
} = argv;

if (!p || !p.length) {
  if (argv._.length !== 1) {
    throw new Error(`current not support this syntax, ${(0, _util.inspect)(argv)}`);
  } else {
    p = [argv._.shift()];
  }
}

if (argv._.length && argv['--'].length) {
  throw new Error(`current not support this syntax, ${argv[_yargsParserExtra.SymInputArgs]}`);
}

(0, _index.default)({ ...argv,
  package: p
});
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbInlweC50cyJdLCJuYW1lcyI6WyJhcmd2IiwicHJvY2VzcyIsInNsaWNlIiwiYWxpYXMiLCJwYWNrYWdlIiwicXVpZXQiLCJhcnJheSIsImJvb2xlYW4iLCJub3JtYWxpemUiLCJwIiwibGVuZ3RoIiwiXyIsIkVycm9yIiwic2hpZnQiLCJTeW1JbnB1dEFyZ3MiXSwibWFwcGluZ3MiOiJBQUFBOztBQUVBOztBQUNBOztBQUVBOzs7Ozs7OztBQUVBLElBQUlBLElBQUksR0FBRywrQkFBTUMsT0FBTyxDQUFDRCxJQUFSLENBQWFFLEtBQWIsQ0FBbUIsQ0FBbkIsQ0FBTixFQUE2QjtBQUN2Q0MsRUFBQUEsS0FBSyxFQUFFO0FBQ05DLElBQUFBLE9BQU8sRUFBRSxDQUFDLEdBQUQsQ0FESDtBQUVOQyxJQUFBQSxLQUFLLEVBQUUsQ0FBQyxHQUFEO0FBRkQsR0FEZ0M7QUFLdkNDLEVBQUFBLEtBQUssRUFBRSxDQUFDLFNBQUQsQ0FMZ0M7QUFNdkNDLEVBQUFBLE9BQU8sRUFBRSxDQUNSLGVBRFEsRUFFUixPQUZRLENBTjhCO0FBVXZDQyxFQUFBQSxTQUFTLEVBQUUsQ0FDVixLQURVO0FBVjRCLENBQTdCLENBQVg7QUFtQkEsSUFBSTtBQUFFQyxFQUFBQSxDQUFDLEdBQUc7QUFBTixJQUFhVCxJQUFqQjs7QUFJQSxJQUFJLENBQUNTLENBQUQsSUFBTSxDQUFDQSxDQUFDLENBQUNDLE1BQWIsRUFDQTtBQUNDLE1BQUlWLElBQUksQ0FBQ1csQ0FBTCxDQUFPRCxNQUFQLEtBQWtCLENBQXRCLEVBQ0E7QUFDQyxVQUFNLElBQUlFLEtBQUosQ0FBVyxvQ0FBbUMsbUJBQVFaLElBQVIsQ0FBYyxFQUE1RCxDQUFOO0FBQ0EsR0FIRCxNQUtBO0FBQ0NTLElBQUFBLENBQUMsR0FBRyxDQUFDVCxJQUFJLENBQUNXLENBQUwsQ0FBT0UsS0FBUCxFQUFELENBQUo7QUFDQTtBQUNEOztBQUVELElBQUliLElBQUksQ0FBQ1csQ0FBTCxDQUFPRCxNQUFQLElBQWlCVixJQUFJLENBQUMsSUFBRCxDQUFKLENBQVdVLE1BQWhDLEVBQ0E7QUFDQyxRQUFNLElBQUlFLEtBQUosQ0FBVyxvQ0FBbUNaLElBQUksQ0FBQ2MsOEJBQUQsQ0FBZSxFQUFqRSxDQUFOO0FBQ0E7O0FBRUQsb0JBQUksRUFDSCxHQUFHZCxJQURBO0FBRUhJLEVBQUFBLE9BQU8sRUFBRUs7QUFGTixDQUFKIiwic291cmNlc0NvbnRlbnQiOlsiIyEvdXNyL2Jpbi9lbnYgbm9kZVxuXG5pbXBvcnQgcGFyc2UsIHsgZGV0YWlsZWQsIFN5bUlucHV0QXJncyB9IGZyb20gJ3lhcmdzLXBhcnNlci1leHRyYSdcbmltcG9ydCBZUFggZnJvbSAnLi4vaW5kZXgnO1xuaW1wb3J0IHsgQXJndW1lbnRzIH0gZnJvbSAneWFyZ3MtcGFyc2VyLWV4dHJhJ1xuaW1wb3J0IHsgaW5zcGVjdCB9IGZyb20gJ3V0aWwnXG5cbmxldCBhcmd2ID0gcGFyc2UocHJvY2Vzcy5hcmd2LnNsaWNlKDIpLCB7XG5cdGFsaWFzOiB7XG5cdFx0cGFja2FnZTogWydwJ10sXG5cdFx0cXVpZXQ6IFsncSddLFxuXHR9LFxuXHRhcnJheTogWydwYWNrYWdlJ10sXG5cdGJvb2xlYW46IFtcblx0XHQncHJlZmVyT2ZmbGluZScsXG5cdFx0J3F1aWV0Jyxcblx0XSxcblx0bm9ybWFsaXplOiBbXG5cdFx0J2N3ZCcsXG5cdF1cbn0pIGFzIEFyZ3VtZW50czx7XG5cdHBhY2thZ2U6IHN0cmluZ1tdLFxuXHRxdWlldD86IGJvb2xlYW4sXG5cdGN3ZD86IHN0cmluZyxcbn0+O1xuXG5sZXQgeyBwID0gW10gfSA9IGFyZ3YgYXMgdHlwZW9mIGFyZ3YgJiB7XG5cdHA6IHN0cmluZ1tdLFxufTtcblxuaWYgKCFwIHx8ICFwLmxlbmd0aClcbntcblx0aWYgKGFyZ3YuXy5sZW5ndGggIT09IDEpXG5cdHtcblx0XHR0aHJvdyBuZXcgRXJyb3IoYGN1cnJlbnQgbm90IHN1cHBvcnQgdGhpcyBzeW50YXgsICR7aW5zcGVjdChhcmd2KX1gKVxuXHR9XG5cdGVsc2Vcblx0e1xuXHRcdHAgPSBbYXJndi5fLnNoaWZ0KCldO1xuXHR9XG59XG5cbmlmIChhcmd2Ll8ubGVuZ3RoICYmIGFyZ3ZbJy0tJ10ubGVuZ3RoKVxue1xuXHR0aHJvdyBuZXcgRXJyb3IoYGN1cnJlbnQgbm90IHN1cHBvcnQgdGhpcyBzeW50YXgsICR7YXJndltTeW1JbnB1dEFyZ3NdfWApXG59XG5cbllQWCh7XG5cdC4uLmFyZ3YsXG5cdHBhY2thZ2U6IHAsXG59KTtcbiJdfQ==