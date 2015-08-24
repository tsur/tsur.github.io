/*!
 * $ Double Resize Plugin
 * Examples and documentation at: http://
 * Copyright (c) 2012-2012 Zurisadai Pavon
 * Version: 0.0 (20-ABR-2012)
 * Dual licensed under the MIT and GPL licenses.
 * http:///license.html
 * Requires: $ v1.3.2 or later
 */

;
(function($) {

  var jdr = {};

  var core = {

    init: function(options) {
      $.extend(settings, options);

      core.$item = $(this);

      if (settings.width != '200px' ||
        settings.height != '200px') {
        methods.changeSize();
      }


      if (settings.resize != false) {
        methods.resize();
      }
    },

    parseSize: function() {
      pattern = /^([1-9][0-9]*)([a-z]*)$/i;

      parts = settings.width.match(pattern);

      if (parts != null) {
        width = parts[1];
        unit = parts[2];
      } else return null;

      parts = settings.height.match(pattern);

      if (parts != null) {
        height = parts[1];
        unit = (unit != '') ? unit : ((parts[2] != '') ? parts[2] : 'px');
      } else return null;

      if (unit == '%') {
        total = window.innerWidth;
        width = (total * width) / 100;

        total = window.innerHeight;
        height = (total * height) / 100;

        unit = 'px';
      }

      return new Array(width, height, unit);
    }
  };

  var settings = {

    tool: '.app_tool',
    bottom: '.app_bottom',
    container: '.app_container',

    //resize: 'all','vertical','horizontal','none'
    resize: 'all',
    width: '200px',
    height: '200px',
    minWidth: '200px',
    minHeight: '200px',
    maxWidth: undefined,
    maxHeight: undefined
  };

  var methods = {

    resize: function() {
      jdr.app_tool = settings.tool;
      jdr.app_bottom = settings.bottom;
      jdr.app_container = settings.container;

      jdr.mousedown_e = false;

      size = core.parseSize();
      if (size == null)
        return;

      width = size[0], height = size[1], unit = size[2];

      $rs_left = $('<div class="app_rs_left">').css('height', height - 30);
      $rs_right = $('<div class="app_rs_right">').css({
        'left': width - 5,
        'height': height - 30
      });
      $rs_top = $('<div class="app_rs_top">').css('width', width - 20);
      $rs_down = $('<div class="app_rs_down">').css('width', width - 20);

      $rs_top_left = $('<div class="app_rs_top_left">');
      $rs_top_right = $('<div class="app_rs_top_right">').css('left', width - 5);
      $rs_down_left = $('<div class="app_rs_down_left">');
      $rs_down_right = $('<div class="app_rs_down_right">').css('left', width - 5);

      if (settings.resize == 'horizontal') {
        core.$item.prepend($rs_right, $rs_left);

        jdr._mouse_start('.app_rs_right');
        jdr._mouse_start('.app_rs_left');
      } else if (settings.resize == 'vertical') {
        core.$item.prepend($rs_down, $rs_top);

        jdr._mouse_start('.app_rs_top');
        jdr._mouse_start('.app_rs_down');
      } else {
        core.$item.prepend($rs_down_right, $rs_down, $rs_down_left, $rs_right, $rs_left, $rs_top_right, $rs_top, $rs_top_left);

        jdr._mouse_start('.app_rs_top');
        jdr._mouse_start('.app_rs_down');
        jdr._mouse_start('.app_rs_right');
        jdr._mouse_start('.app_rs_left');

        jdr._mouse_start('.app_rs_top_left');
        jdr._mouse_start('.app_rs_top_right');
        jdr._mouse_start('.app_rs_down_left');
        jdr._mouse_start('.app_rs_down_right');
      }

      jdr._mouse_stop();

      $(document).unbind('mousemove');
      $(document).mousemove(function(e) {

        if (jdr.mousedown_e == true) {
          if (jdr.mouse_top == true) {
            jdr._top(e.pageY);
          }

          if (jdr.mouse_down == true) {
            jdr._down(e.pageY);
          }

          if (jdr.mouse_right == true) {
            jdr._right(e.pageX);
          }

          if (jdr.mouse_left == true) {
            jdr._left(e.pageX);
          }
        }
      });
    },

    changeSize: function() {
      size = core.parseSize();
      if (size == null)
        return;

      width = size[0], height = size[1], unit = size[2];

      core.$item
        .css({
          'width': width + unit,
          'height': height + unit,
          'margin-left': (-width / 2) + unit,
          'margin-top': (-height / 2) + unit
        });

      core.$item
        .find(settings.tool)
        .css({
          'width': (width - 10) + unit
        });

      core.$item
        .find(settings.container)
        .css({
          'width': (width - 10) + unit,
          'height': (height - 74) + unit
        });

      core.$item
        .find(settings.bottom)
        .css({
          'width': (width - 20) + unit,
          'top': (height - 38) + unit
        });
    },

    maximize: function(w, h) {

      //console.log(arguments);
      //console.log(arguments[2]);
      jdr.app = $(this);
      jdr.app_tool = '.app_tool';
      jdr.app_bottom = '.app_bottom';
      jdr.app_container = '.app_container';

      jdr.mouse_X = parseFloat($(this).css('width'));
      jdr._right(w);

      jdr.mouse_Y = parseFloat($(this).css('height'));
      jdr._down(h);

      return this;
    },

    disable: function(resize) {

      //console.log(resize);
      jdr.app = $(this);

      if (resize == 'horizontal') {
        jdr.app.find('.app_rs_right').unbind('mousedown').css('cursor', 'auto');
        jdr.app.find('.app_rs_left').unbind('mousedown').css('cursor', 'auto');
      } else if (settings.resize == 'vertical') {
        jdr.app.find('.app_rs_top').unbind('mousedown').css('cursor', 'auto');
        jdr.app.find('.app_rs_down').unbind('mousedown').css('cursor', 'auto');
      } else {
        jdr.app.find('div[class*=app_rs_]').unbind('mousedown').css('cursor', 'auto');
      }

      return this;
    },

    destroy: function() {
      jdr.app = $(this);

      jdr.app.find('div[class*=app_rs_]').unbind('mousedown');
      //$(document).unbind('mousemove');
      //$(document).unbind('mouseup');
      //core.$item = null,settings.instance = null,settings = null;

    },

    enable: function(resize) {

      //console.log(resize);
      jdr.app = $(this);

      if (resize == 'horizontal') {
        jdr._mouse_start('.app_rs_right');
        jdr._mouse_start('.app_rs_left');

        jdr.app.find('.app_rs_right').css('cursor', 'e-resize');
        jdr.app.find('.app_rs_left').css('cursor', 'w-resize');
      } else if (settings.resize == 'vertical') {
        jdr._mouse_start('.app_rs_top');
        jdr._mouse_start('.app_rs_down');

        jdr.app.find('.app_rs_top').css('cursor', 'n-resize');
        jdr.app.find('.app_rs_down').css('cursor', 's-resize');
      } else {
        jdr._mouse_start('.app_rs_top');
        jdr._mouse_start('.app_rs_down');
        jdr._mouse_start('.app_rs_right');
        jdr._mouse_start('.app_rs_left');
        jdr._mouse_start('.app_rs_top_left');
        jdr._mouse_start('.app_rs_top_right');
        jdr._mouse_start('.app_rs_down_left');
        jdr._mouse_start('.app_rs_down_right');

        jdr.app.find('.app_rs_top').css('cursor', 'n-resize');
        jdr.app.find('.app_rs_down').css('cursor', 's-resize');
        jdr.app.find('.app_rs_right').css('cursor', 'e-resize');
        jdr.app.find('.app_rs_left').css('cursor', 'w-resize');
        jdr.app.find('.app_rs_top_left').css('cursor', 'nw-resize');
        jdr.app.find('.app_rs_top_right').css('cursor', 'ne-resize');
        jdr.app.find('.app_rs_down_left').css('cursor', 'sw-resize');
        jdr.app.find('.app_rs_down_right').css('cursor', 'se-resize');
      }

      return this;
    }
  };

  jdr._mouse_start = function(the_class) {

    $(the_class).mousedown(function(e) {

      //console.log('mousedown clase');
      jdr.mousedown_e = true;
      jdr.mouse_X = e.pageX;
      jdr.mouse_Y = e.pageY;
      jdr.app = $(this).parent();

      jdr.mouse_top = jdr.mouse_left = jdr.mouse_right = jdr.mouse_down = false;

      switch (the_class) {
        case '.app_rs_top_left':
          jdr.mouse_top = jdr.mouse_left = true;
          break;
        case '.app_rs_top':
          jdr.mouse_top = true;
          break;
        case '.app_rs_top_right':
          jdr.mouse_top = jdr.mouse_right = true;
          break;
        case '.app_rs_left':
          jdr.mouse_left = true;
          break;
        case '.app_rs_right':
          jdr.mouse_right = true;
          break;
        case '.app_rs_down_left':
          jdr.mouse_down = jdr.mouse_left = true;
          break;
        case '.app_rs_down':
          jdr.mouse_down = true;
          break;
        case '.app_rs_down_right':
          jdr.mouse_down = jdr.mouse_right = true;
          break;
        default:
          break;
      }

      //$('.app .app_container:not(div.iframe-overlap)').prepend($('<div>').addClass('iframe-overlap'));


      $('.app .app_container div.iframe-overlap').remove();

      $('.app .app_container').prepend($('<div>').addClass('iframe-overlap'));

      //zindex = jdr.app.css('z-index');
      //
      ////Si da problemas borrar el if
      //if (zindex == '10000')
      //  return false;
      //
      //if (zindex != '999') {
      //  $('.app').each(function() {
      //
      //
      //    if ($(this).css('z-index') == '999') {
      //      $(this).css('z-index', '102');
      //    } else {
      //      $(this).css('z-index', '101');
      //    }
      //  });
      //
      //  jdr.app.css('z-index', 999);
      //} else {
      //  $('.app').each(function() {
      //
      //    if ($(this).css('z-index') == '1000') {
      //      $(this).css('z-index', '998');
      //    }
      //  });
      //}

      return false;

    });

  };

  jdr._mouse_stop = function() {

    //$(document).unbind('mouseup');
    $(document).mouseup(function(e) {

      //console.log('jquery_dr');
      if (jdr.mousedown_e == true) {
        jdr.mousedown_e = false;
      }

      //$('.app').each(function() {
      //
      //  //Si da problemas poner: if($(this).css('z-index') == '999')
      //  if ($(this).css('z-index') >= 999) {
      //    $(this).find('.app_container div.iframe-overlap').remove();
      //  }
      //});

      return false;

    });

  };

  jdr._top = function(y) {

    dif = jdr.mouse_Y - y;

    //console.log('top ' + dif);
    if ((parseFloat(jdr.app.css('top')) - dif) <= (-parseFloat(jdr.app.css('margin-top')) + 26)) {
      dif = parseFloat(jdr.app.css('top')) - 126;
    }

    if ((parseFloat(jdr.app.css('height')) + dif) <= parseFloat(settings.minHeight)) {
      dif = parseFloat(settings.minHeight) - parseFloat(jdr.app.css('height'));
    } else if (settings.maxHeight != undefined &&
      (parseFloat(jdr.app.css('height')) + dif) >= parseFloat(settings.maxHeight)
    ) {
      dif = parseFloat(settings.maxHeight) - parseFloat(jdr.app.css('height'));
    }

    settings.instance.options.maximized = undefined;

    jdr.app.css('height', (dif + parseFloat(jdr.app.css('height'))));
    jdr.app.css('top', (parseFloat(jdr.app.css('top'))) - dif);

    app_container = jdr.app.find(jdr.app_container);
    app_container.css('height', (dif + parseFloat(app_container.css('height'))));

    app_bottom = jdr.app.find(jdr.app_bottom);
    app_bottom.css('top', (dif + parseFloat(app_bottom.css('top'))));

    app_left = jdr.app.find('.app_rs_left');
    app_left.css('height', (dif + parseFloat(app_left.css('height'))));

    app_right = jdr.app.find('.app_rs_right');
    app_right.css('height', (dif + parseFloat(app_right.css('height'))));

    jdr.mouse_Y = y;

  };

  jdr._down = function(y) {

    dif = y - jdr.mouse_Y;
    //console.log('down ' + dif);
    //console.log('height( ' +parseFloat(jdr.app.css('height'))+' maxHeight( '+parseFloat(settings.maxHeight)+' )');
    if ((parseFloat(jdr.app.css('height')) + dif) <= parseFloat(settings.minHeight)) {
      dif = parseFloat(settings.minHeight) - parseFloat(jdr.app.css('height'));
    } else if (settings.maxHeight != undefined &&
      (parseFloat(jdr.app.css('height')) + dif) >= parseFloat(settings.maxHeight)
    ) {
      dif = parseFloat(settings.maxHeight) - parseFloat(jdr.app.css('height'));
    }

    settings.instance.options.maximized = undefined;

    jdr.app.css('height', (dif + parseFloat(jdr.app.css('height'))));

    app_container = jdr.app.find(jdr.app_container);
    app_container.css('height', (dif + parseFloat(app_container.css('height'))));

    app_bottom = jdr.app.find(jdr.app_bottom);
    app_bottom.css('top', (dif + parseFloat(app_bottom.css('top'))));

    app_left = jdr.app.find('.app_rs_left');
    app_left.css('height', (dif + parseFloat(app_left.css('height'))));

    app_right = jdr.app.find('.app_rs_right');
    app_right.css('height', (dif + parseFloat(app_right.css('height'))));

    jdr.mouse_Y = y;
  };

  jdr._right = function(x) {

    dif = x - jdr.mouse_X;
    //console.log('right: ' +dif);

    if ((parseFloat(jdr.app.css('width')) + dif) <= parseFloat(settings.minWidth)) {
      dif = parseFloat(settings.minWidth) - parseFloat(jdr.app.css('width'));
    } else if (settings.maxWidth != undefined &&
      (parseFloat(jdr.app.css('width')) + dif) >= parseFloat(settings.maxWidth)
    ) {
      dif = parseFloat(settings.maxWidth) - parseFloat(jdr.app.css('width'));
    }

    settings.instance.options.maximized = undefined;

    jdr.app.css('width', (dif + parseFloat(jdr.app.css('width'))));

    app_container = jdr.app.find(jdr.app_container);
    app_container.css('width', (dif + parseFloat(app_container.css('width'))));

    app_tool = jdr.app.find(jdr.app_tool);
    app_tool.css('width', (dif + parseFloat(app_tool.css('width'))));

    app_bottom = jdr.app.find(jdr.app_bottom);
    app_bottom.css('width', (dif + parseFloat(app_bottom.css('width'))));

    app_top = jdr.app.find('.app_rs_top');
    app_top.css('width', (dif + parseFloat(app_top.css('width'))));

    app_down = jdr.app.find('.app_rs_down');
    app_down.css('width', (dif + parseFloat(app_down.css('width'))));

    app_top_right = jdr.app.find('.app_rs_top_right');
    app_top_right.css('left', (dif + parseFloat(app_top_right.css('left'))));

    app_right = jdr.app.find('.app_rs_right');
    app_right.css('left', (dif + parseFloat(app_right.css('left'))));

    app_down_right = jdr.app.find('.app_rs_down_right');
    app_down_right.css('left', (dif + parseFloat(app_down_right.css('left'))));

    jdr.mouse_X = x;
  };

  jdr._left = function(x) {

    dif = jdr.mouse_X - x;
    //console.log('left ' + dif);

    if ((parseFloat(jdr.app.css('width')) + dif) <= parseFloat(settings.minWidth)) {
      dif = parseFloat(settings.minWidth) - parseFloat(jdr.app.css('width'));
    } else if (settings.maxWidth != undefined &&
      (parseFloat(jdr.app.css('width')) + dif) >= parseFloat(settings.maxWidth)
    ) {
      dif = parseFloat(settings.maxWidth) - parseFloat(jdr.app.css('width'));
    }

    settings.instance.options.maximized = undefined;

    jdr.app.css('width', (dif + parseFloat(jdr.app.css('width'))));
    jdr.app.css('left', (parseFloat(jdr.app.css('left'))) - dif);

    app_container = jdr.app.find(jdr.app_container);
    app_container.css('width', (dif + parseFloat(app_container.css('width'))));

    app_tool = jdr.app.find(jdr.app_tool);
    app_tool.css('width', (dif + parseFloat(app_tool.css('width'))));

    app_bottom = jdr.app.find(jdr.app_bottom);
    app_bottom.css('width', (dif + parseFloat(app_bottom.css('width'))));

    app_top = jdr.app.find('.app_rs_top');
    app_top.css('width', (dif + parseFloat(app_top.css('width'))));

    app_down = jdr.app.find('.app_rs_down');
    app_down.css('width', (dif + parseFloat(app_down.css('width'))));

    app_top_right = jdr.app.find('.app_rs_top_right');
    app_top_right.css('left', (dif + parseFloat(app_top_right.css('left'))));

    app_right = jdr.app.find('.app_rs_right');
    app_right.css('left', (dif + parseFloat(app_right.css('left'))));

    app_down_right = jdr.app.find('.app_rs_down_right');
    app_down_right.css('left', (dif + parseFloat(app_down_right.css('left'))));

    jdr.mouse_X = x;
  };

  $.prototype.double_resize = function(options) {

    //If the first argument is the name of a function
    if (methods[options]) {
      arg = Array.prototype.slice.call(arguments, 1);
      this.each(function() {
        //console.log(arg);
        methods[options].apply(this, arg);
      });
    }
    //If not arguments or only one which is an object({...})
    else if (typeof options === 'object') { //console.log('(typeof arguments[0] === object) OR (arguments[0] is undefined)');
      //return methods.init.apply(this, arguments);
      arg = arguments;
      this.each(function() {
        core.init.apply(this, arg);
      });
    } else {
      $.error('The argument given: ' + method + ' does not work in $.bapp');

    }

    return this;

  };

})(jQuery);