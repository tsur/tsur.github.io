var Terminal = {};

Terminal.main = function(app) {

  var random = new Date().getTime() + Math.floor((Math.random() * 1000) + 1);

  var content = '<div id="loading' + random + '" class="loading" tabindex="1"><div class="loading_outer" style="padding-bottom:0;"><p class="loading_prompt"> > Type help for further info or issue the command exit to quit.</p></div><div id="loading_outer' + random + '" class="loading_outer"><img id="loading_cursor' + random + '" class="loading_cursor" src="media/images/underscore8.gif" /></div></div>';

  // Welcome to my personal portfolio. What you are in is a shell terminal simulator. I made it for all those who are, just as me, terminal lovers.
  // 
  app.init(content);

  app.onAppFocus = function() {

    //Shell.log('loading'+app.options.rand)
    $('#loading' + random).click();
    //return;
  };

  $('#loading' + random).css('background-color', 'transparent');
  $('.app[rel=' + app.options.app.attr('rel') + '] .app_container').css({
    'background-color': 'transparent',
    'opacity': '0.75'
  });

  new Shell(random).init();

  app.run(true);

  $('#loading' + random).click();

};


Terminal.options = {

  screenName: 'Terminal',
  autoExec: true,
  draggable: true,
  close: true,
  minimize: true,
  maximize: true,

  //For extra-plugins
  resize: 'all',
  width: '650px',
  height: '400px',
  minWidth: '300px',
  minHeight: '300px',
  maxWidth: undefined,
  maxHeight: undefined
};

function Shell(id) {
  //This is the declaration properties
  this.sid = id || '';
  this.commandNumber = 1;
  this.secure = false;
  this.inputMode = false;
  this.keepOutput = false;

  this.pwd = '/guest_' + this.sid + '/';
  this.pwd_alias = '~';


};


//Internal and natives apps
Shell.defaultCommands = ['me', 'ping', 'status', 'npm', 'experiments', 'projects', 'wishlist', 'desktop', 'clear', 'echo', 'exit', 'reboot', 'help'];

if (window.localStorage) {
  if (window.localStorage.console_history) {
    Shell.history = localStorage.console_history.split(',')
  } else {
    Shell.history = []
  }

  if (window.localStorage['cpath']) {

    Shell.cpath = JSON.parse(window.localStorage['cpath']);

  } else {
    Shell.cpath = {};
  }

}

/*Shell.history = (typeof(Storage) !== 'undefined') ? ((localStorage.console_history === undefined || localStorage.console_history == 'undefined') ? [] : localStorage.console_history.split(',')) : $.parseJSON($.cookie('ssos.Shell.history')) || [];*/

Shell.historyCursor = Shell.history.length;

Shell.prototype._prompt = function( /*optional*/ uname, /*optional*/ pwd) {

  var uname = uname || 'guest';

  return jQuery.date('format', '[HH:MM tt, ddd dd, mmm] $');

};

Shell.prototype.newCommand = function(txt, prompt) {

  var txt = txt || '',
    prompt = prompt || true,
    output = $('#loading_outer' + this.sid + ' p:last-child').is('.loading_output');
  //Shell.log(output);
  if (!output) {
    //Shell.log('output false');
    this.commandNumber--;
    $('<div style="display:block;">').insertAfter('#loading_command' + this.sid + this.commandNumber);
    this.commandNumber++;
  }

  //this.commandNumber++;

  var pmpt = $('<p id="loading_pmpt' + this.sid + '" class="loading_prompt">')
    .text(((prompt === true) ? this._prompt(null) : prompt)),
    command = $('<p class="loading_command">' + txt + '</p>')
    .attr('id', "loading_command" + this.sid + this.commandNumber);

  if (prompt !== true) {
    pmpt.css('font-weight', 'normal');
  }

  $('#loading_outer' + this.sid)
    .append(pmpt, command, $('#loading_cursor' + this.sid));

  $('#loading_cursor' + this.sid).css('left', '4px');

  $('#loading' + this.sid).scrollTo('#loading_command' + this.sid + this.commandNumber, 0, {
    axis: 'y'
  });

  return;

};

