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
  e.preventDefault();
  const responseMessage = document.getElementById('responseMessage');
  responseMessage.textContent = "Submitting...";
  responseMessage.style = "color:green;";

  const form = e.target;
  const formData = new FormData(form);
  const data = Object.fromEntries(formData.entries());
  const errors = [];

  if (!data.firstname?.trim()) errors.push('First name is required.');
  if (!data.surname?.trim()) errors.push('Surname is required.');
  if (!['yes', 'no'].includes(data.attending)) errors.push('Attendance must be yes or no.');
  if (!['yes', 'no'].includes(data.drinks)) errors.push('Drinks choice must be yes or no.');
  if (!data.dish) errors.push('Please select a dish.');

  const email = data.email?.trim();
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!email || !emailRegex.test(email)) {
    errors.push('Please enter a valid email address.');
  }

  if (!['webster', 'james'].includes(data.security?.trim().toLowerCase())) {
    errors.push('Security answer is incorrect.');
  }

  if (errors.length > 0) {
    responseMessage.textContent = errors.join(' ');
    responseMessage.style = "color: red;"
    return;
  }

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
        responseMessage.style = "color: green;"
        form.reset(); // Optional: clear the form
      } else {
        responseMessage.textContent = result.error || 'Something went wrong.';
        responseMessage.style = "color: red;"
      }
    } catch (err) {
      responseMessage.textContent = 'A network error occurred.';
      responseMessage.style = "color: red;"
    }
  });
