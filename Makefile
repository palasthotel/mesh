all: typescript

typescript:
	mkdir -p out
	tsc --module commonjs --outDir out src/main.ts
	browserify -r ./out/main.js:mesh -o mesh.js
