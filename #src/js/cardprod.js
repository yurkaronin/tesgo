function findVideos() {
  let videos = document.querySelectorAll('.video-box');

  for (let i = 0; i < videos.length; i++) {
      setupVideo(videos[i]);
  }
}

function setupVideo(video) {
  let link = video.querySelector('.video__link');
  let media = video.querySelector('.video__media');
  let button = video.querySelector('.for-who-box__circle');
  let id = parseMediaURL(media);

  video.addEventListener('click', (e) => {
    e.preventDefault();
    let iframe = createIframe(id);

    link.remove();
    button.remove();
    video.appendChild(iframe);

  });

  link.removeAttribute('href');
  video.classList.add('video--enabled');
  
}

function parseMediaURL(media) {
  let regexp = /https:\/\/i\.ytimg\.com\/vi\/([a-zA-Z0-9_-]+)\/maxresdefault\.jpg/i;
  let url = media.src;
  let match = url.match(regexp);

  return match[1];
}

function createIframe(id) {
  let iframe = document.createElement('iframe');

  iframe.setAttribute('allowfullscreen', '');
  iframe.setAttribute('allow', 'autoplay');
  iframe.setAttribute('src', generateURL(id));
  iframe.classList.add('video__media');

  return iframe;
}

function generateURL(id) {
  let query = '?rel=0&showinfo=0&enablejsapi=1';

  return 'https://www.youtube.com/embed/' + id + query;
}

findVideos();

/**
* Unifies event handling across browsers
*
* - Allows registering and unregistering of event handlers
* - Injects event object and involved DOM element to listener
*
* @author Mark Rolich <mark.rolich@gmail.com>
*/
var Event = function () {
  "use strict";
  this.attach = function (evtName, element, listener, capture) {
      var evt         = '',
          useCapture  = (capture === undefined) ? true : capture,
          handler     = null;

      if (window.addEventListener === undefined) {
          evt = 'on' + evtName;
          handler = function (evt, listener) {
              element.attachEvent(evt, listener);
              return listener;
          };
      } else {
          evt = evtName;
          handler = function (evt, listener, useCapture) {
              element.addEventListener(evt, listener, useCapture);
              return listener;
          };
      }

      return handler.apply(element, [evt, function (ev) {
          var e   = ev || event,
              src = e.srcElement || e.target;

          listener(e, src);
      }, useCapture]);
  };

  this.detach = function (evtName, element, listener, capture) {
      var evt         = '',
          useCapture  = (capture === undefined) ? true : capture;

      if (window.removeEventListener === undefined) {
          evt = 'on' + evtName;
          element.detachEvent(evt, listener);
      } else {
          evt = evtName;
          element.removeEventListener(evt, listener, useCapture);
      }
  };

  this.stop = function (evt) {
      evt.cancelBubble = true;

      if (evt.stopPropagation) {
          evt.stopPropagation();
      }
  };

  this.prevent = function (evt) {
      if (evt.preventDefault) {
          evt.preventDefault();
      } else {
          evt.returnValue = false;
      }
  };
};

