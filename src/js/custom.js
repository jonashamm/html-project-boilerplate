function navToggler() {
	if (window.matchMedia("(max-width: 959px)").matches) {
		$('.nav-main-toggler').click(function() {
			$('.nav-main').slideToggle();
		})
		$('.toggle-subnav').click(function() {
			$(this).closest('li').toggleClass('active').find('.nav-sub').slideToggle();
		})
		$('footer, main, .header-click-area').click(function () {
			$('header, .nav-toggler').removeClass('nav-main-visible');
			$('.nav-main').slideUp();
		});
	}
}
$(document).ready(function() {
	navToggler();

	var resizeTimer;
	$(window).on('resize', function(e) {
		clearTimeout(resizeTimer);
		$('.nav-main-toggler, .toggle-subnav').unbind();
		resizeTimer = setTimeout(function() {
			console.log('resized');
			navToggler();
		}, 150);
	});
});
