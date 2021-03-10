module.exports = {
	plugins: [
		'@snowpack/plugin-postcss'
	],
	routes: [
		{
			match: 'routes', 
			src: '.*', 
			dest: '/index.html'
		}
	]
}