/**
* Magnifier.js is a Javascript library enabling magnifying glass effect on an images.
*
* Features
*
* Zoom in / out functionality using mouse wheel
* Setting options via Javascript or data attributes
* Magnified image can be displayed in the lens itself or outside of it in a wrapper
* Attachment to multiple images with single call
* Attachment of user defined functions for thumbnail entering, moving and leaving and image zooming events
* Display loading text while the large image is being loaded, and switch to lens once its loaded
*
* Magnifier.js uses Event.js as a cross-browser event handling wrapper, which is available at
* Github and JSClasses.org:
*
* Github - https://github.com/mark-rolich/Event.js
* JS Classes - http://www.jsclasses.org/package/212-JavaScript-Handle-events-in-a-browser-independent-manner.html
*
* Works in Chrome, Firefox, Safari, IE 7, 8, 9 & 10.
*
* @author Mark Rolich <mark.rolich@gmail.com>
*/
var Magnifier = function (evt, options) {
  "use strict";

  var gOptions = options || {},
      curThumb = null,
      curData = {
          x: 0,
          y: 0,
          w: 0,
          h: 0,
          lensW: 0,
          lensH: 0,
          lensBgX: 0,
          lensBgY: 0,
          largeW: 0,
          largeH: 0,
          largeL: 0,
          largeT: 0,
          zoom: 2,
          zoomMin: 1.1,
          zoomMax: 5,
          mode: 'outside',
          largeWrapperId: (gOptions.largeWrapper !== undefined)
              ? (gOptions.largeWrapper.id || null)
              : null,
          status: 0,
          zoomAttached: false,
          zoomable: (gOptions.zoomable !== undefined)
              ? gOptions.zoomable
              : false,
          onthumbenter: (gOptions.onthumbenter !== undefined)
              ? gOptions.onthumbenter
              : null,
          onthumbmove: (gOptions.onthumbmove !== undefined)
              ? gOptions.onthumbmove
              : null,
          onthumbleave: (gOptions.onthumbleave !== undefined)
              ? gOptions.onthumbleave
              : null,
          onzoom: (gOptions.onzoom !== undefined)
              ? gOptions.onzoom
              : null
      },
      pos = {
          t: 0,
          l: 0,
          x: 0,
          y: 0
      },
      gId = 0,
      status = 0,
      curIdx = '',
      curLens = null,
      curLarge = null,
      gZoom = (gOptions.zoom !== undefined)
                  ? gOptions.zoom
                  : curData.zoom,
      gZoomMin = (gOptions.zoomMin !== undefined)
                  ? gOptions.zoomMin
                  : curData.zoomMin,
      gZoomMax = (gOptions.zoomMax !== undefined)
                  ? gOptions.zoomMax
                  : curData.zoomMax,
      gMode = gOptions.mode || curData.mode,
      data = {},
      inBounds = false,
      isOverThumb = 0,
      getElementsByClass = function (className) {
          var list = [],
              elements = null,
              len = 0,
              pattern = '',
              i = 0,
              j = 0;

          if (document.getElementsByClassName) {
              list = document.getElementsByClassName(className);
          } else {
              elements = document.getElementsByTagName('*');
              len = elements.length;
              pattern = new RegExp("(^|\\s)" + className + "(\\s|$)");

              for (i, j; i < len; i += 1) {
                  if (pattern.test(elements[i].className)) {
                      list[j] = elements[i];
                      j += 1;
                  }
              }
          }

          return list;
      },
      $ = function (selector) {
          var idx = '',
              type = selector.charAt(0),
              result = null;

          if (type === '#' || type === '.') {
              idx = selector.substr(1, selector.length);
          }

          if (idx !== '') {
              switch (type) {
              case '#':
                  result = document.getElementById(idx);
                  break;
              case '.':
                  result = getElementsByClass(idx);
                  break;
              }
          }

          return result;
      },
      createLens = function (thumb, idx) {
          var lens = document.createElement('div');

          lens.id = idx + '-lens';
          lens.className = 'magnifier-loader';

          thumb.parentNode.appendChild(lens);
      },
      updateLensOnZoom = function () {
          curLens.style.left = pos.l + 'px';
          curLens.style.top = pos.t + 'px';
          curLens.style.width = curData.lensW + 'px';
          curLens.style.height = curData.lensH + 'px';
          curLens.style.backgroundPosition = '-' + curData.lensBgX + 'px -' +
                                              curData.lensBgY + 'px';

          curLarge.style.left = '-' + curData.largeL + 'px';
          curLarge.style.top = '-' + curData.largeT + 'px';
          curLarge.style.width = curData.largeW + 'px';
          curLarge.style.height = curData.largeH + 'px';
      },
      updateLensOnLoad = function (idx, thumb, large, largeWrapper) {
          var lens = $('#' + idx + '-lens'),
              textWrapper = null;

          if (data[idx].status === 1) {
              textWrapper = document.createElement('div');
              textWrapper.className = 'magnifier-loader-text';
              lens.className = 'magnifier-loader hidden';

              textWrapper.appendChild(document.createTextNode('Loading...'));
              lens.appendChild(textWrapper);
          } else if (data[idx].status === 2) {
              lens.className = 'magnifier-lens hidden';
              lens.removeChild(lens.childNodes[0]);
              lens.style.background = 'url(' + thumb.src + ') no-repeat 0 0 scroll';

              large.id = idx + '-large';
              large.style.width = data[idx].largeW + 'px';
              large.style.height = data[idx].largeH + 'px';
              large.className = 'magnifier-large hidden';

              if (data[idx].mode === 'inside') {
                  lens.appendChild(large);
              } else {
                  largeWrapper.appendChild(large);
              }
          }

          lens.style.width = data[idx].lensW + 'px';
          lens.style.height = data[idx].lensH + 'px';

          // lens.style.width = data[idx].lensW + 'px';
          // lens.style.height = data[idx].lensH + 'px';
      },
      getMousePos = function () {
          var xPos = pos.x - curData.x,
              yPos = pos.y - curData.y,
              t    = 0,
              l    = 0;

          inBounds = (
              xPos < 0 ||
              yPos < 0 ||
              xPos > curData.w ||
              yPos > curData.h
          )
              ? false
              : true;

          l = xPos - (curData.lensW / 2);
          t = yPos - (curData.lensH / 2);

          if (curData.mode !== 'inside') {
              if (xPos < curData.lensW / 2) {
                  l = 0;
              }

              if (yPos < curData.lensH / 2) {
                  t = 0;
              }

              if (xPos - curData.w + (curData.lensW / 2) > 0) {
                  l = curData.w - (curData.lensW + 2);
              }

              if (yPos - curData.h + (curData.lensH / 2) > 0) {
                  t = curData.h - (curData.lensH + 2);
              }
          }

          pos.l = Math.round(l);
          pos.t = Math.round(t);

          curData.lensBgX = pos.l + 1;
          curData.lensBgY = pos.t + 1;

          if (curData.mode === 'inside') {
              curData.largeL = Math.round(xPos * (curData.zoom - (curData.lensW / curData.w)));
              curData.largeT = Math.round(yPos * (curData.zoom - (curData.lensH / curData.h)));
          } else {
              curData.largeL = Math.round(curData.lensBgX * curData.zoom * (curData.largeWrapperW / curData.w));
              curData.largeT = Math.round(curData.lensBgY * curData.zoom * (curData.largeWrapperH / curData.h));
          }
      },
      zoomInOut = function (e) {
          var delta = (e.wheelDelta > 0 || e.detail < 0) ? 0.1 : -0.1,
              handler = curData.onzoom,
              multiplier = 1,
              w = 0,
              h = 0;

          if (e.preventDefault) {
              e.preventDefault();
          }

          e.returnValue = false;

          curData.zoom = Math.round((curData.zoom + delta) * 10) / 10;

          if (curData.zoom >= curData.zoomMax) {
              curData.zoom = curData.zoomMax;
          } else if (curData.zoom >= curData.zoomMin) {
              curData.lensW = Math.round(curData.w / curData.zoom);
              curData.lensH = Math.round(curData.h / curData.zoom);

              if (curData.mode === 'inside') {
                  w = curData.w;
                  h = curData.h;
              } else {
                  w = curData.largeWrapperW;
                  h = curData.largeWrapperH;
                  multiplier = curData.largeWrapperW / curData.w;
              }

              curData.largeW = Math.round(curData.zoom * w);
              curData.largeH = Math.round(curData.zoom * h);

              getMousePos();
              updateLensOnZoom();

              if (handler !== null) {
                  handler({
                      thumb: curThumb,
                      lens: curLens,
                      large: curLarge,
                      x: pos.x,
                      y: pos.y,
                      zoom: Math.round(curData.zoom * multiplier * 10) / 10,
                      w: curData.lensW,
                      h: curData.lensH
                  });
              }
          } else {
              curData.zoom = curData.zoomMin;
          }
      },
      onThumbEnter = function () {
          curData = data[curIdx];
          curLens = $('#' + curIdx + '-lens');

          if (curData.status === 2) {
              curLens.className = 'magnifier-lens';

              if (curData.zoomAttached === false) {
                  if (curData.zoomable !== undefined && curData.zoomable === true) {
                      evt.attach('mousewheel', curLens, zoomInOut);

                      if (window.addEventListener) {
                          curLens.addEventListener('DOMMouseScroll', function (e) {
                              zoomInOut(e);
                          });
                      }
                  }

                  curData.zoomAttached = true;
              }

              curLarge = $('#' + curIdx + '-large');
              curLarge.className = 'magnifier-large';
          } else if (curData.status === 1) {
              curLens.className = 'magnifier-loader';
          }
      },
      onThumbLeave = function () {
          if (curData.status > 0) {
              var handler = curData.onthumbleave;

              if (handler !== null) {
                  handler({
                      thumb: curThumb,
                      lens: curLens,
                      large: curLarge,
                      x: pos.x,
                      y: pos.y
                  });
              }

              if (curLens.className.indexOf('hidden') === -1) {
                  curLens.className += ' hidden';
                  curThumb.className = curData.thumbCssClass;

                  if (curLarge !== null) {
                      curLarge.className += ' hidden';
                  }
              }
          }
      },
      move = function () {
          if (status !== curData.status) {
              onThumbEnter();
          }

          if (curData.status > 0) {
              curThumb.className = curData.thumbCssClass + ' opaque';

              if (curData.status === 1) {
                  curLens.className = 'magnifier-loader';
              } else if (curData.status === 2) {
                  curLens.className = 'magnifier-lens';
                  curLarge.className = 'magnifier-large';
                  curLarge.style.left = '-' + curData.largeL + 'px';
                  curLarge.style.top = '-' + curData.largeT + 'px';
              }

              curLens.style.left = pos.l + 'px';
              curLens.style.top = pos.t + 'px';
              curLens.style.backgroundPosition = '-' +
                                              curData.lensBgX + 'px -' +
                                              curData.lensBgY + 'px';

              var handler = curData.onthumbmove;

              if (handler !== null) {
                  handler({
                      thumb: curThumb,
                      lens: curLens,
                      large: curLarge,
                      x: pos.x,
                      y: pos.y
                  });
              }
          }

          status = curData.status;
      },
      setThumbData = function (thumb, thumbData) {
          var thumbBounds = thumb.getBoundingClientRect(),
              w = 0,
              h = 0;

          thumbData.x = thumbBounds.left;
          thumbData.y = thumbBounds.top;
          thumbData.w = Math.round(thumbBounds.right - thumbData.x);
          thumbData.h = Math.round(thumbBounds.bottom - thumbData.y);

          thumbData.lensW = Math.round(thumbData.w / thumbData.zoom);
          thumbData.lensH = Math.round(thumbData.h / thumbData.zoom);

          if (thumbData.mode === 'inside') {
              w = thumbData.w;
              h = thumbData.h;
          } else {
              w = thumbData.largeWrapperW;
              h = thumbData.largeWrapperH;
          }

          thumbData.largeW = Math.round(thumbData.zoom * w);
          thumbData.largeH = Math.round(thumbData.zoom * h);
      };

  this.attach = function (options) {
      if (options.thumb === undefined) {
          throw {
              name: 'Magnifier error',
              message: 'Please set thumbnail',
              toString: function () {return this.name + ": " + this.message; }
          };
      }

      var thumb = $(options.thumb),
          i = 0;

      if (thumb.length !== undefined) {
          for (i; i < thumb.length; i += 1) {
              options.thumb = thumb[i];
              this.set(options);
          }
      } else {
          options.thumb = thumb;
          this.set(options);
      }
  };

  this.setThumb = function (thumb) {
      curThumb = thumb;
  };

  this.set = function (options) {
      if (data[options.thumb.id] !== undefined) {
          curThumb = options.thumb;
          return false;
      }

      var thumbObj    = new Image(),
          largeObj    = new Image(),
          thumb       = options.thumb,
          idx         = thumb.id,
          zoomable    = null,
          largeUrl    = null,
          largeWrapper = (
              $('#' + options.largeWrapper) ||
              $('#' + thumb.getAttribute('data-large-img-wrapper')) ||
              $('#' + curData.largeWrapperId)
          ),
          zoom = options.zoom || thumb.getAttribute('data-zoom') || gZoom,
          zoomMin = options.zoomMin || thumb.getAttribute('data-zoom-min') || gZoomMin,
          zoomMax = options.zoomMax || thumb.getAttribute('data-zoom-max') || gZoomMax,
          mode = options.mode || thumb.getAttribute('data-mode') || gMode,
          onthumbenter = (options.onthumbenter !== undefined)
                      ? options.onthumbenter
                      : curData.onthumbenter,
          onthumbleave = (options.onthumbleave !== undefined)
                      ? options.onthumbleave
                      : curData.onthumbleave,
          onthumbmove = (options.onthumbmove !== undefined)
                      ? options.onthumbmove
                      : curData.onthumbmove,
          onzoom = (options.onzoom !== undefined)
                      ? options.onzoom
                      : curData.onzoom;

      if (options.large === undefined) {
          largeUrl = (options.thumb.getAttribute('data-large-img-url') !== null)
                          ? options.thumb.getAttribute('data-large-img-url')
                          : options.thumb.src;
      } else {
          largeUrl = options.large;
      }

      if (largeWrapper === null && mode !== 'inside') {
          throw {
              name: 'Magnifier error',
              message: 'Please specify large image wrapper DOM element',
              toString: function () {return this.name + ": " + this.message; }
          };
      }

      if (options.zoomable !== undefined) {
          zoomable = options.zoomable;
      } else if (thumb.getAttribute('data-zoomable') !== null) {
          zoomable = (thumb.getAttribute('data-zoomable') === 'true');
      } else if (curData.zoomable !== undefined) {
          zoomable = curData.zoomable;
      }

      if (thumb.id === '') {
          idx = thumb.id = 'magnifier-item-' + gId;
          gId += 1;
      }

      createLens(thumb, idx);

      data[idx] = {
          zoom: zoom,
          zoomMin: zoomMin,
          zoomMax: zoomMax,
          mode: mode,
          zoomable: zoomable,
          thumbCssClass: thumb.className,
          zoomAttached: false,
          status: 0,
          largeUrl: largeUrl,
          largeWrapperId: mode === 'outside' ? largeWrapper.id : null,
          largeWrapperW: mode === 'outside' ? largeWrapper.offsetWidth : null,
          largeWrapperH: mode === 'outside' ? largeWrapper.offsetHeight : null,
          onzoom: onzoom,
          onthumbenter: onthumbenter,
          onthumbleave: onthumbleave,
          onthumbmove: onthumbmove
      };

      evt.attach('mouseover', thumb, function (e, src) {
          if (curData.status !== 0) {
              onThumbLeave();
          }

          curIdx = src.id;
          curThumb = src;

          onThumbEnter(src);

          setThumbData(curThumb, curData);

          pos.x = e.clientX;
          pos.y = e.clientY;

          getMousePos();
          move();

          var handler = curData.onthumbenter;

          if (handler !== null) {
              handler({
                  thumb: curThumb,
                  lens: curLens,
                  large: curLarge,
                  x: pos.x,
                  y: pos.y
              });
          }
      }, false);

      evt.attach('mousemove', thumb, function (e, src) {
          isOverThumb = 1;
      });

      evt.attach('load', thumbObj, function () {
          data[idx].status = 1;

          setThumbData(thumb, data[idx]);
          updateLensOnLoad(idx);

          evt.attach('load', largeObj, function () {
              data[idx].status = 2;
              updateLensOnLoad(idx, thumb, largeObj, largeWrapper);
          });

          largeObj.src = data[idx].largeUrl;
      });

      thumbObj.src = thumb.src;
  };

  evt.attach('mousemove', document, function (e) {
      pos.x = e.clientX;
      pos.y = e.clientY;

      getMousePos();

      if (inBounds === true) {
          move();
      } else {
          if (isOverThumb !== 0) {
              onThumbLeave();
          }

          isOverThumb = 0;
      }
  }, false);

  evt.attach('scroll', window, function () {
      if (curThumb !== null) {
          setThumbData(curThumb, curData);
      }
  });
};


