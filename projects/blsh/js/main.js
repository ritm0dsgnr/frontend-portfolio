document.addEventListener('DOMContentLoaded', function () {
  const header = document.querySelector('.p_content.m')
  const logoM = document.querySelector('.p_content.m .main__logo')
  const main = document.querySelector('.main')
  
  if (logoM) {
    let maxWidth = 400
    let minWidth = 70
    let maxScroll = 370

    function updateParameters() {
      const screenWidth = window.innerWidth

      if (screenWidth >= 769 && screenWidth <= 1920) {
        maxWidth = 400
        minWidth = 70
        maxScroll = 370
      } else if (screenWidth > 450 && screenWidth < 769) {
        maxWidth = 300
        minWidth = 70
        maxScroll = 410
      } else if (screenWidth <= 450) {
        maxWidth = 165
        minWidth = 60
        maxScroll = 290
      }
    }

    updateParameters()
    window.addEventListener('resize', updateParameters)

    window.addEventListener('scroll', () => {
      const scrollY = window.scrollY
      const newWidth = Math.max(
        minWidth,
        Math.min(maxWidth, maxWidth - (scrollY / maxScroll) * (maxWidth - minWidth))
      )
      logoM.style.width = `${newWidth}px`
    })

    const mainHeight = main.offsetHeight - 100
    window.addEventListener('scroll', function () {
      if (window.scrollY > mainHeight) {
        header.classList.remove('active')
        logoM.classList.add('sc')
      } else {
        header.classList.add('active')
        logoM.classList.remove('sc')
      }
    })

  
    window.addEventListener('scroll', function () {
      if (window.scrollY > maxScroll) {
        logoM.classList.add('active')
      } else {
        logoM.classList.remove('active')
      }
    })
  }

  new Swiper('.main .swiper-container', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    loop: true,
    navigation: {
      nextEl: document.querySelector('.main-next'),
      prevEl: document.querySelector('.main-prev'),
    },
    pagination: {
      el: '.main-pagination',
      clickable: true,
    },
  })
  
  const cardPrev = new Swiper('.card__wrapper-gallery-slider .swiper-container', {
    direction: 'vertical', 
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 4.5,
    navigation: {
      nextEl: document.querySelector('.card__wrapper-gallery-slider-next'),
      prevEl: document.querySelector('.card__wrapper-gallery-slider-prev'),
    },
  })

  if (window.innerWidth < 1100) {
    const cardImg = new Swiper('.card__wrapper-gallery-img .swiper-container', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      effect: 'fade',
      speed: 0,
      pagination: {
        el: '.card__wrapper-gallery-img-pagination',
        clickable: true,
      },
    })

    cardPrev.controller.control = cardImg
    cardImg.controller.control = cardPrev
  }

  document.querySelectorAll('.slider').forEach((slider, index) => {
    new Swiper(slider.querySelector('.swiper-container'), {
      spaceBetween: 10,
      slidesPerView: 'auto',
      navigation: {
        nextEl: slider.querySelector('.next'),
        prevEl: slider.querySelector('.prev'),
      },
      breakpoints: {
        450: {
          slidesPerView: 'auto',
          spaceBetween: 20,
        },
      }
    })
  })

  const slides = document.querySelectorAll('.card__wrapper-gallery-slider .swiper-slide')

  slides.forEach(function(slide) {
    slide.addEventListener('click', function() {
      slides.forEach(function(slide) {
        slide.classList.remove('active')
      })
      slide.classList.add('active')
    })
  })

  const scrollElements = document.querySelectorAll('[data-scroll]')

  scrollElements.forEach(function (el) {
    el.addEventListener('click', function (e) {
      e.preventDefault()

      const targetSelector = el.getAttribute('data-scroll')
      const targetElement = document.querySelector(targetSelector)

      if (targetElement) {
        const targetPosition = targetElement.getBoundingClientRect().top + window.pageYOffset
        const offsetPosition = targetPosition - 114

        window.scrollTo({
          top: offsetPosition,
          behavior: 'smooth'
        })
      }
    })
  })

  const cardImgs = document.querySelectorAll('.catalog__cards-item-img'),
        cardLikes = document.querySelectorAll('.catalog__cards-item-img-like'),
        catalogTextBtn = document.querySelector('.catalog__bottom-btn'),
        catalogText = document.querySelector('.catalog__text'),
        burger = document.querySelector('.header__wrapper-burger'),
        menu = document.querySelector('.menu'),
        close = document.querySelector('.menu__block-close'),
        filtersBtn = document.querySelector('.catalog__nav-btn'),
        closeFilters = document.querySelector('.catalog__nav-filters .menu__block-close'),
        filters = document.querySelector('.catalog__nav-filters'),
        filtersBack = document.querySelector('.catalog__nav-filters-header svg'),
        filtersHeaderText = document.querySelector('.catalog__nav-filters-header p'),
        filterItems = document.querySelectorAll('.catalog__nav-filters-item'),
        filterItemLis = document.querySelectorAll('.catalog__nav-filters-item li'),
        filterItemRadios = document.querySelectorAll('.catalog__nav-filters-item-filters-radio'),
        cardColors = document.querySelectorAll('.card__wrapper-info-colors-wrapper span'),
        cardDescription = document.querySelector('.card__wrapper-info-description-text'),
        cardDescriptionBtn = document.querySelector('.card__wrapper-info-description-btn'),
        cardTabs = document.querySelectorAll('.card__wrapper-info-tab-item'),
        sizes = document.querySelectorAll('.card__wrapper-info-sizes-wrapper span'),
        dolyameBtn = document.querySelector('.dolyame__btn'),
        dolyamePopup = document.querySelector('.dolyame__popup'),
        closeDolyamePopup = document.querySelector('.dolyame__popup .menu__block-close'),
        tableBtns = document.querySelectorAll('.popup__table-header-col'),
        tableBlocks = document.querySelectorAll('.popup__table-block'),
        tableBtn = document.querySelector('.card__wrapper-info-sizes-link'),
        tablePopup = document.querySelector('.popup__table'),
        closeTablePopup = document.querySelector('.popup__table .menu__block-close'),
        addToCart = document.querySelector('.card__wrapper-info-add-btn'),
        closeShopPopup = document.querySelector('.popup__shop .menu__block-close'),
        shopPopup = document.querySelector('.popup__shop'),
        sizesBtn = document.querySelector('.card__wrapper-info-sizes-header'),
        sizesPopup = document.querySelector('.card__wrapper-info-sizes-wrapper'),
        counters = document.querySelectorAll('.order__wrapper-item-wrapper-count'),
        orderHeaders = document.querySelectorAll('.order__wrapper-item-wrapper-sizes-header'),
        orderLists = document.querySelectorAll('.order__wrapper-item-wrapper-sizes-list'),
        orderSizes = document.querySelectorAll('.order__wrapper-item-wrapper-sizes-list li'),
        deleteButtons = document.querySelectorAll('.order__wrapper-item-wrapper-del'),
        deletePopup = document.querySelector('.popup__del'),
        closeDeletePopup = document.querySelectorAll('.popup__del .menu__block-close, .popup__del-wrapper #no'),
        confirmDeleteButton = document.querySelector('.popup__del-wrapper #yes'),
        promo = document.querySelector('.order__container-right-promo'),
        promoBtn = document.querySelector('.order__container-right-promo-btn'),
        subscribeBtn = document.querySelector('.subscribe__wrapper-col-btn'),
        subscribeBtnFooter = document.querySelector('.footer__wrapper-col-header .btn'),
        subscribePopup = document.querySelector('.subscribe.popup'),
        closeSubscribePopup = document.querySelector('.subscribe.popup .menu__block-close'),
        items = document.querySelectorAll('.account__wrapper-history-list-item')

  cardImgs.forEach((slider, sliderIndex) => {
    const swiper = new Swiper(slider, {
      slidesPerView: 1,
      slidesPerGroup: 1,
      effect: 'fade',
      speed: 0,
      pagination: {
        el: slider.querySelector('.catalog__cards-item-img-pagination'),
        clickable: true,
      },
    })

    const bullets = slider.querySelectorAll('.swiper-pagination-bullet')

    bullets.forEach((bullet, index) => {
      bullet.addEventListener('mouseenter', () => {
        swiper.slideTo(index)
      })
    })
  })

  if (items) {
    items.forEach(item => {
      const svg = item.querySelector('svg')
      
      svg.addEventListener('click', () => {
        item.classList.toggle('active')
      })
    })
  }

  if (subscribeBtn) {
    subscribeBtn.addEventListener('click', function(event) {
      const emailInput = document.querySelector('.subscribe__wrapper-in input'),
            subscribeWrapper = document.querySelector('.subscribe__wrapper-in'),
            emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
  
      subscribeWrapper.classList.remove('er')
  
      if (!emailInput.value || !emailPattern.test(emailInput.value)) {
        event.preventDefault()
        subscribeWrapper.classList.add('er')
      }
    })
  }

  if (subscribeBtnFooter) {
    subscribeBtnFooter.addEventListener('click', function() {
      subscribePopup.classList.add('active')
    })
  }
  
  if (closeSubscribePopup) {
    closeSubscribePopup.addEventListener('click', function() {
      subscribePopup.classList.remove('active')
    })
  }

  let itemToDelete = null

  if (deleteButtons) {
    deleteButtons.forEach(button => {
      button.addEventListener('click', function() {
        deletePopup.classList.add('active')
        itemToDelete = this.closest('.order__wrapper-item')
      })
    })
  }

  if (closeDeletePopup) {
    closeDeletePopup.forEach(function(element) {
      element.addEventListener('click', function() {
        deletePopup.classList.remove('active')
        itemToDelete = null 
      })
    })
  }

  if (confirmDeleteButton) {
    confirmDeleteButton.addEventListener('click', function() {
      if (itemToDelete) {
        itemToDelete.remove()
        deletePopup.classList.remove('active')
        itemToDelete = null
      }
    })
  }

  if (promoBtn) {
    promoBtn.addEventListener('click', function() {
      const promoInput = document.querySelector('.order__container-right-promo input')
      const promoCode = promoInput.value.trim()
      const validPromoCode = '123'
    
      if (promoCode === validPromoCode) {
        promo.classList.add('done')
        promo.classList.remove('er')
      } else {
        promo.classList.remove('done')
        promo.classList.add('er')
      }
    })
  }

  if (orderHeaders) {
    orderHeaders.forEach((header, index) => {
      header.addEventListener('click', () => {
        orderLists.forEach((list, listIndex) => {
          if (listIndex !== index) {
            list.classList.remove('active')
            orderHeaders[listIndex].classList.remove('active')
          }
        })
    
        orderLists[index].classList.toggle('active')
        header.classList.toggle('active')
      })
    })
  }
  
  if (orderSizes) {
    orderSizes.forEach(size => {
      size.addEventListener('click', () => {
        const parent = size.closest('.order__wrapper-item-wrapper-sizes')
        const headerP = parent.querySelector('.order__wrapper-item-wrapper-sizes-header p')
        headerP.textContent = size.textContent
    
        parent.querySelector('.order__wrapper-item-wrapper-sizes-list').classList.remove('active')
        parent.querySelector('.order__wrapper-item-wrapper-sizes-header').classList.remove('active')
      })
    })
  }

  if (counters) {
    counters.forEach(container => {
      const minusButton = container.querySelector('.minus')
      const plusButton = container.querySelector('.plus')
      const counterElement = container.querySelector('.counter')
  
      let counter = parseInt(counterElement.textContent)
  
      function updateCounter(value) {
        counter = value
        counterElement.textContent = counter
      }
  
      minusButton.addEventListener('click', () => {
        if (counter > 1) {
          updateCounter(counter - 1)
        }
      })
  
      plusButton.addEventListener('click', () => {
        updateCounter(counter + 1)
      })
    })
  }

  if (sizesBtn) {
    sizesBtn.addEventListener('click', () => {
      sizesPopup.classList.toggle('active')
    })
  }

  if (tableBtns) {
    tableBtns.forEach((tableBtn, index) => {
      tableBtn.addEventListener('click', () => {
      tableBtns.forEach(h => h.classList.remove('active'))
      tableBtn.classList.add('active')

      tableBlocks.forEach(b => b.classList.remove('active'))
      tableBlocks[index].classList.add('active')
      })
    })
  }

  if (addToCart) {
    addToCart.addEventListener('click', () => {
 
      const sizes = document.querySelectorAll('.card__wrapper-info-sizes-wrapper span')
      const error = document.querySelector('.er')
      const header = document.querySelector('.card__wrapper-info-sizes-header')

      let hasActiveSize = false
      sizes.forEach(size => {
        if (size.classList.contains('active')) {
          hasActiveSize = true
          return
        }
      })

      if (hasActiveSize) {
        shopPopup.classList.add('active')
        error.classList.remove('active')
        header.classList.remove('active')
      } else {
        error.classList.add('active')
        header.classList.add('active')
      }
    })
  }

  if (closeShopPopup) {
    closeShopPopup.addEventListener('click', () => {
      shopPopup.classList.remove('active')
    })
  }

  if (tableBtn) {
    tableBtn.addEventListener('click', () => {
      tablePopup.classList.add('active')
    })
  }

  if (closeTablePopup) {
    closeTablePopup.addEventListener('click', () => {
      tablePopup.classList.remove('active')
    })
  }

  if (dolyameBtn) {
    dolyameBtn.addEventListener('click', () => {
      dolyamePopup.classList.add('active')
    })
  }

  if (closeDolyamePopup) {
    closeDolyamePopup.addEventListener('click', () => {
      dolyamePopup.classList.remove('active')
    })
  }

  if (filtersBtn) {
    filtersBtn.addEventListener('click', () => {
      filters.classList.add('active')
    })
  }

  if (closeFilters) {
    closeFilters.addEventListener('click', () => {
      filters.classList.remove('active')
    })
  }

  burger.addEventListener('click', () => {
    menu.classList.add('active')
  })

  close.addEventListener('click', () => {
    menu.classList.remove('active')
  })

  if (sizes){
    sizes.forEach(size => {
      size.addEventListener('click', () => {
        if (size.classList.contains('active')) {
          size.classList.remove('active')
        } else {
          sizes.forEach(size => size.classList.remove('active'))
          size.classList.add('active')
        }
      })
    })
  }

  cardColors.forEach(cardColor => {
    cardColor.addEventListener('click', () => {
      if (cardColor.classList.contains('active')) {
        cardColor.classList.remove('active')
      } else {
        cardColors.forEach(cardColor => cardColor.classList.remove('active'))
        cardColor.classList.add('active')
      }
    })
  })

  cardLikes.forEach(cardLike => {
    cardLike.addEventListener('click', () => {
      event.preventDefault()
      cardLike.classList.toggle('active')
    })
  })

  if (catalogTextBtn) {
    catalogTextBtn.addEventListener('click', () => {
      catalogTextBtn.classList.toggle('active')
  
      if (catalogTextBtn.classList.contains('active')) {
        const contentHeight = catalogText.scrollHeight + 'px'
        catalogText.style.height = contentHeight
        catalogText.style.opacity = '1'
      } else {
        catalogText.style.height = '0'
        catalogText.style.opacity = '0'
      }
    })
  }

  cardTabs.forEach(tab => {
    tab.addEventListener('click', () => {
      const content = tab.querySelector('.card__wrapper-info-tab-item-text')

      if (!tab.classList.contains('active')) {
        const contentHeight = content.scrollHeight + 'px' 
        content.style.height = contentHeight
        tab.classList.add('active')
      } else {
        content.style.height = '0'
        tab.classList.remove('active')
      }
    })
  })

  let isExpanded = false

  if (cardDescriptionBtn) {
    cardDescriptionBtn.addEventListener('click', () => {
      if (!isExpanded) {
        const contentHeight = cardDescription.scrollHeight + 'px'
        cardDescription.classList.add('active')
        cardDescription.style.height = contentHeight
        cardDescriptionBtn.textContent = 'Свернуть'
      } else {
        cardDescription.classList.remove('active')
        cardDescription.style.height = '45px'
        cardDescriptionBtn.textContent = 'Развернуть'
      }
      isExpanded = !isExpanded
    })
  }

  filterItemLis.forEach(filterItemLi => {
    filterItemLi.addEventListener('click', () => {
      filterItemLi.classList.toggle('active')
    })
  })

  filterItemRadios.forEach(filterItemRadio => {
    filterItemRadio.addEventListener('click', () => {
      filterItemRadios.forEach(item => item.classList.remove('active'))
      filterItemRadio.classList.add('active')
    })
  })

  if (filtersHeaderText) {
    filtersHeaderText.textContent = 'Фильтры'
  }

  function checkActiveFilters() {
    const hasActiveFilter = Array.from(filterItems).some(item => item.classList.contains('active'))

    if (hasActiveFilter && filtersBack) {
      filtersBack.classList.add('active') 
    } else {
      if (filtersBack) {
        filtersBack.classList.remove('active')
      }
      if (filtersHeaderText) {
        filtersHeaderText.textContent = 'Фильтры'
      }
    }
  }

  function updateFiltersHeaderText(text) {
    filtersHeaderText.textContent = text
  }

  filterItems.forEach(item => {
    const header = item.querySelector('.catalog__nav-filters-item-header')
    const headerText = header.querySelector('p').textContent

    header.addEventListener('click', (event) => {
      event.stopPropagation()
      const isActive = item.classList.contains('active')
      filterItems.forEach(el => el.classList.remove('active'))

      if (!isActive) {
        item.classList.add('active')
        updateFiltersHeaderText(headerText)
      } else {
        updateFiltersHeaderText('Фильтры')
      }
      checkActiveFilters()
    })

    const filters = item.querySelector('.catalog__nav-filters-item-filters')

    if (filters) {
      filters.addEventListener('click', (event) => {
        event.stopPropagation()
      })
    }

    const filterBtn = item.querySelector('.catalog__nav-filters-item-filters-btn')

    if (filterBtn) {
      filterBtn.addEventListener('click', (event) => {
        event.stopPropagation()
        item.classList.remove('active')
        checkActiveFilters()
      })
    }
  })

  document.addEventListener('click', (event) => {
    const clickedInsideFilter = Array.from(filterItems).some(item => item.contains(event.target))

    if (!clickedInsideFilter) {
      filterItems.forEach(item => item.classList.remove('active'))
      if (filtersHeaderText) {
        filtersHeaderText.textContent = 'Фильтры'
      }
      checkActiveFilters()
    }
  })
})

