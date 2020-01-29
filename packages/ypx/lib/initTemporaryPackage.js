Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTemporaryPackage = initTemporaryPackage;
exports.default = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _fsExtra = require("fs-extra");

var _path = require("path");

var _initConfig = _interopRequireDefault(require("./initConfig"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initTemporaryPackage(tmpDir) {
  let data = (0, _initConfig.default)();
  return _bluebird.default.all([(0, _fsExtra.writeFile)((0, _path.join)(tmpDir, '.yarnrc'), data.rc), (0, _fsExtra.writeFile)((0, _path.join)(tmpDir, '.yarnrc.yml'), data.yml), (0, _fsExtra.writeFile)((0, _path.join)(tmpDir, 'yarn.lock'), ``), (0, _fsExtra.writeJSON)((0, _path.join)(tmpDir, 'package.json'), {
    "license": "ISC"
  })]);
}

var _default = initTemporaryPackage;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXRUZW1wb3JhcnlQYWNrYWdlLnRzIl0sIm5hbWVzIjpbImluaXRUZW1wb3JhcnlQYWNrYWdlIiwidG1wRGlyIiwiZGF0YSIsIkJsdWViaXJkIiwiYWxsIiwicmMiLCJ5bWwiXSwibWFwcGluZ3MiOiI7Ozs7OztBQUFBOztBQUNBOztBQUNBOztBQUNBOzs7O0FBRU8sU0FBU0Esb0JBQVQsQ0FBOEJDLE1BQTlCLEVBQ1A7QUFDQyxNQUFJQyxJQUFJLEdBQUcsMEJBQVg7QUFFQSxTQUFPQyxrQkFBU0MsR0FBVCxDQUFhLENBQ25CLHdCQUFVLGdCQUFLSCxNQUFMLEVBQWEsU0FBYixDQUFWLEVBQW1DQyxJQUFJLENBQUNHLEVBQXhDLENBRG1CLEVBRW5CLHdCQUFVLGdCQUFLSixNQUFMLEVBQWEsYUFBYixDQUFWLEVBQXVDQyxJQUFJLENBQUNJLEdBQTVDLENBRm1CLEVBR25CLHdCQUFVLGdCQUFLTCxNQUFMLEVBQWEsV0FBYixDQUFWLEVBQXNDLEVBQXRDLENBSG1CLEVBSW5CLHdCQUFVLGdCQUFLQSxNQUFMLEVBQWEsY0FBYixDQUFWLEVBQXdDO0FBQ3ZDLGVBQVc7QUFENEIsR0FBeEMsQ0FKbUIsQ0FBYixDQUFQO0FBUUE7O2VBRWNELG9CIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IEJsdWViaXJkIGZyb20gJ2JsdWViaXJkJztcbmltcG9ydCB7IHdyaXRlRmlsZSwgd3JpdGVKU09OIH0gZnJvbSAnZnMtZXh0cmEnO1xuaW1wb3J0IHsgam9pbiB9IGZyb20gXCJwYXRoXCI7XG5pbXBvcnQgYnVpbGRDb25maWcgZnJvbSAnLi9pbml0Q29uZmlnJztcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRUZW1wb3JhcnlQYWNrYWdlKHRtcERpcjogc3RyaW5nKVxue1xuXHRsZXQgZGF0YSA9IGJ1aWxkQ29uZmlnKCk7XG5cblx0cmV0dXJuIEJsdWViaXJkLmFsbChbXG5cdFx0d3JpdGVGaWxlKGpvaW4odG1wRGlyLCAnLnlhcm5yYycpLCBkYXRhLnJjKSxcblx0XHR3cml0ZUZpbGUoam9pbih0bXBEaXIsICcueWFybnJjLnltbCcpLCBkYXRhLnltbCksXG5cdFx0d3JpdGVGaWxlKGpvaW4odG1wRGlyLCAneWFybi5sb2NrJyksIGBgKSxcblx0XHR3cml0ZUpTT04oam9pbih0bXBEaXIsICdwYWNrYWdlLmpzb24nKSwge1xuXHRcdFx0XCJsaWNlbnNlXCI6IFwiSVNDXCIsXG5cdFx0fSksXG5cdF0pXG59XG5cbmV4cG9ydCBkZWZhdWx0IGluaXRUZW1wb3JhcnlQYWNrYWdlXG4iXX0=