var d = document;
let slidertabs = d.querySelectorAll('.product__img-slide');
for (let i = 0; i < slidertabs.length; i++) {
  slidertabs[i].addEventListener('click', function () {
    let thisData = this.dataset.slide;


    // Изменяем swiper элемент
    let allActiveSlides = d.querySelectorAll('.product__img-slide--active');
    for (let i = 0; i < allActiveSlides.length; i++) {
      allActiveSlides[i].classList.remove('product__img-slide--active');
    }
    let allCurentControls = d.querySelectorAll('.product__img-slide[data-slide="' + thisData +
      '"]');
    for (let i = 0; i < allCurentControls.length; i++) {
      allCurentControls[i].classList.add('product__img-slide--active');
    }


    // Изменяем target элемент
    let allTargetSlides = d.querySelectorAll('.product__img-target-item--active');
    for (let i = 0; i < allTargetSlides.length; i++) {
      allTargetSlides[i].classList.remove('product__img-target-item--active')
    }

    let allTargetCurrent = d.querySelectorAll('.product__img-target-item[data-slide="' +
      thisData + '"]');
    for (let i = 0; i < allTargetCurrent.length; i++) {
      allTargetCurrent[i].classList.add('product__img-target-item--active')
    }

  });
}


let allProdcutPhotos = d.querySelectorAll('.product__img-target-item');

