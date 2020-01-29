Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.defaultConfig = defaultConfig;
exports.buildConfig = buildConfig;
exports.default = void 0;

var _lodash = require("lodash");

var _camelCase = require("camel-case");

function defaultConfig() {
  return {
    'enableGlobalCache': true,
    'disable-self-update-check': true
  };
}

function buildConfig(userconfig = {}) {
  userconfig = (0, _lodash.defaultsDeep)(userconfig, defaultConfig());
  let o = Object.entries(userconfig).reduce((a, [k, v]) => {
    a.rc.push(`${k} ${v}`);
    a.yml.push(`${(0, _camelCase.camelCase)(k)}: ${v}`);
    return a;
  }, {
    rc: [],
    yml: []
  });
  return {
    rc: o.rc.join('\n') + '\n',
    yml: o.yml.join('\n') + '\n'
  };
}

var _default = buildConfig;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImluaXRDb25maWcudHMiXSwibmFtZXMiOlsiZGVmYXVsdENvbmZpZyIsImJ1aWxkQ29uZmlnIiwidXNlcmNvbmZpZyIsIm8iLCJPYmplY3QiLCJlbnRyaWVzIiwicmVkdWNlIiwiYSIsImsiLCJ2IiwicmMiLCJwdXNoIiwieW1sIiwiam9pbiJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUdBOztBQUNBOztBQUVPLFNBQVNBLGFBQVQsR0FDUDtBQUNDLFNBQU87QUFDTix5QkFBcUIsSUFEZjtBQUVOLGlDQUE2QjtBQUZ2QixHQUFQO0FBSUE7O0FBRU0sU0FBU0MsV0FBVCxDQUFxQkMsVUFBZSxHQUFHLEVBQXZDLEVBQ1A7QUFDQ0EsRUFBQUEsVUFBVSxHQUFHLDBCQUFhQSxVQUFiLEVBQXlCRixhQUFhLEVBQXRDLENBQWI7QUFFQSxNQUFJRyxDQUFDLEdBQUdDLE1BQU0sQ0FBQ0MsT0FBUCxDQUFlSCxVQUFmLEVBQ05JLE1BRE0sQ0FDQyxDQUFDQyxDQUFELEVBQUksQ0FBQ0MsQ0FBRCxFQUFJQyxDQUFKLENBQUosS0FBZTtBQUV0QkYsSUFBQUEsQ0FBQyxDQUFDRyxFQUFGLENBQUtDLElBQUwsQ0FBVyxHQUFFSCxDQUFFLElBQUdDLENBQUUsRUFBcEI7QUFDQUYsSUFBQUEsQ0FBQyxDQUFDSyxHQUFGLENBQU1ELElBQU4sQ0FBWSxHQUFFLDBCQUFVSCxDQUFWLENBQWEsS0FBSUMsQ0FBRSxFQUFqQztBQUVBLFdBQU9GLENBQVA7QUFDQSxHQVBNLEVBT0o7QUFDRkcsSUFBQUEsRUFBRSxFQUFFLEVBREY7QUFFRkUsSUFBQUEsR0FBRyxFQUFFO0FBRkgsR0FQSSxDQUFSO0FBYUEsU0FBTztBQUNORixJQUFBQSxFQUFFLEVBQUVQLENBQUMsQ0FBQ08sRUFBRixDQUFLRyxJQUFMLENBQVUsSUFBVixJQUFrQixJQURoQjtBQUVORCxJQUFBQSxHQUFHLEVBQUVULENBQUMsQ0FBQ1MsR0FBRixDQUFNQyxJQUFOLENBQVcsSUFBWCxJQUFtQjtBQUZsQixHQUFQO0FBSUE7O2VBRWNaLFciLCJzb3VyY2VzQ29udGVudCI6WyIvKipcbiAqIENyZWF0ZWQgYnkgdXNlciBvbiAyMDIwLzEvMzAuXG4gKi9cbmltcG9ydCB7IGNsb25lRGVlcCwgZGVmYXVsdHNEZWVwIH0gZnJvbSAnbG9kYXNoJztcbmltcG9ydCB7IGNhbWVsQ2FzZSB9IGZyb20gJ2NhbWVsLWNhc2UnO1xuXG5leHBvcnQgZnVuY3Rpb24gZGVmYXVsdENvbmZpZygpXG57XG5cdHJldHVybiB7XG5cdFx0J2VuYWJsZUdsb2JhbENhY2hlJzogdHJ1ZSxcblx0XHQnZGlzYWJsZS1zZWxmLXVwZGF0ZS1jaGVjayc6IHRydWUsXG5cdH1cbn1cblxuZXhwb3J0IGZ1bmN0aW9uIGJ1aWxkQ29uZmlnKHVzZXJjb25maWc6IGFueSA9IHt9KVxue1xuXHR1c2VyY29uZmlnID0gZGVmYXVsdHNEZWVwKHVzZXJjb25maWcsIGRlZmF1bHRDb25maWcoKSk7XG5cblx0bGV0IG8gPSBPYmplY3QuZW50cmllcyh1c2VyY29uZmlnKVxuXHRcdC5yZWR1Y2UoKGEsIFtrLCB2XSkgPT4ge1xuXG5cdFx0XHRhLnJjLnB1c2goYCR7a30gJHt2fWApO1xuXHRcdFx0YS55bWwucHVzaChgJHtjYW1lbENhc2Uoayl9OiAke3Z9YCk7XG5cblx0XHRcdHJldHVybiBhXG5cdFx0fSwge1xuXHRcdFx0cmM6IFtdIGFzIHN0cmluZ1tdLFxuXHRcdFx0eW1sOiBbXSBhcyBzdHJpbmdbXSxcblx0XHR9KVxuXHQ7XG5cblx0cmV0dXJuIHtcblx0XHRyYzogby5yYy5qb2luKCdcXG4nKSArICdcXG4nLFxuXHRcdHltbDogby55bWwuam9pbignXFxuJykgKyAnXFxuJyxcblx0fVxufVxuXG5leHBvcnQgZGVmYXVsdCBidWlsZENvbmZpZ1xuIl19