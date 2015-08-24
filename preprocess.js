var preprocess = require('preprocess');
var fs = require('fs');

preprocess.preprocessFileSync(__dirname + '/main.html', __dirname + '/index.html', {
  SVG_GITHUB: fs.readFileSync(__dirname + '/media/images/svg/github17.svg'),
  SVG_NPM: fs.readFileSync(__dirname + '/media/images/svg/npm.svg'),
  SVG_IN: fs.readFileSync(__dirname + '/media/images/svg/linkedin.svg'),
  SVG_BLOG: fs.readFileSync(__dirname + '/media/images/svg/blogger16.svg'),
  SVG_TWITTER: fs.readFileSync(__dirname + '/media/images/svg/twitter.svg'),
  SVG_TERMINAL: fs.readFileSync(__dirname + '/media/images/svg/computer1.svg'),
  SVG_CODEPEN: fs.readFileSync(__dirname + '/media/images/svg/3d80.svg'),
  SVG_SKYPE: fs.readFileSync(__dirname + '/media/images/svg/skype12.svg')
});