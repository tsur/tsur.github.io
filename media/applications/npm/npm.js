function Npm(shell) {

  var packages = {

    "is-reserved": "Check if some keyword is reserved in Javascript. It supports all ECMAScript versions",
    "node-sword": "Sword Engine(Crosswire) for NodeJS (C++ Addon)",
    "rae": "Simple Rae Dictionary Library",
    "vtt-to-srt": "Convert Web VTT(The Web Video Text Tracks Format, aka html5 video subtitles) into SubRip SRT",
    "whatsapp-secretary": "Tell your whatsapp secretary to just let you know about what's important for you."

  };

  var output = '\n\n[table class="tab"]';

  for (p in packages) {

    output += "[tr][td][color=#4aa3c4]" + p + "[/color][/td][td][color=#777]=>[/color][/td][td]" + packages[p] + "[/td][/tr]";

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};