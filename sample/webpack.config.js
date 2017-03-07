var path = require("path");

module.exports = [
	{
		context: path.join(__dirname, "build"),
		entry: ["../../lib/index.js", "./parent.js"],
		output: {
			path: path.join(__dirname, "build"),
			filename: "parent-bundle.js"
		}
	},
	{
		context: path.join(__dirname, "build"),
		entry: ["../../lib/index.js", "./child.js"],
		output: {
			path: path.join(__dirname, "build"),
			filename: "child-bundle.js"
		}
	}
];
