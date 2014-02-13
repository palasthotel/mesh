all: debug

debug:
	mkdir -p out
	tsc --module commonjs --outDir out src/main.ts
	browserify -d -r ./out/main.js:mesh -o mesh.js

release:
	mkdir -p out
	tsc --module commonjs --outDir out src/main.ts
	browserify -r ./out/main.js:mesh -o mesh.js
