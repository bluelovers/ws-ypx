const { mixinJestConfig } = require('@bluelovers/jest-config');

module.exports = mixinJestConfig({}, true, {
	file: __filename,
})
