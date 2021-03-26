module.exports = {
	plugins: [
		'@snowpack/plugin-postcss'
	],
	routes: [
		{
			'match': 'routes', 
			'src': '.*', 
			'dest': '/index.html'
		}
	],
	mount: {
		// misleading in docs: this maps local folder (key) to hosted folder (val)
		lib: '/dist',
		public: '/',
	},
}
