module.exports = {
	'env': {
		'es2021': true,
		'node': true
	},
	'extends': 'eslint:recommended',
	'parserOptions': {
		'ecmaVersion': 12
	},
	'rules': {
		semi: ['error', 'never'],
		quotes: ['error', 'single'],
		indent: ['error', 'tab']
	}
}
