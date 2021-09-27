document.addEventListener("DOMContentLoaded", init);

function init() {
	menuMob();
	moreFooterLinks();
	moreFilterCheckbox();
	searchBlock();
	changeFiledInput();
	goodsCountSelect();
	scrollBarSartEnd();

	goodsCountChange('.js-goods-count');

	if(window.matchMedia("(max-width: 1200px)").matches) {
		fixedHeader();
	}

	if(window.matchMedia("(max-width: 768px)").matches) {}

	if(window.matchMedia("(max-width: 992px)").matches) {
		hideShowFiltersMob();
	}

	if(window.matchMedia("(min-width: 993px)").matches) {
		hideShowFilters();
	}

	if (window.matchMedia("(max-width: 576px)").matches) {
		footerNavMobAccordion();

		document.querySelectorAll('.navfblock_list_itm.is-display-none').forEach(itm => itm.classList.remove('is-display-none'));
	}

	if(window.matchMedia("(min-width: 1199px)").matches) {
		hoverMenu();
		tabs('.dropmnpc_link', '.dropmnpc');
	}

}

function menuMob() {
	const btnTrigger = document.querySelector('.js-btnmenu');
	const menuMob = document.querySelector('.js-menumob');
	const menuMobOverlay = document.querySelector('.js-menumob-overlay');
	const btnDropTrigger = document.querySelectorAll('.js-mdropmenu');
	const btnDropClose = document.querySelectorAll('.js-menumob-btnclose-drop');
	const menuBoxMain = document.querySelector('.js-menumob-box-main');

	btnTrigger.addEventListener('click', function () {
		disableScroll();
		openMenu();
	});

	menuMobOverlay.addEventListener('click', function () {
		enableScroll();
		closeMenu();
	});


	// DROP MENU //
	btnDropTrigger.forEach(function (btn, i) {
		btn.addEventListener('click', function () {
			const dataLabel = btn.getAttribute('data-label');
			const menuDop = menuMob.querySelector(`[data-mboxother="${dataLabel}"]`);

			if (menuDop === null) return;

			// menuBoxMain.classList.add('dssnon');
			menuBoxMain.style.opacity = '0';
			menuDop.classList.add('is-animate');
		});
	})

	btnDropClose.forEach(function (btn, i) {
		btn.addEventListener('click', function () {
			btn.closest('.menumob_box-other').classList.remove('is-animate');
			menuBoxMain.style.opacity = '1';
			// menuBoxMain.classList.remove('dssnon');
		});
	})


	// HELP FUNC //

	function openMenu() {
		menuMob.classList.add('is-active');
	}

	function closeMenu() {
		menuMob.classList.remove('is-active');
	}

};

function moreFooterLinks() {
	const btnTrigger = document.querySelector('.js-navigatbl-btnmore');

	if(btnTrigger == null) return false;

	btnTrigger.addEventListener('click', function() {
		if(!this.classList.contains('is-active')) {
			document.querySelectorAll('.navfblock_list_itm.is-hidden').forEach(itm => itm.classList.remove('is-display-none'));
			document.querySelectorAll('.navfblock_list_itm.is-hidden').forEach(itm => slidetoggle.show(itm, 300));


			// button state
			this.querySelector('.btnnavmore_text').innerHTML = 'Свернуть';
			this.classList.add('is-active');

		} else {
			document.querySelectorAll('.navfblock_list_itm.is-hidden').forEach(itm => itm.classList.add('is-display-none'))
			document.querySelectorAll('.navfblock_list_itm.is-hidden').forEach(itm => slidetoggle.hide(itm, 300));
			// button state
			this.querySelector('.btnnavmore_text').innerHTML = 'Показать еще';
			this.classList.remove('is-active');
		}
	})
};

function footerNavMobAccordion() {
	const btnTrigger = document.querySelectorAll('.navfblock_title');

	btnTrigger.forEach(btn => {
		btn.addEventListener('click', (e) => {
			e.preventDefault();

			const contentHidden = btn.nextElementSibling;


			if(contentHidden.classList.contains('is-active')) {
				contentHidden.classList.remove('is-active');
				slidetoggle.hide(contentHidden, 300);

				btn.classList.remove('is-active');
			} else {
				document.querySelectorAll('.navfblock_list').forEach(itm => itm.classList.remove('is-active'));
				document.querySelectorAll('.navfblock_list').forEach(itm => slidetoggle.hide(itm, 300));

				document.querySelectorAll('.navfblock_title').forEach(itm => itm.classList.remove('is-active'));

				contentHidden.classList.add('is-active');
				slidetoggle.show(contentHidden, 300);

				btn.classList.add('is-active');
			}

		})
	})
};

