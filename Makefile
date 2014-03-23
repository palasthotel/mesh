MESH = -r ./src/index.js:mesh
PLUGINS = -x ./src/index.js -r ./plugins/index.js:mesh-plugins

all: debug docs

debug:
	browserify --debug $(MESH) > mesh.js
	browserify --debug $(PLUGINS) > mesh-plugins.js

release:
	browserify $(MESH) > mesh.js
	browserify $(PLUGINS) > mesh-plugins.js
	java -jar ../compiler.jar --js mesh.js --js_output_file tmp.js
	cat src/license.js tmp.js > mesh.js
	java -jar ../compiler.jar --js mesh-plugins.js --js_output_file tmp.js
	cat src/license.js tmp.js > mesh-plugins.js

docs:
	rm -r ../mesh-docs/api/current
	mkdir -p ../mesh-docs/api/current
	jsdoc -c jsdoc.json
