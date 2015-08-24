function Help(shell) {

  var commands = {

    'me': 'Take a look at a summarized version of my resume',
    'ping': 'Send me a ping if wanna get in touch with me',
    'status': 'Check what is my professional current status',
    'npm': 'Discover the npm packages published on my personal account',
    'projects': 'Discover the projects I am currently working on during my leisure time',
    'experiments': 'Check it out some of my experiments',
    'wishlist': 'Check my list of whishes and if possible, make it come to true ;)',
    'desktop': 'Enable and disable media desktop interactions',
    'clear': 'Clean up all the terminal messages',
    'reboot': 'Reboot the system',
    'help': 'Display this help menu and exit',
    'exit': 'Quit the current terminal session'

  }

  var output = '\n\nThis is my personal portfolio shell terminal simulator.\nI made it for all those who, just as me, are terminal lovers.\n\nPlease, find below the list of available commands:\n\n\n[table class="tab"]';

  for (command in commands) {

    output += "[tr][td][color=#4aa3c4]" + command + "[/color][/td][td][color=#777]=>[/color][/td][td]" + commands[command] + "[/td][/tr]";

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};