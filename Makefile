all: debug docs

debug:
	browserify --debug -r ./src/main.js:mesh > mesh.js

release:
	browserify -r ./src/main.js:mesh > tmp.js
	java -jar ../compiler.jar --js tmp.js --js_output_file mesh.js

docs:
	rm -r ../mesh-docs/api/current
	mkdir -p ../mesh-docs/api/current
	jsdoc -c jsdoc.json
