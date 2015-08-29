// var loading = document.querySelector('#loading');
// var frame = document.querySelector('#browser_frame');
// var overlay = document.querySelector('#img_blocking');
// var wallpaper = document.querySelector('#wallpaper_img');
// var menu = document.querySelector('#hex-menu');

// setTimeout(function() {

//   loading.classList.add('fadeOutDown');
//   loading.remove();

//   frame.classList.add('fadeInUpBig');
//   overlay.classList.add('fadeInUpBig');

//   wallpaper.classList.add('pulse');
//   menu.classList.add('fadeIn');


// }, 1000);
// 
// 
function printMessageProgressively(el, msg, fn) {

  var chars = msg.split('');

  var print = function() {

    if (chars.length) {

      var letter = chars.shift();

      var span = $('<span>').text(letter);

      el.append(span);

      setTimeout(print, letter === '.' ? 350 : ~~(Math.random() * 80 + 50));

    } else {

      fn();
    }

  }

  print();

}

function initPortfolioPreview(fn) {

  if (window.localStorage.status == "loaded") {

    return fn();
  }

  var messages = [

    "> Hello World!",
    "> My name is Zuri, and this is my personal portfolio system",
    // "> Please, let me introduce myself while the system stops loading",
    // "> I'm not though a higly experienced programmer, but enjoy too much the way while achieving it",
    "> I was born in Málaga, Spain, about 25 years ago (yepp I'm getting older), and ...",
    "> to be honest, my life is not so interesting. I do often spend most of my time at work or home, but I do actually like it",
    // "> but I do actually like it, I like the stillness and yeahh, also the silence. Well, I do actually love thinking and silence is always a good partner for it",
    // "> I try to grab and learn all those software pattern and methodologies which are straightforward and simple enough to apply to day-in day out programming challenges",
    "> I do love maths in the widest sense, and programming becomes the way to know more about it",
    "> the Unix philosophy and the functional programming paradigm are both, when possible, the shape of my programming habits",
    "> My long term goal is to learn from every area of computer science, including information retrieval, artificial intelligence",
    "> machine learning, natural language processing, distributed computing, networking, security, data compression and user interface design",
    "> see ya soon ..."

  ]

  var printMsg = function() {

    if (messages.length) {

      var msg = messages.shift();
      var space = $('<div class="divider">');
      var content = $('<p class="loading_command loading_intro">');

      $('.loading_command').last().after(space);
      $('.divider').last().after(content);

      printMessageProgressively(content, msg, function() {

        setTimeout(printMsg, 300);

      });

    } else {

      // var space = $('<div class="divider">');
      // var content = $('<p class="loading_command"> Please, press any key to access my personal portfolio</p>');

      // $('.loading_command').last().after(space);
      // $('.divider').last().after(content);

      // $(document).bind('keydown', function() {

      //   $(document).unbind('keydown');

      //   window.localStorage.status = "loaded";

      //   fn();

      // });

      window.localStorage.status = "loaded";

      fn();
    }
  }

  printMsg();

}

function initPortfolioDesktop() {

  $('body').css('backgroundColor', '#000');

  $('#wallpaper_img').unbind("load").fadeIn();

  $('#loading').fadeOut(function() {

    $(this).remove();

    $("#browser_frame").animate({
      opacity: '1'
    });

    $('#img_blocking').fadeIn('fast', function() {

      $('body').css('backgroundColor', '#000');

      $('#wallpaper_img').animate({
        width: '110%',
        left: -50
      }, 'slow', function() {

        //$('#top-bar').slideDown('500');
        $(this).animate({
          'width': '100%', //window.innerWidth - 50
          left: 0
        }, 'slow', function() {

          // $('#hex-menu').fadeIn('slow', function() {



          // });

          Runner.execute('terminal');


        });
      });
    });


  });
}

$('#wallpaper_img')
  .css('display', 'none')
  .attr('src', 'media/images/wallpaper/cloud.jpg')
  .bind("load", function() {

    initPortfolioPreview(initPortfolioDesktop);


  });

$('#terminal-icon').click(function() {

  Runner.execute('terminal');

});

//$('#blog-icon').click(function() {
//
//  Runner.execute('blog');
//
//});
//
//$('#github-icon').click(function() {
//
//  Runner.execute('github');
//
//});

//Change css position in desktop top bar

//Reajust when resizing ...
var $originWinHeight = window.innerHeight;

$(window).unbind('resize');

$(window).bind('resize', function(e) {

  var increment = window.innerHeight - $originWinHeight;
  $originWinHeight = window.innerHeight;

  $('#wallpaper_img').css('height', parseInt(jQuery('#wallpaper_img').css('height')) + increment);

});