function fixedHeader() {
	const header = document.querySelector('.headmid');
	const headerHidden = document.querySelector('.headmid-hidden');
	const searchBlock = document.querySelector('.searchbox');
	const hiddenBlockHeight = header.scrollHeight;

	window.addEventListener('scroll', function() {
		const scrollTopY = this.scrollY;

		if(scrollTopY > 0) {
			headerHidden.style.height = `${hiddenBlockHeight}px`
			header.classList.add('is-scroll');

			searchBlock.classList.add('is-searchbox-scroll');
		} else {
			headerHidden.style.height = '0'
			header.classList.remove('is-scroll');

			searchBlock.classList.remove('is-searchbox-scroll');
		}
	});

}

function hoverMenu() {
	const hoverEL = document.querySelectorAll('.js-nav-link-pc');
	const mainWrap = document.querySelector('.main');

	hoverEL.forEach(el => {

		el.addEventListener('mouseover', function() {

			if(el.querySelector('.dropmnpc') == null) return;

			el.querySelector('.nav_link').classList.add('is-active')
			el.querySelector('.dropmnpc').classList.add('is-active');
			mainWrap.classList.add('is-hover');

			showOverlay();
		})

		el.addEventListener('mouseout', function(e) {

			if(el.querySelector('.dropmnpc') == null) return;

			el.querySelector('.nav_link').classList.remove('is-active')
			el.querySelector('.dropmnpc').classList.remove('is-active');
			mainWrap.classList.remove('is-hover');

			hideOverlay()
		})

	})
}

function searchBlock() {
	const btnTrigger = document.querySelector('.js-search-trigger');
	const btnClose = document.querySelector('.js-searchbox-close');
	const searchBlock = document.querySelector('.searchbox');

	btnTrigger.addEventListener('click', function() {
		searchBlock.classList.add('is-active');
		showOverlay();
		disableScroll();
	})

	btnClose.addEventListener('click', function() {
		searchBlock.classList.remove('is-active');
		hideOverlay();
		enableScroll();
	})
}

function tabs(btn, tabs) {
	const btns = document.querySelectorAll(`${btn}`);

	btns.forEach(function(itm) {
		itm.addEventListener('click', function() {
			const currentBtn = itm;
			const tabAttr = currentBtn.getAttribute('data-tabbtn');
			const tabsWrap = currentBtn.closest(`${tabs}`);

			// find current tab content
			const currentTab = tabsWrap.querySelector(`[data-tabcontent="${tabAttr}"]`);

			// if click on active block
			if(currentBtn.classList.contains('is-active')) return;

			// delete all is-active class
			// tabsWrap.querySelector(`.dropmnpc_link.is-active`).classList.remove('is-active');
			// tabsWrap.querySelector(`.dropmnpc_prods.is-active`).classList.remove('is-active');
			tabsWrap.querySelectorAll('.dropmnpc_link').forEach(function(itm) {
				itm.classList.remove('is-active');
			});
			tabsWrap.querySelectorAll('.dropmnpc_prods').forEach(function(itm) {
				itm.classList.remove('is-active');
			});

			// add is-active class current
			currentBtn.classList.add('is-active');
			currentTab.classList.add('is-active');
		})
	})

}

function goodsCountChange(wrapper) {
	const wrapEl = document.querySelectorAll(`${wrapper}`);

	wrapEl.forEach(function(itm) {
		const trigger = itm.querySelector('.js-goods-count-trigger');
		const drop = itm.querySelector('.js-goods-count-drop');
		const dropElements = drop.children;
		const input = trigger.querySelector('input');

		trigger.addEventListener('click', function(e) {


			// document.querySelectorAll('.js-goods-count-trigger').forEach(function(itm) {
			// 	itm.classList.remove('is-active');
			// });
			// document.querySelectorAll('.js-goods-count-drop').forEach(function(itm) {
			// 	itm.classList.remove('is-active');
			// });

			if(!this.classList.contains('is-active')) {
				this.classList.add('is-active');
				drop.classList.add('is-active');

			} else {
				this.classList.remove('is-active');
				drop.classList.remove('is-active');
			}
		});

		Array.from(dropElements).forEach(function(itm) {
			itm.addEventListener('click', function() {
				const numbCount = parseInt(this.textContent);
				input.value = numbCount;


				if(input.value == 1) {
					drop.firstElementChild.classList.add('is-disabled')
				} else {
					drop.firstElementChild.classList.remove('is-disabled')
				}


				trigger.classList.remove('is-active');
				drop.classList.remove('is-active');

			})
		});

	})

}

