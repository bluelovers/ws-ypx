Object.defineProperty(exports, "__esModule", {
  value: true
});
exports.YpxError = void 0;

class YpxError extends Error {
  constructor(exitCode) {
    super(String(exitCode));
    this.exitCode = exitCode;
  }

}

exports.YpxError = YpxError;
//# sourceMappingURL=data:application/json;charset=utf-8;base64,eyJ2ZXJzaW9uIjozLCJzb3VyY2VzIjpbImVyci50cyJdLCJuYW1lcyI6WyJZcHhFcnJvciIsIkVycm9yIiwiY29uc3RydWN0b3IiLCJleGl0Q29kZSIsIlN0cmluZyJdLCJtYXBwaW5ncyI6Ijs7Ozs7QUFJTyxNQUFNQSxRQUFOLFNBQXVCQyxLQUF2QixDQUNQO0FBQ0NDLEVBQUFBLFdBQVcsQ0FBaUJDLFFBQWpCLEVBQ1g7QUFDQyxVQUFNQyxNQUFNLENBQUNELFFBQUQsQ0FBWjtBQURELFNBRDRCQSxRQUM1QixHQUQ0QkEsUUFDNUI7QUFFQzs7QUFKRiIsInNvdXJjZXNDb250ZW50IjpbIi8qKlxuICogQ3JlYXRlZCBieSB1c2VyIG9uIDIwMjAvMS8zMC5cbiAqL1xuXG5leHBvcnQgY2xhc3MgWXB4RXJyb3IgZXh0ZW5kcyBFcnJvclxue1xuXHRjb25zdHJ1Y3RvcihwdWJsaWMgcmVhZG9ubHkgZXhpdENvZGU/OiBudW1iZXIpXG5cdHtcblx0XHRzdXBlcihTdHJpbmcoZXhpdENvZGUpKTtcblx0fVxufVxuIl19