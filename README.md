mesh
====

Mesh is an HTML5 WYSIWYG editor for HTML texts using the `contenteditable`
attribute for making the HTML editable directly. It also allows you to sort
entire paragraphs through drag and drop. It can be extended with plug-ins.

## Prerequisites

This project uses [browserify](http://browserify.org/) as its build tool. To
make the build process work, you need to install several tools. Follow the
instructions below.

 1. Install [Node.js](http://nodejs.org/). This usually includes NPM.

    (Node.js is only used for **building** the code. All code is merged into one
    file.)
 2. Check out this repository:

    ~~~
    git clone git://github.com/palasthotel/mesh.git
    ~~~
 3. `cd mesh`
 5. `npm install -g browserify jsdoc` or if necessary `sudo npm install -g
    browserify jsdoc`

If you want to understand how Node.js-style JavaScript modules work, [this
document](http://nodejs.org/api/modules.html) might help.

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


### Final directory structure

Here's the directory structure you should have if you followed the instructions
above.

~~~
path/to/parent/
|
|-- mesh/         -- contains this Git repository
|-- mesh-docs/    -- contains the docs
\-- compiler.jar  -- closure compiler
~~~
