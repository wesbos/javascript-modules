A big thanks to [bitHound](https://BitHound.io) for sponsoring my time to research and write this article. Check out their service, which analyzes both your front and back end JavaScript and its dependencies.

# Using `npm` and ES6 Modules for Front End Development

The JavaScript landscape is changing quickly and along with it the way that we work with dependencies in our websites and applications.

This post is for developers who are currently loading in their JavaScript via multiple script tags and finding that dependency management is becoming a little cumbersome as their webpages or applications start to grow.

For a deep dive into everything the spec has to offer, as well as some great comparisons to CommonJS and AMD, check out Axel Rauschmayer's [Exploring ES6 book](http://exploringjs.com/), particularly chapter 17.

## What are JavaScript Modules?

JavaScript modules allows us to chunk our code into separate files inside our project, or use open source modules that we can install via `npm`.  Writing your code in modules helps with organization, maintenance, testing, and most importantly dependency management.

When we write JavaScript, it's ideal if we can make modules that do one thing and one thing well. This way we can pull in different modules only when we need them. This is the whole idea behind `npm` - when we need specific functionality we can install those modules to our project and load them into our project.

We already said that the JavaScript landscape is changing - we're seeing fewer and fewer large frameworks that do everything under the sun, and more __small modules that do one thing and one thing well__. 

This article will take a look at using `npm` and ES6 Modules. There are other registries (Bower and Component) and other module loaders (Common JS, AMD), and there are plenty of articles already on those topics. 

Whether you are doing Node or Front End development, I believe that ES6 modules and `npm` are the way forward, and if you look at any of the popular open source projects today, such as React or Lodash, you'll see they have also adopted ES6 modules + `npm`.

### Current Workflow

Many workflows for JavaScript look like this:

1. Find a plugin or library that you want and download it from GitHub
2. Load it into your website via a script tag
3. Access it via a global variable, or as a jQuery plugin

This worked well for years, but we often run into a few issues:

1. Any updates to the plugins would have to be done manually — It's hard to know when there are critical bug fixes or new functionality available.
2. All dependencies needed to be checked into source control, and can make for a messy history when libraries are updated.
3. Little to no dependency management — many scripts would duplicate functionality that could easily be a small module shared between the them.
4. Pollution and possible collisions of the global name space. 

The idea of writing JavaScript modules isn't new, but with the arrival of ES6 and the industry settling on `npm` as a package manager for JavaScript, we're starting to see many devs migrate away from the above and into using ES6 and `npm`.

### Hold on. `npm`? Isn't that for Node?

Many moons ago, `npm` was the package manager for Node.js, but it has since evolved to become the package manager for JavaScript and front-end dev in general. This means that instead of doing the whole song and dance above, we can cut that down to 2 steps: 

First, install our dependency from `npm`:  `npm install lodash --save-dev`

Finally, import it into the file where we need that dependency:

```js
import _ from 'lodash';
```

Now, there is a lot more that goes into setting this workflow up, as well as plenty to learn about **importing** and **exporting** from modules, so let's dive into that.

## The idea behind Modules

Instead of just loading everything into the global name space, we use `import` and `export` statements to share things (variables, functions, data, anything...) between files. Each module will import the dependencies that it needs, and export anything that should be made import-able by other files.

To get everything working in today's browsers requires a bundle step - and we will talk about that later in this article, but for now let's focus on the core ideas behind JavaScript Modules.

## Creating your own Modules

Let's say we are building an online store app, and part of what we need is a file to hold all of our helper functions. We can create a module called `helpers.js` that contains a number of handy helper functions - `formatPrice(price)`, `addTax(price)` and `discountPrice(price, percentage)`, as well as some variables about the online store itself.

Our `helpers.js` file would look like this:

```js
const taxRate = 0.13;

const couponCodes = ['BLACKFRIDAY', 'FREESHIP', 'HOHOHO'];

function formatPrice(price) {
	// .. do some formatting
	return formattedPrice;
}

function addTax(price) {
	return price * (1 + taxRate);
}

function discountPrice(price, percentage) {
	return price * (1 - percentage);
}
```

Now, each file can have its own local functions and variables, and unless they are explicitly exported, they won't ever bleed into the scope of any other files. Above, we might not need `taxRate` to be available to other modules, but it is a variable we need internally for that module. 

How do we make the functions and variables above available to other modules? **We need to export them**. There are two kinds of exports in ES6 - named exports and a single default export. Since we need to make multiple functions and the `couponCodes` variable available, we will used named exports. More on this in a second.

The simplest and most straight forward way to export something from a module is to simply stick the `export` keyword in front, like so: 

```js
const taxRate = 0.13;

export const couponCodes = ['BLACKFRIDAY', 'FREESHIP', 'HOHOHO'];

export function formatPrice(price) {
	// .. do some formatting
	return formattedPrice;
}

//  ... 
```

We can also export them after the fact:

```js
export couponCodes;
export formatPrice;
export addTax;
export discountPrice;
```

Or all at once:

```js
export { couponCodes, formatPrice, addTax, discountPrice };
```

There are a handful of other ways use export, make sure to check the [MDN Docs](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Statements/export) if you run into a situation where these aren't working for you. 

## Default Export

We just said that there are actually two ways that you can export from a module - named or default. The above was an example of **named exports** and in order to import them from another module, we must know the names of the things we wish to import — examples of this coming in a second. The benefit of doing named exports is that you can export multiple items from a module. 

The other type of export is the default export, and while you can use this along with named exports, it's advised that you should pick one. Named exports for when you want to export multiple things, and a default export for when you wish to only export one thing. 

Examples of default exports may be a single `StorePicker` React Component or an array of data. For example, if we have the following array of data that we need to make available to other components, we can use `export default` to export it just as we did above.


```js
// people.js
const fullNames = ['Drew Minns', 'Heather Payne', 'Kristen Spencer', 'Wes Bos', 'Ryan Christiani'];

const firstNames = fullNames.map(name => name.split(' ').shift());

export default firstNames; // ["Drew", "Heather", "Kristen", "Wes", "Ryan"]
```

Just as above you can append the export default in front of the function you wish to export as well:

```js
export default function yell(name) {return `HEY ${name.toUpperCase()}!!`}
```


## Importing your own modules

Now that we have separated our code into little modules and exported pieces that we need, we can go ahead an import parts or all of those modules into our code. 

To import modules that are part of our codebase, we use an `import` statement and then point to the file's location. You'll notice that we leave off the `.js` extension as it's not required.

It's important to note that we don't import modules once and have them available to the entire application as globals. Whenever one of your modules has a dependency on another module — say our above code needed a lodash method — we must `import` it into that module. If we require the same lodash function in 5 of our modules, then we import it 5 times. This helps keep a sane scope as well as makes our modules very portable and reusable.

### Importing named exports

The first thing we exported was our helpers module. Remember we used **named exports** here, so we can import them in a number of ways:

```js
// import everything as methods or properties of an object
import * as h from './helpers';
// and then use them
const displayTotal = h.formatPrice(5000);


// Or import everything into the module scope:
import * from './helpers';
const displayTotal = addTax(1000);


// or cherry pick only the things you need:
import { couponcodes, discountPrice } from './helpers';
const discount = discountPrice(500,.33);
```

### Importing default exports

The second thing we did was export an array of first names from `people.js`. Since this was the only thing that needed to be exported from this module. 

Default exports can be imported as any name - it's not necessary to know the name of the variable, function or class that was exported. 

```js
import firstNames from './people';
// or
import names from './people';
// or
import elephants from './people';
// they are all equal to the array of first names
```

## Importing modules from `npm`

Many of the modules we will use come from `npm`. Whether we need a full library like jQuery, a few utility functions from lodash or something to perform Ajax requests like the superagent library, we can use `npm` to install them. 

```
npm install jquery --save-dev
npm install lodash --save-dev
npm install superagent --save-dev
// or all in one go:
npm i jquery lodash superagent -D
```

Once they are in our `node_modules/` directory, we can import them into our code. When using Babel to compile modules, it assumes the `node_modules/` directory so our import statements only need to include the name of the node module. Other bundlers may require a plugin or configuration to pull from your `node_modules/` folder. 

```js
// import entire library or plugin
import $ from 'jquery'; 
// and then go ahead an use them as we wish:
$('.cta').on('click',function() {
	alert('Ya clicked it!');
});
```

The above code works because jQuery is a module in itself, and it's been **exported** as the default. 

Let's try it again with superagent. Superagent is like jQuery in that it  exports the entire libary as default, so we can import it as anything we like — it's common to call it `request`.

```js
// import the module into ours
import request from 'superagent';
// then use it!
request
	.get('https://api.github.com/users/wesbos')
	.end(function(err, res){
	    console.log(res.body);
	});
```

### Importing Pieces or Cherry Picking

One of my favorite things about ES6 modules is that many libraries allow you to cherry-pick just the pieces you want. Lodash is a fantastic utility library filled with dozens of helpful JavaScript methods.

We can load the entire library into the `_` variable since lodash exports the entire library as a **default export**:

```js
// import the entire library in the _ variable
import _ from 'lodash';
const dogs = [
  { 'name': 'snickers', 'age': 2, breed : 'King Charles'},
  { 'name': 'prudence', 'age': 5, breed : 'Poodle'}
];

_.findWhere(dogs, { 'breed': 'King Charles' }); // snickers object
```

However, often you will want just one or two lodash methods instead of the entire library. Since Lodash has exported every single one of its methods as a module itself, we can cherry pick just the parts we want! This is made possible by Lodash also having **named exports** for each module.

```js
import { throttle } from 'lodash';
$('.click-me').on('click', throttle(function() {
  console.count('ouch!');
}, 1000));
```

## Making sure modules are up to date

Some resistance to the whole "small modules" way of coding is that it's easy to end up with a dozen or two dependencies from `npm` that all interact with each other. 

This space is moving very quickly right now, and keeping these dependencies up to date can be a headache. Knowing when both your code and your dependencies have bugs, security flaws or just general code smells isn't as easy as it used to be. We need to know if anything in our project is insecure, deprecated, outdated or unused.

To solve this, bitHound is a fantastic service that will constantly monitor your code and let you know when there is anything wrong with your dependencies as well as provide an overall score as to how well your repo is doing. 

bitHound integrates with GitHub and BitBucket and has also rolled out automatic commit analysis which will notify bitHound of changes to your repository's branches.

[Screenshot of dashboard showing some advice]

![](http://wes.io/e3om/content)

Another tool that works well with bitHound is called NCU. Install globally on your development machine with `npm install node-check-updates -g` and then run `ncu` to quickly check if your packages have any available updates. If they do, you can run `ncu --upgradeAll` to automatically update all packages in your package.json.


## The Bundle Process

Because the browser doesn't understand ES6 modules just yet, we need tools to make them work today. A JavaScript bundler takes in our Modules and compiles them into a single JavaScript file or multiple bundles for different parts of your application.

The idea is that eventually we won't need to run a bundler on our code and HTTP/2 will request all `import` statements in one payload.

There are a few popular bundlers, most of which use Babel as a dependency to compile them down to CommmonJS modules. 

* [Browserify](http://browserify.org/) was initially created to allow node-style commmonjs requires in the browser. It also allows for ES6 modules. 
* [webpack](https://webpack.github.io/) is popular in the React community. It also handles much more than ES6 modules.
* [Rollup](https://github.com/rollup/rollup) is built for ES6, but seems to have trouble with sourcemaps - I'd check on this one in a few months. 
* [JSPM](http://jspm.io/) sits on top of `npm` and [SystemJS](https://github.com/systemjs/systemjs).
* [Ember CLI](http://ember-cli.com/) is an easy-breezy command line tool similar to webpack for users of Ember. It uses Broccoli under the hood.

Which one should you use? Whichever works best for you. I'm a big fan of Browserify for the ease of getting started and webpack for much of its React integrations. The beauty of writing ES6 modules is that you aren't writing Browserify or webpack modules - you can switch your bundler at any time. There are a lot of opinions out there on what to use, so do a quick search and you'll find plenty of arguments for either side. 

If you are already running tasks via Gulp, Grunt or `npm` tasks for your existing JavaScript and CSS, integrating this into your workflow is [fairly simple](https://github.com/wesbos/React-For-Beginners-Starter-Files/blob/master/01%20-%20Introduction%20-%20Start%20Here/gulpfile.js#L58-L99). 

There are many different ways to implement a bundler - you can run it as part of your gulp task, via your webpack config, as an `npm` script or straight from the command line.

I've [created a repo](TODO) detailing how to use webpack and Browserify along with some sample modules for you to play with. 

### Importing code that isn't a module

If you are working on moving your codebase over to modules but aren't able to do it all in one shot, you can simply just `import "filename"` and it will load and run the code from that file. Now - this isn't ES6 proper, but a feature of your bundler.

This is no different than running concatenation on multiple `.js` files except that everything loaded in will be scoped to that module.

### Code that requires a global variable

Some things, like jQuery plugins, need the window. However we just learned that **there are no globals with ES6 modules**. Everything is scoped to the module itself unless you explicitly set something on the window.

This one is a little tricky because the whole jQuery plugin ecosystem assumes that there is a global variable called `jQuery` which each plugin can tack itself onto.

To solve this, first ask yourself if you really need that plugin, or if it's something you could code on your own. Much of the JavaScript plugin ecosystem is being rewritten to exclude the jQuery dependency because, as they are being rewritten, they are being created as JavaScript modules.

If not, you will need to look to your build process to help solve this problem. With Browserify, there is [Browserify Shim](https://github.com/thlorenz/browserify-shim) and [webpack](https://webpack.github.io/docs/shimming-modules.html) has some documentation on it.

## Gotchas 

When exporting a function, do not include a semi-colon at the end of the function. Most bundlers will still allow the extra semi-colon, but it's a good practice to keep it off your function declarations so you don't have an unexpected behavior when switching bundlers. 

```js
// Wrong:
export function yell(name) { return `HEY ${name}`; };
// Right:
export function yell(name) { return `HEY ${name}`; }
```

## Further Reading

Hopefully this was a nice introduction to using `npm` and ES6 Modules. There is a lot more to learn and in my opinion the best way to learn is to start using them in your next project. Here are some fantastic resources to help you along the way:

* [Exploring ES6 book](http://exploringjs.com/)
* [Brief Overview of ES6 Module syntax](https://github.com/ModuleLoader/es6-module-loader/wiki/Brief-Overview-of-ES6-Module-syntax)
* [ES6 Features](https://github.com/lukehoban/es6features#readme)
* [ES6 Modules on Rollup's Wiki](https://github.com/rollup/rollup/wiki/ES6-modules)
* [Browserify vs webpack hot drama](http://blog.namangoel.com/browserify-vs-webpack-js-drama)
* [webpack & ES6](http://www.2ality.com/2015/04/webpack-es6.html)
