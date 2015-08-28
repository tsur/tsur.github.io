var Blockade = {};

Blockade.main = function(app) {

  app.init();

  app.run(true);

};

Blockade.options = {

  screenName: 'Blockade Experiment',
  autoExec: true,
  draggable: true,
  close: true,
  minimize: false,
  maximize: true,
  url: 'http://tsur.github.io/blockade',

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