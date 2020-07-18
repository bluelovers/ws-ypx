module.exports = {
	clearMocks: true,
	moduleFileExtensions: ['ts', 'js'],
	testEnvironment: 'node',
	//testMatch: ['**/*.test.ts', '**/*.spec.ts'],
	testRegex: ['\\.(test|spec)\\.(ts|tsx)$'],
	testPathIgnorePatterns: [
		"/node_modules/",
		"install.test.ts"
	],
	transform: {
		'^.+\\.ts$': 'ts-jest',
	},
	verbose: true,
	collectCoverage: false,
}
