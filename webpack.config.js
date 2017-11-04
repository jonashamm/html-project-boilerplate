module.exports = {
	entry: {
		app: './src/js/main.js'
	},
	output: {
		path: __dirname + '/dist',
		filename: "bundle.js"
	},
	resolve: {
		alias: {
			vue: 'vue/dist/vue.js',
			jquery: "jquery/dist/jquery"
		}
	}
};