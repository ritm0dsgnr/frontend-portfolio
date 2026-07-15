document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('[data-scroll]').forEach(e => {
    e.addEventListener('click', (event) => {
      event.preventDefault()

      const blockId = e.getAttribute('data-scroll')
      const blockOffset = document.querySelector(blockId).offsetTop + 100

      window.scrollTo({
        top: blockOffset,
        behavior: 'smooth'
      })
    })
  })

  if (window.innerWidth < 768) {
    new Swiper('.p_content.hero .slider-r__pagination', {
      spaceBetween: 10,
      slidesPerView: 'auto',
    })

    const heroHouse = document.querySelector('.hero-house')
    if (heroHouse) {
      const activeClass = [...heroHouse.classList].find(cls => cls !== 'hero-house')

      if (activeClass) {
        const activeItem = document.querySelector(`.slider-r__pagination-item.${activeClass}`)
        if (activeItem) {
          activeItem.classList.add('active')
        }
      }
    }
  }

  new Swiper('.product-slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 800,
    effect: 'fade',
    loop: true,
    navigation: {
      nextEl: '.product-slider .slider-nav .next',
      prevEl: '.product-slider .slider-nav .prev',
    },
    pagination: {
      el: '.product-slider .slider-big__pagination',
      clickable: true,
    },
  })

  new Swiper('.slider-big .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: '400',
    loop: true,
    navigation: {
      nextEl: '.slider-big .slider-nav .next',
      prevEl: '.slider-big .slider-nav .prev',
    },
    pagination: {
      el: '.slider-big .slider-big__pagination',
      clickable: true,
    },
  })

  new Swiper('.universe-slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 800,
    effect: 'fade',
    loop: true,
    navigation: {
      nextEl: '.universe-slider .slider-nav .next',
      prevEl: '.universe-slider .slider-nav .prev',
    },
    pagination: {
      el: '.universe-slider .slider-big__pagination',
      clickable: true,
    },
  })

  const sliderR_thumbnail = new Swiper('.slider-r .swiper-container.slider-r__pagination', {
    clickable: true,
    allowTouchMove: false
  })
  
  const sliderR = new Swiper('.slider-r .swiper-container.slider-r-main', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    breakpoints: {
      421: {
        effect: 'fade',
      },
    },
    thumbs: {
      swiper: sliderR_thumbnail,
    }, 
  })

  const parallaxBlock = document.querySelector('.slider-r__pagination')

  if (parallaxBlock) {
    parallaxBlock.addEventListener('mouseenter', () => {
      parallaxBlock.classList.remove('hint')
    })

    const minRotate = -200
    const maxRotate = 20
    const initialRotate = 80

    parallaxBlock.addEventListener('mousemove', (e) => {
      if (window.innerWidth > 768) {
        const rect = parallaxBlock.getBoundingClientRect()
        const y = e.clientY - rect.top
        const height = rect.height
        const rotate = minRotate + ((y / height) * (maxRotate - minRotate))
    
        parallaxBlock.style.transform = `rotate(${rotate}deg)`
      }
    })

    parallaxBlock.addEventListener('mouseleave', () => {
      if (window.innerWidth > 768) {
        parallaxBlock.style.transform = 'rotate(-90deg)'
      }
    })

    let previousIndex = sliderR.realIndex

    if (window.innerWidth < 421) {
      sliderR.on('slideChange', () => {
        const currentIndex = sliderR.realIndex
        const direction = currentIndex > previousIndex ? -1 : 1
        const currentTransform = parallaxBlock.style.transform || `rotate(${initialRotate}deg)`
        const currentRotate = parseFloat(currentTransform.replace('rotate(', '').replace('deg)', '')) || initialRotate
        const newRotate = currentRotate + (12 * direction)
        parallaxBlock.style.transform = `rotate(${newRotate}deg)`
      
        previousIndex = currentIndex
      })
    }
  }

  const body = document.querySelector('body'),
        header = document.querySelector('.header'),
        burger = document.querySelector('.header__wrapper-burger'),
        menu = document.querySelector('.menu'),
        toggle = document.querySelector('.header__wrapper-toggle'),
        qrs = document.querySelectorAll('.footer__wrapper-col-qr'),
        qrPopup = document.querySelector('.qr__popup'),
        qrClose = document.querySelector('.qr__popup__wrapper-close'),
        catalogPaginations = document.querySelectorAll('.catalog__cards-pagination span'),
        catalogFilters = document.querySelectorAll('.catalog__cards-filter-btn'),
        catalogFiltersBtn = document.querySelector('.catalog__cards-btn'),
        catalogFiltersPopup = document.querySelector('.catalog__filter'),
        catalogFiltersClose = document.querySelector('.catalog__filter-wrapper-close'),
        catalogFiltersBtnsAccept = document.querySelectorAll('.catalog__filter-wrapper-btns-btn'),
        catalogPaginationPrev = document.querySelector('.catalog__cards-pagination .prev'),
        catalogPaginationNext = document.querySelector('.catalog__cards-pagination .next'),
        tabButtons = document.querySelectorAll('.about-product__wrapper-info-btns-wrapper'),
        tabСontent = document.querySelectorAll('.about-product__wrapper-info-text > div'),
        chooseHero = document.querySelector('.hero-house__choose'),
        paginationHero = document.querySelector('.hero-house .slider-r__pagination'),
        paginationHeroImg = document.querySelector('.hero-house__choose div'),
        whereBuy = document.querySelectorAll('.btn.where-buy'),
        buyPopup = document.querySelector('.buy-popup'),
        closeBuyPopup = document.querySelector('.buy-popup-wrapper-close'),
        aboutProductWrapper = document.querySelector('.about-product__wrapper-info-text'),
        cookie = document.querySelector('.cookie'),
        cookieBtn = document.querySelector('.cookie__btn')
 
  burger.addEventListener('click', () => {
    burger.classList.toggle('active')
    menu.classList.toggle('active')
    header.classList.toggle('active')
    toggle.classList.toggle('active')
  })

  if (cookieBtn){
    cookieBtn.addEventListener('click', () => {
      cookie.classList.toggle('active')
    })
  }

  if (window.innerWidth <= 421) {
    function isAndroid() {
      return navigator.userAgent.match(/Android/i)
    }
  
    function isiPhone() {
      return navigator.userAgent.match(/iPhone|iPod/i)
    }
  
    if (isAndroid()) {
      const androidButtons = document.querySelectorAll('.footer__wrapper-col-btn.as')
      androidButtons.forEach(function(button) {
        button.style.display = 'none'
      })
    } else if (isiPhone()) {
      const iPhoneButtons = document.querySelectorAll('.footer__wrapper-col-btn.gp')
      iPhoneButtons.forEach(function(button) {
        button.style.display = 'none'
      })
    }
  }

  if (window.innerWidth <= 768) {
    function isAndroid() {
      return navigator.userAgent.match(/Android/i)
    }
  
    function isiPhone() {
      return navigator.userAgent.match(/iPhone|iPod/i)
    }
  
    if (isAndroid()) {
      const androidButtons = document.querySelectorAll('.footer .footer__wrapper-col-btn.as')
      androidButtons.forEach(function(button) {
        button.style.display = 'none'
      })
    } else if (isiPhone()) {
      const iPhoneButtons = document.querySelectorAll('.footer .footer__wrapper-col-btn.gp')
      iPhoneButtons.forEach(function(button) {
        button.style.display = 'none'
      })
    }
  }

  if (chooseHero) {
    chooseHero.addEventListener('click', (event) => {
      paginationHero.classList.add('active')
      chooseHero.classList.add('active')
    })
    document.addEventListener('click', (event) => {
      const targetElement = event.target
      if (!paginationHero.contains(targetElement) && !chooseHero.contains(targetElement)) {
        paginationHero.classList.remove('active')
        chooseHero.classList.remove('active')
      }
    })
  }

  if (whereBuy) {
    whereBuy.forEach(btn => {
      btn.addEventListener('click', (event) => {
        event.preventDefault()
        buyPopup.classList.add('active')
        body.classList.add('lock')
      })
    })
  }

  if (closeBuyPopup) {
    closeBuyPopup.addEventListener('click', () => {
      buyPopup.classList.remove('active')
      body.classList.remove('lock')
    })
  }

  if (catalogFiltersBtn) {
    catalogFiltersBtn.addEventListener('click', () => {
      catalogFiltersPopup.classList.add('active')
      body.classList.add('lock')
    })
  }

  if (catalogFiltersClose){
    catalogFiltersClose.addEventListener('click', () => {
      catalogFiltersPopup.classList.remove('active')
      body.classList.remove('lock')
    })
  }

  catalogFiltersBtnsAccept.forEach(catalogFiltersBtnAccept => {
    catalogFiltersBtnAccept.addEventListener('click', () => {
      catalogFiltersPopup.classList.remove('active')
      body.classList.remove('lock')
    })
  })

  qrs.forEach(qr => {
    qr.addEventListener('click', () => {
      qrPopup.classList.add('active')
    })
  })

  if (catalogPaginationNext) {
    const updateActivePagination = (newActiveIndex) => {
      catalogPaginations.forEach(pagination => pagination.classList.remove('active'))
      if (newActiveIndex >= 0 && newActiveIndex < catalogPaginations.length) {
        catalogPaginations[newActiveIndex].classList.add('active')
      }
    }

    catalogPaginations.forEach((catalogPagination, index) => {
      catalogPagination.addEventListener('click', () => {
        updateActivePagination(index)
      })
    })

    catalogPaginationPrev.addEventListener('click', () => {
      const currentIndex = Array.from(catalogPaginations).findIndex(pagination => pagination.classList.contains('active'))
      if (currentIndex > 0) {
        updateActivePagination(currentIndex - 1)
      }
    })

    catalogPaginationNext.addEventListener('click', () => {
      const currentIndex = Array.from(catalogPaginations).findIndex(pagination => pagination.classList.contains('active'))
      if (currentIndex < catalogPaginations.length - 1) {
        updateActivePagination(currentIndex + 1)
      }
    })
  }

  catalogFilters.forEach(catalogFilter => {
    catalogFilter.addEventListener('click', () => {
      if (catalogFilter.classList.contains('active')) {
        catalogFilter.classList.remove('active')
      } else {
        catalogFilters.forEach(catalogFilter => catalogFilter.classList.remove('active'))
        catalogFilter.classList.add('active')
      }
    })
  })

  if (paginationHeroImg) {
    let currentImageIndex = 1
    const totalImages = 9
    const images = []

    for (let i = 1; i <= totalImages; i++) {
      const img = new Image()
      img.src = `img/character-icon-0${i}.svg`
      images.push(img)
    }

    function changeImage() {
      paginationHeroImg.style.maskImage = `url(${images[currentImageIndex - 1].src})`

      currentImageIndex++
      if (currentImageIndex > totalImages) {
        currentImageIndex = 1 
      }
    }

    setInterval(changeImage, 2000)
  }

  if (qrClose) {
    qrClose.addEventListener('click', () => {
      qrPopup.classList.remove('active')
    })
  }

  function hideAllContent() {
    tabСontent.forEach(block => {
      block.style.display = 'none'
    })
  }
  
  function deactivateAllTabs() {
    tabButtons.forEach(button => {
      button.classList.remove('active')
    })
  }
  
  function showContent(className) {
    const content = document.querySelector('.about-product__wrapper-info-text .' + className)
    if (content) {
      content.style.display = 'block'
    }
  }

  if (aboutProductWrapper) {
    hideAllContent()
    document.querySelector('.about-product__wrapper-info-text .description').style.display = 'block'
  
    tabButtons.forEach(button => {
      button.addEventListener('click', function() {
        const className = this.classList[1]
  
        deactivateAllTabs()
        this.classList.add('active')
  
        hideAllContent()
        showContent(className)
      })
    })
  }

  const animations = [
    { id: 'collie', file: 'collie.json', type: 'loop' },
    { id: 'lilo', file: 'lilo.json', type: 'loop' },
    { id: 'note-green', file: 'note-green.json', type: 'loop' },
    { id: 'note-blue', file: 'note-blue.json', type: 'loop' },
    { id: 'note-pink', file: 'note-pink.json', type: 'loop' },
    { id: 'fire', file: 'fire.json', type: 'loop' },
    { id: 'trix_1', file: 'trix_1.json', type: 'loop' },
    { id: 'trix_2', file: 'trix_2.json', type: 'loop' },
    { id: 'trix_3', file: 'trix_3.json', type: 'loop' },
    { id: 'skat', file: 'skat.json', type: 'loop' },
    { id: 'molnii', file: 'molnii.json', type: 'loop' },
    { id: 'bubbles', file: 'bubbles.json', type: 'loop' },
    { id: 'fantasmo', file: 'fantasmo.json', type: 'loop' },
    { id: 'njama', file: 'njama.json', type: 'loop' },
    { id: 'disastro-hero', file: 'disastro-hero.json', type: 'loop' },
    { id: 'fantasmo-hero', file: 'fantasmo-hero.json', type: 'loop' },
    { id: 'bunny', file: 'bunny.json', type: 'loop' },
    { id: 'bunny-hero', file: 'bunny-hero.json', type: 'loop' },
    { id: 'pikki-hero', file: 'pikki-hero.json', type: 'loop' },
    { id: 'holly-hero', file: 'holly-hero.json', type: 'loop' },
    { id: 'lillo-hero', file: 'lillo-hero.json', type: 'loop' },
    { id: 'ndzhama-hero', file: 'ndzhama-hero.json', type: 'loop' },
    { id: 'colli-hero', file: 'colli-hero.json', type: 'loop' },
    { id: 'trix-hero', file: 'trix-hero.json', type: 'loop' },
    { id: 'eye', file: 'eye.json', type: 'loop' },
    { id: 'fishes', file: 'fishes.json', type: 'loop' },
    { id: 'fishes_1', file: 'fishes_1.json', type: 'loop' },
    { id: 'fishes-night', file: 'fishes-night.json', type: 'loop' },
    { id: 'fugu', file: 'fugu.json', type: 'loop' },
    { id: 'light', file: 'light.json', type: 'loop' },
    { id: 'light-night', file: 'light-night.json', type: 'loop' },
    { id: 'tv-light', file: 'tv-light.json', type: 'loop' },
    { id: 'njama_product_1', file: 'njama_product_1.json', type: 'loop' },
    { id: 'njama_product_3', file: 'njama_product_3.json', type: 'loop' },
    { id: 'njama_product_4', file: 'njama_product_4.json', type: 'loop' },
    { id: 'pikki_product_1', file: 'pikki_product_1.json', type: 'loop' },
    { id: 'pikki_product_3', file: 'pikki_product_3.json', type: 'loop' },
    { id: 'pikki_product_4', file: 'pikki_product_4.json', type: 'loop' },
    { id: 'fantasmo_product_1', file: 'fantasmo_product_1.json', type: 'loop' },
    { id: 'fantasmo_product_3', file: 'fantasmo_product_3.json', type: 'loop' },
    { id: 'fantasmo_product_4', file: 'fantasmo_product_4.json', type: 'loop' },
    { id: 'disastro_product_1', file: 'disastro_product_1.json', type: 'loop' },
    { id: 'disastro_product_3', file: 'disastro_product_3.json', type: 'loop' },
    { id: 'disastro_product_4', file: 'disastro_product_4.json', type: 'loop' },
    { id: 'collie_product_1', file: 'collie_product_1.json', type: 'loop' },
    { id: 'collie_product_3', file: 'collie_product_3.json', type: 'loop' },
    { id: 'collie_product_4', file: 'collie_product_4.json', type: 'loop' },
    { id: 'bunny_product_1', file: 'bunny_product_1.json', type: 'loop' },
    { id: 'bunny_product_3', file: 'bunny_product_3.json', type: 'loop' },
    { id: 'bunny_product_4', file: 'bunny_product_4.json', type: 'loop' },
    { id: 'lilo_product_1', file: 'lilo_product_1.json', type: 'loop' },
    { id: 'lilo_product_3', file: 'lilo_product_3.json', type: 'loop' },
    { id: 'lilo_product_4', file: 'lilo_product_4.json', type: 'loop' },
    { id: 'holly_product_1', file: 'holly_product_1.json', type: 'loop' },
    { id: 'holly_product_3', file: 'holly_product_3.json', type: 'loop' },
    { id: 'holly_product_4', file: 'holly_product_4.json', type: 'loop' },
    { id: 'main', file: 'main.json', type: 'hover' },
    { id: 'main-night', file: 'main-night.json', type: 'hover' },
    { id: 'universe', file: 'universe.json', type: 'hover' },
    { id: 'universe-night', file: 'universe-night.json', type: 'hover' },
    { id: 'catalog', file: 'catalog.json', type: 'hover' },
    { id: 'catalog-night', file: 'catalog-night.json', type: 'hover' }
  ]
  
  function loadBodymovinAnimation(element, file) {
    return bodymovin.loadAnimation({
      container: element,
      renderer: 'svg',
      loop: true,
      autoplay: true,
      path: `js/animation/${file}`
    })
  }
  
  function setupLottieAnimation(container, file) {
    const animation = lottie.loadAnimation({
      container: container,
      renderer: 'svg',
      loop: false,
      autoplay: false,
      path: `js/animation/${file}`
    })
  
    container.addEventListener('mouseenter', function() {
      animation.playSegments([0, animation.totalFrames], true)
    })
  
    container.addEventListener('mouseleave', function() {
      animation.playSegments([animation.totalFrames], true)
    })
  }
  
  animations.forEach(animation => {
    const elements = document.querySelectorAll(`#${animation.id}`)
    elements.forEach(element => {
      if (animation.type === 'loop') {
        loadBodymovinAnimation(element, animation.file)
      } else if (animation.type === 'hover') {
        setupLottieAnimation(element, animation.file)
      }
    })
  })

  const elementsToToggle = [
    '.p_content', 
    '.header', 
    '.slider-big', 
    '.slider-r', 
    '.product', 
    '.footer', 
    '.seahorse', 
    '.menu',
    '.main',
    '.fishes',
    '.cookie'
  ]
  
  const nodeListToToggle = [
    '.btn', 
    '.main__wrapper-info-text', 
    '.info__wrapper-text-text', 
    '.main__wrapper-info-title', 
    '.info__wrapper-text-title', 
    '.slider-big .slider-nav .prev', 
    '.slider-big .slider-nav .next'
  ]
  
  const toggleNightMode = () => {
    elementsToToggle.forEach(selector => {
      const element = document.querySelector(selector)
      if (element) element.classList.toggle('night')
    })
  
    nodeListToToggle.forEach(selector => {
      const elements = document.querySelectorAll(selector)
      elements.forEach(element => {
        element.classList.toggle('night')
      })
    })
  
    toggle.classList.toggle('night')

    const images = document.querySelectorAll('.hero-house__bg img')
    images.forEach(image => {
      const currentSrc = image.src
      const fileName = currentSrc.substring(currentSrc.lastIndexOf('/') + 1)
      const newFileName = toggle.classList.contains('night')
        ? fileName.replace('.jpg', '-night.jpg')
        : fileName.replace('-night.jpg', '.jpg')

      image.src = currentSrc.replace(fileName, newFileName)
    })
  }
  
  const checkTimeAndToggleNight = () => {
    const now = new Date()
    const hour = now.getHours()
    const userToggledNightMode = localStorage.getItem('userToggledNightMode') === 'enabled'
  
    if ((hour >= 19 || hour < 7) && !userToggledNightMode) {
      if (localStorage.getItem('nightMode') !== 'enabled') {
        localStorage.setItem('nightMode', 'enabled')
        toggleNightMode()
      }
    } else if (localStorage.getItem('nightMode') === 'enabled' && !userToggledNightMode) {
      localStorage.setItem('nightMode', 'disabled')
      toggleNightMode()
    }
  }
  
  checkTimeAndToggleNight()
  
  if (localStorage.getItem('nightMode') === 'enabled') {
    toggleNightMode()
  }
  
  toggle.addEventListener('click', () => {
    toggleNightMode()
  
    if (localStorage.getItem('nightMode') !== 'enabled') {
      localStorage.setItem('nightMode', 'enabled')
      localStorage.setItem('userToggledNightMode', 'enabled')
    } else {
      localStorage.setItem('nightMode', 'disabled')
      localStorage.setItem('userToggledNightMode', 'disabled')
    }
  })

  setInterval(checkTimeAndToggleNight, 120000)
  
  if (document.querySelector('.catalog__cards-filter')) {
    document.querySelector('.catalog__cards-filter').addEventListener('wheel', function(event) {
      if (event.deltaY !== 0) {
        this.scrollLeft += event.deltaY
        event.preventDefault()
      }
    })
  }

  if (window.innerWidth < 420) {
    const tabs = document.querySelectorAll('.about-product__wrapper-info-btns-wrapper')

    tabs.forEach(tab => {
      tab.addEventListener('click', function() {
        tabs.forEach(t => t.classList.remove('active'))
        this.classList.add('active')
        updateTabPositions()
      })
    })

    function updateTabPositions() {
      const firstTab = document.querySelector('.about-product__wrapper-info-btns-wrapper:nth-child(1)')
      const secondTab = document.querySelector('.about-product__wrapper-info-btns-wrapper:nth-child(2)')
      const thirdTab = document.querySelector('.about-product__wrapper-info-btns-wrapper:nth-child(3)')

      if (firstTab.classList.contains('active')) {
        secondTab.querySelector('.tab').style.left = '-15%'
      } else if (thirdTab.classList.contains('active')) {
        secondTab.querySelector('.tab').style.left = '15%'
      } else {
        secondTab.querySelector('.tab').style.left = ''
      }
    }
  }











  gsap.registerPlugin(ScrollTrigger)

  if (document.querySelector('.hero-house')) {
    const heroHouse = document.querySelector('.hero-house')
    const characterImg = document.querySelector('.hero-house__character img')
    const backgroundWrapper = document.querySelector('.hero-house__bg')
    const background = document.querySelector('.hero-house__bg img')
    const block = document.querySelector('.hero-house__block')
    const character = document.querySelector('.hero-house__character')
    const bubbles = document.querySelectorAll('.hero-house__bubbles')
    const btn = document.querySelector('.hero-house__btn')
    const scrollIndicator = document.querySelector('.hero-house .scroll')
    const characterOtherImg = document.querySelector('.hero-house__character-other img')
  
    const stepClasses = ['step-01', 'step-02', 'step-03', 'step-04', 'step-05', 'step-06']
  
    const stylesMap = {
      'fantasmo': {
        desktopStyles: [
          [100, 0, 0, 33, 53, 14.5],
          [195, -40, -17, 25, 86, 30],
          [195, -40, -87, 55, 113, 27],
          [195, -107, -39, 51, 75, 30],
          [195, -115, -137, 44, 68, 30],
          [156, -104, -108, 76, 123, 29],
        ],
        tabletStyles: [
          [180, -10, -10, 40, 63, 14.5],
          [290, -14, -48, 61, 67, 30],
          [290, -26, -130, 81, 91, 27],
          [290, -80, -90, 99, 40, 30],
          [290, -90, -170, 84, 60, 30],
          [235, -110, -170, 94, 90, 29],
        ],
        mobileStyles: [
          [255, -4, -25, 32, 32, 14.5],
          [450, -5, -70, 55, 28, 30],
          [450, -27, -170, 62, 20, 27],
          [450, -91, -92, 60, 17, 30],
          [450, -89, -171, 67, 18, 30],
          [420, -116, -212, 82, 46, 29],
        ]
      },
      'pikki': {
        desktopStyles: [
          [100, 0, 0, 26, 118, 21],
          [195, -0, -182, 52, 48, 40],
          [195, -67, -134, 41, 73, 40],
          [195, -95, -0, 51, 90, 40],
          [195, -50, -6, 44, 64, 40],
          [156, -104, -3, 33, 114, 40],
        ],
        tabletStyles: [
          [180, -8, -107, 26, 58, 21],
          [290, -29, -205, 26, 58, 40],
          [290, -94, -170, 34, 56, 40],
          [290, -107, -47, 60, 51, 40],
          [290, -60, -55, 45, 26, 40],
          [290, -135, -120, 60, 53, 40],
        ],
        mobileStyles: [
          [255, -10, -108, 17, 19, 21],
          [450, -15, -200, 32, 22, 40],
          [450, -60, -170, 46, 21, 40],
          [450, -102, -74, 36, 16, 40],
          [450, -30, -50, 57, 15, 40],
          [450, -96, -130, 70, 15, 40]
        ]
      },
      'bunny': {
        desktopStyles: [
          [100, -1, 0, 32, 83, 22],
          [195, -40, -17, 34, 75, 39],
          [195, -40, -87, 36, 104, 39],
          [195, -107, -39, 46, 42, 39],
          [195, -115, -137, 58, 47, 39],
          [156, -104, -108, 65, 93, 39],
        ],
        tabletStyles: [
          [180, -8, -62, 39, 54, 22],
          [290, -11, -33, 74, 72, 39],
          [290, -22, -136, 69, 79, 39],
          [290, -87, -54, 87, 37, 39],
          [290, -83, -160, 113, 48, 39],
          [235, -92, -140, 102, 90, 39],
        ],
        mobileStyles: [
          [255, -8, -64, 26, 26, 22],
          [450, -23, -63, 46, 24, 39],
          [450, -35, -162, 37, 20, 39],
          [450, -98, -64, 46, 10, 39],
          [450, -98, -158, 67, 18, 39],
          [420, -150, -204, 46, 22, 39],
        ]
      },
      'disastro': {
        desktopStyles: [
          [100, 0, 0, 29, 57, 12],
          [195, -1, -15, 55, 94, 24],
          [195, -69, -72, 41, 83, 24],
          [195, -115, -143, 30, 24, 24],
          [195, -115, -177, 33, 97, 24],
          [156, -95, 0, 54, 62, 24],
        ],
        tabletStyles: [
          [180, -2, -24, 39, 54, 14],
          [290, 0, -49, 67, 76, 24],
          [290, -80, -116, 44, 59, 24],
          [290, -110, -150, 54, 37, 24],
          [290, -108, -254, 55, 56, 24],
          [235, -72, -40, 95, 40, 24],
        ],
        mobileStyles: [
          [255, -7, -33, 25, 28, 12],
          [450, 0, -74, 56, 34, 24],
          [450, -46, -128, 60, 19, 24],
          [450, -87, -140, 51, 19, 24],
          [450, -70, -240, 67, 18, 24],
          [420, -120, -55, 46, 22, 24],
        ]
      },
      'holly': {
        desktopStyles: [
          [100, 0, 0, 2, 69, 22],
          [195, 0, -54, 6, 81, 40],
          [195, -41, -169, 44, 73, 40],
          [195, -0, -182, 46, 94, 40],
          [195, -109, -75, 40, 65, 40],
          [156, -104, 0, 67, 22, 40],
        ],
        tabletStyles: [
          [180, 0, -34, 6, 62, 22],
          [290, 0, -70, 8, 83, 40],
          [290, -28, -200, 70, 75, 40],
          [290, -10, -257, 42, 52, 40],
          [290, -100, -92, 70, 60, 40],
          [235, -100, 0, 95, 30, 40],
        ],
        mobileStyles: [
          [255, 0, -45, 4, 28, 22],
          [450, 0, -100, 7, 29, 40],
          [450, -30, -210, 50, 18, 40],
          [450, -2, -251, 42, 12, 40],
          [450, -86, -110, 61, 18, 40],
          [420, -106, -24, 85, 8, 40],
        ]
      },
      'lillo': {
        desktopStyles: [
          [100, 0, 0, 27, 57, 15],
          [195, 0, -55, 56, 62, 24],
          [195, 0, -148, 37, 80, 24],
          [195, -81, -137, 57, 101, 24],
          [195, -96, -58, 51, 72, 24],
          [156, -104, -3, 75, 18, 27],
        ],
        tabletStyles: [
          [180, 0, -26, 39, 54, 15],
          [290, 5, -54, 67, 76, 24],
          [290, 0, -195, 41, 60, 24],
          [290, -100, -232, 54, 37, 24],
          [290, -112, -90, 55, 56, 24],
          [235, -100, -7, 105, 20, 27],
        ],
        mobileStyles: [
          [255, -12, -33, 18, 29, 15],
          [450, 0, -78, 54, 34, 24],
          [450, 0, -187, 35, 31, 24],
          [450, -80, -210, 51, 17, 24],
          [450, -75, -108, 67, 18, 24],
          [420, -95, -20, 105, 8, 27],
        ]
      },
      'ndzhama': {
        desktopStyles: [
          [100, 0, 0, 38, 109, 18],
          [195, -19, -161, 58, 52, 32],
          [195, -67, -76, 44, 76, 32],
          [195, -95, 0, 35, 98, 32],
          [195, -130, -0, 28, 75, 32],
          [156, -104, -58, 64, 106, 34],
        ],
        tabletStyles: [
          [180, -0, -90, 54, 62, 18],
          [290, -24, -188, 62, 58, 32],
          [290, -54, -110, 71, 59, 32],
          [290, -80, -50, 66, 60, 32],
          [290, -91, -22, 90, 65, 32],
          [235, -116, -107, 75, 84, 32],
        ],
        mobileStyles: [
          [255, -11, -93, 30, 26, 18],
          [450, -16, -178, 56, 32, 32],
          [450, -45, -128, 60, 19, 32],
          [450, -66, -71, 58, 22, 32],
          [450, -85, -56, 67, 18, 32],
          [420, -145, -160, 46, 30, 32],
        ]
      },
      'colli': {
        desktopStyles: [
          [100, 0, 0, 33, 113, 20],
          [195, -16, -141, 50, 78, 36],
          [195, 0, -63, 19, 72, 36],
          [195, -123, -16, 27, 106, 36],
          [195, -108, -100, 24, 81, 36],
          [156, -103, -43, 43, 74, 31],
        ],
        tabletStyles: [
          [180, -7, -90, 45, 65, 20],
          [290, -22, -188, 58, 60, 36],
          [290, 0, -93, 26, 59, 36],
          [290, -103, -78, 65, 60, 36],
          [290, -88, -167, 62, 36, 36],
          [235, -89, -49, 80, 84, 31],
        ],
        mobileStyles: [
          [255, 0, -87, 37, 32, 20],
          [450, -8, -180, 56, 31, 36],
          [450, 0, -97, 20, 30, 36],
          [450, -83, -92, 60, 25, 36],
          [450, -60, -150, 67, 18, 36],
          [420, -80, -100, 86, 30, 31],
        ]
      },
      'trix': {
        desktopStyles: [
          [100, 0, 0, 14, 98, 26],
          [195, 0, -100, 31, 84, 46],
          [195, -83, -64, 17, 32, 46],
          [195, -98, -0, 16, 54, 46],
          [195, -228, -106, 22, 68, 46],
          [198, -271, -20, 22, 76, 38],
        ],
        tabletStyles: [
          [180, 0, -90, 23, 44, 26],
          [290, 0, -150, 36, 62, 46],
          [290, -83, -64, 34, 49, 46],
          [290, -90, -9, 42, 52, 46],
          [290, -240, -156, 40, 40, 46],
          [235, -178, -8, 80, 76, 38],
        ],
        mobileStyles: [
          [255, 0, -75, 15, 25, 26],
          [450, 0, -150, 27, 28, 46],
          [450, -52, -72, 45, 19, 46],
          [450, -57, -40, 51, 11, 46],
          [450, -172, -145, 67, 18, 46],
          [420, -172, -62, 83, 20, 38],
        ]
      }
    }
  
    const heroHouseClasses = heroHouse.classList
    const secondClass = heroHouseClasses[1]
    const currentClass = Object.keys(stylesMap).find(className => className === secondClass)
  
    let currentIndex = 0
  
    if (currentClass) {
      const { desktopStyles, tabletStyles, mobileStyles } = stylesMap[currentClass]
      const isTablet = window.matchMedia('(max-width: 768px)').matches
      const isMobile = window.matchMedia('(max-width: 420px)').matches
      const styles = isMobile ? mobileStyles : (isTablet ? tabletStyles : desktopStyles)
  
      function applyStyles(bgScale, bgTranslateY, bgTranslateX, charScale, charTranslateY, charTranslateX) {
        background.style.width = `${bgScale}%`
        backgroundWrapper.style.transform = `translateY(${bgTranslateY}rem) translateX(${bgTranslateX}rem)`
        block.style.top = `${charScale}rem`
        block.style.left = `${charTranslateY}rem`
        character.style.width = `${charTranslateX}rem`
      }
  
      function removeActiveClass() {
        bubbles.forEach(function (bubble) {
          bubble.classList.remove('active')
        })
      }
  
      function updateStylesAndClasses(currentIndex) {
        const characterImgSrc = characterImg.src
        const match = characterImgSrc.match(/img\/(.*?)\-character/)
        let baseName = ''
        if (match) {
          baseName = match[1]
        }
        characterImg.src = `img/${baseName}-character-0${currentIndex + 1}.svg`
  
        if (characterOtherImg) {
          const characterOtherImgSrc = characterOtherImg.src
          const matchOther = characterOtherImgSrc.match(/img\/(.*?)\-character/)
          let baseNameOther = ''
          if (matchOther) {
            baseNameOther = matchOther[1]
          }
          characterOtherImg.src = `img/${baseNameOther}-character-0${currentIndex + 1}.svg`
        }
  
        const [bgScale, bgTranslateY, bgTranslateX, charScale, charTranslateY, charTranslateX] = styles[currentIndex]
        applyStyles(bgScale, bgTranslateY, bgTranslateX, charScale, charTranslateY, charTranslateX)
  
        removeActiveClass()
  
        const bubble = document.querySelector(`.hero-house__bubbles.b${currentIndex + 1}`)
        if (bubble) {
            bubble.classList.add('active')
        }
  
        if (currentIndex === 0) {
          btn.classList.remove('hidden')
        } else {
          btn.classList.add('hidden')
        }
  
        if (currentIndex === 1) {
          scrollIndicator.classList.remove('hidden')
        } else {
          scrollIndicator.classList.add('hidden')
        }
  
        block.classList.remove(...stepClasses)
        block.classList.add(stepClasses[currentIndex])
      }
  
      function createScrollSync() {
        ScrollTrigger.create({
          trigger: '.hero-house',
          start: 'top top',
          end: () => "+=" + (stepClasses.length * window.innerHeight),
          pin: true,
          scrub: 1,
          onUpdate: (self) => {
            const progress = self.progress * (stepClasses.length - 1)
            const targetIndex = Math.round(progress)
  
            if (currentIndex !== targetIndex) {
              currentIndex = targetIndex
              updateStylesAndClasses(currentIndex)
            }
          },
        })
      }
  
      btn.addEventListener('click', () => {
        const targetIndex = 1
        currentIndex = targetIndex
        window.scrollTo({
          top: targetIndex * window.innerHeight,
          behavior: 'smooth'
        })
        setTimeout(() => {
          updateStylesAndClasses(currentIndex);
        }, 100)
      })
  
      updateStylesAndClasses(0)
      createScrollSync()
    }
  }
})