for (let i = 0; i < allProdcutPhotos.length; i++) {
  allProdcutPhotos[i].addEventListener('click', function (e) {
    e.preventDefault();
    d.querySelector('.modalprod').classList.add('modalprod--active');
    d.querySelector('body').classList.add('stop-scroll');
    d.querySelector('.modalprod .modalprod-window--overview').classList.add('modalprod-window--active');
  });
}


const slidPrordThumb = document.querySelector('.proimgstatic').querySelectorAll('.swiper-slide');
const thumbVideoTrigger = slidPrordThumb[slidPrordThumb.length - 1]
thumbVideoTrigger.addEventListener('click', function() {
  d.querySelector('.modalprod').classList.add('modalprod--active');
  d.querySelector('body').classList.add('stop-scroll');
  d.querySelector('.modalprod .modalprod-window--overview').classList.add('modalprod-window--active');
})

const slidPrordThumbModal = document.querySelector('.modalprod').querySelectorAll('.swiper-slide');
slidPrordThumbModal.forEach(function(itm) {
	itm.addEventListener('click', function() {
		if(itm.closest('.modalprod').querySelector('.video-box iframe') == null) return;

		document.querySelector('.video__media').src = document.querySelector('.video__media').src;
	})
})



let allLupaElements = d.querySelectorAll('.magnifier-thumb-wrapper');
for (let i = 0; i < allLupaElements.length; i++) {
  allLupaElements[i].addEventListener('mouseover', function () {
    d.querySelector('.magnifier-preview').classList.add('active');
  });
  allLupaElements[i].addEventListener('mouseout', function () {
    d.querySelector('.magnifier-preview').classList.remove('active');
  });
}


