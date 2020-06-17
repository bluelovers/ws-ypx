Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.findCommand = findCommand;
exports.findCommand2 = findCommand2;
exports.default = void 0;

var _crossSpawnExtra = _interopRequireDefault(require("cross-spawn-extra"));

var _fsExtra = require("fs-extra");

var _path = require("path");

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

async function findCommand(name, cwd) {
  let cp = await _crossSpawnExtra.default.sync('yarn', ['bin', name].filter(v => v != null), {
    stripAnsi: true,
    cwd,
    env: process.env
  });
  let bin = cp.stdout.toString().replace(/^\s+|\s+$/g, '');

  if (bin && (0, _fsExtra.pathExistsSync)(bin)) {
    return bin;
  }
}

async function findCommand2(name, cwd) {
  try {
    let file = require.resolve(name + '/package.json', {
      paths: [cwd]
    });

    let json = await (0, _fsExtra.readJSON)(file);
    let dir = (0, _path.dirname)(file);

    if (json.bin) {
      let bin;

      if (typeof json.bin === 'string') {
        bin = json.bin;
      } else {
        bin = Object.values(json.bin)[0];
      }
    }
  } catch (e) {}
}

var _default = findCommand;
exports.default = _default;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImZpbmRDb21tYW5kLnRzIl0sIm5hbWVzIjpbImZpbmRDb21tYW5kIiwibmFtZSIsImN3ZCIsImNwIiwiY3Jvc3NTcGF3bkV4dHJhIiwic3luYyIsImZpbHRlciIsInYiLCJzdHJpcEFuc2kiLCJlbnYiLCJwcm9jZXNzIiwiYmluIiwic3Rkb3V0IiwidG9TdHJpbmciLCJyZXBsYWNlIiwiZmluZENvbW1hbmQyIiwiZmlsZSIsInJlcXVpcmUiLCJyZXNvbHZlIiwicGF0aHMiLCJqc29uIiwiZGlyIiwiT2JqZWN0IiwidmFsdWVzIiwiZSJdLCJtYXBwaW5ncyI6Ijs7Ozs7OztBQUFBOztBQUNBOztBQUVBOzs7O0FBRU8sZUFBZUEsV0FBZixDQUEyQkMsSUFBM0IsRUFBeUNDLEdBQXpDLEVBQ1A7QUFDQyxNQUFJQyxFQUFFLEdBQUcsTUFBTUMseUJBQWdCQyxJQUFoQixDQUFxQixNQUFyQixFQUE2QixDQUMzQyxLQUQyQyxFQUUzQ0osSUFGMkMsRUFHMUNLLE1BSDBDLENBR25DQyxDQUFDLElBQUlBLENBQUMsSUFBSSxJQUh5QixDQUE3QixFQUdXO0FBQ3pCQyxJQUFBQSxTQUFTLEVBQUUsSUFEYztBQUV6Qk4sSUFBQUEsR0FGeUI7QUFHekJPLElBQUFBLEdBQUcsRUFBRUMsT0FBTyxDQUFDRDtBQUhZLEdBSFgsQ0FBZjtBQVNBLE1BQUlFLEdBQUcsR0FBR1IsRUFBRSxDQUFDUyxNQUFILENBQVVDLFFBQVYsR0FDUkMsT0FEUSxDQUNBLFlBREEsRUFDYyxFQURkLENBQVY7O0FBR0EsTUFBSUgsR0FBRyxJQUFJLDZCQUFlQSxHQUFmLENBQVgsRUFDQTtBQUNDLFdBQU9BLEdBQVA7QUFDQTtBQUNEOztBQUVNLGVBQWVJLFlBQWYsQ0FBNEJkLElBQTVCLEVBQTBDQyxHQUExQyxFQUNQO0FBQ0MsTUFDQTtBQUNDLFFBQUljLElBQUksR0FBR0MsT0FBTyxDQUFDQyxPQUFSLENBQWdCakIsSUFBSSxHQUFHLGVBQXZCLEVBQXdDO0FBQ2xEa0IsTUFBQUEsS0FBSyxFQUFFLENBQUNqQixHQUFEO0FBRDJDLEtBQXhDLENBQVg7O0FBSUEsUUFBSWtCLElBQUksR0FBRyxNQUFNLHVCQUFTSixJQUFULENBQWpCO0FBQ0EsUUFBSUssR0FBRyxHQUFHLG1CQUFRTCxJQUFSLENBQVY7O0FBRUEsUUFBSUksSUFBSSxDQUFDVCxHQUFULEVBQ0E7QUFDQyxVQUFJQSxHQUFKOztBQUNBLFVBQUksT0FBT1MsSUFBSSxDQUFDVCxHQUFaLEtBQW9CLFFBQXhCLEVBQ0E7QUFDQ0EsUUFBQUEsR0FBRyxHQUFHUyxJQUFJLENBQUNULEdBQVg7QUFDQSxPQUhELE1BS0E7QUFDQ0EsUUFBQUEsR0FBRyxHQUFHVyxNQUFNLENBQUNDLE1BQVAsQ0FBY0gsSUFBSSxDQUFDVCxHQUFuQixFQUF3QixDQUF4QixDQUFOO0FBQ0E7QUFHRDtBQUNELEdBdkJELENBd0JBLE9BQU9hLENBQVAsRUFDQSxDQUVDO0FBQ0Q7O2VBRWN4QixXIiwic291cmNlc0NvbnRlbnQiOlsiaW1wb3J0IGNyb3NzU3Bhd25FeHRyYSBmcm9tICdjcm9zcy1zcGF3bi1leHRyYSc7XG5pbXBvcnQgeyBwYXRoRXhpc3RzU3luYywgcmVhZEpTT04gfSBmcm9tICdmcy1leHRyYSc7XG5pbXBvcnQgYmluRXhpc3RzIGZyb20gJ2Jpbi1leGlzdHMnO1xuaW1wb3J0IHsgZGlybmFtZSB9IGZyb20gJ3BhdGgnO1xuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZENvbW1hbmQobmFtZTogc3RyaW5nLCBjd2Q6IHN0cmluZylcbntcblx0bGV0IGNwID0gYXdhaXQgY3Jvc3NTcGF3bkV4dHJhLnN5bmMoJ3lhcm4nLCBbXG5cdFx0J2JpbicsXG5cdFx0bmFtZSxcblx0XS5maWx0ZXIodiA9PiB2ICE9IG51bGwpLCB7XG5cdFx0c3RyaXBBbnNpOiB0cnVlLFxuXHRcdGN3ZCxcblx0XHRlbnY6IHByb2Nlc3MuZW52LFxuXHR9KTtcblxuXHRsZXQgYmluID0gY3Auc3Rkb3V0LnRvU3RyaW5nKClcblx0XHQucmVwbGFjZSgvXlxccyt8XFxzKyQvZywgJycpXG5cdDtcblx0aWYgKGJpbiAmJiBwYXRoRXhpc3RzU3luYyhiaW4pKVxuXHR7XG5cdFx0cmV0dXJuIGJpbjtcblx0fVxufVxuXG5leHBvcnQgYXN5bmMgZnVuY3Rpb24gZmluZENvbW1hbmQyKG5hbWU6IHN0cmluZywgY3dkOiBzdHJpbmcpXG57XG5cdHRyeVxuXHR7XG5cdFx0bGV0IGZpbGUgPSByZXF1aXJlLnJlc29sdmUobmFtZSArICcvcGFja2FnZS5qc29uJywge1xuXHRcdFx0cGF0aHM6IFtjd2RdXG5cdFx0fSk7XG5cblx0XHRsZXQganNvbiA9IGF3YWl0IHJlYWRKU09OKGZpbGUpO1xuXHRcdGxldCBkaXIgPSBkaXJuYW1lKGZpbGUpO1xuXG5cdFx0aWYgKGpzb24uYmluKVxuXHRcdHtcblx0XHRcdGxldCBiaW46IHN0cmluZztcblx0XHRcdGlmICh0eXBlb2YganNvbi5iaW4gPT09ICdzdHJpbmcnKVxuXHRcdFx0e1xuXHRcdFx0XHRiaW4gPSBqc29uLmJpbjtcblx0XHRcdH1cblx0XHRcdGVsc2Vcblx0XHRcdHtcblx0XHRcdFx0YmluID0gT2JqZWN0LnZhbHVlcyhqc29uLmJpbilbMF0gYXMgc3RyaW5nXG5cdFx0XHR9XG5cblxuXHRcdH1cblx0fVxuXHRjYXRjaCAoZSlcblx0e1xuXG5cdH1cbn1cblxuZXhwb3J0IGRlZmF1bHQgZmluZENvbW1hbmRcbiJdfQ==