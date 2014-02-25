all: debug docs

debug:
	browserify --debug src/main.js > mesh.js

release:
	browserify src/main.js | uglifyjs > mesh.min.js

docs:
	yuidoc .
