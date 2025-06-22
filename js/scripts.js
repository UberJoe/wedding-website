$(document).ready(function () {

    /***************** Initiate Flexslider ******************/
    $('.flexslider').flexslider({
        animation: "slide"
    });
    
    /***************** Smooth Scrolling ******************/

    $(function () {

        $('a[href*=#]:not([href=#])').click(function () {
            if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {

                var target = $(this.hash);
                target = target.length ? target : $('[name=' + this.hash.slice(1) + ']');
                if (target.length) {
                    $('html,body').animate({
                        scrollTop: target.offset().top - 90
                    }, 2000);
                    return false;
                }
            }
        });

    });

    /********************** Embed youtube video *********************/
    $('.player').YTPlayer();
});

document.getElementById('rsvpForm').addEventListener('submit', async function (e) {
    e.preventDefault(); // Stop the form from submitting the default way

    const form = e.target;
    const formData = new FormData(form);
    const data = Object.fromEntries(formData.entries());

    const responseMessage = document.getElementById('responseMessage');

    try {
      const res = await fetch(form.action, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams(data)
      });

      const result = await res.json();

      if (result.success) {
        responseMessage.textContent = result.message;
        responseMessage.className = 'mt-4 text-green-600 text-sm font-medium';
        form.reset(); // Optional: clear the form
      } else {
        responseMessage.textContent = result.error || 'Something went wrong.';
        responseMessage.className = 'mt-4 text-red-600 text-sm font-medium';
      }
    } catch (err) {
      responseMessage.textContent = 'A network error occurred.';
      responseMessage.className = 'mt-4 text-red-600 text-sm font-medium';
    }
  });
