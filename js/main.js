$(document).ready(function(){

     $('.fa-bars').click(function(){
        $(this).toggleClass('fa-times');
        $('.navbar').toggleClass('nav-toggle');
    });

    $(window).on('load scroll',function(){
        $('.fa-bars').removeClass('fa-times');
        $('.navbar').removeClass('nav-toggle');

        if($(window).scrollTop()>35){
            $('.header').addClass('scrolled');
        } else {
            $('.header').removeClass('scrolled');
        }
    });

    const counters = document.querySelectorAll('.counter');
    const speed = 120;
    counters.forEach(counter => {
	const updateCount = () => {
		const target = +counter.getAttribute('data-target');
		const count = +counter.innerText;
		const inc = target / speed;
		if (count < target) {
			counter.innerText = count + inc;
			setTimeout(updateCount, 1);
		} else {
			counter.innerText = target;
		}
	};
	  updateCount();
   });

   // OwlCarousel removed; Bootstrap carousel handles testimonials

$(window).scroll(function () {
    if ($(this).scrollTop() > 100) {
        $('.back-to-top').fadeIn('slow');
    } else {
        $('.back-to-top').fadeOut('slow');
    }
});
$('.back-to-top').click(function () {
    $('html, body').animate({scrollTop: 0}, 1500, 'easeInOutExpo');
    return false;
});

$('.accordion-header').click(function(){
    $('.accordion .accordion-body').slideUp(500);
    $(this).next('.accordion-body').slideDown(500);
    $('.accordion .accordion-header span').text('+');
    $(this).children('span').text('-');
});

// AI Chat Assistant interactions
$(function(){
  const $panel = $('.ai-panel');
  const $toggle = $('.ai-toggle');
  const $close = $('.ai-close');
  const $form = $('#aiForm');
  const $input = $('#aiInput');
  const $messages = $('#aiMessages');

  function setPanel(open){
    if(open){
      $panel.addClass('open').attr('aria-hidden', 'false');
      setTimeout(()=>{ $input.trigger('focus'); }, 100);
    } else {
      $panel.removeClass('open').attr('aria-hidden', 'true');
    }
  }

  function appendMsg(text, who){
    const cls = who === 'user' ? 'ai-msg ai-msg--user' : 'ai-msg ai-msg--bot';
    $('<div>').addClass(cls).text(text).appendTo($messages);
    $messages.scrollTop($messages.prop('scrollHeight'));
  }

  function replyFor(q){
    const s = (q||'').toLowerCase();
    if(s.includes('service') || s.includes('offer')){
      return 'We deliver ML, NLP, Computer Vision, MLOps, and GenAI assistants. See the AI section or share your use-case via Contact.';
    }
    if(s.includes('price') || s.includes('cost') || s.includes('rate')){
      return 'Pricing depends on scope. Discovery is quick; we offer fixed-price projects and retainers. Send details in the Contact section.';
    }
    if(s.includes('time') || s.includes('timeline') || s.includes('how long')){
      return 'Typical timelines: POC 1–2 weeks; full solutions 4–12 weeks depending on data and integrations.';
    }
    if(s.includes('contact') || s.includes('email') || s.includes('start')){
      return 'Great! Use the Contact form below or email neurofinancelab@gmail.com. We usually respond within 24 hours.';
    }
    return 'I can help with services, timelines, pricing, and getting started. Ask anything or leave your email in Contact.';
  }

  $toggle.on('click', function(){ setPanel(!$panel.hasClass('open')); });
  $close.on('click', function(){ setPanel(false); });

  $form.on('submit', function(e){
    e.preventDefault();
    const q = ($input.val()||'').trim();
    if(!q) return;
    appendMsg(q, 'user');
    $input.val('');
    setTimeout(()=>{ appendMsg(replyFor(q), 'bot'); }, 400);
  });
});