/*
bapp v.0.0.0
Copyright (c) 2012 
Released under the MIT License <http://www.opensource.org/licenses/mit-license.php> 
*/

/*
Dependencies: jquery.double_resize, jquery-ui.draggable, jquery.cookie
*/

function Runner(name, options) {

  this.name = name;

  this.options = Runner.defaultOptions;
  this.timestamp = (new Date()).getTime() + Math.random().toString().replace('.', '');

  $.extend(this.options, options || {});

}

Runner.running = null;

Runner.runnings = [];

Runner.execute = function(application, extra) {

  var head = document.head || document.getElementsByTagName('head')[0];

  var path = 'media/applications/' + application + '/' + application + '.js';

  var appMainFile = application.substring(0, 1).toUpperCase() + application.substring(1);

  try {

    if (Runner.runnings[application] !== undefined) {

      if (Runner.runnings[application].options.minimized) return Runner.runnings[application].fromMinimize(Runner.runnings[application].options.app);

      return;
    }

    //Map application data to namesMap

    //Runner.namesMap[output.id] = alias;
    Runner.running = application;

    $('#browser_frame').css('cursor', 'progress');

    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', path);

    script.onload = function() {

      if (!window[appMainFile].options.commandLine) {

        Runner.runnings[application] = new Runner(application, window[appMainFile].options);

      }

      window[appMainFile].main(Runner.runnings[application], extra);

      $('#browser_frame').css('cursor', 'default');

    };

    script.onerror = function() {

      $('#browser_frame').css('cursor', 'default');
      head.removeChild(script);

    };

    head.appendChild(script);

  } catch (e) {
    //console.log(e);
  }
};


Runner.defaultOptions = {

  //Create the app at the same time it's opened
  appStatus: undefined,
  appUrl: undefined,
  appCode: 'iframe',
  appLang: 'none',
  lajaxUrl: '',
  appDefaultLang: 'en',
  blockingApp: false,

  //resize: 'all','vertical','horizontal','none'
  autoExec: true,
  draggable: true,
  close: true,
  minimize: true,
  maximize: true,
  onAppLoad: undefined,

  //For extra-plugins
  resize: 'all',
  width: '200px',
  height: '200px',
  minWidth: '200px',
  minHeight: '200px',
  maxWidth: undefined,
  maxHeight: undefined
};

Runner.blockScreen = function(f) {

  $('#browser_frame').animate({
    opacity: '0.50'
  }, '2500', function() {

    $(this).after('<div id="block-screen">');

    $('div#block-screen').click(function() {

      return false;
    });

    f();

  });
};

Runner.unblockScreen = function() {

  $('#browser_frame').animate({
    opacity: '1'
  }, '2500', function() {

    $('div#block-screen').unbind('click').remove();
  });
};

Runner.appCounter = 0;

//Instance methods

Runner.prototype.init = function(content) {

  //Application basic structure
  var $topBar = $('<div>').addClass('app_tool'),
    $bottomBar = $('<div>').addClass('app_bottom'),
    $appContainer = $('<div>').addClass('app_container'),
    $appSrc = null,
    $appButtons = $('<div>').addClass('app_tool_buttons'),
    $newApp = $('<div>').addClass('app app_outer');

  $topBar.html($('<p>').addClass('unselectable').text(this.options.screenName));

  if (this.options.status != undefined)
    $bottomBar.html($('<p>').text(this.options.status));

  if (this.options.url != undefined){

    var self = this;

    $appSrc = $('<iframe>').attr('src', this.options.url);

    $appSrc.mouseup(function() {

      //self.options.app.find('.app_container').focus();
      //self.onAppFocus($(this));
      self.zindex($newApp);

    });
  }


  if (content != undefined)
    $appSrc = $(content).wrap('<div class="app_wrap">');

  $appContainer.html($appSrc);

  if (this.options.minimize != false) $appButtons.append('<a class="app_tool_minimize"><img src="media/images/webtop/minimize.png" /></a>');

  if (this.options.maximize != false &&
    this.options.maxWidth == undefined &&
    this.options.maxHeight == undefined
  )
    $appButtons.append('<a class="app_tool_maximize"><img src="media/images/webtop/move.png"></a>');

  if (this.options.close != false)
    $appButtons.append('<a class="app_tool_close"><img src="media/images/webtop/close.png"></a>');

  $newApp
    .append($appButtons, $topBar, $appContainer, $bottomBar)
    .attr('rel', this.timestamp)
    .addClass('dis_hidden')
    .css('z-index', '1000')
    .insertAfter('#hex-menu');

  this.options.app = $newApp;

  return this;

};

