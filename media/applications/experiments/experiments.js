function Experiments(shell) {

  var run = shell.args.args[1] || shell.args.opt.run;

  if (run) {

    Runner.execute(run);
    return shell.end();

  }

  var projects = {

    "blockade": "An experiment for the classical blockade/snake game",
    "webvtt": "A Webvtt experiment for setting subtitles to your videos on the fly",
    "gamelife": "A Conway's Game of Life Experiment"

  };

  var output = '\n\nCheck below some of my experiments. You may try a live demo by issuing:\n\nexperiments --run (experiment-name)\n\n> experiments run gamelife\n\n[table class="tab"]';

  for (p in projects) {

    output += "[tr][td][color=#4aa3c4]" + p + "[/color][/td][td][color=#777]=>[/color][/td][td]" + projects[p] + "[/td][/tr]";

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};