function goodsCountSelect() {
	const wrapper = document.querySelectorAll('.js-goodscount-select');

	if(wrapper.length == 0) return false;

	wrapper.forEach(function(el) {
		const select = el.querySelector('select');
		const input = el.querySelector('input');

		select.addEventListener('change', function(e) {
			if(e.target.value == '6+') {
				input.classList.add('is-active');
				select.classList.remove('is-active');

				// Default value
				input.value = 7;

			} else{
				input.classList.remove('is-active');
				select.classList.add('is-active');
			}
		});

		input.addEventListener('input', function(e) {
			if(e.target.value < 6) {
				input.classList.remove('is-active');
				select.classList.add('is-active');

				// Default value
				select.value = 1;
			}
		})
	})
}


// Catalog Script //
function moreFilterCheckbox() {
	const btnTrigger = document.querySelector('.js-filters-morebtn');

	if(btnTrigger == null) return false;

	btnTrigger.addEventListener('click', function() {

		if(!this.classList.contains('is-active')) {
			document.querySelectorAll('.filters_checkbox_wrap.is-hidden').forEach(itm => itm.classList.remove('is-display-none'));
			document.querySelectorAll('.filters_checkbox_wrap.is-hidden').forEach(itm => slidetoggle.show(itm, 300));


			// button state
			this.querySelector('.filters_morebtn_text').innerHTML = 'Показать меньше';
			this.classList.add('is-active');

		} else {
			document.querySelectorAll('.filters_checkbox_wrap.is-hidden').forEach(itm => itm.classList.add('is-display-none'))
			document.querySelectorAll('.filters_checkbox_wrap.is-hidden').forEach(itm => slidetoggle.hide(itm, 300));
			// button state
			this.querySelector('.filters_morebtn_text').innerHTML = 'Показать все';
			this.classList.remove('is-active');
		}
	})
};

function hideShowFilters() {
	const trigger = document.querySelector('.js-panelaction-hideshowfilter');
	if(trigger == null) return false;

	trigger.addEventListener('click', function() {
		const filterBlock = document.querySelector('.js-category-filter');
		const goodsBlock = document.querySelector('.js-category-goods');

		if(!this.classList.contains('is-active')) {
			this.classList.add('is-active');
			this.querySelector('.panelaction_text').innerHTML = 'Показать фильтры:'
			filterBlock.classList.add('is-hide');
			goodsBlock.classList.add('is-full');
		} else {
			this.classList.remove('is-active');
			this.querySelector('.panelaction_text').innerHTML = 'Скрыть фильтры:'
			filterBlock.classList.remove('is-hide');
			goodsBlock.classList.remove('is-full');
		}

	});
}

function hideShowFiltersMob() {
	const trigger = document.querySelector('.js-panelaction-hideshowfilter');
	if(trigger == null) return false;

	trigger.querySelector('.panelaction_hideshowfolter_text').innerHTML = 'Показать фильтры:';

	trigger.addEventListener('click', function() {
		const filterBlock = document.querySelector('.js-category-filter');

		disableScroll();

		this.classList.add('is-active');
		filterBlock.classList.add('is-active');

	});

	document.querySelector('.js-catfiltmob-close').addEventListener('click', function() {
		const filterBlock = document.querySelector('.js-category-filter');

		enableScroll();

		trigger.classList.remove('is-active');
		filterBlock.classList.remove('is-active');
	})
}

// Confirmation //
function changeFiledInput() {
	const radioEl = document.querySelectorAll('.js-radio-bus-business');

	if(radioEl == null) return false;

	radioEl.forEach(function(el) {
		el.addEventListener('input', function() {
			if(this.id == 'form-radio-organiz') {
				document.querySelector('.js-form-box-organization').classList.add('is-active');
			} else {
				document.querySelector('.js-form-box-organization').classList.remove('is-active');
			}
		})
	})
}


