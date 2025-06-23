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

  // Always required
  if (!data.firstname?.trim()) errors.push('First name is required.');
  if (!data.surname?.trim()) errors.push('Surname is required.');
  if (!['yes', 'no'].includes(data.attending)) errors.push('Attendance must be yes or no.');

  const isAttending = data.attending === 'yes';

  if (isAttending) {
    if (!['yes', 'no'].includes(data.drinks)) {
      errors.push('Drinks choice must be yes or no.');
    }

    if (!data.dish?.trim()) {
      errors.push('Please select a dish.');
    }

    const email = data.email?.trim();
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!email || !emailRegex.test(email)) {
      errors.push('Please enter a valid email address.');
    }

    if (!['webster', 'james'].includes(data.security?.trim().toLowerCase())) {
      errors.push('Security answer is incorrect.');
    }
  }

  // If not attending, still validate security if the field is visible
  if (!isAttending && data.security?.trim()) {
    if (!['webster', 'james'].includes(data.security?.trim().toLowerCase())) {
      errors.push('Security answer is incorrect.');
    }
  }

  if (errors.length > 0) {
    responseMessage.textContent = errors.join(' ');
    responseMessage.style = "color: red;";
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
      responseMessage.style = "color: green;";
      form.reset();
    } else {
      responseMessage.textContent = result.error || 'Something went wrong.';
      responseMessage.style = "color: red;";
    }
  } catch (err) {
    responseMessage.textContent = 'A network error occurred.';
    responseMessage.style = "color: red;";
  }
});


document.addEventListener('DOMContentLoaded', function () {
  const attendingRadios = document.querySelectorAll('input[name="attending"]');
  const attendingFieldsContainer = document.getElementById('attendingFields');

  const conditionalFields = [
      'dietary',
      'dish',
      'drinks',
      'email',
      'security'
  ].map(name => document.querySelector(`[name="${name}"]`));

  const drinksRadios = document.querySelectorAll('input[name="drinks"]');

  function toggleRequiredAndVisibility() {
      const attendingValue = document.querySelector('input[name="attending"]:checked')?.value;
      const shouldRequire = attendingValue === 'yes';

      conditionalFields.forEach(field => {
          if (field) {
              field.required = shouldRequire;
          }
      });

      drinksRadios.forEach(radio => {
          radio.required = shouldRequire;
      });

      // Show/hide the attending fields
      attendingFieldsContainer.style.display = shouldRequire ? 'block' : 'none';
  }

  attendingRadios.forEach(radio => {
      radio.addEventListener('change', toggleRequiredAndVisibility);
  });

  // Initialize on page load
  toggleRequiredAndVisibility();
});
