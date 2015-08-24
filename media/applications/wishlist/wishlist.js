function Wishlist(shell) {

  var wishes = {

    '1': 'A wife. I would like to make a family.',
    '2': 'Funcional Programming Books (Specially about Haskell) ',

  }

  var output = '\n\nIf you think you can make me happy, use the ping command to ping me with the wishlist item number you can make for real ;)\n\n\n[table class="tab"]';

  for (wish in wishes) {

    output += "[tr][td][color=#4aa3c4]" + wish + "[/color][/td][td][color=#777]=>[/color][/td][td]" + wishes[wish] + "[/td][/tr]";

  }

  shell.output(output + "[/table]\n", false);
  shell.end();

};