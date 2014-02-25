all: debug docs

debug:
	browserify --debug src/main.js > mesh.js

release:
	browserify src/main.js | uglifyjs > mesh.min.js

docs:
	rm -r ../mesh-docs/api/current
	mkdir -p ../mesh-docs/api/current
	jsdoc -c jsdoc.json
