all: typescript

typescript:
	tsc --module commonjs --outdir src ts/main.ts
	browserify src/main.js -o mesh.js
