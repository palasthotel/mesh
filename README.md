mesh
====

A HTML5 content-editable and jQuery text-editor


## Prerequisites

 1. Install [Node.js](http://nodejs.org/). This usually includes NPM.
 2. Check out this repository:

    ~~~
    git clone git://github.com/palasthotel/mesh.git
    ~~~
 3. `cd mesh`
 4. `npm install .`
 5. `npm install -g browserify jsdoc`


## Build

To build the combined JavaScript file, simply run

~~~
make debug
~~~

or

~~~
make release
~~~

The `release` target also requires [Google's Closure
Compiler](https://code.google.com/p/closure-compiler/). Unzip
`compiler-latest.zip`, so `compiler.jar` is in the same directory that contains
the `mesh` repository.


### Documentation

You can build the documentation by running

~~~
make docs
~~~

This will create `../mesh-docs`.

You need a web server to read it. You could, for example,

~~~
npm install -g wup
cd ../mesh-docs
wup
~~~

Then open <http://localhost:8080/> in your browser.

A (likely outdated) version of the documentation can be found here:
<http://palasthotel.github.io/mesh/api/current/>.

