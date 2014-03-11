all: debug docs

debug:
	browserify --debug -r ./src/main.js:mesh > tmp.js

release:
	browserify -r ./src/main.js:mesh > mesh.js
	java -jar ../compiler.jar --js mesh.js --js_output_file tmp.js
	cat src/license.js tmp.js > mesh.js

docs:
	rm -r ../mesh-docs/api/current
	mkdir -p ../mesh-docs/api/current
	jsdoc -c jsdoc.json
