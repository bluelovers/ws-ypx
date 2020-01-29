Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.initTemporaryPackage = initTemporaryPackage;
exports.default = void 0;

var _bluebird = _interopRequireDefault(require("bluebird"));

var _fsExtra = require("fs-extra");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

function initTemporaryPackage(tmpDir) {
  return _bluebird.default.all([(0, _fsExtra.writeFile)((0, _path.join)(tmpDir, '.yarnrc'), [`enableGlobalCache true`, `disable-self-update-check true`].join('\n') + '\n'), (0, _fsExtra.writeFile)((0, _path.join)(tmpDir, '.yarnrc.yml'), [`enableGlobalCache: true`, `disableSelfUpdateCheck: true`].join('\n') + '\n'), (0, _fsExtra.writeFile)((0, _path.join)(tmpDir, 'yarn.lock'), ``), (0, _fsExtra.writeJSON)((0, _path.join)(tmpDir, 'package.json'), {
    "license": "ISC"
  })]);
}

var _default = initTemporaryPackage;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXRUZW1wb3JhcnlQYWNrYWdlLnRzIl0sIm5hbWVzIjpbImluaXRUZW1wb3JhcnlQYWNrYWdlIiwidG1wRGlyIiwiQmx1ZWJpcmQiLCJhbGwiLCJqb2luIl0sIm1hcHBpbmdzIjoiOzs7Ozs7QUFBQTs7QUFDQTs7QUFDQTs7OztBQUVPLFNBQVNBLG9CQUFULENBQThCQyxNQUE5QixFQUNQO0FBQ0MsU0FBT0Msa0JBQVNDLEdBQVQsQ0FBYSxDQUNuQix3QkFBVSxnQkFBS0YsTUFBTCxFQUFhLFNBQWIsQ0FBVixFQUFtQyxDQUNqQyx3QkFEaUMsRUFFakMsZ0NBRmlDLEVBR2pDRyxJQUhpQyxDQUc1QixJQUg0QixJQUdwQixJQUhmLENBRG1CLEVBS25CLHdCQUFVLGdCQUFLSCxNQUFMLEVBQWEsYUFBYixDQUFWLEVBQXVDLENBQ3JDLHlCQURxQyxFQUVyQyw4QkFGcUMsRUFHckNHLElBSHFDLENBR2hDLElBSGdDLElBR3hCLElBSGYsQ0FMbUIsRUFTbkIsd0JBQVUsZ0JBQUtILE1BQUwsRUFBYSxXQUFiLENBQVYsRUFBc0MsRUFBdEMsQ0FUbUIsRUFVbkIsd0JBQVUsZ0JBQUtBLE1BQUwsRUFBYSxjQUFiLENBQVYsRUFBd0M7QUFDdkMsZUFBVztBQUQ0QixHQUF4QyxDQVZtQixDQUFiLENBQVA7QUFjQTs7ZUFFY0Qsb0IiLCJzb3VyY2VzQ29udGVudCI6WyJpbXBvcnQgQmx1ZWJpcmQgZnJvbSAnYmx1ZWJpcmQnO1xuaW1wb3J0IHsgd3JpdGVGaWxlLCB3cml0ZUpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgeyBqb2luIH0gZnJvbSBcInBhdGhcIjtcblxuZXhwb3J0IGZ1bmN0aW9uIGluaXRUZW1wb3JhcnlQYWNrYWdlKHRtcERpcjogc3RyaW5nKVxue1xuXHRyZXR1cm4gQmx1ZWJpcmQuYWxsKFtcblx0XHR3cml0ZUZpbGUoam9pbih0bXBEaXIsICcueWFybnJjJyksIFtcblx0XHRcdGBlbmFibGVHbG9iYWxDYWNoZSB0cnVlYCxcblx0XHRcdGBkaXNhYmxlLXNlbGYtdXBkYXRlLWNoZWNrIHRydWVgLFxuXHRcdF0uam9pbignXFxuJykgKyAnXFxuJyksXG5cdFx0d3JpdGVGaWxlKGpvaW4odG1wRGlyLCAnLnlhcm5yYy55bWwnKSwgW1xuXHRcdFx0YGVuYWJsZUdsb2JhbENhY2hlOiB0cnVlYCxcblx0XHRcdGBkaXNhYmxlU2VsZlVwZGF0ZUNoZWNrOiB0cnVlYCxcblx0XHRdLmpvaW4oJ1xcbicpICsgJ1xcbicpLFxuXHRcdHdyaXRlRmlsZShqb2luKHRtcERpciwgJ3lhcm4ubG9jaycpLCBgYCksXG5cdFx0d3JpdGVKU09OKGpvaW4odG1wRGlyLCAncGFja2FnZS5qc29uJyksIHtcblx0XHRcdFwibGljZW5zZVwiOiBcIklTQ1wiLFxuXHRcdH0pLFxuXHRdKVxufVxuXG5leHBvcnQgZGVmYXVsdCBpbml0VGVtcG9yYXJ5UGFja2FnZVxuIl19