document.addEventListener('DOMContentLoaded', function() {

  const sdek = document.querySelector('.order__container-left-form-sdek'),
        courierRadio = document.querySelector('input[name="delivery"][value="courier"]'),
        pickupRadio = document.querySelector('input[name="delivery"][value="pickup"]'),
        addressFields = document.querySelectorAll(
          'input[name="street"], input[name="house-number"], input[name="flat-number"], input[name="index"]'
        ),
        submitButton = document.querySelector('.order__container-right-btn'),
        form = document.querySelector('.order__container-left-form'),
        onlinePaymentRadio = document.querySelector('input[name="payment"][value="online"]'),
        dolyamiPaymentRadio = document.querySelector('input[name="payment"][value="dolyami"]')

        let courierLabel = null
        if (courierRadio) {
          courierLabel = courierRadio.closest('.order__container-left-form-radio')
        }
        
        let pickupLabel = null
        if (pickupRadio) {
          pickupLabel = pickupRadio.closest('.order__container-left-form-radio')
        }
        
        let onlinePaymentLabel = null
        if (onlinePaymentRadio) {
          onlinePaymentLabel = onlinePaymentRadio.closest('.order__container-left-form-radio')
        }
        
        let dolyamiPaymentLabel = null
        if (dolyamiPaymentRadio) {
          dolyamiPaymentLabel = dolyamiPaymentRadio.closest('.order__container-left-form-radio')
        }

  function toggleAddressFields(show) {
    addressFields.forEach(function(field) {
      field.required = show
      field.closest('.order__container-left-form-col').style.display = show ? 'flex' : 'none'
    })
  }

  if (courierRadio) {
    courierRadio.addEventListener('change', function() {
      if (courierRadio.checked) {
        sdek.classList.remove('active')
        courierLabel.classList.add('active')
        pickupLabel.classList.remove('active')
        toggleAddressFields(true)
      }
    })
  }

  if (pickupRadio) {
    pickupRadio.addEventListener('change', function() {
      if (pickupRadio.checked) {
        sdek.classList.add('active')
        pickupLabel.classList.add('active')
        courierLabel.classList.remove('active')
        toggleAddressFields(false)
      }
    })

    if (pickupRadio.checked) {
      toggleAddressFields(false)
    } else {
      toggleAddressFields(true)
    }
  }

  function checkField(field) {
    const parent = field.closest('.order__container-left-form-col')
    if (field.required && parent.style.display !== 'none') {
      if (!field.value.trim()) {
        parent.classList.add('er')
        return false
      } else {
        parent.classList.remove('er')
        return true
      }
    }
    return true
  }

  function validateEmail(email) {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailPattern.test(email)
  }

  function validatePhone(phone) {
    const phonePattern = /^\+?[0-9]{10,15}$/
    return phonePattern.test(phone)
  }

  if (onlinePaymentRadio) {
    onlinePaymentRadio.addEventListener('change', function() {
      if (onlinePaymentRadio.checked) {
        onlinePaymentLabel.classList.add('active')
        dolyamiPaymentLabel.classList.remove('active')
      }
    })
  }

  if (dolyamiPaymentRadio) {
    dolyamiPaymentRadio.addEventListener('change', function() {
      if (dolyamiPaymentRadio.checked) {
        dolyamiPaymentLabel.classList.add('active')
        onlinePaymentLabel.classList.remove('active')
      }
    })
  }

  if (submitButton) {
    submitButton.addEventListener('click', function(event) {
      event.preventDefault()
      let isValid = true
    
      form.querySelectorAll('input[required]').forEach(function(input) {
        if (!checkField(input)) {
          isValid = false
        }
    
        if (input.name === 'email' && !validateEmail(input.value)) {
          input.closest('.order__container-left-form-col').classList.add('er')
          isValid = false
        } else if (input.name === 'email') {
          input.closest('.order__container-left-form-col').classList.remove('er')
        }
    
        if (input.name === 'phone' && !validatePhone(input.value)) {
          input.closest('.order__container-left-form-col').classList.add('er')
          isValid = false
        } else if (input.name === 'phone') {
          input.closest('.order__container-left-form-col').classList.remove('er')
        }
      })
    
      if (isValid) {
        window.location.href = 'order-done.html'
      }
    })
  }
})