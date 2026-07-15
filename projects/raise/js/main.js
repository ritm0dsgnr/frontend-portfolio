document.addEventListener('DOMContentLoaded', function () {
  Marquee3k.init()

  jQuery(document).ready(function() {
    jQuery('[data-fancybox="gallery"]').fancybox({
      buttons: [
        'prev',
        'next',
        'close'
      ],
      infobar: false,
      loop: true,
      idleTime: false,
      btnTpl: {
        prev: '<div data-fancybox-prev class="fancybox-button-custom prev"><img src="img/arrow-slider.svg" alt=""></div>',
        next: '<div data-fancybox-next class="fancybox-button-custom next"><img src="img/arrow-slider.svg" alt=""></div>',
        close: '<div data-fancybox-close class="fancybox-button-close"></div>'
      }
    })
  })



  const aboutMediaImg = new Swiper('.about__dark-media-img.swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    effect: 'fade',
    loop: true,
  })

  const aboutMediaInfo  = new Swiper('.about__dark-media-info.swiper-container', {
    direction: "vertical",
    speed: 800,
    slidesPerView: 3,
    slidesPerGroup: 1,
    centeredSlides: true,
    thumbs: {
      swiper: aboutMediaImg,
    },
    navigation: {
      nextEl: '.about__dark-media-nav .next',
      prevEl: '.about__dark-media-nav .prev',
    },
  })

  gsap.registerPlugin(ScrollTrigger)

  const totalSlides = aboutMediaInfo .slides.length

  if (window.innerWidth < 1008) {
    ScrollTrigger.create({
      trigger: '.about__dark-fixed',
      start: "top top",
      end: () => "+=" + (totalSlides * window.innerHeight),
      pin: true,
      scrub: 1,
      onUpdate: (self) => {
        const progress = self.progress * (totalSlides - 1)
        const targetSlide = Math.round(progress)

        if (aboutMediaInfo .activeIndex !== targetSlide) {
          aboutMediaInfo .slideTo(targetSlide)
        }
      },
    })
  }

  const aboutText = new Swiper('.about__wrapper-text-seo-slider.swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    loop: true,
    effect: 'fade',
    pagination: {
      el: '.about__wrapper-text-seo-slider-pagination',
      clickable: true,
    },
  })
  
  const aboutImg = new Swiper('.about__wrapper-slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    loop: true,
    navigation: {
      nextEl: '.project-item__wrapper-right-slider-nav.next',
      prevEl: '.project-item__wrapper-right-slider-nav.prev',
    },
  })

  aboutText.controller.control = aboutImg
  aboutImg.controller.control = aboutText

  new Swiper('.project-item__wrapper-right-slider.ver .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    loop: true,
    navigation: {
      nextEl: '.project-item__wrapper-right-slider-nav.next',
      prevEl: '.project-item__wrapper-right-slider-nav.prev',
    },
    pagination: {
      el: '.project-item__wrapper-right-slider-pagination',
      clickable: true,
    },
  })

  new Swiper('.project-item__wrapper-right-slider.hor .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    loop: true,
    navigation: {
      nextEl: '.project-item__wrapper-right-slider-nav.next',
      prevEl: '.project-item__wrapper-right-slider-nav.prev',
    },
    pagination: {
      el: '.project-item__wrapper-right-slider-pagination',
      clickable: true,
    },
  })
  
  const sliderVideo = new Swiper('.projects .swiper-container.projects__video', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 1600,
    effect: 'fade',
    loop: true,
  })

  const sliderName = new Swiper('.projects .swiper-container.projects__name', {
    slidesPerView: 1.25,
    speed: 1600,
    loop: true,
    centeredSlides : true,
    thumbs: {
      swiper: sliderVideo,
    },
    breakpoints: {
      751: {
        slidesPerView: 1.5,
      },
    }
  })

  const swiperWrapper = document.querySelector('.projects .swiper-container.projects__name.projects__name-main .swiper-wrapper')

  if(swiperWrapper){
    swiperWrapper.addEventListener('wheel', function (event) {
      event.preventDefault()
      if (event.deltaY > 0) {
        sliderName.slideNext()
      } else {
        sliderName.slidePrev()
      }
    })
  }

  document.querySelectorAll('.projects .swiper-container.projects__name .swiper-slide').forEach(slide => {
    slide.addEventListener('click', function () {
      const slideIndex = sliderName.slides.indexOf(slide)
      const activeIndex = sliderName.activeIndex
  
      if (slideIndex > activeIndex) {
        sliderName.slideNext()
      } else if (slideIndex < activeIndex) {
        sliderName.slidePrev()
      }
    })
  })

  const mainLogo = document.querySelector('.main__wrapper-logo'),
        menuBtns = document.querySelectorAll('.menu__btn'),
        menuBtnsMenu = document.querySelectorAll('.menu__btn-menu'),
        menu = document.querySelector('.menu'),
        body = document.querySelector('body'),
        videoBtn = document.querySelector('.project-item__wrapper-right-video-wrapper-play'),
        iframe = document.querySelector('.project-item__wrapper-right-video-wrapper iframe'),
        column1 = document.querySelector('.project-item__wrapper-left'),
        column2 = document.querySelector('.project-item__wrapper-right')

  if (mainLogo) {
    document.addEventListener('mousemove', (event) => {
      const windowWidth = window.innerWidth
      const windowHeight = window.innerHeight
      const centerX = windowWidth / 2
      const centerY = windowHeight / 2
  
      const mouseX = event.clientX
      const mouseY = event.clientY
  
      const distance = Math.sqrt(Math.pow(centerX - mouseX, 2) + Math.pow(centerY - mouseY, 2))
      const maxDistance = Math.sqrt(Math.pow(centerX, 2) + Math.pow(centerY, 2))
      const maxBlur = 15
  
      const blur = (distance / maxDistance) * maxBlur
  
      mainLogo.style.filter = `blur(${blur}px)`
    })
  }

  menuBtns.forEach(menuBtn => {
    menuBtn.addEventListener('click', (e) => {
      e.preventDefault()
      const svg = menuBtn.querySelector('svg use')
      if (svg) {
        const hrefValue = svg.getAttribute('xlink:href')
        menuBtnsMenu.forEach(menuBtnMenu => {
          const menuSvg = menuBtnMenu.querySelector('svg use')
          if (menuSvg) {
            menuSvg.setAttribute('xlink:href', hrefValue)
          }
        })
      }
      menu.classList.toggle('active')
      body.classList.toggle('lock')
    })
  })
 
  const player = new Vimeo.Player(iframe)

  if (videoBtn) {
    videoBtn.addEventListener('click', function() {
      player.play().then(function() {
        videoBtn.classList.add('hidden')
      })
    })
  }
  
  if (window.innerWidth > 1008) {
    window.addEventListener('scroll', function() {
      const column1Height = column1.scrollHeight,
            column2Height = column2.scrollHeight,
            windowHeight = window.innerHeight
      
      const column1OffsetTop = column1.getBoundingClientRect().top + window.scrollY,
            column1ScrollTop = window.scrollY || window.pageYOffset
      
      const column1ScrollHeight = column1Height - windowHeight
      
      const scrollPercentage = Math.min(1, (column1ScrollTop - column1OffsetTop) / column1ScrollHeight),
            column2ScrollHeight = Math.max(0, column1Height - column2Height),
            column2TranslateY = Math.max(0, scrollPercentage * column2ScrollHeight)
      
      column2.style.transform = `translateY(${column2TranslateY}px)`
    })
  }
})