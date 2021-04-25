module.exports = {
	plugins: [
		'@snowpack/plugin-postcss',
		'@snowpack/plugin-typescript'
	],
	routes: [
		{
			'match': 'routes', 
			'src': '.*', 
			'dest': '/index.html'
		}
	],
	alias: {
		'@': './lib',
	},
	mount: {
		// misleading in docs: this maps local folder (key) to hosted folder (val)
		lib: '/dist',
		public: '/',
	},
}
