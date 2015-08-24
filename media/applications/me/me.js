function Me(shell) {

  // var help = shell.args.args[0] === 'help' || shell.args.opt.help === true;

  // if (help) {

  //   shell.output('Usage: me\nOptions:\n[table class="tab"][tr][td]summary, --summary[/td][/tr][tr][td]experience, --experience[/td][/tr][tr][td]education, --education[/td][/tr][/table]', false);
  //   return shell.end();

  // }

  var summary = "My passion is for math, and programming becomes the way to make it for real. I do often work on web based applications as a front-end developer, but sometimes also on server based applications as a back-end developer. My academic background has been in Computer Science, and my employment experience  in that same field too. The open source movement, the Unix philosophy and the functional programming paradigm define my principles as a software developer."

  var experience = {

    "March 2015 - Present": "Javascript UI Developer at ITRS Group",
    "May 2012 - Present": "FREElance Software Developer",
    "Sep 2014 - May 2015": "Node.js Developer at GSR Markets",
    "Nov 2013 - Sep 2014": "Python Software Developer at Ebury Partners",
    "Jan 2011 - Jun 2011": "PHP Web Developer at Genera Internet Technologies"

  };

  var education = {

    "2011-2013": "Bachelor's Degree in IT (Information Technology) - Mikkeli University of Applied Sciences (Finland)",
    "2007-2013": "Technical Enginner in Computer Sciences - Universidad de Málaga (Spain)"
  };

  var output = '\n\n[color=#4aa3c4]> Summary[/color]\n\n\t' + summary + '\n\n[color=#4aa3c4]> Experience[/color]\n\n[table class="tab"]';

  for (job in experience) {

    output += '[tr][td]' + job + '[/td][td]=>[/td][td]' + experience[job] + '[/td][/tr]';

  }

  output += '[/table]\n\n[color=#4aa3c4]> Education[/color]\n\n[table class="tab"]';

  for (course in education) {

    output += '[tr][td]' + course + '[/td][td]=>[/td][td]' + education[course] + '[/td][/tr]';

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};