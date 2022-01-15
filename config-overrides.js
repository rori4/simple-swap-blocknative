const webpack = require("webpack")
module.exports = function override(config, env) {
	//do stuff with the webpack config...

	config.resolve.fallback = {
		url: require.resolve("url"),
		assert: require.resolve("assert"),
		crypto: require.resolve("crypto-browserify"),
		http: require.resolve("stream-http"),
		https: require.resolve("https-browserify"),
		os: require.resolve("os-browserify/browser"),
		buffer: require.resolve("buffer"),
		stream: require.resolve("stream-browserify"),
	}

	config.module.rules.push({
		test: /\.js$/,
		enforce: "pre",
		use: [
			{
				//needed to chain sourcemaps.  see: https://webpack.js.org/loaders/source-map-loader/
				loader: "source-map-loader",
				options: {
					filterSourceMappingUrl: (url, resourcePath) => {
						//  console.log({ url, resourcePath }) example:
						// {
						//  url: 'index.js.map',
						//  resourcePath: '/repos/xlib-wsl/common/temp/node_modules/.pnpm/https-proxy-agent@5.0.0/node_modules/https-proxy-agent/dist/index.js'
						// }

						if (/.*\/node_modules\/.*/.test(resourcePath)) {
							return false
						}
						return true
					},
				},
			},
		],
	})

	config.plugins.push(
		new webpack.ProvidePlugin({
			process: "process/browser",
			Buffer: ["buffer", "Buffer"],
		})
	)

	return config
}