// Скрытие модалки при клике на оверлей
d.querySelector('.modalprod-overlay').addEventListener('click', function (e) {
  e.preventDefault();
  d.querySelector('body').classList.remove('stop-scroll');
  d.querySelector('.modalprod').classList.remove('modalprod--active');
  d.querySelector('.modalprod-window--active').classList.remove('modalprod-window--active');

  if(document.querySelector('.video-box').querySelector('iframe')) {
    document.querySelector('.video__media').src = document.querySelector('.video__media').src;
  }
});

function findCloseBtns() {
  let closeBtns = document.querySelectorAll('.close');

  for (let i = 0; i < closeBtns.length; i++) {
    setUpClose(closeBtns[i]);
  }
}

function setUpClose(closeBtn) {
  closeBtn.addEventListener('click', function (e) {
    e.preventDefault();
    // menuBurger.classList.remove('header__burger--active');
    // d.querySelector('.header__nav').classList.remove('header__nav--active');
    d.querySelector('body').classList.remove('stop-scroll');
    d.querySelector('.modalprod').classList.remove('modalprod--active');
    d.querySelector('.modalprod-window--active').classList.remove('modalprod-window--active')

    if(document.querySelector('.video-box').querySelector('iframe')) {
      document.querySelector('.video__media').src = document.querySelector('.video__media').src;
    }

  });
}

