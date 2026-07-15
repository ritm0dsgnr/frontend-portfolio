document.addEventListener('DOMContentLoaded', function () {

  const body = document.querySelector('body')

  const cookieBlock = document.querySelector('.cookie')
  if (cookieBlock) {
    const storageKey = 'cookieConsent'
    const closeBtn = cookieBlock.querySelector('.cookie__close')
    const hideCookie = () => {
      cookieBlock.remove()
      localStorage.setItem(storageKey, 'accepted')
    }
    if (localStorage.getItem(storageKey) === 'accepted') {
      cookieBlock.remove()
    } else if (closeBtn) {
      closeBtn.addEventListener('click', e => {
        e.preventDefault()
        hideCookie()
      })
    }
  }

  Fancybox.bind('[data-fancybox="gallery"]', {
    dragToClose: false,
    toolbar: false,
    closeButton: true,
    fullscreen: false,
    keyboard: true,
    zoom: true,
    protect: true,
    animated: true,
    showClass: 'fancybox-fadeIn',
    hideClass: 'fancybox-fadeOut',
    dragToClose: false,
    autoFocus: false,
    placeFocusBack: false,
    Thumbs: false,
    Carousel: {
  
      Dots: false,
      center: true
    },
    Images: {
      zoom: false
    },
    Toolbar: {
      display: false
    },
    Buttons: {
      show: false
    }
  })

  const validateEmail = (value) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(value).toLowerCase())
  const clearValidity = (input) => {
    input.removeAttribute('aria-invalid')
    input.classList.remove('is-invalid')
    const label = input.closest('label') || input.parentElement
    const err = label?.querySelector('.field-error')
    if (err) err.remove()
  }
  const setInvalid = (input, message) => {
    input.setAttribute('aria-invalid', 'true')
    input.classList.add('is-invalid')
    const form = input.closest('form')
    if (form) form.classList.add('has-errors')
    const label = input.closest('label') || input.parentElement
    if (label) {
      let err = label.querySelector('.field-error')
      if (!err) {
        err = document.createElement('span')
        err.className = 'field-error'
        input.after(err)
      }
      err.textContent = message || 'Неверно введено значение'
    }
  }

  document.addEventListener('input', (e) => {
    const input = e.target
    if (!(input instanceof HTMLInputElement)) return
    clearValidity(input)
  })

  document.querySelectorAll('.login__form').forEach(f => {
    f.setAttribute('novalidate', 'novalidate')
  })

  document.addEventListener('click', (e) => {
    const btn = e.target.closest('.login__form-btn')
    if (!btn) return
    const form = btn.closest('.login__form')
    if (!form) return
    e.preventDefault()

    const popup = form.closest('.lk__popup')
    const popupId = popup?.id || ''
    form.classList.remove('has-errors', 'validated')
    form.querySelectorAll('input').forEach(clearValidity)

    if (popupId === 'login' && form.id === 'loginForm') {
      const inputs = form.querySelectorAll('input')
      const loginInput = inputs[0]
      const passInput = inputs[1]
      let firstInvalid = null
      if (!loginInput.value.trim()) { setInvalid(loginInput, 'Введите логин'); firstInvalid = firstInvalid || loginInput }
      if (!passInput.value.trim()) { setInvalid(passInput, 'Введите пароль'); firstInvalid = firstInvalid || passInput }
      if (firstInvalid) { firstInvalid.focus(); return }
      form.classList.add('validated')
      window.location.href = btn.getAttribute('href') || '#'
      return
    }

    if (popupId === 'passowrd') {
      const emailInput = form.querySelector('input')
      let firstInvalid = null
      if (!emailInput.value.trim()) { setInvalid(emailInput, 'Введите email'); firstInvalid = emailInput }
      else if (!validateEmail(emailInput.value.trim())) { setInvalid(emailInput, 'Некорректный email'); firstInvalid = emailInput }
      if (firstInvalid) { firstInvalid.focus(); return }
      form.classList.add('validated')
      window.location.href = btn.getAttribute('href') || '#'
      return
    }

    if (popupId === 'login' && form.id === 'reg') {
      const email = form.querySelector('input[type="email"], input[name="email"], input[name="email_individual"]')
      const inputs = Array.from(form.querySelectorAll('input'))
      const passwordCandidates = inputs.filter(i => (i.placeholder || '').toLowerCase().includes('парол'))
      const pass1 = passwordCandidates[0]
      const pass2 = passwordCandidates[1]
      let firstInvalid = null
      if (!email || !email.value.trim()) { setInvalid(email || inputs[0], 'Введите email'); firstInvalid = firstInvalid || (email || inputs[0]) }
      else if (!validateEmail(email.value.trim())) { setInvalid(email, 'Некорректный email'); firstInvalid = firstInvalid || email }
      if (!pass1 || pass1.value.length < 6) { setInvalid(pass1 || inputs[1], 'Минимум 6 символов'); firstInvalid = firstInvalid || (pass1 || inputs[1]) }
      if (!pass2 || pass2.value.length < 6) { setInvalid(pass2 || inputs[2], 'Минимум 6 символов'); firstInvalid = firstInvalid || (pass2 || inputs[2]) }
      if (pass1 && pass2 && pass1.value !== pass2.value) { setInvalid(pass2, 'Пароли не совпадают'); firstInvalid = firstInvalid || pass2 }
      if (firstInvalid) { firstInvalid.focus(); return }
      form.classList.add('validated')
      window.location.href = btn.getAttribute('href') || '#'
      return
    }
  })

  document.addEventListener('click', (e) => {
    const span = e.target.closest('.inf__popup span')
    if (!span) return
    e.preventDefault()
    e.stopPropagation()

    const loginPopup = document.getElementById('login')
    const loginHeader = loginPopup?.querySelector('.login__header')
    const loginForm = loginPopup?.querySelector('#loginForm')
    const regForm = loginPopup?.querySelector('#reg')

    if (loginPopup && loginHeader && loginForm && regForm) {
      loginPopup.classList.add('active')
      const wantReg = /регист|register/i.test(span.textContent || '')
      const spans = loginHeader.querySelectorAll('span')
      spans.forEach(s => s.classList.remove('active'))
      if (wantReg) {
        loginForm.classList.remove('active')
        regForm.classList.add('active')
        spans[1]?.classList.add('active')
      } else {
        regForm.classList.remove('active')
        loginForm.classList.add('active')
        spans[0]?.classList.add('active')
      }
    }
  })
  
  new Swiper('.main__sliders-main', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    effect: 'fade',
    loop: true,
    autoplay: {
      delay: 3000,
      disableOnInteraction: false,
      pauseOnMouseEnter: true
    },
    navigation: {
      nextEl: '.main__sliders-nav-arrow.next',
      prevEl: '.main__sliders-nav-arrow.prev',
    },
  })

  new Swiper('.logos__slider', {
    slidesPerView: 3,
    slidesPerGroup: 1,
    spaceBetween: 15,
    navigation: {
      nextEl: '.logos__slider-nav-arrow.next',
      prevEl: '.logos__slider-nav-arrow.prev',
    },
    breakpoints: {
      1101: {
        slidesPerView: 3,
      },
      501: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 2,
      },
    }
  })

  new Swiper('.slider .swiper-container', {
    slidesPerView: 5,
    slidesPerGroup: 1,
    spaceBetween: 15,
    navigation: {
      nextEl: '.slider__header-nav-arrow.next',
      prevEl: '.slider__header-nav-arrow.prev',
    },
    breakpoints: {
      1101: {
        slidesPerView: 5,
      },
      501: {
        slidesPerView: 3,
      },
      320: {
        slidesPerView: 2,
      },
    }
  })

  new Swiper('.new .swiper-container', {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 15,
    navigation: {
      nextEl: '.slider__header-nav-arrow.next',
      prevEl: '.slider__header-nav-arrow.prev',
    },
    breakpoints: {
      1101: {
        slidesPerView: 4,
      },
      501: {
        slidesPerView: 3,
      },
      320: {
        slidesPerView: 1,
      },
    }
  })

  const galleryThumbs = new Swiper('.card__wrapper-gallery-th.swiper-container', {
    slidesPerView: 5,
    watchSlidesProgress: true,
    breakpoints: {
      501: {
        slidesPerView: 5,
      },
      320: {
        slidesPerView: 4,
      },
    },
  })

  new Swiper('.card__wrapper-gallery-main.swiper-container', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    navigation: {
      nextEl: '.card__wrapper-gallery-main-nav-arrow.next',
      prevEl: '.card__wrapper-gallery-main-nav-arrow.prev',
    },
    thumbs: {
      swiper: galleryThumbs,
    },
  })

  new Swiper('.video__slider.swiper-container', {
    slidesPerView: 4,
    slidesPerGroup: 1,
    spaceBetween: 15,
    navigation: {
      nextEl: '.video__slider-nav-arrow.next',
      prevEl: '.video__slider-nav-arrow.prev',
    },
    breakpoints: {
      1101: {
        slidesPerView: 4,
      },
      501: {
        slidesPerView: 2,
      },
      320: {
        slidesPerView: 1,
      },
    }
  })

  document.querySelectorAll('.text').forEach(container => {
    const shortText = container.querySelector('.text__wrapper:not(.full)')
    const fullText = container.querySelector('.text__wrapper.full')
    const btn = container.querySelector('.text__btn')

    if (!shortText || !fullText || !btn) return

    const update = expanded => {
      shortText.style.display = expanded ? 'none' : 'block'
      fullText.style.display = expanded ? 'block' : 'none'
      btn.textContent = expanded ? 'Свернуть' : 'Развернуть'
    }

    update(false)

    btn.addEventListener('click', () => {
      const isExpanded = getComputedStyle(fullText).display !== 'none'
      update(!isExpanded)
    })
  })

  const topButton = document.querySelector('.top')

  if (topButton) {
    window.addEventListener('scroll', function() {
      if (window.scrollY > window.innerHeight * 0.1) {
        topButton.classList.remove('hide')
      } else {
        topButton.classList.add('hide')
      }
    })
    topButton.addEventListener('click', function() {
      window.scrollTo({
        top: 0,
        behavior: 'smooth'
      })
    })
  }

  document.addEventListener('click', (e) => {
    const link = e.target.closest('.login__form-link')
    if (!link) return
    e.preventDefault()
    document.querySelectorAll('.lk__popup.active').forEach(p => p.classList.remove('active'))
    const popup = document.querySelector('#passowrd')
    if (popup) popup.classList.add('active')
  })

  document.addEventListener('click', (e) => {
    const closeBtn = e.target.closest('.closePopups, .lk__popup-w-back')
    if (closeBtn) {
      const popup = closeBtn.closest('.lk__popup')
      if (popup) popup.classList.remove('active')
      if (closeBtn.classList.contains('lk__popup-w-back') && popup && popup.id === 'passowrd') {
        document.querySelector('#login')?.classList.add('active')
      }
      e.preventDefault()
      return
    }

    const overlay = e.target.closest('.lk__popup')
    if (overlay && e.target === overlay) {
      overlay.classList.remove('active')
      e.preventDefault()
    }
  })

  document.querySelector('#bTel')?.addEventListener('click', () => {
    event.preventDefault()
    body.classList.add('lock')
    document.querySelector('#pTel')?.classList.add('active')
  })

  document.querySelector('.popup__wrapper-close')?.addEventListener('click', () => {
    body.classList.remove('lock')
    document.querySelector('.popup')?.classList.remove('active')
  })

  document.addEventListener('click', function(event) {
    const dropdownConfigs = [
      {
        containerSelector: '.list__cards-sort',
        dropdownSelector: '.list__cards-sort-dropdown'
      },
      {
        containerSelector: '.list__filters',
        dropdownSelector: '.list__filters-wrapper'
      }
    ]

    dropdownConfigs.forEach(({ containerSelector, dropdownSelector }) => {
      const container = document.querySelector(containerSelector)
      if (!container) return

      const dropdown = container.querySelector(dropdownSelector)
      if (!dropdown) return

      if (container.contains(event.target)) {
        if (!dropdown.contains(event.target)) {
          container.classList.toggle('active')
        }
      } else {
        container.classList.remove('active')
      }
    })
  })

  const filterBlocks = document.querySelectorAll('.list__filters-wrapper-item')

  if (filterBlocks) {
    filterBlocks.forEach(block => {
      const toggleBtn = block.querySelector('.list__filters-wrapper-item-btn')
      const extraFilters = block.querySelector('.extra-filters')
  
      if (toggleBtn && extraFilters) {
        toggleBtn.addEventListener('click', function (e) {
          e.preventDefault()
          extraFilters.classList.toggle('hidden')
          toggleBtn.textContent = extraFilters.classList.contains('hidden') ? 'Показать еще' : 'Скрыть'
        })
      }
    })
  }

  const globalShowMore = document.querySelector('.show-more')
  const customCheckboxLabels = Array.from(document.querySelectorAll('.list__filters-wrapper-item label.custom-checkbox'))

  const getInput = label => label.querySelector('input[type="checkbox"]')

  const placeButtonToLatestCheckedLabel = () => {
    if (!globalShowMore) return
    const checkedLabels = customCheckboxLabels.filter(label => getInput(label)?.checked)
    if (checkedLabels.length === 0) {
      globalShowMore.style.display = 'none'
      return
    }
    const target = checkedLabels.sort((a, b) => (+(b.dataset.lastChanged || 0)) - (+(a.dataset.lastChanged || 0)))[0]
    target.appendChild(globalShowMore)
    globalShowMore.style.display = 'inline-flex'
  }

  customCheckboxLabels.forEach(label => {
    const cb = getInput(label)
    if (!cb) return
    cb.addEventListener('change', e => {
      if (e.target.checked) label.dataset.lastChanged = Date.now().toString()
      placeButtonToLatestCheckedLabel()
    })
  })

  placeButtonToLatestCheckedLabel()
  
  const counters = document.querySelectorAll('.card__wrapper-info-bottom-count-calc')
 
  counters.forEach(counter => {
    const minusBtn = counter.querySelector('.calc-minus')
    const plusBtn = counter.querySelector('.calc-plus')
    const valueSpan = counter.querySelector('.calc-value')
    const priceElement = counter.closest('.card__wrapper-info-bottom')?.querySelector('.card__wrapper-info-bottom-price-text span:last-child')
    
    if (!minusBtn || !plusBtn || !valueSpan || !priceElement) return
    
    const basePrice = parseInt(priceElement.textContent)
    let count = parseInt(valueSpan.textContent)

    const updatePrice = () => {
      priceElement.textContent = basePrice * count
    }

    minusBtn.addEventListener('click', () => {
      if (count > 1) {
        count--
        valueSpan.textContent = count
        updatePrice()
      }
    })

    plusBtn.addEventListener('click', () => {
      count++
      valueSpan.textContent = count
      updatePrice()
    })
  })

  const orderForm = document.querySelector('#order-form')
  if (orderForm) {
    orderForm.setAttribute('novalidate', 'novalidate')
    orderForm.classList.remove('was-validated')
    const stripErrClasses = () => {
      orderForm.querySelectorAll('.err').forEach((el) => el.classList.remove('err'))
    }

    orderForm.querySelectorAll('input, textarea').forEach((el) => {
      el.classList.remove('is-invalid')
      el.classList.remove('err')
      const label = el.closest('label')
      const err = label?.querySelector('.er')
      if (err) { err.classList.add('hidden'); err.style.display = 'none' }
    })
    stripErrClasses()
    const mo = new MutationObserver(() => stripErrClasses())
    mo.observe(orderForm, { childList: true, subtree: true })
    orderForm.querySelectorAll('.er').forEach(err => { err.classList.add('hidden'); err.style.display = 'none' })

    const isVisible = (el) => !el.closest('.hidden')
    const isEmailValid = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase())
    const digits = (v) => (v || '').replace(/\D+/g, '')
    const isPhoneValid = (v) => digits(v).length >= 10
    const validateInput = (input) => {
      const label = input.closest('label')
      if (!label) return
      const err = label.querySelector('.er')
      if (!err) return
      if (!isVisible(input)) { err.classList.add('hidden'); err.style.display = 'none'; input.classList.remove('is-invalid'); return }
      let valid = true
      const val = input.value.trim()
      if (input.type === 'email') valid = isEmailValid(val)
      else if (input.id === 'phone1' || input.id === 'phone2' || input.name?.includes('phone')) valid = isPhoneValid(val)
      else if (input.hasAttribute('required')) valid = val.length > 0
      if (valid) { err.classList.add('hidden'); err.style.display = 'none'; input.classList.remove('is-invalid') }
      else { err.textContent = 'Неверно введено значение'; err.classList.remove('hidden'); err.style.display = 'block'; input.classList.add('is-invalid') }
    }

    orderForm.querySelectorAll('input, textarea').forEach((el) => {
      el.addEventListener('input', () => {
        if (orderForm.classList.contains('was-validated')) validateInput(el)
      })
      el.addEventListener('blur', () => {
        if (orderForm.classList.contains('was-validated')) validateInput(el)
      })
    })

    const validateAllVisible = () => {
      orderForm.querySelectorAll('input, textarea').forEach((el) => validateInput(el))
    }

    orderForm.addEventListener('click', (e) => {
      const btn = e.target.closest('.order__btn')
      if (!btn) return
      orderForm.classList.add('was-validated')
      validateAllVisible()
      if (btn.closest('#final-submit')) {
        showPaymentSection()
        return
      }
    })

    orderForm.addEventListener('change', (e) => {
      const target = e.target
      if (!(target instanceof HTMLInputElement)) return
      if (target.name === 'personType') {
        const individual = target.value === 'individual'
        document.getElementById('individual-fields')?.classList.toggle('hidden', !individual)
        document.getElementById('company-fields')?.classList.toggle('hidden', individual)
        if (orderForm.classList.contains('was-validated')) {
          orderForm.querySelectorAll('input, textarea').forEach((el) => validateInput(el))
        }
      }
    })
  }

  const buttons = document.querySelectorAll('.tabs__header-btn')
  const contents = document.querySelectorAll('.tabs__content')
  const dropdownHeader = document.querySelector('.tabs__dropdown-header')
  const dropdownList = document.querySelector('.tabs__dropdown-list')
  const dropdownItems = document.querySelectorAll('.tabs__dropdown-list li')

  if (buttons) {
    function activateTab(tabId, tabText = null) {
      buttons.forEach(btn => btn.classList.remove('active'))
      contents.forEach(content => content.classList.remove('active'))

      const activeButton = document.querySelector(`.tabs__header-btn[data-tab="${tabId}"]`)
      const activeContent = document.getElementById(tabId)
    
      if (activeButton) activeButton.classList.add('active')
      if (activeContent) activeContent.classList.add('active')

      if (tabText && dropdownHeader) {
        dropdownHeader.querySelector('p').textContent = tabText
      }

      if (dropdownList) dropdownList.classList.remove('open')
      if (dropdownHeader) dropdownHeader.classList.remove('active')
      if (dropdownList) dropdownList.classList.remove('active')
    }

    buttons.forEach(button => {
      button.addEventListener('click', () => {
        const tabId = button.getAttribute('data-tab')
        activateTab(tabId, button.textContent)
      })
    })

    if (dropdownHeader) {
        dropdownHeader.addEventListener('click', () => {
          dropdownHeader.classList.toggle('active')
          dropdownList.classList.toggle('active')
        })
      
      dropdownItems.forEach(item => {
        item.addEventListener('click', () => {
          const tabId = item.getAttribute('data-tab')
          const tabText = item.textContent
          activateTab(tabId, tabText)
        })
      })

      document.addEventListener('click', (e) => {
        if (!dropdownHeader.contains(e.target) && !dropdownList.contains(e.target)) {
          dropdownHeader.classList.remove('active')
          dropdownList.classList.remove('active')
        }
      })
    }
  }

  const navDropdownMain = document.querySelector('.header__wrapper-nav-dropdown-header')

  if (navDropdownMain) {
    const navDropdownList = document.querySelector('.header__wrapper-nav-dropdown-list')

    navDropdownMain.addEventListener('click', function() {
      navDropdownList.classList.toggle('active')
      navDropdownMain.classList.toggle('active')
    })

    const navDropdownDropdowns = document.querySelectorAll('.header__wrapper-nav-dropdown-list-dropdown-header')

    navDropdownDropdowns.forEach(header => {
      header.addEventListener('click', function(e) {
        e.stopPropagation()
        const dropdownList = this.nextElementSibling
        dropdownList.classList.toggle('active')
        header.classList.toggle('active')
      })
    })
  }

  const getSlideCalcValue = (calc) => calc?.querySelector('span:not(.minus):not(.plus)')

  document.addEventListener('click', e => {
    const btn = e.target
    if (!btn || (!btn.classList.contains('minus') && !btn.classList.contains('plus'))) return
    const calc = btn.closest('.slider__slide-h-calc')
    if (!calc) return
    const valueEl = getSlideCalcValue(calc)
    if (!valueEl) return
    const current = parseInt(valueEl.textContent.trim(), 10) || 0
    const next = btn.classList.contains('minus') ? Math.max(1, current - 1) : current + 1
    valueEl.textContent = next
  })

  const slides = document.querySelectorAll('.slider__slide')
  const marginStore = new WeakMap()
  const captureMargin = (content) => {
    const slide = content.closest('.slider__slide')
    if (!slide || slide.matches(':hover')) return marginStore.get(content)
    const value = getComputedStyle(content).marginTop
    marginStore.set(content, value)
    return value
  }
  const updateMargins = () => {
    slides.forEach(slide => {
      const content = slide.querySelector('.slider__slide-w')
      if (!content) return
      captureMargin(content)
    })
  }
  updateMargins()
  window.addEventListener('resize', updateMargins)
  const observer = 'ResizeObserver' in window ? new ResizeObserver(entries => {
    entries.forEach(entry => {
      const slide = entry.target.closest('.slider__slide')
      if (!slide || slide.matches(':hover')) return
      const content = slide.querySelector('.slider__slide-w')
      if (content) captureMargin(content)
    })
  }) : null
  slides.forEach(slide => {
    const content = slide.querySelector('.slider__slide-w')
    if (!content) return
    let resetTimer = null
    if (observer) {
      observer.observe(slide)
      observer.observe(content)
    }
    slide.addEventListener('mouseenter', () => {
      if (resetTimer) {
        clearTimeout(resetTimer)
        resetTimer = null
      }
      const stored = marginStore.get(content) || captureMargin(content)
      if (stored) content.style.marginTop = stored
    })
    slide.addEventListener('mouseleave', () => {
      resetTimer = window.setTimeout(() => {
        content.style.marginTop = ''
        captureMargin(content)
        resetTimer = null
      }, 300)
    })
  })

  const headerPopup = document.querySelector('.header__nav-popup')
  document.addEventListener('click', e => {
    const openBtn = e.target.closest('.slider__slide-h-shop')
    if (openBtn && headerPopup) {
      e.preventDefault()
      headerPopup.classList.add('active')
      return
    }
    const closeBtn = e.target.closest('.header__nav-popup-close, .header__nav-popup-btns .cls')
    if (closeBtn && headerPopup) {
      e.preventDefault()
      headerPopup.classList.remove('active')
    }
  })

  const likes = document.querySelectorAll('.slider__slide-header-like')

  if (likes) {
    likes.forEach(like => {
      like.addEventListener('click', () => {
        like.classList.toggle('active')
      })
    })
  }

  const shoppingCartBtn = document.querySelector('.card__wrapper-info-bottom-price-btn')
  const shoppingCartPopup = document.querySelector('.shopping__cart__popup')
  const shoppingCartClose = document.querySelector('.shopping__cart__popup-wrapper-close')

  if (shoppingCartBtn && shoppingCartPopup && shoppingCartClose) {
    shoppingCartBtn.addEventListener('click', function() {
      event.preventDefault()
      shoppingCartPopup.classList.add('active')
      body.classList.add('lock')
    })
  
    shoppingCartClose.addEventListener('click', function() {
      event.preventDefault()
      shoppingCartPopup.classList.remove('active')
      body.classList.remove('lock')
    })
  }

  const wishlistPopup = document.querySelector('.wishlist__popup')
  if (wishlistPopup) {
    document.addEventListener('click', e => {
      const openBtn = e.target.closest('[data-open="wishlist-popup"], .wishlist__open')
      if (openBtn) {
        e.preventDefault()
        wishlistPopup.classList.add('active')
        body.classList.add('lock')
        return
      }
      const closeBtn = e.target.closest('.wishlist__popup-wrapper-close, .wishlist__popup-wrapper-btn')
      if (closeBtn) {
        e.preventDefault()
        wishlistPopup.classList.remove('active')
        body.classList.remove('lock')
        return
      }
      if (e.target === wishlistPopup) {
        wishlistPopup.classList.remove('active')
        body.classList.remove('lock')
      }
    })
  }

  document.querySelectorAll('.buy__items-item-header').forEach(header => {
    header.addEventListener('click', () => {
      const item = header.closest('.buy__items-item')
      item.classList.toggle('active')
    })
  })

  const popupsClose = document.querySelectorAll('.closePopups')
  const popups = document.querySelectorAll('.lk__popup')
  const cancelOrderBtns = document.querySelectorAll('.lk__wrapper-info-item-col-btns-btn.cancel, .lk__wrapper-info-dropdown-bottom-btns-btn.def')
  const cancelOrder = document.getElementById('cancelOrder')
  const login = document.getElementById('login')
  const loginBtn = document.getElementById('loginBtn')

  if (loginBtn) {
    loginBtn.addEventListener('click', () => {
      event.preventDefault()
      login.classList.add('active')
    })
  }

  if (cancelOrderBtns) {
    cancelOrderBtns.forEach(cancelOrderBtn => {
      cancelOrderBtn.addEventListener('click', () => {
        event.preventDefault()
        cancelOrder.classList.add('active')
      })
    })
  }

  if (popupsClose) {
    popupsClose.forEach(close => {
      close.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const popup = close.closest('.lk__popup')
        if (popup) {
          popup.classList.remove('active')
        }
      })
    })
  }

  const burger = document.querySelector('.header__wrapper-icons-icon.menu')
  const navMobile = document.querySelector('.header__wrapper-nav')

  if (burger && navMobile) {
    burger.addEventListener('click', function() {
      event.preventDefault()
      navMobile.classList.toggle('active')
      burger.classList.toggle('active')
    })
  }
  
  const popupClose = document.querySelector('.popup__video-wrapper-close')

  if (popupClose) {
    const videoItems = document.querySelectorAll('.video__slider-item-cover video')
    const popupVideo = document.querySelector('.popup__video')
    const popupVideoElement = document.querySelector('.popup__video video')
    
    if (popupVideo && popupVideoElement) {
      videoItems.forEach(item => {
        item.addEventListener('click', function(event) {
          event.preventDefault() 
          const videoSrc = item.querySelector('source')?.getAttribute('src')
          if (videoSrc) {
            body.classList.add('lock')
            popupVideo.classList.add('active')
            popupVideoElement.querySelector('source')?.setAttribute('src', videoSrc)
            popupVideoElement.load() 
          }
        })
      })
    
      popupClose.addEventListener('click', function() {
        body.classList.remove('lock')
        popupVideo.classList.remove('active')
        popupVideoElement.querySelector('source')?.setAttribute('src', '')
        popupVideoElement.load()
      })

      window.addEventListener('click', function(event) {
        if (event.target === popupVideo) {
          body.classList.remove('lock')
          popupVideo.classList.remove('active')
          popupVideoElement.querySelector('source')?.setAttribute('src', '')
          popupVideoElement.load() 
        }
      })
    }
  }

  const orderInfo = document.querySelector('.order__info')
  if (orderInfo) {
    const orderHeader = orderInfo.querySelector('.order__info-header')
    
    function toggleOrderInfo() {
      if (window.innerWidth <= 1000) {
        orderInfo.classList.toggle('active')
      }
    }

    orderHeader.addEventListener('click', toggleOrderInfo)

    window.addEventListener('resize', () => {
      if (window.innerWidth > 1000) {
        orderInfo.classList.remove('active')
      }
    })
  }

  document.querySelectorAll('.order__dropdown').forEach(dropdown => {
    const header = dropdown.querySelector('.order__dropdown-header')
    const list = dropdown.querySelector('.order__dropdown-list')
    const items = list.querySelectorAll('li')
    const headerText = header.querySelector('p')

    header.addEventListener('click', function(e) {
      e.stopPropagation()
      document.querySelectorAll('.order__dropdown').forEach(otherDropdown => {
        if (otherDropdown !== dropdown) {
          otherDropdown.querySelector('.order__dropdown-header').classList.remove('active')
          otherDropdown.querySelector('.order__dropdown-list').classList.remove('active')
        }
      })

      header.classList.toggle('active')
      list.classList.toggle('active')
    })

    items.forEach(item => {
      item.addEventListener('click', function(e) {
        e.stopPropagation()
        items.forEach(i => i.classList.remove('active'))
        this.classList.add('active')
        headerText.textContent = this.textContent.trim()
        header.classList.remove('active')
        list.classList.remove('active')
        
        if (dropdown.id === 'facade-type-dropdown') {
          const materialField = document.getElementById('material-field')
          if (materialField) {
            if (this.textContent.includes('Глухой')) {
              materialField.classList.remove('conf__nav-items--hidden')
            } else {
              materialField.classList.add('conf__nav-items--hidden')
            }
          }
        }
      })
    })

    document.addEventListener('click', function(e) {
      if (!dropdown.contains(e.target)) {
        header.classList.remove('active')
        list.classList.remove('active')
      }
    })
  })

  const orderItems = document.querySelectorAll('.lk__wrapper-info-i')

  orderItems.forEach(function (orderItem) {
    const arrow = orderItem.querySelector('.lk__wrapper-info-item-col-arrow')
    const dropdown = orderItem.querySelector('.lk__wrapper-info-dropdown')

    arrow.addEventListener('click', function () {
      dropdown.classList.toggle('active')
      arrow.classList.toggle('active')
    })
  })

  const imageWrappers = document.querySelectorAll('.card__wrapper-gallery-main .swiper-slide')
  const zoomBlock = document.querySelector('.card__wrapper-gallery-zoom')
  
  if (zoomBlock) {
    const selectionArea = document.createElement('div')
    selectionArea.className = 'selection-area'
    document.body.appendChild(selectionArea)
    
    imageWrappers.forEach(wrapper => {
      const img = wrapper.querySelector('img')
      
      wrapper.addEventListener('mouseenter', () => {
        if (img) {
          const clone = img.cloneNode()
          zoomBlock.innerHTML = ''
          zoomBlock.appendChild(clone)
          zoomBlock.style.display = 'block'
          selectionArea.style.display = 'block'
        }
      })
    
      wrapper.addEventListener('mousemove', e => {
        if (img) {
          const rect = wrapper.getBoundingClientRect()
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          
          const areaSize = 100
          const maxX = rect.width - areaSize
          const maxY = rect.height - areaSize
          
          const left = Math.min(Math.max(0, x - areaSize/2), maxX)
          const top = Math.min(Math.max(0, y - areaSize/2), maxY)
          
          selectionArea.style.left = `${rect.left + left}px`
          selectionArea.style.top = `${rect.top + top}px`
          
          const zoomImg = zoomBlock.querySelector('img')
          if (zoomImg) {
            const percentX = (x / rect.width) * 100
            const percentY = (y / rect.height) * 100
            zoomImg.style.transformOrigin = `${percentX}% ${percentY}%`
            zoomImg.style.transform = 'scale(2)'
          }
        }
      })
    
      wrapper.addEventListener('mouseleave', () => {
        zoomBlock.innerHTML = ''
        zoomBlock.style.display = 'none'
        selectionArea.style.display = 'none'
      })
    })
  }

  ymaps.ready(() => {
    const maps = [
      {
        id: 'map1',
        center: [55.761999, 37.617734]
      },
      {
        id: 'map2',
        center: [55.751999, 37.617734]
      }
    ]

    maps.forEach(({ id, center }) => {
      const mapElement = document.getElementById(id)
      if (!mapElement) return
      
      const map = new ymaps.Map(id, {
        center,
        zoom: 16,
        controls: []
      })

      const placemark = new ymaps.Placemark(center, {}, {
        preset: 'islands#redHomeIcon'
      })

      map.geoObjects.add(placemark)
    })
  })
  
  const loginHeader = document.querySelector('.login__header')

  if (loginHeader) {
    const loginForm = document.getElementById('loginForm')
    const regForm = document.getElementById('reg')
    const loginPopup = document.getElementById('login')

    if (loginPopup && loginForm && regForm) {
      loginPopup.addEventListener('click', e => {
        if (e.target === loginPopup) {
          loginPopup.classList.remove('active')
        }
      })

      loginHeader.addEventListener('click', e => {
        if (e.target.tagName === 'SPAN') {
          e.stopPropagation()
          const spans = loginHeader.querySelectorAll('span')
          spans.forEach(span => span.classList.remove('active'))
          e.target.classList.add('active')
          
          if (e.target.textContent.trim() === 'Вход') {
            loginForm.classList.add('active')
            regForm.classList.remove('active')
          } else {
            loginForm.classList.remove('active')
            regForm.classList.add('active')
          }
        }
      })
    }
  }

  const forgotEmail = document.getElementById('forgotEmail')
  if (forgotEmail) {
    const enableInput = () => {
      if (forgotEmail.hasAttribute('readonly')) forgotEmail.removeAttribute('readonly')
      const randomSuffix = Date.now().toString(36)
      forgotEmail.setAttribute('aria-autocomplete', 'none')
      forgotEmail.setAttribute('autocorrect', 'off')
      forgotEmail.setAttribute('autocomplete', 'off')
      forgotEmail.setAttribute('name', `user_email_${randomSuffix}`)
      try {
        forgotEmail.setAttribute('type', 'text')
        setTimeout(() => {
          forgotEmail.setAttribute('type', 'email')
        }, 50)
      } catch (e) { /* no-op */ }
    }
    forgotEmail.addEventListener('focus', enableInput)
    const popup = forgotEmail.closest('#passowrd')
    if (popup) {
      popup.addEventListener('keydown', enableInput, { once: true })
    }
  }

  const searchInput = document.querySelector('.header__wrapper-search input')
  if (searchInput) {
    const searchResults = document.querySelector('.header__wrapper-search-results')

    if (searchResults) {
      searchInput.addEventListener('input', e => {
        const query = e.target.value.trim()
        searchResults.classList.toggle('active', query.length > 0)
      })
    
      document.addEventListener('click', e => {
        if (!e.target.closest('.header__wrapper-search')) {
          searchResults.classList.remove('active')
        }
      })
    }
  }

  const priceText = document.querySelector('.card__wrapper-info-bottom-price-text')

  if (priceText) {
    const priceFrom = priceText.querySelector('.h')
    const checkboxes = document.querySelectorAll('input[name="type"]')
  
    if (priceFrom && checkboxes.length > 0) {
      checkboxes.forEach(checkbox => {
        checkbox.addEventListener('change', () => {
          if (checkbox.checked) {
            priceFrom.style.display = 'none'
          } else {
            priceFrom.style.display = 'inline'
          }
        })
      })
    }
  }

  const confNavBtn = document.querySelector('.conf__nav-btn')
  const confItems = document.querySelector('.conf__items')

  if (confNavBtn && confItems) {
    confNavBtn.addEventListener('click', (e) => {
      e.preventDefault()
      const offset = 160
      const elementPosition = confItems.getBoundingClientRect().top + window.pageYOffset
      window.scrollTo({
        top: elementPosition - offset,
        behavior: 'smooth'
      })
    })
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const personTypeRadios = document.querySelectorAll('input[name="personType"]')
  const individualFields = document.getElementById('individual-fields')
  const companyFields = document.getElementById('company-fields')
  const nextButton = document.getElementById('next-button')
  const buyerSection = document.getElementById('buyer-section')
  if (buyerSection) {
    const buyerHeader = buyerSection.querySelector('.order__form-header')
    const buyerDropdown = buyerSection.querySelector('.order__form-dropdown')
    const shippingSelection = document.getElementById('shipping-selection')
    const deliveryFields = document.getElementById('delivery-fields')
    const paymentTrigger = document.getElementById('payment-trigger')
    const finalSubmit = document.getElementById('final-submit')
    const paymentSection = document.getElementById('payment-section')
    const shippingHeader = shippingSelection?.querySelector('.order__form-header')
    const shippingTitle = shippingSelection?.querySelector('.order__form-title')
    const shippingOptions = shippingSelection?.querySelector('.order__form-radio')
    const paymentTotals = document.querySelectorAll('.order__info-bottom[data-payment-only]')
    const showPaymentSection = () => {
      if (paymentSection) paymentSection.classList.remove('hidden')
      shippingSelection?.classList.add('no-options')
      shippingTitle?.classList.add('hidden')
      shippingOptions?.classList.add('hidden')
      shippingHeader?.classList.remove('active')
      shippingHeader?.classList.add('dropdown')
      paymentTotals.forEach(block => block.classList.remove('hidden'))
      toggleFields(deliveryFields, false)
    }
    if (paymentSection && !paymentSection.classList.contains('hidden')) {
      showPaymentSection()
    }

    const shippingRadios = document.getElementsByName('shippingType')

    const innerNextButton = buyerDropdown.querySelector('.order__btn')
    const secondHeader = buyerDropdown.querySelector('.order__form-header.def')

    Inputmask({ mask: "+7 (999) 999-99-99" }).mask("#phone1")
    Inputmask({ mask: "+7 (999) 999-99-99" }).mask("#phone2")
    Inputmask({ mask: "+7 (999) 999-99-99" }).mask("#receiverPhone")
    Inputmask({ mask: "99.99.9999" }).mask("#deliveryDate")

    function toggleFields(container, show) {
      if (!container) return
      container.classList.toggle('hidden', !show)
      const inputs = container.querySelectorAll('input, select, textarea')
      inputs.forEach(input => input.disabled = !show)
    }

    function isPhoneComplete(input) {
      return input.inputmask && input.inputmask.isComplete()
    }

    function validateRequiredFields(container, showErrors = true) {
      if (!container) return false
      
      const inputs = container.querySelectorAll('input[required], select[required], textarea[required]')
      let isValid = true
      
      inputs.forEach(input => {
        if (input.disabled || input.offsetParent === null) return
        
        let inputValid = true
        
        if (input.type === 'email') {
          inputValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value)
        } else if (input.type === 'tel') {
          inputValid = isPhoneComplete(input)
        } else if (input.id === 'phone1' || input.id === 'phone2' || (input.name && input.name.includes('phone'))) {
          inputValid = isPhoneComplete(input) || /\d{10,}/.test((input.value || '').replace(/\D+/g, ''))
        } else {
          inputValid = input.value.trim() !== ''
        }
        
        if (showErrors) {
          if (!inputValid) {
            input.classList.add('is-invalid')
            const label = input.closest('label')
            const err = label?.querySelector('.er')
            if (err) { err.classList.remove('hidden'); err.style.display = 'block' }
            isValid = false
          } else {
            input.classList.remove('is-invalid')
            const label = input.closest('label')
            const err = label?.querySelector('.er')
            if (err) { err.classList.add('hidden'); err.style.display = 'none' }
          }
        } else {
          if (!inputValid) {
            isValid = false
          }
        }
      })
      
      return isValid
    }

    function updateNextButtonState() {
      if (!nextButton) return
      nextButton.disabled = false
    }

    personTypeRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const isIndividual = radio.value === 'individual'
        toggleFields(individualFields, isIndividual)
        toggleFields(companyFields, !isIndividual)
        updateNextButtonState()
        if (orderForm.classList.contains('was-validated')) {
          const currentSection = isIndividual ? individualFields : companyFields
          validateRequiredFields(currentSection, true)
        }
      })
    })

    if (individualFields) {
      individualFields.addEventListener('input', updateNextButtonState)
    }
    if (companyFields) {
      companyFields.addEventListener('input', updateNextButtonState)
    }

    nextButton.addEventListener('click', (e) => {
      e.preventDefault()
      const formEl = document.getElementById('order-form')
      if (formEl) formEl.classList.add('was-validated')

      const selectedPersonType = document.querySelector('input[name="personType"]:checked')
      const isIndividual = selectedPersonType ? selectedPersonType.value === 'individual' : true
      const currentSection = isIndividual ? individualFields : companyFields

      const ok = validateRequiredFields(currentSection, true)
      if (!ok) { return }

      buyerDropdown.classList.add('hidden')
      buyerHeader.classList.add('dropdown')
      shippingSelection.classList.remove('hidden')
      paymentTrigger?.classList.remove('hidden')
    })

    buyerHeader.addEventListener('click', () => {
      const isCurrentlyHidden = buyerDropdown.classList.contains('hidden')
      buyerDropdown.classList.toggle('hidden')

      if (isCurrentlyHidden) {
        innerNextButton.classList.add('hidden')
        secondHeader.classList.add('hidden')
      } else {
        innerNextButton.classList.remove('hidden')
        secondHeader.classList.remove('hidden')
      }
    })

    shippingRadios.forEach(radio => {
      radio.addEventListener('change', () => {
        const isDelivery = radio.value === 'delivery'
        toggleFields(deliveryFields, isDelivery)
      })
    })

    if (personTypeRadios.length > 0 && !document.querySelector('input[name="personType"]:checked')) {
      personTypeRadios[0].checked = true
    }

    const activePersonType = document.querySelector('input[name="personType"]:checked')
    if (activePersonType) {
      const isIndividual = activePersonType.value === 'individual'
      toggleFields(individualFields, isIndividual)
      toggleFields(companyFields, !isIndividual)
    } else {
      toggleFields(individualFields, true)
      toggleFields(companyFields, false)
    }

    const checkedShipping = document.querySelector('input[name="shippingType"]:checked')
    toggleFields(deliveryFields, checkedShipping ? checkedShipping.value === 'delivery' : false)
    updateNextButtonState()
    if (nextButton) nextButton.disabled = false

    const orderForm = document.getElementById('order-form')
    if (orderForm) {
      orderForm.addEventListener('click', (e) => {
        const btn = e.target.closest('.order__btn')
        if (!btn) return
        orderForm.classList.add('was-validated')
        const visibleInputs = orderForm.querySelectorAll('input:not(.hidden input), select:not(.hidden select), textarea:not(.hidden textarea)')
        let allValid = true
        visibleInputs.forEach(input => {
          if (input.disabled || input.offsetParent === null) return
          let valid = true
          const val = (input.value || '').trim()
          if (input.type === 'email') valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val)
          else if (input.type === 'tel') valid = input.inputmask ? input.inputmask.isComplete() : val.length >= 10
          else if (input.required) valid = val.length > 0
          const label = input.closest('label')
          const err = label?.querySelector('.er')
          if (!valid) {
            input.classList.add('is-invalid')
            if (err) { err.classList.remove('hidden'); err.style.display = 'block' }
            allValid = false
          } else {
            input.classList.remove('is-invalid')
            if (err) { err.classList.add('hidden'); err.style.display = 'none' }
          }
        })
        if (btn.closest('#payment-trigger')) {
          if (allValid) {
            showPaymentSection()
            finalSubmit?.classList.remove('hidden')
            btn.closest('#payment-trigger')?.classList.add('hidden')
          }
          return
        }
        if (btn.closest('#final-submit') && allValid) {
          document.getElementById('thank-you-popup')?.classList.remove('hidden')
        }
      })
    }
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const fileInput = document.querySelector('input[type="file"][name="org_file"]')
  const fileNameElement = document.querySelector('.file-name')
  const fileDeleteElement = document.querySelector('.file-delete')
  const fileWrapper = document.querySelector('.file__w')
  const fileIcon = document.querySelector('.file-icon')

  if (fileInput && fileNameElement && fileDeleteElement && fileWrapper && fileIcon) {
    fileInput.addEventListener('change', function () {
      const file = fileInput.files[0]

      if (file) {
        fileNameElement.textContent = file.name
        fileIcon.src = 'img/file_2.svg'
        fileWrapper.classList.add('active')
        fileDeleteElement.classList.remove('hidden')
      } else {
        fileNameElement.textContent = 'Загрузить файл'
        fileIcon.src = 'img/file.svg'
        fileWrapper.classList.remove('active')
        fileDeleteElement.classList.add('hidden')
      }
    })

    fileDeleteElement.addEventListener('click', function () {
      fileInput.value = ''
      fileNameElement.textContent = 'Загрузить файл'
      fileIcon.src = 'img/file.svg'
      fileWrapper.classList.remove('active')
      fileDeleteElement.classList.add('hidden')
    })
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.lk__wrapper-info-form')
  if (!form) return

  form.setAttribute('novalidate', 'novalidate')

  const getDigits = (v) => (v || '').replace(/\D+/g, '')
  const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(String(v).toLowerCase())

  const ensureErrorEl = (input) => {
    const label = input.closest('label') || input.parentElement
    if (!label) return null
    let el = label.querySelector('.field-error')
    if (!el) {
      el = document.createElement('span')
      el.className = 'field-error'
      input.after(el)
    }
    return el
  }

  const showError = (input, msg) => {
    input.classList.add('is-invalid')
    const err = ensureErrorEl(input)
    if (err) {
      err.textContent = msg || 'Неверно введено значение'
      err.style.display = 'block'
    }
  }

  const hideError = (input) => {
    input.classList.remove('is-invalid')
    const label = input.closest('label') || input.parentElement
    const err = label?.querySelector('.field-error')
    if (err) err.style.display = 'none'
  }

  const validateField = (input) => {
    const val = (input.value || '').trim()
    let ok = true
    if (input.type === 'email') ok = isEmail(val)
    else if (input.name && input.name.includes('phone')) ok = getDigits(val).length >= 10
    else if (input.hasAttribute('required')) ok = val.length > 0
    if (ok) {
      hideError(input)
    } else {
      showError(input)
    }
    return ok
  }

  const inputs = form.querySelectorAll('input, textarea')
  inputs.forEach((el) => {
    el.addEventListener('input', () => {
      if (form.classList.contains('was-validated')) validateField(el)
    })
    el.addEventListener('blur', () => {
      if (form.classList.contains('was-validated')) validateField(el)
    })
  })

  form.addEventListener('submit', (e) => {
    e.preventDefault()
    form.classList.add('was-validated')

    let allValid = true
    inputs.forEach((el) => { if (!validateField(el)) allValid = false })

    const passNew = inputs[Array.from(inputs).findIndex(i => (i.placeholder || '').toLowerCase().includes('новый пароль') && i.tagName === 'INPUT')]
    const passRepeat = inputs[Array.from(inputs).findIndex(i => (i.placeholder || '').toLowerCase().includes('повтор') && i.tagName === 'INPUT')]
    if (passNew && passRepeat) {
      const v1 = passNew.value
      const v2 = passRepeat.value
      if (v1.length < 6) { showError(passNew, 'Минимум 6 символов'); allValid = false } else hideError(passNew)
      if (v2.length < 6 || v1 !== v2) { showError(passRepeat, 'Пароли не совпадают'); allValid = false } else hideError(passRepeat)
    }

    if (allValid) {
      form.submit()
    }
  })
})