Runner.prototype.run = function(visible) {

  visible = (visible === false) ? false : undefined;

  var self = this;
  var app = this.options.app;

  app
    .double_resize({

      instance: self,
      resize: self.options.resize,
      width: self.options.width,
      height: self.options.height,
      minWidth: self.options.minWidth,
      minHeight: self.options.minHeight,
      maxWidth: self.options.maxWidth,
      maxHeight: self.options.maxHeight

    });

  //Make it draggable!
  if (this.options.draggable == true) {
    app
    //.draggable({handle:'.app_tool, .app_tool_move', addClasses:false})
    .draggable({
      handle: '.app_tool',
      addClasses: false,
      /*grid: [20, 20], cursorAt: { top: 6 },*/
      containment: [, -parseFloat(app.css('margin-top')), , /*window.innerHeight+62*/ ]
    });

    app.mousedown(function() {

      //self.options.app.find('.app_container').focus();
      app.draggable('disable');
      self.zindex(app);
      app.draggable('enable');
      return false;

    });

    app.mouseup(function() {


      //self.options.app.find('.app_container').focus();
      //self.onAppFocus($(this));
      app.draggable('disable');
      self.zindex(app);
      app.draggable('enable');

    });
  }

  //When closing it, what does it do?
  if (this.options.close != false) {
    app.find('.app_tool_close').click(function() {

      self.onAppClose($(this).parent().parent());
    });
  }

  if (this.options.maxWidth == undefined &&
    this.options.maxHeight == undefined &&
    this.options.maximize != false) {
    //When maximizing it, what does it do?
    app.find('.app_tool_maximize').click(function() {

      self.onAppMaximize($(this).parent().parent());

    });

    //When double click on the top bar
    app.find('.app_tool').dblclick(function() {

      self.onAppMaximize($(this).parent());

    });

  }

  if (this.options.startMaximized === true) {

    this.onAppMaximize(app);
    this.onAppFocus(app);
  }

  //When minimizing it, what does it do?
  if (this.options.minimize != false) {
    app.find('.app_tool_minimize').click(function() {

      self.onAppMinimize($(this).parent().parent());

    });
  }

  $(window).bind('resize', function() {

    app.draggable('enable');

    app.double_resize('enable', self.options.resize);

    self.options.maximized = undefined;
  });

  if (visible !== false) {
    app.removeClass('dis_hidden');
  }
};

Runner.prototype.close = function() {

  this.onAppClose(this.options.app);

}

Runner.prototype.onAppClose = function(app) {

  var rel = app.attr('rel');

  if (this.options.close !== false &&
    typeof this.options.close == 'function') {
    this.options.close();
  }

  Runner.runnings[this.name] = undefined;
  app.remove();

};

Runner.prototype.onAppFocus = function(app) {

  this.zindex(app);

};

Runner.prototype.onAppBlur = function(app) {

};

Runner.prototype.onAppMaximize = function(app) {

  var rel = app.attr('rel');

  if (this.options.maximized == undefined) {
    this.options.$currentMaxCss = {

      top: app.css('top'),
      left: app.css('left'),
      width: parseFloat(app.css('width')),
      height: parseFloat(app.css('height'))
    };

    var maximiseCss = {

      top: -parseFloat(app.css('margin-top')) + 'px',
      left: (-parseFloat(app.css('margin-left'))) + 'px'
    };

    app
      .css(maximiseCss)
      .double_resize('maximize', window.innerWidth, window.innerHeight);

    if (this.options.draggable == true) {
      app.draggable('disable');
    }

    if (this.options.resize != false) {
      app.double_resize('disable', this.options.resize);
    }

    this.options.maximized = true;

    this.options.minimized = undefined;

  } else {
    //console.log(window.innerHeight-core.$currentMaxCss.height);

    app
      .css({
        top: this.options.$currentMaxCss.top,
        left: this.options.$currentMaxCss.left
      })
      .double_resize('maximize', this.options.$currentMaxCss.width, this.options.$currentMaxCss.height);

    if (this.options.draggable == true) {
      app.draggable('enable');
    }

    if (this.options.resize != false) {
      app.double_resize('enable', this.options.resize);
    }

    this.options.maximized = undefined;
  }

  //core.zindex(app);
};

Runner.prototype.onAppMinimize = function(app) {

  app.addClass('dis_hidden');

  if (this.options.minimized === undefined) {

    this.options.minimized = true;

  }
};

Runner.prototype.fromMinimize = function(app) {

  //console.log(this.appId);
  if (this.options.minimized === true) {

    this.options.minimized = undefined;

    this.zindex(app);

    app.removeClass('dis_hidden');

  }
};

Runner.prototype.zindex = function(app) {

  $('.app').each(function() {

      $(this).css('z-index', '998');
  });

  app.css('z-index', '1000');
};