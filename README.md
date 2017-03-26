![Build Status](https://travis-ci.org/tompascall/js-to-less-var-loader.svg?branch=master) [![Coverage Status](https://coveralls.io/repos/github/tompascall/js-to-less-var-loader/badge.svg?branch=master)](https://coveralls.io/github/tompascall/js-to-less-var-loader?branch=master)

## js-to-less-var-loader

### A [Webpack]() loader to share data for less variables between javascript modules and less files

This loader is for that special case when you would like to import data from a javascript module into a less file. The [Less loader](https://github.com/webpack-contrib/less-loader) complains, because importing js module is not a valid less instruction.

##### The loader only handles the case when you want to inject less variables into a less file via a javascript module.

#### Prerequisites

- Nodejs >= 6.0
- [Less](http://lesscss.org/) for css pre-processing
- Webpack for module bundle
- Install js-to-less-var-loader npm package into your project: `npm i --save js-to-less-var-loader`

#### Setting up Webpack config

Probably you use [less-loader](https://github.com/webpack-contrib/less-loader) with Webpack. The usage in this case is pretty simple: just put this loader before less-loader in your webpack config:

```js
{
  rules: [
    test: /\.less$/,
    use: [
      {
        loader: "style-loader"
      },
      {
        loader: "css-loader"
      },
      {
        loader: "less-loader"
      },
      {
        loader: "js-to-less-var-loader"
      }
    ]
  ]
}
```

#### Usage

Let's assume we would like to store some variable data in a module like this:

```js
// colors.js

const colors = {
  'fancy-white': '#FFFFFE',
  'fancy-black': '#000001'
};

module.exports = colors;
```

You can use this module in your favorite templates / frameworks etc., and you don't want to repeat yourself when using these colors in a less file as variable (e.g. `@fancy-white: #FFFFFE; /*...*/ background-color: @fancy-white`). In this situation just require your module in the beginning of your less module:
```js
require('relative/path/to/colors.js');

// ...
.some-class {
  background-color: @fancy-white
}
// ...
```

**The form of the required data is important**: it must be an object with key/values pair, the key will be the name of the less variable.

#### Misc

You can use other require form (`require('relative/path/to/module').someProperty`), too.  

#### Development

Run tests with `npm test` or `npm run test:watch`. 

The transformer is developed with tdd, so if you would like to contribute, please, write your tests for your new functionality, and send pull request to integrate your changes.
