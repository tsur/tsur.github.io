function Ping(shell) {

  var contacts = {

    "email": "[link=mailto:zurisadai.pabon@gmail.com]zurisadai.pabon@gmail.com[/link]",
    "phone": "[link=callto:+34661188615]+34-661-188-615[/link]",
    "twitter": "[link=https://twitter.com/zuripabon]@zuripabon[/link]"
  };

  var output = 'Ping me to some of the contact methods below\n\n[table class="tab"]';

  for (method in contacts) {

    output += '[tr][td]' + method + '[/td][td]=>[/td][td][color=#4aa3c4]' + contacts[method] + '[/color][/td][/tr]';

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};