// Range SLider //
const slider = document.querySelector('.js-filters-rangeinput');
if(slider) {
	noUiSlider.create(slider, {
		start: [document.querySelector('.js-filters-rangeinput').getAttribute('data-filtrange-start'), document.querySelector('.js-filters-rangeinput').getAttribute('data-filtrange-end')],
		connect: true,
		range: {
			'min': parseInt(document.querySelector('.js-filters-rangeinput').getAttribute('data-filtrange-min')),
			'max': parseInt(document.querySelector('.js-filters-rangeinput').getAttribute('data-filtrange-max'))
		},

	});

	slider.noUiSlider.on('update.one', function () {
		const minNumb = slider.noUiSlider.get()[0];
		const maxNumb = slider.noUiSlider.get()[1];

		const wrapRangeBox = this.target.closest('.filters_range');
		const fromBox = wrapRangeBox.querySelector('.js-filters-range-from');
		const toBox = wrapRangeBox.querySelector('.js-filters-range-to');
		fromBox.value = minNumb;
		toBox.value = maxNumb;

	});
}

// Set all select libs //
document.querySelectorAll('.js-select-all').forEach(function(el) {
	new SlimSelect({
		select: el,
	})
})


// Other Code //
function showOverlay() {
	document.querySelector('.overlay-bg').classList.add('is-active');
}

function hideOverlay() {
	document.querySelector('.overlay-bg').classList.remove('is-active');
}

function disableScroll() {
	document.querySelector('body').classList.add('stop-scroll');
}

function enableScroll() {
	document.querySelector('body').classList.remove('stop-scroll');
}

function scrollBarSartEnd() {
	const scrollEl = document.querySelector('.accountnav');
	if(scrollEl == null) return;

	scrollEl.scrollLeft = scrollEl.clientWidth;
}


/* Libs Code */

// -- Input Page -- //
const mainSlider = new Swiper('.js-mainslider-initial', {
	loop: true,
	spaceBetween: 10,
	slidesPerView: 1,

	// centeredSlides: true,
	// roundLengths: true,

	// observer: true,
	// observeParents: true,
	// observeSlideChildren: true,

	speed: 800,

	// paginationClickable: true,

	// autoHeight: true,

	// allowTouchMove: false,
	// onlyExternal: true,
	// noSwiping: true,

	// effect: 'fade',
	// fadeEffect: {
	// 	crossFade: true
	// },

	pagination: {
		el: '.js-mainslider-pagination',
		clickable: true
	},

	navigation: {
		nextEl: '.js-mainslider-btn-next',
		prevEl: '.js-mainslider-btn-prev',
	},

	breakpoints: {
		0: {

		},
		480: {

		},
		768: {

		},
		992: {

		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});

const goodsSlider = new Swiper('.js-goodsslider-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 6,

	speed: 800,

	pagination: {
		el: '.js-blgoodtemp-pagination',
		clickable: true
	},

	navigation: {
		nextEl: '.js-goodsslid-btn-next',
		prevEl: '.js-goodsslid-btn-prev',
	},

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 3,
			loop: true,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 15,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1441: {
			slidesPerView: 6,
		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});


// -- Comparison Page -- //
const comparprodsliderinfSlider = new Swiper('.js-comparprodsliderinf-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 5,

	speed: 800,

	// freeMode: true,
	// watchSlidesVisibility: true,
	// watchSlidesProgress: true,

	loopedSlides: 1,

	// allowTouchMove: false,
	// onlyExternal: true,
	// noSwiping: true,

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 3,
			loop: false,

			allowTouchMove: true,
			onlyExternal: false,
			noSwiping: false,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 33,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1440: {
			slidesPerView: 5,

			allowTouchMove: false,
			onlyExternal: true,
			noSwiping: true,
		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});
const comparprodSlider = new Swiper('.js-comparprod-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 5,

	speed: 800,

	// thumbs: {
	// 	swiper: comparprodsliderinfSlider,
	// },

	navigation: {
		nextEl: '.js-comparprodslider-btn-next',
		prevEl: '.js-comparprodslider-btn-prev',
	},

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 3,
			loop: false,

			allowTouchMove: true,
			onlyExternal: false,
			noSwiping: false,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 33,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1440: {
			slidesPerView: 5,

			allowTouchMove: false,
			onlyExternal: true,
			noSwiping: true,
		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});

if(comparprodSlider.controller) comparprodSlider.controller.control = comparprodsliderinfSlider;
if(comparprodsliderinfSlider.controller) comparprodsliderinfSlider.controller.control = comparprodSlider;

// -- Catalog Page -- //
const catalogSlider = new Swiper('.js-catalog-slider-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 6,

	speed: 800,

	navigation: {
		nextEl: '.js-goodsslid-btn-next',
		prevEl: '.js-goodsslid-btn-prev',
	},

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 3,
			loop: true,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 15,
		},
		992: {
			slidesPerView: 3,
			spaceBetween: 32,
		},
		1441: {
			slidesPerView: 6,
		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});

// -- Product Page -- //
const productsliderinfSlider = new Swiper('.js-productsliderinf-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 5,

	speed: 800,

	// freeMode: true,
	// watchSlidesVisibility: true,
	// watchSlidesProgress: true,

	loopedSlides: 1,

	// allowTouchMove: false,
	// onlyExternal: true,
	// noSwiping: true,

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 3,
			loop: false,

			allowTouchMove: true,
			onlyExternal: false,
			noSwiping: false,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 16,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1441: {
			slidesPerView: 5,

			allowTouchMove: false,
			onlyExternal: true,
			noSwiping: true,
		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});
const productSlider = new Swiper('.js-product-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 5,

	speed: 800,

	// thumbs: {
	// 	swiper: productsliderinfSlider,
	// },

	navigation: {
		nextEl: '.js-productslider-btn-next',
		prevEl: '.js-productslider-btn-prev',
	},

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 3,
			loop: false,

			allowTouchMove: true,
			onlyExternal: false,
			noSwiping: false,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 16,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1441: {
			slidesPerView: 5,

			allowTouchMove: false,
			onlyExternal: true,
			noSwiping: true,
		}
	},

	on: {
		init: function () {

		},

		slideChange: function () {

		},

	},

});