findCloseBtns();


var swiper = new Swiper(".product__img-slider--1", {
  direction: "vertical",
  slidesPerView: 'auto',
  spaceBetween: 8,
  breakpoints: {
    0: { 
      direction: 'horizontal',
      slidesPerView: 'auto',
      spaceBetween: 10,
    },
    576: {
      direction: 'vertical', 
      slidesPerView: 'auto',
    }
  }
});

var swiper2 = new Swiper(".product__img-slider--2", {
    slidesPerView: "auto",
  spaceBetween: 16,

    allowTouchMove: false,
    onlyExternal: true,
    noSwiping: true,

  breakpoints: { 
    0: { 
      slidesPerView: "auto",
      spaceBetween: 10,

      allowTouchMove: true,
      onlyExternal: false,
      noSwiping: false,
    },
    480: { 
        slidesPerView: "auto",
        spaceBetween: 10,

        allowTouchMove: true,
        onlyExternal: false,
        noSwiping: false,
    },
    1200: {
        allowTouchMove: false,
        onlyExternal: true,
        noSwiping: true,
    }
  }
});

if(swiper.controller) swiper.controller.control = swiper2;
if(swiper2.controller) swiper2.controller.control = swiper;


// ZOOM IMAGE INIT //

document.addEventListener("DOMContentLoaded", function() {});


if(window.matchMedia("(min-width: 1201px)").matches) {

	var evt = new Event();
	var m = new Magnifier(evt);

	m.attach({
        thumb: '.thumb',
        zoom: 2,
        largeWrapper: 'preview',
	});

}

