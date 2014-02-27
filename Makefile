all: debug docs

debug:
	browserify --debug src/main.js > mesh.js

release:
	browserify src/main.js > tmp.js
	java -jar ../compiler.jar --js tmp.js --js_output_file mesh.js

docs:
	rm -r ../mesh-docs/api/current
	mkdir -p ../mesh-docs/api/current
	jsdoc -c jsdoc.json
