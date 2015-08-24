function Ping(shell) {

  var contacts = {

    "email": "zurisadai.pabon@gmail.com",
    "phone": "+34-661-188-615"
  };

  var output = 'Ping me to some of the contact methods below\n\n[table class="tab"]';

  for (method in contacts) {

    output += '[tr][td]' + method + '[/td][td]=>[/td][td][color=#4aa3c4]' + contacts[method] + '[/color][/td][/tr]';

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};