if(productSlider.controller) productSlider.controller.control = productsliderinfSlider;
if(productsliderinfSlider.controller) productsliderinfSlider.controller.control = productSlider;

const productTemplateSlider = new Swiper('.js-product-slidtemplate-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 6,

	speed: 800,

	navigation: {
		nextEl: `.js-goodsslid-btn-next`,
		prevEl: `.js-goodsslid-btn-prev`,
	},

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 6,
			loop: true,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 15,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1441: {
			slidesPerView: 6,
		}
	},

	on: {
		init: function () {
			// console.log(this.$el[0].parentElement.querySelector('.js-goodsslid-btn-next'));
		},

		slideChange: function () {

		},

	},

});

const productTemplateSaleSlider = new Swiper('.js-product-slidtemplatesale-initial', {
	loop: false,
	spaceBetween: 32,
	slidesPerView: 6,

	speed: 800,

	navigation: {
		nextEl: `.js-slidtemplatesale-btn-next`,
		prevEl: `.js-slidtemplatesale-btn-prev`,
	},

	breakpoints: {
		0: {
			slidesPerView: 'auto',
			spaceBetween: 6,
			loop: true,
		},
		360: {
			slidesPerView: 'auto',
			spaceBetween: 10,
		},
		480: {
			slidesPerView: 2,
			spaceBetween: 10,
			loop: false,
		},
		576: {
			slidesPerView: 3,
			spaceBetween: 15,
		},
		992: {
			slidesPerView: 4,
			spaceBetween: 32,
		},
		1441: {
			slidesPerView: 6,
		}
	},

	on: {
		init: function () {
			// console.log(this.$el[0].parentElement.querySelector('.js-goodsslid-btn-next'));
		},

		slideChange: function () {

		},

	},

});

MicroModal.init({
	disableScroll: true,
  disableFocus: true,

	onShow: function(modal, element, event) {
		document.querySelector('.modal.is-open').classList.remove('is-open');
		modal.classList.add('is-open')
	},
});

(function () {
  window.addEventListener("click", function (event) {
    if (event.target.classList.contains("js-validate")) {

      const formParent = event.target.closest("form");
      // console.log(formParent.querySelectorAll(".form_inpt"))
      formParent.querySelectorAll(".form_inpt").forEach(function(item) {
        console.log(item)
        if (item.querySelector("[data-required]")) {
          if (item.querySelector("[data-required]").value === '') {
            console.log("не заполнен")
            item.classList.add("js-field-error");
          } else {
            console.log("заполнен")
            item.classList.remove("js-field-error");
          }
        }
      });
    }
  })
})();
