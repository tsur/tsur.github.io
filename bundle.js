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

$('#wallpaper_img')
  .css('display', 'none')
  .attr('src', 'media/images/wallpaper/cloud.jpg')
  .bind("load", function() {

    $(this).unbind("load").fadeIn();

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


  });

$('#terminal-icon').click(function() {

  Runner.execute('terminal');

});


//Change css position in desktop top bar

//Reajust when resizing ...
var $originWinHeight = window.innerHeight;

$(window).unbind('resize');

$(window).bind('resize', function(e) {

  var increment = window.innerHeight - $originWinHeight;
  $originWinHeight = window.innerHeight;

  $('#wallpaper_img').css('height', parseInt(jQuery('#wallpaper_img').css('height')) + increment);

});