Shell.prototype.manageCommand = function(e) {

  //Get the command
  var command = $.trim($('#loading_command' + this.sid + this.commandNumber).text()),
    alias,
    comalias,
    args;

  this.commandNumber++;
  //Shell.log(this.commandNumber);
  //Check if there is an actual command...
  if (command == '') {
    this.newCommand();
    return;
  }

  //Keep tracking the command typed
  Shell.historyCursor = Shell.history.push(command);

  if (typeof(Storage) !== 'undefined') {
    localStorage.console_history = Shell.history;
  }

  if (!this.internal(command, e)) {
    this.cli(command);
  }

};

Shell.prototype.parser = function(command) {

  var arguments = command.match(/(\-{1,2}[a-z0-9\_\-]+(\ *[\=\ ]\ *((?=[^\-])((([a-z0-9\'\ñ\@\_\-\:\,\.\/])|(\\\ ))+|(\"[^\"]+\"))))?)|(((([a-z0-9\'\ñ\@\_\-\:\,\.\/])|(\\\ ))+|([\"][^\"]+[\"])))/gi),
    result = (arguments === null) ? [] : [arguments[0]],
    argObject = {},
    i,
    opt;

  argObject.args = [];
  argObject.opt = {};

  if (arguments === null) {
    return result;
  }

  for (i = 1; i < arguments.length; i++) {
    if (arguments[i] === "")
      continue;

    if (arguments[i].indexOf('-') === 0) {
      //opt=val
      //opt val
      //opt="val"
      //opt "val"
      opt =
        arguments[i]
      //.replace(/^(\-{1,2})([a-z][a-z\-]*)([\ \=])?(.*)?$/i,"$2\n$4")
      .replace(/^\-{1,2}([a-z0-9\_\-]+)((\ *[\=\ ]\ *)(.*))?$/i, "$1\n$4")
        .split('\n');

      if (arguments[1] !== undefined) {
        arguments[1] = arguments[1].replace(/\\\ /g, ' ');
      }

      if (opt[1] === undefined) {
        argObject.opt[opt[0]] = '';
      } else {
        if (opt[1].indexOf('"') === 0 || opt[1].indexOf("'") === 0)
          argObject.opt[opt[0]] = opt[1].substr(1, opt[1].length - 2);
        else
          argObject.opt[opt[0]] = opt[1];
      }

    }
    //else if(arguments[i].indexOf('"') === 0 || arguments[i].indexOf("'") === 0)
    else if (arguments[i].indexOf('"') === 0) {
      argObject.args.push(arguments[i].substr(1, arguments[i].length - 2));
    } else {
      arguments[i] = arguments[i].replace(/\\\ /g, ' ');
      //console.log(arguments[i]);
      argObject.args.push(arguments[i]);
    }
  }

  result.push(argObject);

  //console.log(result);

  return result;
}

Shell.prototype.internal = function(command, e) {
  command = this.parser(command);

  if (command[0] in this.action) {
    //response = this.action[c](a,this,e);

    this.output(this.action[command[0]](command[1], this, e));

    this.newCommand();

    return true;
    //return (response === false) ? false : response || true;
  }

  return false;
};

/**
 *
 * Carga la aplicacion cli que se va a ejecutar si no ha sido ya cargada y la ejecuta
 * @command Array el nombre del comando y sus argumentos/opciones
 */
Shell.prototype.cli = function(command) {

  var self = this,
    terminate = function(msg) {
      self.newCommand();
    },
    stdout = function(msg, c) {
      if (msg !== undefined) {
        self.output(msg, c);
      }
    },
    stdin = function(obj) {
      Shell.log(obj);

      if (obj.input) {
        self.output(obj.input);
      }

      self.inputMode = true;
      self.secure = (obj.secure) ? true : false;
      self.requestTo = obj.requestTo || 'input';

      self.newCommand(null, ' > ');
    },
    stderror = function(data) {

      if (typeof data['additional'] === 'undefined') {
        //Buscaria en el fichero propio de idiomas de mod_shell por
        //medio de data['code']
        self.output(command + ': ' + data['message']);
        return;
      }


      self.output('[color=#fc6767]Error Fatal: ' + data['message'] + '[/color]');

      self.keepOutput = false;

      self.commandNumber++;
      self.newCommand();
    };

  var _command = this.parser(command);

  self.execute(_command[0], {
    args: _command[1],
    end: terminate,
    input: stdin,
    output: stdout,
    error: stderror,
  });

};

Shell.runnings = {};

Shell.prototype.execute = function(application, data) {

  var head = document.head || document.getElementsByTagName('head')[0];

  var path = 'media/applications/' + application + '/' + application + '.js';

  var appMainFile = application.substring(0, 1).toUpperCase() + application.substring(1);

  try {

    if (Shell.runnings[application]) {

      return window[appMainFile](data);
    }

    var self = this;
    var script = document.createElement('script');
    script.setAttribute('type', 'text/javascript');
    script.setAttribute('src', path);

    script.onload = function() {

      Shell.runnings[application] = true;

      window[appMainFile](data);

    };

    script.onerror = function() {

      head.removeChild(script);

      self.output('[color=#fc6767]Fatal Error: Command "' + application + '" not found[/color]');

      self.newCommand();

    };

    head.appendChild(script);

  } catch (e) {
    //console.log(e);
  }

  return;
};

Shell.prototype.action = {


  reboot: function() {

    window.location.href = window.location.href;
    window.localStorage['apppath'] = {};
  },

  echo: function(a) {

    var result = "",
      i;

    if (a.args.length == 0) {
      return true;
    }

    for (i = 0; i < a.args.length - 1; i++) {
      result += a.args[i] + "\n";
    }

    return result + a.args[a.args.length - 1];

  },

  clear: function(a, self) {

    if (a.opt.history !== undefined) {
      Shell.history = [];
      Shell.historyCursor = 0;
      localStorage.console_history = undefined;

      return;
    }

    $('#loading_outer' + self.sid + ' p, #loading_outer' + self.sid + ' div, #loading_outer' + self.sid + ' script, #loading_outer' + self.sid + ' pre, table')
      .remove();

    self.commandNumber = 1;

    return;
  },

  // alias: function(a, self) {
  //   if ($.cookie('ssos.logged') === null || webtop.user.get('id') === null) return true;

  //   var result = terminal.execExternal('alias', a);

  //   if (result.comalias !== undefined) {
  //     self.auto_commands(result.comalias);
  //     webtop.user.set('comalias', result.comalias);
  //   }

  //   return result.output;

  // },

  exit: function(a, self, e) {
    //Shell.log(e);
    $(e)
      .parent()
      .parent()
      .find('.app_tool_buttons .app_tool_close')
      .click();

  },

};

Shell.prototype.autoComplete = function( /*c,a*/ ) {

  var text = $('#loading_command' + this.sid + this.commandNumber).text(),
    coincidences = [],
    parser = this.parser(text),
    c = parser[0];

  if (!c) {

    this.output(this.action.echo({
      args: Shell['defaultCommands']
    }), false);
    this.commandNumber++;
    return this.newCommand();
  }

  for (i = 0; i < Shell['defaultCommands'].length; i++) {
    if (Shell['defaultCommands'][i].indexOf(c) === 0) {
      coincidences.push(Shell['defaultCommands'][i]);
    }
  }

  if (coincidences.length === 1) {

    return $('#loading_command' + this.sid + this.commandNumber).text(coincidences[0] + ' ');

  }

  this.output(this.action.echo({
    args: coincidences
  }), false);

  var current = $('#loading_command' + this.sid + this.commandNumber).text();

  this.commandNumber++;
  this.newCommand();

  return $('#loading_command' + this.sid + this.commandNumber).text(current);


};

Shell.prototype.output = function(output, c) {

  var self = this;

  c = c === false ? '' : '>';

  /*if(typeof output === 'object')
            {  
                //keepWaiting = (output.keepWaiting && output.keepWaiting === true) ? true : false;
                if(output.keepWaiting && output.keepWaiting === true)
                {
                    
                }
                
                output = (output.output) ? output.output : undefined;
            }*/

  if (typeof output === 'string' && output != '') {
    //Split the output in lines
    output = output.split("\n");

    //Wrap each line for due formatting and print it
    $.each(output, function(i, val) {

      if (val.indexOf('table') != -1) {

        val = val.replace(/\[color\=(.+?)\](.+?)\[\/color\]/g, '<span style="color:$1;font-weight:bold;">$2</span>');
        val = val.replace(/\[/g, '<');
        val = val.replace(/\]/g, '>');

        $(val).appendTo('#loading_outer' + self.sid);

      } else {

        val = val.replace(/\[color\=(.+?)\](.+?)\[\/color\]/g, '<span style="color:$1;font-weight:bold;">$2</span>');

        if (val === '') {
          $('<p class="loading_output_empty"></p>').appendTo('#loading_outer' + self.sid);
        } else {

          $('<p class="loading_output"> ' + c + ' ' + val + '</p>').appendTo('#loading_outer' + self.sid);
        }

      }

    });
  }

  // //Get ready for the next command
  // if (this.lastCommand != 'exit' && !this.keepOutput) {
  //   //Shell.log('entra1');
  //   this.newCommand(c);
  // }
};

Shell.prototype.init = function() {

  //if(Shell.displayed == true)
  //    return;
  var self = this;

  $('#loading' + this.sid)
    .unbind('onkeypress', 'onkeydown', 'onkeyup');

  //Chrome version 12.0.742.124
  // if ($.browser.webkit) {

  $('#loading' + this.sid).keypress(function(e) {

    var charCode = e.charCode,
      ConsoleCommand = $('#loading_command' + self.sid + self.commandNumber);

    if (charCode == 32) {
      var text = ConsoleCommand.text();
      if (text[text.length - 1] == ' ') return true;
    }

    if (e.ctrlKey /*|| e.which == 13 || e.which == 8 || e.which == 9*/ ) return true;

    var left = parseInt($('#loading_cursor' + self.sid).css('left')),
      character = String.fromCharCode(charCode);

    if (self.secure) {
      //character = String.fromCharCode(183);
      ConsoleCommand.css('display', 'none');
    }

    if (left >= 4) {
      ConsoleCommand.text(ConsoleCommand.text() + character);
      return;
    }

    var position = (left + ((ConsoleCommand.text().length * 7) - 4)) / 7;

    if (position == 0) {
      ConsoleCommand.text(character + ConsoleCommand.text());
      return;
    }

    var subA = ConsoleCommand.text().substr(0, position),
      subB = ConsoleCommand.text().substr(position, ConsoleCommand.text().length - 1);

    ConsoleCommand.text(subA + character + subB);

    return false;
  });

  $('#loading' + this.sid).keydown(function(e) {
    var ConsoleCommand = $('#loading_command' + self.sid + self.commandNumber),
      e = e || window.event;

    if (e.keyCode == 8) //backspace(delete)
    {
      /*if(self.last_complete == true)
                    {
                        self.last_complete = false;
                    }*/
      e.preventDefault();
      e.stopPropagation();

      var left = parseInt($('#loading_cursor' + self.sid).css('left')),
        position = (left + ((ConsoleCommand.text().length * 7) - 4)) / 7;

      if (position == 0) return false;

      var subA = ConsoleCommand.text().substr(0, position - 1),
        subB = ConsoleCommand.text().substr(position, ConsoleCommand.text().length - 1);

      ConsoleCommand.text(subA + subB);
      return false;
    } else if (e.keyCode == 13) //Enter
    {
      if (self.inputMode) {
        self.smanageCommand();
      } else if (!self.keepOutput) {
        self.manageCommand(e.target);
      }

      e.preventDefault();
      e.stopPropagation();
      return false;
    } else if (e.keyCode == 38 && Shell.historyCursor > 0) //UP key
    {
      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      ConsoleCommand.text(Shell.history[Shell.historyCursor - 1]);
      Shell.historyCursor--;

      return false;
    } else if (e.keyCode == 40 && Shell.historyCursor < Shell.history.length) //DOWN key
    {
      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      Shell.historyCursor++;

      if (Shell.historyCursor == Shell.history.length) {
        ConsoleCommand.text('');
        return false;
      }

      ConsoleCommand.text(Shell.history[Shell.historyCursor]);
      return false;
    } else if (e.keyCode == 39) //RIGHT key 
    {
      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      var left = parseInt($('#loading_cursor' + self.sid).css('left'));

      if (left >= 4) {
        return;
      }

      $('#loading_cursor' + self.sid).css('left', (left + 7) + 'px');

      return false;
    } else if (e.keyCode == 37) //LEFT key 
    {

      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      var left = parseInt($('#loading_cursor' + self.sid).css('left'));

      if (left <= -((ConsoleCommand.text().length * 7) - 4)) return false;

      $('#loading_cursor' + self.sid).css('left', (left - 7) + 'px');

      return false;
    } else if (e.keyCode == 46) //DEL key
    {
      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      var left = parseInt($('#loading_cursor' + self.sid).css('left'));

      if (left >= 4) return false;

      var position = (left + ((ConsoleCommand.text().length * 7) - 4)) / 7,
        subA = ConsoleCommand.text().substr(0, position),
        subB = ConsoleCommand.text().substr(position + 1, ConsoleCommand.text().length - 1);

      ConsoleCommand.text(subA + subB);

      $('#loading_cursor' + self.sid).css('left', (left + 7) + 'px');
      return false;
    } else if (e.keyCode == 36) //HOME key
    {
      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      $('#loading_cursor' + self.sid).css('left', '-' + ((ConsoleCommand.text().length * 7) - 4) + 'px');

      return false;
    } else if (e.keyCode == 35) //END key
    {
      e.preventDefault();
      e.stopPropagation();

      if (self.secure) return false;

      $('#loading_cursor' + self.sid).css('left', '4px');

      return false;
    } else if (e.keyCode == 33) //PGUP key
    {
      e.preventDefault();
      e.stopPropagation();

      $('#loading' + self.sid).scrollTo('#loading_command0' + self.sid, 0, {
        axis: 'y'
      });
      return false;
    } else if (e.keyCode == 34) //PGDN key
    {
      e.preventDefault();
      e.stopPropagation();

      $('#loading' + self.sid).scrollTo('#loading_command' + self.sid + self.commandNumber, 0, {
        axis: 'y'
      });

      return false;
    } else if (e.keyCode == 9) //Tab key
    {

      self.autoComplete();

      e.preventDefault();
      e.stopPropagation();
      return false;
    }


    if (e.ctrlKey && e.keyCode == 86) {

      //$("#loading_pasteArea").val("");
      $("#loading_pasteArea" + self.sid).css("display", "block");
      $("#loading_pasteArea" + self.sid).focus();

      setTimeout(function() {

        $("#loading_pasteArea" + self.sid).blur();

        var left = parseInt($('#loading_cursor' + self.sid).css('left')),
          displayed = $('#loading_command' + self.sid + self.commandNumber).text(),
          position = (left + ((displayed.length * 7) - 4)) / 7,
          subA = displayed.substr(0, position),
          subB = displayed.substr(position, displayed.length);

        $('#loading_command' + self.sid + self.commandNumber).text(subA + $("#loading_pasteArea" + self.sid).val() + subB);
        $('#loading' + self.sid).focus();
        $("#loading_pasteArea" + self.sid).val("");
        $("#loading_pasteArea" + self.sid).css("display", "none");

      }, 50);

      return;
    }

    if (e.ctrlKey && self.inputMode && e.keyCode == 67) {
      self.secure = false;
      self.inputMode = false;
      self.newCommand();
      return false;
    }

    if (e.ctrlKey && e.keyCode == 67) {
      if (self.inputMode) {
        self.secure = false;
        self.inputMode = false;
        self.requestTo = 'default';
        self.saveData = {};
        self.commandNumber++;
      }

      if (self.pid != null) {
        kernel.signal(self.pid, 0);
        self.pid = null;
        self.keepOutput = false;
        self.newCommand();
      }
    }

    return;
  });

  $('<textarea id="loading_pasteArea' + this.sid + '" style="display: none; position: fixed; left: -1000px;bottom:0"></textarea>').insertAfter('#loading_outer' + this.sid);

  //$(document).click();
  $('#loading' + this.sid).focus();

  $('#loading' + this.sid).click(function() {
    $('#loading' + self.sid).focus();
    //Shell.log('sid is '+self.sid);
  });

  this.newCommand();
  this.ctrlDown = false;
  return;
  // } else {

  //   $('#loading' + this.sid).keypress(function(e) {

  //     var charCode = e.charCode,
  //       ConsoleCommand = $('#loading_command' + self.sid + self.commandNumber);

  //     //Shell.log(self.commandNumber);

  //     if (charCode == 32) {
  //       var text = ConsoleCommand.text();
  //       if (text[text.length - 1] == ' ') return true;
  //     }

  //     if (e.ctrlKey) return true;

  //     if (charCode == 0) {

  //       if (e.keyCode == 8) //backspace(delete)
  //       {

  //         /*if(self.last_complete == true)
  //                       {
  //                           self.last_complete = false;
  //                       }*/

  //         var left = parseInt($('#loading_cursor' + self.sid).css('left')),
  //           position = (left + ((ConsoleCommand.text().length * 7) - 4)) / 7;

  //         if (position == 0) return;

  //         var subA = ConsoleCommand.text().substr(0, position - 1),
  //           subB = ConsoleCommand.text().substr(position, ConsoleCommand.text().length - 1);

  //         ConsoleCommand.text(subA + subB);

  //         e.preventDefault();
  //         e.stopPropagation();
  //         return false;
  //       } else if (e.keyCode == 13) //Enter
  //       {
  //         if (self.inputMode) {
  //           self.smanageCommand();
  //         } else if (!self.keepOutput) {
  //           self.manageCommand(e.target);
  //         }

  //         e.preventDefault();
  //         e.stopPropagation();
  //         return false;

  //       } else if (e.keyCode == 38 && Shell.historyCursor > 0) //UP key
  //       {
  //         if (self.secure) return false;

  //         ConsoleCommand.text(Shell.history[Shell.historyCursor - 1]);
  //         Shell.historyCursor--;
  //       } else if (e.keyCode == 40 && Shell.historyCursor < Shell.history.length) //DOWN key
  //       {
  //         if (self.secure) return false;

  //         Shell.historyCursor++;

  //         if (Shell.historyCursor == Shell.history.length) {
  //           ConsoleCommand.text('');
  //           return;
  //         }

  //         ConsoleCommand.text(Shell.history[Shell.historyCursor]);

  //       } else if (e.keyCode == 39) //RIGHT key 
  //       {
  //         if (self.secure) return false;

  //         var left = parseInt($('#loading_cursor' + self.sid).css('left'));

  //         if (left >= 4) return;

  //         $('#loading_cursor' + self.sid).css('left', (left + 7) + 'px');

  //       } else if (e.keyCode == 37) //LEFT key 
  //       {

  //         if (self.secure) return false;

  //         var left = parseInt($('#loading_cursor' + self.sid).css('left'));

  //         if (left <= -((ConsoleCommand.text().length * 7) - 4)) return;

  //         $('#loading_cursor' + self.sid).css('left', (left - 7) + 'px');

  //       } else if (e.keyCode == 46) //DEL key
  //       {
  //         if (self.secure) return false;

  //         var left = parseInt($('#loading_cursor' + self.sid).css('left'));

  //         if (left >= 4) return;

  //         var position = (left + ((ConsoleCommand.text().length * 7) - 4)) / 7,
  //           subA = ConsoleCommand.text().substr(0, position),
  //           subB = ConsoleCommand.text().substr(position + 1, ConsoleCommand.text().length - 1);

  //         ConsoleCommand.text(subA + subB);

  //         $('#loading_cursor' + self.sid).css('left', (left + 7) + 'px');

  //       } else if (e.keyCode == 36) //HOME key
  //       {
  //         if (self.secure) return false;

  //         $('#loading_cursor' + self.sid).css('left', '-' + ((ConsoleCommand.text().length * 7) - 4) + 'px');
  //       } else if (e.keyCode == 35) //END key
  //       {
  //         if (self.secure) return false;

  //         $('#loading_cursor' + self.sid).css('left', '4px');
  //       } else if (e.keyCode == 33) //PGUP key
  //       {
  //         $('#loading' + self.sid).scrollTo('#loading_command0' + self.sid, 0, {
  //           axis: 'y'
  //         });
  //       } else if (e.keyCode == 34) //PGDN key
  //       {
  //         $('#loading' + self.sid).scrollTo('#loading_command' + self.sid + self.commandNumber, 0, {
  //           axis: 'y'
  //         });
  //       } else if (e.keyCode == 9) //Tab key
  //       {
  //         if (self.secure) {
  //           return false;
  //         }

  //         //var command = $.trim($('#loading_command'+self.sid + self.commandNumber).text()),
  //         //    c = self.chopCommand(command)
  //         //    ;

  //         //self.autoComplete(c[0] || "",c[1] || "");
  //         self.autoComplete();

  //         e.preventDefault();
  //         e.stopPropagation();
  //         return false;
  //       }
  //     } else //Normally writing
  //     {

  //       //Shell.log(e.toSource());
  //       var left = parseInt($('#loading_cursor' + self.sid).css('left')),
  //         character = String.fromCharCode(charCode);

  //       if (self.secure) {
  //         //character = String.fromCharCode(183);
  //         ConsoleCommand.css('display', 'none');
  //       }

  //       if (left >= 4) {
  //         ConsoleCommand.text(ConsoleCommand.text() + character);
  //         return;
  //       }

  //       var position = (left + ((ConsoleCommand.text().length * 7) - 4)) / 7;

  //       if (position == 0) {
  //         ConsoleCommand.text(character + ConsoleCommand.text());
  //         return;
  //       }

  //       var subA = ConsoleCommand.text().substr(0, position),
  //         subB = ConsoleCommand.text().substr(position, ConsoleCommand.text().length - 1);

  //       ConsoleCommand.text(subA + character + subB);

  //     }

  //     return false;
  //   });

  //   $('#loading' + this.sid).keydown(function(e) {

  //     if (e.ctrlKey && e.keyCode == 86) {
  //       //Shell.time('copy');
  //       //$("#loading_pasteArea").val("");
  //       $("#loading_pasteArea" + self.sid).css("display", "block");
  //       $("#loading_pasteArea" + self.sid).focus();
  //       //Shell.timeEnd('copy');
  //       //Copy will be made here by the browser to the text area
  //       setTimeout(function() {

  //         $("#loading_pasteArea" + self.sid).blur();

  //         var left = parseInt($('#loading_cursor' + self.sid).css('left')),
  //           displayed = $('#loading_command' + self.sid + self.commandNumber).text(),
  //           position = (left + ((displayed.length * 7) - 4)) / 7,
  //           subA = displayed.substr(0, position),
  //           subB = displayed.substr(position, displayed.length);

  //         $('#loading_command' + self.sid + self.commandNumber).text(subA + $("#loading_pasteArea" + self.sid).val() + subB);

  //         $('#loading' + self.sid).focus();
  //         $("#loading_pasteArea" + self.sid).val("");
  //         $("#loading_pasteArea" + self.sid).css("display", "none");

  //       }, 100);

  //       return;
  //     }

  //     if (e.ctrlKey && e.keyCode == 67) {

  //       if (self.inputMode) {
  //         self.secure = false;
  //         self.inputMode = false;
  //         self.requestTo = 'default';
  //         self.saveData = {};
  //         self.commandNumber++;
  //       }

  //       if (self.pid != null) {
  //         kernel.signal(self.pid, 0);
  //         self.pid = null;
  //         self.keepOutput = false;
  //         self.newCommand();
  //       }
  //       //return false;
  //     }
  //   });

  //   $('<textarea id="loading_pasteArea' + this.sid + '" style="display: none; position: fixed; left: -1000px;bottom:0;"></textarea>').insertAfter('#loading_outer' + this.sid);

  //   //get focus
  //   //$(document).click();
  //   $('#loading' + this.sid).focus();

  //   $('#loading' + this.sid).click(function() {
  //     $('#loading' + self.sid).focus();
  //     //Shell.log('sid is '+self.sid);
  //   });

  //   this.newCommand();
  //   this.ctrlDown = false;

  // } //end else
}; //end init function