mesh
====

Building instructions
---------------------

To keep the code modular, mesh uses the module system of Node.js for JavaScript
code. In order to build the code, you have to

 1. have [Node.js](http://nodejs.org/) installed.
 2. have [Browserify](http://browserify.org/) installed.

        npm install -g browserify

 3. run

        browserify main.js > bundle.js

