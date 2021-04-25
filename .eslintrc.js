module.exports = {
	env: {
		browser: true,
		es2021: true,
	},
	extends: [
		'plugin:react/recommended',
		'airbnb',
	],
	settings: {
		'import/parsers': {
			'@typescript-eslint/parser': ['.ts', '.tsx', '.js'],
		},
		'import/resolver': {
			typescript: {
				alwaysTryTypes: true,
				project: './tsconfig.json',
			},
		},
	},
	parser: '@typescript-eslint/parser',
	parserOptions: {
		ecmaFeatures: {
			jsx: true,
		},
		ecmaVersion: 12,
		sourceType: 'module',
	},
	plugins: [
		'react',
		'@typescript-eslint',
	],
	rules: {
		'implicit-arrow-linebreak': 0,
		'func-style': [
			'error',
			'declaration', {allowArrowFunctions: true},
		],

		semi: ['error', 'never'],
		indent: ['error', 'tab'],
		camelcase: ['error', {properties: 'never'}],

		'import/no-cycle': 0,
		'no-void': 0,
		'no-tabs': 0,
		'no-return-assign': 0,
		'import/prefer-default-export': 0,
		'linebreak-style': 0,

		'object-curly-spacing': ['error', 'never'],
		'object-curly-newline': 0,

		'react/jsx-filename-extension': [1, {extensions: ['.tsx', '.jsx']}],
		'react/jsx-one-expression-per-line': 0,
		'react/no-access-state-in-setstate': 0,
		'react/destructuring-assignment': 0,
		'react/jsx-props-no-spreading': 0,
		'react/jsx-indent': [2, 'tab'],
		'react/no-array-index-key': 0,
		'react/react-in-jsx-scope': 0,
		'react/jsx-indent-props': 0,
		'react/no-danger': 0,

		'jsx-a11y/no-noninteractive-element-interactions': 0,
		'jsx-a11y/no-static-element-interactions': 0,
		'jsx-a11y/click-events-have-key-events': 0,
		'jsx-a11y/media-has-caption': 0,
		'jsx-a11y/anchor-is-valid': 0,
		'jsx-a11y/no-noninteractive-tabindex': 0,
		'jsx-a11y/no-interactive-element-to-noninteractive-role': 0,

		'global-require': 0,
		'no-use-before-define': 0,
		'@typescript-eslint/no-use-before-define': 1,
		'@typescript-eslint/no-unused-vars': 0, // broken
		'no-unused-vars': 0,

		// we handle midding props thanks to ts
		'react/require-default-props': 0,
	},
}
