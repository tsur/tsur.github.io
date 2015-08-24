function Projects(shell) {

  var projects = {

    "yoursho.es": "I started working on it after me and my family needed an application to manages a little shoes store we own. It is just a basic point of sale (POS) web and desktop based application. You may grab it for free from the github repository.",
    "matrix.exposed": "A collaborative website to help people around the world to discover all those facts that goverments, chemical industries, space agencies, big companies and other public institutions/agents all over the world deliberately concealing information from the rest of us",
    "scripturesos.com": "Have you ever wonder if you could write your own religious scriptures? make it for real and share with the rest of the world!",
    //"liberando.me": "We do always try to offer our help to people far way from us, but what about those people who are just as close to us as the next corner. Joinning both needed people and people who offers its aid, let's make of this world a better place."

  };

  var output = '\n\nAll of the projects below are non-profit. I have been working alone. All hands willing to help are most welcome!\n\n[table class="tab"]';

  for (p in projects) {

    output += "[tr][td][color=#4aa3c4]" + p + "[/color][/td][td][color=#777]=>[/color][/td][td]" + projects[p] + "[/td][/tr]";

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};
