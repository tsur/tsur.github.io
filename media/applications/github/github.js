var Github = {};

Github.main = function(app) {

  app.init();

  app.run(true);

};


Github.options = {

  screenName: 'Github',
  autoExec: true,
  draggable: true,
  close: true,
  minimize: false,
  maximize: true,
  url: 'http://github.com/Tsur',

  //For extra-plugins
  startMaximized: true,
  resize: 'all',
  width: '550px',
  height: '350px',
  minWidth: '300px',
  minHeight: '300px',
  maxWidth: undefined,
  maxHeight: undefined

};