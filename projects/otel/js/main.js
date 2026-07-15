(function () {
  'use strict'

  const runtimeConfig = window.StarterConfig || {}
  const FLAGS = {
    formClearOnSubmit: false,
    smoothScroll: false,
    debug: false,
    ...(runtimeConfig.FLAGS || {})
  }
  const APP_NAMESPACE = runtimeConfig.APP_NAMESPACE || 'StarterApp'
  let isInitialized = false
  let isDispatchingValidatedSubmit = false
  const beforeSubmitHooks = new WeakMap()

  const logDebug = (...args) => {
    if (!FLAGS.debug) return
    console.log('[starter]', ...args)
  }
  const setFieldError = (field, isError) => {
    field.classList.toggle('error', isError)
    const wrap = field.closest('[data-field-wrap]')
    if (wrap) wrap.classList.toggle('error', isError)
  }

  const validateRequired = (form) => {
    let valid = true
    const fields = form.querySelectorAll('[required]')
    fields.forEach((field) => {
      const isCheckbox = field.type === 'checkbox'
      const isEmpty = isCheckbox ? !field.checked : !field.value.trim()
      setFieldError(field, isEmpty)
      if (isEmpty) valid = false
    })
    return valid
  }
  const dispatchSubmit = (form) => {
    isDispatchingValidatedSubmit = true
    try {
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
    } finally {
      isDispatchingValidatedSubmit = false
    }
  }
  const runValidatedSubmit = async (form) => {
    if (!validateRequired(form)) return
    const onBeforeSubmit = beforeSubmitHooks.get(form)
    if (onBeforeSubmit && !(await onBeforeSubmit(form))) return
    dispatchSubmit(form)
    if (FLAGS.formClearOnSubmit) form.reset()
  }
  const bindForm = (form, options = {}) => {
    if (!form || form.dataset.jsBound === '1') return
    const submitBtn = form.querySelector('[data-submit]')
    if (!submitBtn) return
    if (typeof options.onBeforeSubmit === 'function') beforeSubmitHooks.set(form, options.onBeforeSubmit)
    form.dataset.jsBound = '1'
    submitBtn.addEventListener('click', (e) => {
      e.preventDefault()
      runValidatedSubmit(form)
    })
    form.addEventListener('submit', (e) => {
      if (isDispatchingValidatedSubmit) return
      e.preventDefault()
      runValidatedSubmit(form)
    })
  }
  const initForm = (formSelector, options = {}) => {
    const form = document.querySelector(formSelector)
    if (!form) return
    bindForm(form, options)
  }
  const setBeforeSubmitHook = (formSelector, onBeforeSubmit) => {
    const form = document.querySelector(formSelector)
    if (!form || typeof onBeforeSubmit !== 'function') return
    beforeSubmitHooks.set(form, onBeforeSubmit)
  }

  const initSmoothScroll = () => {
    if (!FLAGS.smoothScroll) return
    document.addEventListener('click', (e) => {
      const trigger = e.target.closest('[data-scroll-to]')
      if (!trigger) return
      const target = document.querySelector(trigger.dataset.scrollTo)
      if (!target) return
      e.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    })
  }

  const init = () => {
    if (isInitialized) return
    isInitialized = true
    initSmoothScroll()
    document.querySelectorAll('form[data-form]').forEach((form) => bindForm(form))
    logDebug('init complete', { flags: FLAGS })
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init, { once: true })
  } else {
    init()
  }

  window[APP_NAMESPACE] = {
    ...(window[APP_NAMESPACE] || {}),
    init,
    initForm,
    validateRequired,
    dispatchSubmit,
    setBeforeSubmitHook,
    FLAGS
  }
})();

(function () {
  'use strict'

  const menu = document.getElementById('mobile-menu')
  const burger = document.querySelector('.header__wrapper-burger')
  if (!menu || !burger) return

  const closeBtn = menu.querySelector('.mobile-menu__close')
  const links = menu.querySelectorAll('.mobile-menu__nav a')

  const setOpen = (open) => {
    menu.classList.toggle('is-open', open)
    menu.setAttribute('aria-hidden', open ? 'false' : 'true')
    burger.setAttribute('aria-expanded', open ? 'true' : 'false')
    document.body.classList.toggle('is-mobile-menu-open', open)
  }

  const open = () => setOpen(true)
  const close = () => setOpen(false)

  burger.setAttribute('aria-label', 'Открыть меню')
  burger.setAttribute('aria-expanded', 'false')
  burger.setAttribute('aria-controls', 'mobile-menu')

  burger.addEventListener('click', open)
  burger.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    open()
  })
  closeBtn?.addEventListener('click', close)
  closeBtn?.addEventListener('keydown', (e) => {
    if (e.key !== 'Enter' && e.key !== ' ') return
    e.preventDefault()
    close()
  })
  links.forEach((link) => link.addEventListener('click', close))

  const chatBtn = menu.querySelector('[data-question-open]')
  chatBtn?.addEventListener('click', close)

  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && menu.classList.contains('is-open')) close()
  })

  window.HotelMobileMenu = { open, close }
})();

(function () {
  'use strict'

  const initHeaderNav = () => {
    const dropdowns = [...document.querySelectorAll('[data-header-dropdown]')]
    if (!dropdowns.length) return

    const closeAll = () => {
      dropdowns.forEach((dropdown) => dropdown.classList.remove('is-open'))
    }

    dropdowns.forEach((dropdown) => {
      const trigger = dropdown.querySelector('[data-header-dropdown-trigger]')
      if (!trigger) return

      trigger.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const isOpen = dropdown.classList.contains('is-open')
        closeAll()
        if (!isOpen) dropdown.classList.add('is-open')
      })
    })

    document.addEventListener('click', closeAll)
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeAll()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeaderNav, { once: true })
  } else {
    initHeaderNav()
  }
})();

(function () {
  'use strict'
  if (typeof Lenis !== 'function') return
  if (document.querySelector('.main')) return
  if (document.body?.dataset.lenis === 'false' || document.documentElement.dataset.lenis === 'false') return

  const lenis = new Lenis({
    duration: 1.2,
    easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
    smoothWheel: true,
    smoothTouch: false,
    wheelMultiplier: 1,
    touchMultiplier: 1.2
  })

  const raf = (time) => {
    lenis.raf(time)
    requestAnimationFrame(raf)
  }
  requestAnimationFrame(raf)

  let resizeFrame = 0
  const resize = () => {
    if (resizeFrame) return
    resizeFrame = requestAnimationFrame(() => {
      resizeFrame = 0
      lenis.resize?.()
    })
  }

  if (typeof ResizeObserver !== 'undefined') {
    const observer = new ResizeObserver(resize)
    observer.observe(document.body)
  }

  if (typeof MutationObserver !== 'undefined') {
    const observer = new MutationObserver(resize)
    observer.observe(document.body, {
      childList: true,
      subtree: true,
      attributes: true,
      attributeFilter: ['style', 'class', 'hidden']
    })
  }

  window.addEventListener('load', resize)
  window.addEventListener('resize', resize)

  window.lenis = lenis
})();

(function () {
  'use strict'

  const root = document.querySelector('.rooms')
  if (!root) return

  const AMENITY_ICON_BASE = 'img/svg/'
  const AUTO_MS = 7500
  const SLIDE_IDS = [
    '0_51',
    '0_47',
    '0_40',
    '0_43',
    '0_37'
  ]

  const photoTrack = root.querySelector('.rooms__wrapper-photo-track')
  const photoImgs = photoTrack
    ? [...photoTrack.querySelectorAll('.rooms__wrapper-photo-img')]
    : []
  const title = root.querySelector('.rooms__wrapper-info-title')
  const price = root.querySelector('.rooms__wrapper-info-price')
  const desc = root.querySelector('.rooms__wrapper-info-desc')
  const portraitImgs = root.querySelectorAll('.rooms__wrapper-info-portrait-img')
  const amenities = root.querySelector('.rooms__wrapper-info-amenities')
  const dots = root.querySelector('.rooms__wrapper-info-dots')
  const btnPrev = root.querySelector('.rooms__wrapper-arrow--prev')
  const btnNext = root.querySelector('.rooms__wrapper-arrow--next')

  let index = 0
  let slideBusy = false
  let autoTimer = 0
  let isOpen = false
  let currentPhoto = { src: '', alt: '' }
  let currentAmenitiesKey = ''

  const catalog = () => window.HotelRooms || {}

  const amenitiesKey = (items) => items
    .map((item) => `${item.icon || ''}:${item.label || ''}`)
    .join('|')

  const normalize = (raw, fallbackTitle) => {
    if (!raw) {
      return {
        title: fallbackTitle || '',
        price: '',
        description: '',
        image: 'img/rooms/default.jpg',
        portrait: '',
        amenities: []
      }
    }
    const items = Array.isArray(raw.amenities) ? raw.amenities : []
    return {
      title: raw.title || fallbackTitle || '',
      price: raw.price || '',
      description: raw.description || raw.desc || '',
      image: raw.image || raw.photo || 'img/rooms/default.jpg',
      portrait: raw.portrait || '',
      amenities: items
    }
  }

  const preloadImage = (src) => new Promise((resolve) => {
    if (!src) {
      resolve()
      return
    }
    const img = new Image()
    img.onload = img.onerror = resolve
    img.src = src
  })

  const fillAmenities = (items) => {
    if (!amenities) return
    const key = amenitiesKey(items)
    if (key === currentAmenitiesKey) return
    currentAmenitiesKey = key
    amenities.replaceChildren()
    items.forEach((item) => {
      if (!item.icon) return
      const li = document.createElement('li')
      li.className = 'rooms__wrapper-info-amenities-item'
      if (item.label) li.title = item.label
      const img = document.createElement('img')
      img.src = AMENITY_ICON_BASE + item.icon + '.svg'
      img.alt = item.label || ''
      li.appendChild(img)
      amenities.appendChild(li)
    })
  }

  const fillSlideContent = (payload) => {
    if (title) title.textContent = payload.title
    if (price) price.textContent = payload.price
    if (desc) desc.textContent = payload.description
    portraitImgs.forEach((img) => {
      const portraitSrc = payload.portrait || ''
      if (img.getAttribute('src') !== portraitSrc) img.src = portraitSrc
      img.alt = payload.title
      img.hidden = !portraitSrc
    })
    fillAmenities(payload.amenities)
  }

  const setPhotoMeta = (img, src, alt, visible) => {
    if (!img) return
    const path = src || ''
    if (img.getAttribute('src') !== path) img.src = path
    img.alt = alt || ''
    if (visible) img.removeAttribute('aria-hidden')
    else img.setAttribute('aria-hidden', 'true')
  }

  const showPhoto = (src, alt) => {
    if (!photoImgs[0]) return
    setPhotoMeta(photoImgs[0], src, alt, true)
    if (photoImgs[1]) photoImgs[1].setAttribute('aria-hidden', 'true')
    if (photoTrack) {
      photoTrack.classList.add('is-reset')
      photoTrack.style.transform = 'translate3d(0, 0, 0)'
    }
    currentPhoto = { src, alt }
  }

  const fillSlide = (id) => {
    const payload = normalize(catalog()[id], id)
    fillSlideContent(payload)
    showPhoto(payload.image, payload.title)
  }

  const nextPaint = () => new Promise((resolve) => {
    requestAnimationFrame(resolve)
  })

  const waitTrackTransition = () => new Promise((resolve) => {
    if (!photoTrack) {
      resolve()
      return
    }

    const style = window.getComputedStyle(photoTrack)
    const duration = Math.max(
      ...style.transitionDuration.split(',').map((v) => parseFloat(v) || 0)
    ) * 1000

    if (!duration || style.transitionProperty === 'none') {
      resolve()
      return
    }

    let done = false
    const finish = () => {
      if (done) return
      done = true
      photoTrack.removeEventListener('transitionend', onEnd)
      clearTimeout(fallback)
      resolve()
    }

    const onEnd = (e) => {
      if (e.target !== photoTrack) return
      if (e.propertyName !== 'transform' && e.propertyName !== '-webkit-transform') return
      finish()
    }

    const fallback = window.setTimeout(finish, duration + 80)
    photoTrack.addEventListener('transitionend', onEnd)
  })

  const animatePhotoNext = async (payload) => {
    const src = payload.image
    const alt = payload.title || ''
    const prevPhoto = currentPhoto

    if (!photoTrack || photoImgs.length < 2) {
      showPhoto(src, alt)
      return
    }

    setPhotoMeta(photoImgs[0], prevPhoto.src, prevPhoto.alt, true)
    setPhotoMeta(photoImgs[1], src, alt, false)
    photoTrack.classList.add('is-reset')
    photoTrack.style.transform = 'translate3d(0, 0, 0)'
    void photoTrack.offsetWidth
    photoTrack.classList.remove('is-reset')
    await nextPaint()
    photoTrack.style.transform = 'translate3d(-50%, 0, 0)'
    await waitTrackTransition()
    showPhoto(src, alt)
  }

  const animatePhotoPrev = async (payload) => {
    const src = payload.image
    const alt = payload.title || ''
    const prevPhoto = currentPhoto

    if (!photoTrack || photoImgs.length < 2) {
      showPhoto(src, alt)
      return
    }

    setPhotoMeta(photoImgs[1], prevPhoto.src, prevPhoto.alt, false)
    photoTrack.classList.add('is-reset')
    photoTrack.style.transform = 'translate3d(-50%, 0, 0)'
    void photoTrack.offsetWidth
    setPhotoMeta(photoImgs[0], src, alt, true)
    photoTrack.classList.remove('is-reset')
    await nextPaint()
    photoTrack.style.transform = 'translate3d(0, 0, 0)'
    await waitTrackTransition()
    showPhoto(src, alt)
  }

  const animatePhoto = async (direction, payload) => {
    await preloadImage(payload.image)
    if (direction === 'prev') {
      await animatePhotoPrev(payload)
      return
    }
    await animatePhotoNext(payload)
  }

  const updateNav = () => {
    if (btnPrev) btnPrev.disabled = false
    if (btnNext) btnNext.disabled = false
    if (!dots) return
    dots.querySelectorAll('.rooms__wrapper-info-dots-item').forEach((btn, i) => {
      btn.classList.toggle('active', i === index)
    })
  }

  const scheduleAfterSlide = () => {
    clearTimeout(autoTimer)
    if (!isOpen || slideBusy) return

    autoTimer = window.setTimeout(() => {
      if (!isOpen || slideBusy) return
      const last = SLIDE_IDS.length - 1
      const nextIndex = index >= last ? 0 : index + 1
      goTo(nextIndex).then(() => scheduleAfterSlide())
    }, AUTO_MS)
  }

  const startAutoplay = () => {
    stopAutoplay()
    scheduleAfterSlide()
  }

  const stopAutoplay = () => {
    clearTimeout(autoTimer)
    autoTimer = 0
  }

  const goTo = (nextIndex) => {
    const total = SLIDE_IDS.length
    if (!total || slideBusy) return Promise.resolve()
    if (nextIndex < 0 || nextIndex >= total) return Promise.resolve()
    if (nextIndex === index) return Promise.resolve()

    const direction = nextIndex === 0 && index === total - 1
      ? 'next'
      : nextIndex === total - 1 && index === 0
        ? 'prev'
        : nextIndex > index
          ? 'next'
          : 'prev'
    const payload = normalize(catalog()[SLIDE_IDS[nextIndex]], SLIDE_IDS[nextIndex])

    slideBusy = true
    stopAutoplay()
    index = nextIndex

    fillSlideContent(payload)
    updateNav()

    return animatePhoto(direction, payload)
      .catch(() => {})
      .finally(() => {
        slideBusy = false
        scheduleAfterSlide()
      })
  }

  const buildDots = () => {
    if (!dots) return
    dots.replaceChildren()
    SLIDE_IDS.forEach((id, i) => {
      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'rooms__wrapper-info-dots-item'
      btn.setAttribute('aria-label', catalog()[id]?.title || ('Номер ' + (i + 1)))
      btn.addEventListener('click', () => {
        goTo(i).then(() => startAutoplay())
      })
      dots.appendChild(btn)
    })
    updateNav()
  }

  btnPrev?.addEventListener('click', () => {
    const last = SLIDE_IDS.length - 1
    const nextIndex = index <= 0 ? last : index - 1
    goTo(nextIndex).then(() => startAutoplay())
  })

  btnNext?.addEventListener('click', () => {
    const last = SLIDE_IDS.length - 1
    const nextIndex = index >= last ? 0 : index + 1
    goTo(nextIndex).then(() => startAutoplay())
  })

  buildDots()
  fillSlide(SLIDE_IDS[0])

  window.HotelRoomsSlider = {
    open: () => {
      isOpen = true
      index = 0
      slideBusy = false
      fillSlide(SLIDE_IDS[0])
      updateNav()
      startAutoplay()
    },
    resume: () => {
      isOpen = true
      slideBusy = false
      updateNav()
    },
    resumeFromCity: () => {
      isOpen = true
      slideBusy = false
      index = SLIDE_IDS.length - 1
      fillSlide(SLIDE_IDS[index])
      updateNav()
      stopAutoplay()
    },
    close: () => {
      isOpen = false
      stopAutoplay()
    },
    next: () => goTo(index + 1),
    prev: () => goTo(index - 1),
    goTo,
    startAutoplay,
    stopAutoplay,
    getIndex: () => index,
    getTotal: () => SLIDE_IDS.length,
    isBusy: () => slideBusy
  }
})();

(function () {
  'use strict'

  const root = document.querySelector('.main__map')
  if (!root) return

  const stage = root.querySelector('.main__map-stage')
  const frame = root.querySelector('.main__map-frame')
  const cover = root.querySelector('.main__map-cover')
  const mapBox = cover || frame
  const pointsRoot = root.querySelector('.main__map-points')
  const card = root.querySelector('.main__map-card')
  const cardImg = root.querySelector('.main__map-card-img')
  const cardTime = root.querySelector('.main__map-card-time')
  const cardText = root.querySelector('.main__map-card-text')
  const cardLink = root.querySelector('.main__map-card-link')
  const modal = document.querySelector('.main__map-modal')
  const modalBack = modal?.querySelector('.main__map-modal-back')
  const modalClose = modal?.querySelector('.main__map-modal-close')
  const modalPhoto = modal?.querySelector('.main__map-modal-photo-img')
  const modalTitle = modal?.querySelector('.main__map-modal-title')
  const modalText = modal?.querySelector('.main__map-modal-text')
  const modalContactText = modal?.querySelector('.main__map-modal-contact-text')
  const modalLink = modal?.querySelector('.main__map-modal-actions-link')
  const modalWrapper = modal?.querySelector('.main__map-modal-wrapper')
  const modalInfo = modal?.querySelector('.main__map-modal-info')

  const places = Array.isArray(window.HotelMapPlaces) ? window.HotelMapPlaces : []
  const MAP_SCROLL_MQ = window.matchMedia('(max-width: 640px)')
  const isMobileMap = () => MAP_SCROLL_MQ.matches
  const MOBILE_CARD_PIN_X = 0.22
  const MOBILE_CARD_PIN_Y = 0.28
  const MOBILE_MAP_DEFAULT_SCROLL = 0.56 // 0.5 = center; >0.5 shifts map left on screen
  const HINT_SCROLL_RATIO = 0.35
  const CARD_TRANSITION_MS = 550
  const CARD_SWAP_MS = 220
  const MODAL_SWIPE_CLOSE = 90
  const MODAL_SWIPE_MIN = 10
  const MODAL_DISMISS_MS = 420
  const MODAL_CLOSE_MS_MOBILE = 850
  const MODAL_CLOSE_FALLBACK_MS = 150
  let activeId = null
  let hideTimer = 0
  let hiddenTimer = 0
  let modalTouchStartY = 0
  let modalTouchStartX = 0
  let modalDragY = 0
  let modalDragging = false
  let modalDismissTimer = 0

  const hint = root.querySelector('.main__map-hint')
  const hintPrev = hint?.querySelector('.main__map-hint-arrow--prev')
  const hintNext = hint?.querySelector('.main__map-hint-arrow--next')

  const hintCanScroll = () => {
    if (!MAP_SCROLL_MQ.matches || !stage) return false
    return stage.scrollWidth > stage.clientWidth + 1
  }

  const updateHintArrows = () => {
    if (!hint || !hintPrev || !hintNext) return
    const can = hintCanScroll()
    hint.classList.toggle('is-scrollable', can)
    if (!can) {
      hintPrev.disabled = true
      hintNext.disabled = true
      return
    }
    const max = stage.scrollWidth - stage.clientWidth
    const sl = stage.scrollLeft
    hintPrev.disabled = sl <= 1
    hintNext.disabled = sl >= max - 1
  }

  const scrollHint = (dir) => {
    if (!stage || !hintCanScroll()) return
    stage.scrollBy({ left: dir * stage.clientWidth * HINT_SCROLL_RATIO, behavior: 'smooth' })
  }

  hintPrev?.addEventListener('click', (e) => {
    e.stopPropagation()
    scrollHint(-1)
  })
  hintNext?.addEventListener('click', (e) => {
    e.stopPropagation()
    scrollHint(1)
  })

  const centerStage = ({ animate = false, ratio = MOBILE_MAP_DEFAULT_SCROLL } = {}) => {
    if (!stage) return
    if (!MAP_SCROLL_MQ.matches) {
      stage.scrollLeft = 0
      updateHintArrows()
      return
    }
    if (stage.scrollWidth <= stage.clientWidth + 1) {
      stage.scrollLeft = 0
      updateHintArrows()
      return
    }
    const max = stage.scrollWidth - stage.clientWidth
    const target = max * ratio
    if (animate) {
      stage.scrollTo({ left: target, behavior: 'smooth' })
    } else {
      stage.scrollLeft = target
    }
    updateHintArrows()
  }

  const clearHideTimer = () => {
    clearTimeout(hideTimer)
    clearTimeout(hiddenTimer)
    hideTimer = 0
    hiddenTimer = 0
  }

  const syncActivePointLayer = (activeBtn = null) => {
    if (!mapBox || !pointsRoot) return
    root.querySelectorAll('.main__map-point').forEach((el) => {
      const parent = el === activeBtn ? mapBox : pointsRoot
      if (el.parentElement !== parent) parent.appendChild(el)
    })
  }

  const hideCard = () => {
    if (!card) return
    card.classList.remove('is-visible', 'is-swapping', 'main__map-card--layout-left', 'main__map-card--pin-bottom')
    hiddenTimer = window.setTimeout(() => {
      if (!card.classList.contains('is-visible')) card.hidden = true
    }, CARD_TRANSITION_MS)
    root.querySelectorAll('.main__map-point').forEach((btn) => {
      btn.classList.remove('is-active')
    })
    syncActivePointLayer(null)
    activeId = null
  }

  const scheduleHide = () => {
    clearHideTimer()
    hideTimer = window.setTimeout(hideCard, 120)
  }

  const positionCard = (btn, place) => {
    if (!card || !mapBox || !btn) return

    const mapRect = mapBox.getBoundingClientRect()
    const btnRect = btn.getBoundingClientRect()
    const cardRect = card.getBoundingClientRect()
    const mobile = isMobileMap()
    const edgeGap = 16
    const pinBottom = !mobile && place?.cardPinMode === 'bottom'
    const layoutLeft = !mobile && place?.cardLayout === 'left' && !pinBottom

    card.classList.toggle('main__map-card--layout-left', layoutLeft)
    card.classList.toggle('main__map-card--pin-bottom', pinBottom)

    const pinRatio = mobile
      ? (typeof place?.cardPinXMobile === 'number' ? place.cardPinXMobile : MOBILE_CARD_PIN_X)
      : (typeof place?.cardPinX === 'number' ? place.cardPinX : 0.22)
    const pinYRatio = mobile
      ? (typeof place?.cardPinYMobile === 'number' ? place.cardPinYMobile : MOBILE_CARD_PIN_Y)
      : (typeof place?.cardPinY === 'number' ? place.cardPinY : (pinBottom ? 0.88 : 0.28))

    const pinOffsetX = cardRect.width * pinRatio
    const pinOffsetY = cardRect.height * pinYRatio
    const pinX = btnRect.left - mapRect.left + btnRect.width / 2
    const pinY = btnRect.top - mapRect.top + btnRect.height / 2

    let top = pinY - pinOffsetY
    let left = pinX - pinOffsetX

    if (typeof place?.cardOffsetX === 'number' && !mobile) {
      left -= cardRect.width * place.cardOffsetX
    }

    const maxTop = mapRect.height - cardRect.height - edgeGap
    const maxLeft = mapRect.width - cardRect.width - edgeGap

    if (top > maxTop) top = maxTop
    if (top < edgeGap) top = edgeGap
    if (left > maxLeft) left = maxLeft
    if (left < edgeGap) left = edgeGap

    if (pinBottom) {
      const rem = parseFloat(getComputedStyle(document.documentElement).fontSize) || 10
      const contentTop = pinY - top - 22.4 * rem
      if (contentTop < edgeGap) {
        top = pinY - 22.4 * rem - edgeGap
        if (top > maxTop) top = maxTop
        if (top < edgeGap) top = edgeGap
      }
    }

    const pinInCardX = pinX - left
    const pinInCardY = pinY - top

    card.style.top = `${top}px`
    card.style.left = `${left}px`
    card.style.right = 'auto'
    card.style.bottom = 'auto'
    card.style.setProperty('--pin-x', `${pinInCardX}px`)
    card.style.setProperty('--pin-y', `${pinInCardY}px`)
  }

  const applyCardContent = (place) => {
    if (cardImg) {
      cardImg.src = place.image || ''
      cardImg.alt = place.title || ''
    }
    if (cardTime) cardTime.textContent = place.time || ''
    if (cardText) cardText.textContent = place.text || ''
    if (cardLink) {
      cardLink.href = place.link || '#'
      cardLink.textContent = 'подробнее'
    }
  }

  const revealCard = (place, btn) => {
    const src = place.image || ''
    const show = () => {
      applyCardContent(place)
      card.hidden = false
      positionCard(btn, place)
      syncActivePointLayer(btn)
      card.classList.remove('is-swapping')
      requestAnimationFrame(() => {
        requestAnimationFrame(() => card.classList.add('is-visible'))
      })
    }
    if (!src) {
      show()
      return
    }
    const preload = new Image()
    preload.onload = show
    preload.onerror = show
    preload.src = src
  }

  const showCard = (place, btn) => {
    if (!card || !place) return

    clearHideTimer()
    activeId = place.id

    root.querySelectorAll('.main__map-point').forEach((el) => {
      el.classList.toggle('is-active', el === btn)
    })
    syncActivePointLayer(btn)

    const swapping = card.classList.contains('is-visible')
    if (swapping) {
      card.classList.add('is-swapping')
      card.classList.remove('is-visible')
      window.setTimeout(() => revealCard(place, btn), CARD_SWAP_MS)
      return
    }

    revealCard(place, btn)
  }

  const resetModalInfoScroll = () => {
    if (modalInfo) modalInfo.scrollTop = 0
  }

  const openModal = (place) => {
    if (!modal || !place) return
    clearModalDismissStyles()
    resetModalDrag()
    resetModalInfoScroll()
    modal.classList.remove('is-dismissing', 'is-dragging', 'is-closing')
    if (modalTitle) modalTitle.textContent = place.title || ''
    if (modalText) modalText.textContent = place.text || ''
    if (modalContactText) modalContactText.textContent = place.contactText || ''
    if (modalPhoto) {
      modalPhoto.src = place.image || ''
      modalPhoto.alt = place.title || ''
    }
    hideCard()
    modal.hidden = false
    requestAnimationFrame(() => {
      modal.classList.add('is-open')
    })
    document.documentElement.classList.add('is-modal-scroller-open')
    document.body.classList.add('lock')
    window.HotelHero?.blockInput?.()
  }

  const canModalSwipe = () => {
    if (!MAP_SCROLL_MQ.matches || !modal?.classList.contains('is-open')) return false
    return !modal.classList.contains('is-dismissing')
  }

  const resetModalDrag = () => {
    modalDragY = 0
    modalDragging = false
    modal?.classList.remove('is-dragging')
    if (!modalWrapper) return
    modalWrapper.style.transition = ''
    modalWrapper.style.transform = ''
  }

  const clearModalDismissStyles = () => {
    if (modalBack) {
      modalBack.style.transition = ''
      modalBack.style.opacity = ''
    }
    if (modalDismissTimer) {
      window.clearTimeout(modalDismissTimer)
      modalDismissTimer = 0
    }
  }

  const finishCloseModal = () => {
    if (!modal) return
    modal.classList.remove('is-open', 'is-dismissing', 'is-dragging', 'is-closing')
    document.documentElement.classList.remove('is-modal-scroller-open')
    document.body.classList.remove('lock')
    window.HotelHero?.blockInput?.()
    resetModalInfoScroll()
    modal.hidden = true
    requestAnimationFrame(() => {
      clearModalDismissStyles()
      resetModalDrag()
    })
  }

  const dismissModalAnimated = () => {
    if (!modal || modal.classList.contains('is-dismissing') || modal.classList.contains('is-closing')) return
    clearModalDismissStyles()
    resetModalDrag()
    modal.classList.add('is-closing')
    modal.classList.remove('is-open')

    const photo = modal.querySelector('.main__map-modal-photo')
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      if (modalDismissTimer) {
        window.clearTimeout(modalDismissTimer)
        modalDismissTimer = 0
      }
      photo?.removeEventListener('transitionend', onTransitionEnd)
      finishCloseModal()
    }

    const onTransitionEnd = (e) => {
      if (e.target !== photo) return
      if (e.propertyName !== 'transform' && e.propertyName !== '-webkit-transform') return
      finish()
    }

    photo?.addEventListener('transitionend', onTransitionEnd)
    modalDismissTimer = window.setTimeout(finish, MODAL_CLOSE_MS_MOBILE + MODAL_CLOSE_FALLBACK_MS)
  }

  const dismissModalBySwipe = (fromY) => {
    if (!modal || !modalWrapper || modal.classList.contains('is-dismissing')) return
    modalDragging = false
    modal.classList.remove('is-dragging')
    modal.classList.add('is-dismissing')

    const distance = modalWrapper.getBoundingClientRect().height
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'

    modalWrapper.style.transition = 'none'
    modalWrapper.style.transform = `translate3d(0, ${fromY}px, 0)`
    void modalWrapper.offsetHeight
    modalWrapper.style.transition = `transform ${MODAL_DISMISS_MS}ms ${easing}`
    modalWrapper.style.transform = `translate3d(0, ${distance}px, 0)`

    if (modalBack) {
      modalBack.style.transition = `opacity ${MODAL_DISMISS_MS}ms ease`
      modalBack.style.opacity = '0'
    }

    modalDismissTimer = window.setTimeout(finishCloseModal, MODAL_DISMISS_MS)
  }

  const setModalDrag = (y) => {
    if (!modalWrapper) return
    modalWrapper.style.transition = 'none'
    modalWrapper.style.transform = y > 0 ? `translate3d(0, ${y}px, 0)` : ''
  }

  const snapModalDrag = () => {
    if (!modalWrapper || modalDragY <= 0) {
      resetModalDrag()
      return
    }
    modalDragging = false
    modal?.classList.remove('is-dragging')
    modalWrapper.style.transition = 'transform .25s ease'
    modalWrapper.style.transform = ''
    modalDragY = 0
    window.setTimeout(() => {
      if (modalWrapper) modalWrapper.style.transition = ''
    }, 250)
  }

  const closeModal = () => {
    if (!modal || modal.classList.contains('is-dismissing') || modal.classList.contains('is-closing')) return
    if (MAP_SCROLL_MQ.matches) {
      dismissModalAnimated()
      return
    }
    clearModalDismissStyles()
    resetModalDrag()
    modal.classList.remove('is-open', 'is-dismissing', 'is-dragging', 'is-closing')
    document.body.classList.remove('lock')
    window.HotelHero?.blockInput?.()
    resetModalInfoScroll()
    window.setTimeout(() => {
      if (!modal.classList.contains('is-open')) modal.hidden = true
    }, 650)
  }

  const buildPoints = () => {
    if (!pointsRoot) return
    pointsRoot.replaceChildren()

    places.forEach((place) => {
      if (place.hidePoint) return

      const btn = document.createElement('button')
      btn.type = 'button'
      btn.className = 'main__map-point'
      if (place.labelSide === 'left') btn.classList.add('main__map-point--label-left')
      if (place.hideLabel) btn.classList.add('main__map-point--no-label')
      btn.style.setProperty('--x', String(place.x))
      btn.style.setProperty('--y', String(place.y))
      btn.setAttribute('data-id', place.id)
      btn.setAttribute('aria-label', place.title)

      const pin = document.createElement('span')
      pin.className = 'main__map-pin'
      pin.setAttribute('aria-hidden', 'true')

      const label = document.createElement('span')
      label.className = 'main__map-label'
      label.textContent = place.title

      btn.append(pin, label)
      pointsRoot.appendChild(btn)

      btn.addEventListener('mouseenter', () => {
        if (isMobileMap()) return
        if (modal?.classList.contains('is-open')) return
        showCard(place, btn)
      })
      btn.addEventListener('focus', () => {
        if (isMobileMap()) return
        showCard(place, btn)
      })
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        clearHideTimer()
        openModal(place)
      })
      btn.addEventListener('mouseleave', () => {
        if (isMobileMap()) return
        if (modal?.classList.contains('is-open')) return
        scheduleHide()
      })
      btn.addEventListener('blur', (e) => {
        if (isMobileMap()) return
        if (card?.contains(e.relatedTarget)) return
        scheduleHide()
      })
    })
  }

  if (card) {
    card.addEventListener('mouseenter', () => {
      if (isMobileMap()) return
      clearHideTimer()
    })
    card.addEventListener('mouseleave', () => {
      if (isMobileMap()) return
      scheduleHide()
    })
    card.addEventListener('focusin', clearHideTimer)
    card.addEventListener('focusout', (e) => {
      if (isMobileMap()) return
      if (e.relatedTarget?.closest?.('.main__map-point')) return
      scheduleHide()
    })
  }

  cardLink?.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    const place = places.find((item) => item.id === activeId)
    if (place) openModal(place)
  })

  root.addEventListener('click', (e) => {
    if (!isMobileMap()) return
    if (!card?.classList.contains('is-visible')) return
    if (e.target.closest('.main__map-point') || e.target.closest('.main__map-card')) return
    hideCard()
  })

  modalLink?.addEventListener('click', (e) => {
    e.preventDefault()
    e.stopPropagation()
    window.HotelQuestionForm?.reset?.()
    window.HotelQuestionForm?.open?.()
  })

  modalBack?.addEventListener('click', closeModal)
  modalClose?.addEventListener('click', (e) => {
    e.stopPropagation()
    closeModal()
  })
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal()
  })

  modalWrapper?.addEventListener('touchstart', (e) => {
    if (e.target?.closest?.('.main__map-modal-close, .main__map-modal-info')) return
    if (!canModalSwipe()) return
    modalTouchStartY = e.touches[0].clientY
    modalTouchStartX = e.touches[0].clientX
    modalDragY = 0
    modalDragging = true
  }, { passive: true })

  modalWrapper?.addEventListener('touchmove', (e) => {
    if (!canModalSwipe() || !modalDragging) return
    const dy = e.touches[0].clientY - modalTouchStartY
    const dx = e.touches[0].clientX - modalTouchStartX
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MODAL_SWIPE_MIN) {
      snapModalDrag()
      return
    }
    if (dy <= 0) {
      if (modalDragY > 0) snapModalDrag()
      else resetModalDrag()
      return
    }
    modalDragY = dy
    modal?.classList.add('is-dragging')
    setModalDrag(dy)
    e.preventDefault()
  }, { passive: false })

  modalWrapper?.addEventListener('touchend', () => {
    if (!modalDragging) return
    if (modalDragY >= MODAL_SWIPE_CLOSE) {
      dismissModalBySwipe(modalDragY)
      return
    }
    snapModalDrag()
  }, { passive: true })

  modalWrapper?.addEventListener('touchcancel', snapModalDrag, { passive: true })

  const bindPokrovkaLink = () => {
    const link = root.querySelector('.main__map-pokrovka')
    const place = places.find((item) => item.id === 'pokrovka')
    if (!link || !place) return

    link.href = place.link || '#'
    link.setAttribute('aria-label', place.title || 'ул. Большая Покровская')

    if (place.linkExternal) {
      link.target = '_blank'
      link.rel = 'noopener noreferrer'
      return
    }

    link.removeAttribute('target')
    link.removeAttribute('rel')
  }

  buildPoints()
  bindPokrovkaLink()

  window.addEventListener('resize', () => {
    centerStage()
    if (activeId && card?.classList.contains('is-visible')) {
      const btn = root.querySelector(`.main__map-point[data-id="${activeId}"]`)
      const place = places.find((item) => item.id === activeId)
      if (btn) positionCard(btn, place)
    }
    updateHintArrows()
  })
  MAP_SCROLL_MQ.addEventListener('change', () => {
    centerStage()
    updateHintArrows()
  })
  stage?.addEventListener('scroll', () => {
    if (activeId && card?.classList.contains('is-visible')) {
      const btn = root.querySelector(`.main__map-point[data-id="${activeId}"]`)
      const place = places.find((item) => item.id === activeId)
      if (btn) positionCard(btn, place)
    }
    updateHintArrows()
  }, { passive: true })

  let stagePanning = false

  const bindStageTouchPan = () => {
    if (!stage) return

    let active = false
    let locked = false
    let startX = 0
    let startY = 0
    let startScroll = 0

    const syncStageScroll = () => {
      if (activeId && card?.classList.contains('is-visible')) {
        const btn = root.querySelector(`.main__map-point[data-id="${activeId}"]`)
        const place = places.find((item) => item.id === activeId)
        if (btn) positionCard(btn, place)
      }
      updateHintArrows()
    }

    stage.addEventListener('touchstart', (e) => {
      if (!MAP_SCROLL_MQ.matches || !hintCanScroll()) return
      if (e.touches.length !== 1) return
      active = true
      locked = false
      stagePanning = false
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startScroll = stage.scrollLeft
    }, { passive: true })

    stage.addEventListener('touchmove', (e) => {
      if (!active || !MAP_SCROLL_MQ.matches) return
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      const dx = startX - x
      const dy = startY - y
      if (!locked) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        if (Math.abs(dy) > Math.abs(dx)) {
          active = false
          return
        }
        locked = true
      }
      const max = Math.max(0, stage.scrollWidth - stage.clientWidth)
      stagePanning = true
      stage.scrollLeft = Math.max(0, Math.min(max, startScroll + dx))
      syncStageScroll()
      e.preventDefault()
      e.stopPropagation()
    }, { passive: false })

    const endStagePan = () => {
      active = false
      locked = false
      window.setTimeout(() => {
        stagePanning = false
      }, 80)
    }

    stage.addEventListener('touchend', endStagePan, { passive: true })
    stage.addEventListener('touchcancel', endStagePan, { passive: true })
  }

  bindStageTouchPan()
  centerStage()

  window.HotelMap = {
    rebuild: () => {
      buildPoints()
      bindPokrovkaLink()
    },
    hide: hideCard,
    centerStage,
    updateHintArrows,
    isStagePanning: () => stagePanning
  }
})();

(function () {
  'use strict'

  const root = document.querySelector('.info-slider')
  if (!root) return

  const ICON = 'info-slider__info-icon'
  const TITLE = 'info-slider__info-title'
  const PHOTO = 'info-slider__photo-img'

  let iconCurrent = root.querySelector(`.${ICON}--current`)
  let iconNext = root.querySelector(`.${ICON}--next`)
  let titleCurrent = root.querySelector(`.${TITLE}--current`)
  let titleNext = root.querySelector(`.${TITLE}--next`)
  const titleHeight = root.querySelector('.info-slider__info-title-height')
  const link = root.querySelector('.info-slider__info-link')
  let photoCurrent = root.querySelector(`.${PHOTO}--current`)
  let photoNext = root.querySelector(`.${PHOTO}--next`)

  const AUTO_MS = 3500
  const FADE_MS = 650
  const TEXT_MS = 900
  const CHANGE_MS = Math.max(FADE_MS, TEXT_MS)
  let index = 0
  let timer = 0
  let isOpen = false
  let changing = false

  const slides = () => Array.isArray(window.HotelInfoSlides) ? window.HotelInfoSlides : []

  const normalize = (raw) => ({
    icon: raw?.icon || '',
    title: raw?.title || '',
    buttonText: raw?.buttonText || '',
    link: raw?.link || '#',
    image: raw?.image || ''
  })

  const preloadImage = (src) => new Promise((resolve) => {
    if (!src) {
      resolve()
      return
    }
    const img = new Image()
    img.onload = () => resolve()
    img.onerror = () => resolve()
    img.src = src
  })

  const nextPaint = () => new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })

  const syncTitleHeight = (text) => {
    if (titleHeight) titleHeight.textContent = text || ''
  }

  const setPhoto = (img, payload) => {
    if (!img) return
    img.src = payload.image
    img.alt = payload.title
  }

  const setInfo = (icon, title, payload) => {
    if (icon) {
      icon.src = payload.icon
      icon.hidden = !payload.icon
    }
    if (title) title.textContent = payload.title
  }

  const setLink = (payload) => {
    if (!link) return
    link.textContent = payload.buttonText
    link.href = payload.link
    link.hidden = !payload.buttonText
  }

  const swapLayer = (current, next, base) => {
    current.classList.remove(`${base}--current`)
    current.classList.add(`${base}--next`)
    next.classList.remove(`${base}--next`)
    next.classList.add(`${base}--current`)
  }

  const swapLayers = () => {
    swapLayer(iconCurrent, iconNext, ICON)
    swapLayer(titleCurrent, titleNext, TITLE)
    swapLayer(photoCurrent, photoNext, PHOTO)
    ;[iconCurrent, iconNext] = [iconNext, iconCurrent]
    ;[titleCurrent, titleNext] = [titleNext, titleCurrent]
    ;[photoCurrent, photoNext] = [photoNext, photoCurrent]
  }

  const renderCurrent = (payload) => {
    setInfo(iconCurrent, titleCurrent, payload)
    syncTitleHeight(payload.title)
    setLink(payload)
    setPhoto(photoCurrent, payload)
  }

  const renderNext = (payload) => {
    setInfo(iconNext, titleNext, payload)
    setPhoto(photoNext, payload)
  }

  const clearNext = () => {
    setInfo(iconNext, titleNext, { icon: '', title: '' })
    if (photoNext) photoNext.removeAttribute('src')
  }

  const render = (slide) => {
    renderCurrent(normalize(slide))
    clearNext()
  }

  const stop = () => {
    clearTimeout(timer)
    timer = 0
  }

  const schedule = () => {
    stop()
    if (!isOpen || slides().length < 2) return
    timer = window.setTimeout(() => {
      goTo(index + 1)
    }, AUTO_MS)
  }

  const ensureOpen = () => {
    if (!isOpen) {
      open({ animate: false })
      return
    }
    if (!root.classList.contains('is-open')) root.classList.add('is-open')
    document.body.classList.add('is-info-slider-open')
    schedule()
  }

  const goTo = async (nextIndex) => {
    const items = slides()
    if (!items.length || changing) return

    const nextIdx = ((nextIndex % items.length) + items.length) % items.length
    if (nextIdx === index && items.length === 1) return

    const payload = normalize(items[nextIdx])
    changing = true
    stop()

    await Promise.all([
      preloadImage(payload.image),
      preloadImage(payload.icon)
    ])

    renderNext(payload)
    await nextPaint()

    root.classList.add('is-leaving')

    window.setTimeout(async () => {
      index = nextIdx
      root.classList.add('is-preparing')
      swapLayers()
      syncTitleHeight(payload.title)
      setLink(payload)
      root.classList.remove('is-leaving')
      await nextPaint()
      root.classList.remove('is-preparing')
      changing = false
      schedule()
    }, CHANGE_MS)
  }

  const open = ({ reset = false, animate = true } = {}) => {
    const items = slides()
    if (!items.length) return
    isOpen = true
    if (reset) index = 0
    render(items[index])
    root.classList.remove('is-open', 'is-leaving', 'is-preparing')
    document.body.classList.add('is-info-slider-open')
    const applyOpen = () => {
      root.classList.add('is-open')
      schedule()
    }
    if (!animate) {
      applyOpen()
      return
    }
    requestAnimationFrame(() => {
      requestAnimationFrame(applyOpen)
    })
  }

  const close = () => {
    isOpen = false
    changing = false
    stop()
    root.classList.remove('is-open', 'is-leaving', 'is-preparing')
    document.body.classList.remove('is-info-slider-open')
  }

  render(slides()[0])

  window.HotelInfoSlider = {
    open,
    close,
    start: schedule,
    stop,
    ensureOpen,
    goTo,
    getIndex: () => index,
    isBusy: () => changing,
    isSwipeEnabled: () => isOpen && root.classList.contains('is-open')
  }
})();

(function () {
  'use strict'

  const section = document.querySelector('.main')
  if (!section) return
  const vfwd = section.querySelector('.main__video--forward')
  const vrev = section.querySelector('.main__video--reverse')
  const reveal = section.querySelector('.main__reveal')
  const rooms = section.querySelector('.rooms')
  const roomsPhoto = section.querySelector('.rooms__wrapper-photo')
  const roomsInfo = section.querySelector('.rooms__wrapper-info')
  const city = section.querySelector('.main__city')
  const cvfwd = section.querySelector('.main__city-video--forward')
  const cvrev = section.querySelector('.main__city-video--reverse')
  const map = section.querySelector('.main__map')
  const infoSlider = section.querySelector('.info-slider')
  if (!vfwd || !vrev || !reveal) return

  const hasRooms = !!(rooms && roomsPhoto && roomsInfo)
  const hasCity = !!(city && cvfwd && cvrev)
  const hasMap = !!map
  const hasInfoSlider = !!infoSlider
  const SHIFT_MS = 1000
  const WHEEL_MIN = 4
  const TOUCH_MIN = 30
  const TOUCH_UNLOCK_SCENE = 14
  const ROOMS_MS = 1600
  const CITY_MS = 1200
  const MAP_MS = 1200
  const MOBILE_CITY_MAP_MS = 700
  const INFO_PANEL_MS = 1400
  const INFO_PANEL_MOBILE_MS = 1150
  const SCENE_DONE_SLIDE = hasInfoSlider ? 8 : (hasMap ? 7 : (hasCity ? 6 : (hasRooms ? 5 : 4)))
  const MAX_SLIDE = hasInfoSlider ? 7 : (hasMap ? 6 : (hasCity ? 5 : (hasRooms ? 4 : 3)))
  const ROOMS_STEP_COOLDOWN_MS = 250
  const SCROLL_TOP_MAX = 16
  const LEAVE_FOOTER_DY = 48
  const MOBILE_PHOTO_MQ = window.matchMedia('(max-width: 480px)')
  const isMobilePhoto = () => MOBILE_PHOTO_MQ.matches
  const mainPhotoFwd = section.querySelector('.main__photo--forward')
  const mainPhotoRev = section.querySelector('.main__photo--reverse')
  const cityPhoto = section.querySelector('.main__city-photo')
  const hasMobileMainPhoto = !!(mainPhotoFwd && mainPhotoRev)
  const hasMobileCityPhoto = !!cityPhoto
  const FACADE_SCROLL_MQ = window.matchMedia('(max-width: 640px)')
  const ROOMS_MOBILE_MQ = window.matchMedia('(max-width: 640px)')
  const INFO_MOBILE_MQ = window.matchMedia('(max-width: 640px)')
  if ('scrollRestoration' in history) history.scrollRestoration = 'manual'

  document.documentElement.classList.add('is-hero-scene')
  document.documentElement.style.overflowY = 'hidden'
  document.documentElement.style.overflowX = 'hidden'
  document.body.style.overflowY = 'hidden'
  document.body.style.overflowX = 'hidden'

  let slide = 0
  let busy = false
  let cityAwaitingScroll = false
  let cityPlaying = false
  let cityVideoDone = false
  let touchStartY = 0
  let touchStartX = 0
  let footerScrollVisited = false
  let facadePanTouch = false
  let mapPanTouch = false
  let roomsTouchActive = false
  let infoTouchActive = false
  let lastRoomsSwipeAt = 0
  let mainVideoIntroDone = false
  let heroPlayToken = 0
  let wheelAccum = 0
  let wheelAccumTimer = 0

  const abortHeroPlay = () => {
    heroPlayToken += 1
    vfwd?.pause()
    vrev?.pause()
    if (hasCity) {
      cvfwd?.pause()
      cvrev?.pause()
    }
    section.classList.remove('is-video-playing')
  }

  const isIntroTransition = () => (
    slide === 0
    && section.classList.contains('is-shifted')
    && !useMobileMainPhoto()
  )

  const hasVideoProgress = (v) => !!v && v.currentTime > 0.12

  const finishBlockedHeroIntro = (token) => {
    if (!isIntroTransition()) return false
    if (token != null && token !== heroPlayToken) return false
    if (hasVideoProgress(vfwd)) return false
    abortHeroPlay()
    showForward()
    try { vfwd.currentTime = 0 } catch (e) {}
    slide = 2
    busy = false
    syncFacadeSceneClass()
    return true
  }
  const revealStage = () => section.querySelector('.main__reveal-stage')
  const mapStage = () => section.querySelector('.main__map-stage')

  const revealCanScrollX = () => {
    if (!FACADE_SCROLL_MQ.matches) return false
    const stage = revealStage()
    return !!(stage && stage.scrollWidth > stage.clientWidth + 1)
  }

  const mapCanScrollX = () => {
    if (!FACADE_SCROLL_MQ.matches) return false
    const stage = mapStage()
    return !!(stage && stage.scrollWidth > stage.clientWidth + 1)
  }

  const resetPanTouch = () => {
    facadePanTouch = false
    mapPanTouch = false
    roomsTouchActive = false
    infoTouchActive = false
  }

  const syncPanTouch = (e) => {
    facadePanTouch = isFacadeScene()
      && revealCanScrollX()
      && !!e.target.closest('.main__reveal-stage')
    mapPanTouch = isMapScene()
      && mapCanScrollX()
      && !!e.target.closest('.main__map-stage')
    roomsTouchActive = roomsCanSwipeX()
      && !!e.target.closest('.rooms')
    infoTouchActive = infoCanSwipeX()
      && !!e.target.closest('.info-slider')
  }

  const shouldIgnoreVerticalSwipe = (e) => {
    const end = e.changedTouches[0]
    const dx = Math.abs(touchStartX - end.clientX)
    const dy = Math.abs(touchStartY - end.clientY)
    return dx >= dy || dx >= TOUCH_MIN
      || window.HotelFacade?.isStagePanning?.()
      || window.HotelMap?.isStagePanning?.()
  }

  const isFacadeScene = () => slide === 3 && section.classList.contains('is-revealed')
  const isMapScene = () => section.classList.contains('is-map')
  const isRoomsScene = () => (
    slide === 4
    && hasRooms
    && section.classList.contains('is-rooms')
    && rooms.classList.contains('is-open')
  )
  const roomsCanSwipeX = () => ROOMS_MOBILE_MQ.matches && isRoomsScene()

  const isInfoSliderScene = () => (
    slide === 7
    && hasInfoSlider
    && section.classList.contains('is-info-slider')
    && infoSlider?.classList.contains('is-open')
  )

  const infoCanSwipeX = () => INFO_MOBILE_MQ.matches && isInfoSliderScene()

  const allowRevealPan = (e) => {
    if (!isFacadeScene() || !revealCanScrollX()) return false
    if (!e.target.closest('.main__reveal-stage')) return false
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - touchStartX)
    const dy = Math.abs(touch.clientY - touchStartY)
    if (dx < TOUCH_MIN && dy < TOUCH_MIN) return true
    return dx > dy
  }

  const allowMapPan = (e) => {
    if (!isMapScene() || !mapCanScrollX()) return false
    if (!e.target.closest('.main__map-stage')) return false
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - touchStartX)
    const dy = Math.abs(touch.clientY - touchStartY)
    if (dx < TOUCH_MIN && dy < TOUCH_MIN) return true
    return dx > dy
  }

  const allowRevealWheelX = (e) => {
    if (!isFacadeScene() || !revealCanScrollX()) return false
    if (!e.target.closest('.main__reveal-stage')) return false
    return Math.abs(e.deltaX) > Math.abs(e.deltaY)
  }

  const allowMapWheelX = (e) => {
    if (!isMapScene() || !mapCanScrollX()) return false
    if (!e.target.closest('.main__map-stage')) return false
    return Math.abs(e.deltaX) > Math.abs(e.deltaY)
  }

  const roomsInfoCanScrollY = (panel) => {
    if (!panel) return false
    return panel.scrollHeight > panel.clientHeight + 1
  }

  const roomsInfoScrollConsumable = (panel, deltaY) => {
    if (!panel || !roomsInfoCanScrollY(panel)) return false
    const atTop = panel.scrollTop <= 0
    const atBottom = panel.scrollTop + panel.clientHeight >= panel.scrollHeight - 1
    if (deltaY > 0) return !atBottom
    if (deltaY < 0) return !atTop
    return false
  }

  const allowRoomsWheelY = (e) => {
    if (slide !== 4 || !hasRooms || !section.classList.contains('is-rooms')) return false
    const panel = e.target.closest('.rooms__wrapper-info')
    if (!panel) return false
    return roomsInfoScrollConsumable(panel, e.deltaY)
  }

  const allowRoomsPan = (e) => {
    if (slide !== 4 || !hasRooms || !section.classList.contains('is-rooms')) return false
    const panel = e.target.closest('.rooms__wrapper-info')
    if (!panel) return false
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - touchStartX)
    const dyAbs = Math.abs(touch.clientY - touchStartY)
    if (dx > dyAbs && dx >= TOUCH_MIN) return false
    const dy = touchStartY - touch.clientY
    return roomsInfoScrollConsumable(panel, dy)
  }

  const allowRoomsHorizontalPan = (e) => {
    if (!roomsCanSwipeX()) return false
    if (!e.target.closest('.rooms')) return false
    const touch = e.touches[0]
    const dx = Math.abs(touch.clientX - touchStartX)
    const dy = Math.abs(touch.clientY - touchStartY)
    if (dx < TOUCH_MIN && dy < TOUCH_MIN) return true
    return dx > dy
  }

  const isSceneDone = () => slide >= SCENE_DONE_SLIDE

  const isFooterMode = () => document.body.classList.contains('is-scene-done')

  const isPageFlowDone = () => isSceneDone() || isFooterMode()

  const getPageScrollY = () => {
    const root = document.scrollingElement || document.documentElement
    return window.scrollY || root.scrollTop || document.body.scrollTop || 0
  }

  const getMaxPageScroll = () => {
    const root = document.documentElement
    return Math.max(0, root.scrollHeight - window.innerHeight)
  }

  const canPageScrollDown = () => getPageScrollY() < getMaxPageScroll() - 1

  const canPageScrollUp = () => getPageScrollY() > SCROLL_TOP_MAX

  const atPageTop = () => getPageScrollY() <= SCROLL_TOP_MAX

  const lockPageScroll = () => {
    window.scrollTo(0, 0)
    document.documentElement.scrollTop = 0
    document.body.scrollTop = 0
  }

  const ensureScrollUnlocked = () => {
    if (!document.body.classList.contains('is-scene-done')) return
    document.documentElement.classList.remove('is-hero-scene')
    document.documentElement.classList.add('is-scene-done')
    document.documentElement.style.overflowY = 'auto'
    document.documentElement.style.overflowX = 'hidden'
    document.documentElement.style.height = 'auto'
    document.documentElement.style.maxHeight = 'none'
    document.body.style.overflowY = 'visible'
    document.body.style.overflowX = 'hidden'
    document.body.style.height = 'auto'
    document.body.style.maxHeight = 'none'
    const pContent = document.querySelector('.p_content')
    if (pContent) {
      pContent.style.overflowX = 'hidden'
      pContent.style.overflowY = 'visible'
      pContent.style.height = 'auto'
      pContent.style.maxHeight = 'none'
    }
  }

  const afterFooterUnlock = () => {
    requestAnimationFrame(() => {
      ensureScrollUnlocked()
      requestAnimationFrame(ensureScrollUnlocked)
    })
  }

  const syncFooterScrollVisited = () => {
    if (getPageScrollY() > 48) footerScrollVisited = true
  }

  const handlePageFlowWheel = (e) => {
    if (isInsideModal(e.target)) return
    syncFooterScrollState()
    syncFooterScrollVisited()
    const dy = e.deltaY
    if (Math.abs(dy) < WHEEL_MIN) return

    if (dy > 0) {
      if (canPageScrollDown()) {
        window.scrollBy({ top: dy, left: 0, behavior: 'auto' })
        e.preventDefault()
      }
      return
    }

    if (canPageScrollUp()) {
      window.scrollBy({ top: dy, left: 0, behavior: 'auto' })
      e.preventDefault()
      return
    }

    if (atPageTop() && tryLeaveFooterScene()) e.preventDefault()
  }

  const handlePageFlowTouch = (e) => {
    if (isInsideModal(e.target)) return
    syncFooterScrollState()
    syncFooterScrollVisited()
    const y = e.touches[0]?.clientY
    if (y == null) return

    const dy = touchStartY - y
    if (Math.abs(dy) < 2) return

    if (dy > 0) {
      if (canPageScrollDown()) {
        window.scrollBy({ top: dy, left: 0, behavior: 'auto' })
        touchStartY = y
        footerScrollVisited = true
        e.preventDefault()
      }
      return
    }

    if (canPageScrollUp()) {
      window.scrollBy({ top: dy, left: 0, behavior: 'auto' })
      touchStartY = y
      e.preventDefault()
      return
    }

    if (atPageTop()) {
      e.preventDefault()
    }
  }

  const syncFooterScrollState = () => {
    if (!isPageFlowDone()) return
    slide = SCENE_DONE_SLIDE
    document.body.classList.add('is-scene-done')
    document.documentElement.classList.add('is-scene-done')
    document.documentElement.classList.remove('is-hero-scene')
    ensureScrollUnlocked()
  }

  const resumeHeroScene = () => {
    blockInput(250)
    busy = false
    slide = 7
    section.classList.remove('is-city', 'is-rooms', 'is-map-leaving', 'is-map-entering')
    section.classList.add('is-info-slider', 'is-shifted', 'is-shifted-static')
    if (hasMap) setMap(true)
    document.documentElement.classList.remove('is-scene-done')
    document.documentElement.classList.add('is-hero-scene')
    document.documentElement.style.overflowY = 'hidden'
    document.documentElement.style.overflowX = 'hidden'
    document.documentElement.style.height = ''
    document.documentElement.style.maxHeight = ''
    document.body.style.overflowY = 'hidden'
    document.body.style.overflowX = 'hidden'
    document.body.style.height = ''
    document.body.style.maxHeight = ''
    document.body.classList.remove('is-scene-done', 'lock')
    const pContent = document.querySelector('.p_content')
    if (pContent) {
      pContent.style.overflowX = ''
      pContent.style.overflowY = ''
      pContent.style.height = '100dvh'
      pContent.style.maxHeight = '100dvh'
    }
    infoSliderApi()?.ensureOpen?.()
    footerScrollVisited = false
    lockPageScroll()
    requestAnimationFrame(lockPageScroll)
  }

  const tryLeaveFooterScene = () => {
    if (!isPageFlowDone() || !hasInfoSlider || busy || isModalOpen()) return false
    if (!atPageTop()) return false
    lockPageScroll()
    resumeHeroScene()
    return true
  }

  const tryLeaveFooterBySwipe = (dy) => {
    if (dy > -LEAVE_FOOTER_DY || !atPageTop() || !footerScrollVisited) return false
    return tryLeaveFooterScene()
  }

  const roomsSlider = () => window.HotelRoomsSlider
  const infoSliderApi = () => window.HotelInfoSlider
  const roomsBusy = () => !!roomsSlider()?.isBusy?.()

  const tryRoomsHorizontalSwipe = (e) => {
    if (!roomsTouchActive || !roomsCanSwipeX()) return false
    const dx = touchStartX - e.changedTouches[0].clientX
    const dy = touchStartY - e.changedTouches[0].clientY
    if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < TOUCH_MIN) return false
    if (isInputBlocked() || busy || roomsBusy()) return true
    const now = Date.now()
    if (now - lastRoomsSwipeAt < ROOMS_STEP_COOLDOWN_MS) return true
    lastRoomsSwipeAt = now
    const slider = roomsSlider()
    if (!slider) return true
    const last = slider.getTotal() - 1
    const current = slider.getIndex()
    const nextIndex = dx > 0
      ? (current >= last ? 0 : current + 1)
      : (current <= 0 ? last : current - 1)
    slider.goTo(nextIndex).then(() => slider.startAutoplay())
    return true
  }

  const tryInfoHorizontalSwipe = (e) => {
    if (!infoTouchActive || !infoCanSwipeX()) return false
    const dx = touchStartX - e.changedTouches[0].clientX
    const dy = touchStartY - e.changedTouches[0].clientY
    if (Math.abs(dx) <= Math.abs(dy) || Math.abs(dx) < TOUCH_MIN) return false
    if (isInputBlocked() || busy || infoSliderApi()?.isBusy?.()) return true
    const slider = infoSliderApi()
    if (!slider) return true
    const current = slider.getIndex()
    slider.goTo(dx > 0 ? current + 1 : current - 1)
    return true
  }

  const tryPlay = (v) => {
    if (!v) return Promise.resolve(false)
    const p = v.play()
    if (p && typeof p.then === 'function') {
      return p.then(() => !v.paused).catch(() => false)
    }
    return Promise.resolve(!v.paused)
  }

  const kickVideoPlay = (v, { fromStart = true } = {}) => {
    if (!v) return
    if (fromStart) {
      try { v.currentTime = 0 } catch (e) {}
    }
    tryPlay(v)
  }

  const setupInlineVideo = (v, { preload = 'auto' } = {}) => {
    if (!v) return
    v.muted = true
    v.defaultMuted = true
    v.playsInline = true
    v.setAttribute('muted', '')
    v.setAttribute('playsinline', '')
    v.setAttribute('webkit-playsinline', '')
    v.setAttribute('preload', preload)
    v.removeAttribute('autoplay')
  }

  const ensureVideoSrc = (v) => {
    if (!v) return
    const pending = v.dataset.src
    if (!pending || v.getAttribute('src')) return
    v.src = pending
    v.removeAttribute('data-src')
    try { v.load() } catch (e) {}
  }

  const pauseBackgroundVideos = (active) => {
    const all = [vfwd, vrev]
    if (hasCity) all.push(cvfwd, cvrev)
    all.forEach((v) => {
      if (!v || v === active) return
      v.pause()
    })
  }

  const waitMedia = (v, eventName, timeoutMs = 4000) => new Promise((resolve) => {
    if (!v) return resolve()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      v.removeEventListener(eventName, finish)
      clearTimeout(timer)
      resolve()
    }
    const timer = setTimeout(finish, timeoutMs)
    if (eventName === 'canplaythrough' && v.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      finish()
      return
    }
    if (eventName === 'loadedmetadata' && v.readyState >= HTMLMediaElement.HAVE_METADATA) {
      finish()
      return
    }
    v.addEventListener(eventName, finish, { once: true })
  })

  const seekToStart = (v) => new Promise((resolve) => {
    if (!v) return resolve()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      v.removeEventListener('seeked', finish)
      clearTimeout(timer)
      resolve()
    }
    const timer = setTimeout(finish, 150)
    v.addEventListener('seeked', finish, { once: true })
    try { v.currentTime = 0 } catch (e) { finish() }
  })

  const warmUpVideo = (v) => {
    if (!v || v.dataset.warmed === '1') return
    pauseBackgroundVideos(v)
    const mark = () => { v.dataset.warmed = '1' }
    if (v.readyState >= HTMLMediaElement.HAVE_ENOUGH_DATA) {
      mark()
      return
    }
    waitMedia(v, 'canplaythrough', 8000).then(mark)
    try { v.load() } catch (e) {}
  }

  const videoPlaybackTimeout = (v, fallbackMs = 12000) => {
    const duration = v?.duration
    if (Number.isFinite(duration) && duration > 0) {
      return Math.min(Math.max(duration * 1000 + 1000, 3000), 60000)
    }
    return fallbackMs
  }

  const waitVideoPlaybackEnd = (v, timeoutMs = 12000, playToken = heroPlayToken) => new Promise((resolve) => {
    if (!v) return resolve()
    let done = false
    const cleanup = () => {
      v.removeEventListener('ended', onEnd)
      v.removeEventListener('timeupdate', onTime)
      v.removeEventListener('playing', onPlaying)
      clearTimeout(timer)
      clearTimeout(stallTimer)
    }
    const finish = () => {
      if (done) return
      done = true
      cleanup()
      resolve()
    }
    const onEnd = () => finish()
    const onPlaying = () => {
      clearTimeout(stallTimer)
      stallTimer = setTimeout(() => {
        if (playToken !== heroPlayToken) return finish()
        if (v.paused) finish()
      }, 2000)
    }
    const onTime = () => {
      if (playToken !== heroPlayToken) return finish()
      const duration = v.duration
      if (!Number.isFinite(duration) || duration <= 0) return
      if (v.currentTime >= duration - 0.2) finish()
    }
    let stallTimer = setTimeout(() => {
      if (playToken !== heroPlayToken) return finish()
      if (v.paused || v.currentTime < 0.05) finish()
    }, 2000)
    const timer = setTimeout(finish, timeoutMs)
    v.addEventListener('ended', onEnd, { once: true })
    v.addEventListener('timeupdate', onTime)
    v.addEventListener('playing', onPlaying, { once: true })
    if (!v.paused) onPlaying()
  })

  const playVideo = async (v, { show, fromStart = true, token } = {}) => {
    if (!v) return
    const playToken = token ?? ++heroPlayToken
    section.classList.add('is-video-playing')
    if (v === vfwd) vfwd.classList.add('is-frame-ready')
    if (typeof show === 'function') show()
    pauseBackgroundVideos(v)
    try {
      warmUpVideo(v)
      if (fromStart) {
        try { v.currentTime = 0 } catch (e) {}
      }
      if (v.paused) await tryPlay(v)
      if (playToken !== heroPlayToken) return
      if (v.paused) {
        await waitMedia(v, 'canplaythrough', 4000)
        if (playToken !== heroPlayToken) return
        if (fromStart) await seekToStart(v)
        await tryPlay(v)
      }
      if (playToken !== heroPlayToken) return
      await waitVideoPlaybackEnd(v, videoPlaybackTimeout(v), playToken)
    } finally {
      if (playToken === heroPlayToken) {
        section.classList.remove('is-video-playing')
      }
    }
  }

  const setPhotoOpacity = (fwd, rev, progress) => {
    const p = Math.max(0, Math.min(1, progress))
    if (fwd) fwd.style.opacity = String(p)
    if (rev) rev.style.opacity = String(1 - p)
  }

  const showPhotoForward = (fwd, rev) => setPhotoOpacity(fwd, rev, 1)
  const showPhotoReverse = (fwd, rev) => setPhotoOpacity(fwd, rev, 0)

  const animatePhotoCrossfade = (fwd, rev, toForward, durationMs) => new Promise((resolve) => {
    if (!fwd || !rev) return resolve()
    const from = toForward ? 0 : 1
    const to = toForward ? 1 : 0
    const start = performance.now()
    const tick = (now) => {
      const t = Math.min(1, (now - start) / durationMs)
      const eased = 1 - (1 - t) * (1 - t)
      setPhotoOpacity(fwd, rev, from + (to - from) * eased)
      if (t < 1) requestAnimationFrame(tick)
      else resolve()
    }
    requestAnimationFrame(tick)
  })

  const playMobileMainPhoto = (toForward) => {
    if (!isMobilePhoto() || !hasMobileMainPhoto) return Promise.resolve()
    return animatePhotoCrossfade(mainPhotoFwd, mainPhotoRev, toForward, SHIFT_MS)
  }

  const showCityPhoto = () => {
    if (!cityPhoto) return
    cityPhoto.style.opacity = '1'
  }

  const clearCityPhotoStyles = () => {
    if (cityPhoto) cityPhoto.style.opacity = ''
    if (city) city.style.opacity = ''
  }

  const animateCityMapCrossfade = (toMap, durationMs = MOBILE_CITY_MAP_MS) => {
    if (!map || !useMobileCityPhoto()) return Promise.resolve()

    section.classList.add('is-city-map-crossfade')
    map.style.transition = 'none'
    map.style.willChange = 'opacity'
    if (city) {
      city.style.transition = 'none'
      city.style.willChange = 'opacity'
    }

    if (toMap) {
      section.classList.add('is-map-entering')
      setMap(true)
      map.style.opacity = '0'
      map.style.visibility = 'visible'
      showCityPhoto()
      if (city) {
        city.style.opacity = '1'
        city.style.visibility = 'visible'
      }
      window.HotelMap?.centerStage?.()
    } else {
      section.classList.add('is-map-leaving', 'is-city')
      map.style.opacity = '1'
      map.style.visibility = 'visible'
      if (city) {
        city.style.opacity = '0'
        city.style.visibility = 'visible'
      }
    }

    return new Promise((resolve) => {
      const fromCity = toMap ? 1 : 0
      const toCity = toMap ? 0 : 1
      const fromMap = toMap ? 0 : 1
      const toMapVal = toMap ? 1 : 0
      const start = performance.now()

      const finish = () => {
        map.style.transition = ''
        map.style.willChange = ''
        map.style.opacity = ''
        map.style.visibility = ''
        if (city) {
          city.style.transition = ''
          city.style.willChange = ''
        }
        clearCityPhotoStyles()
        section.classList.remove('is-city-map-crossfade')
        if (toMap) {
          section.classList.remove('is-map-entering')
        } else {
          section.classList.remove('is-map', 'is-map-leaving')
          setMap(false)
          showCityPhoto()
        }
        resolve()
      }

      const tick = (now) => {
        const t = Math.min(1, (now - start) / durationMs)
        const eased = 1 - (1 - t) * (1 - t)
        const cityOp = fromCity + (toCity - fromCity) * eased
        const mapOp = fromMap + (toMapVal - fromMap) * eased
        if (city) city.style.opacity = String(cityOp)
        map.style.opacity = String(mapOp)
        if (t < 1) requestAnimationFrame(tick)
        else finish()
      }
      requestAnimationFrame(tick)
    })
  }

  const useMobileMainPhoto = () => isMobilePhoto() && hasMobileMainPhoto
  const useMobileCityPhoto = () => isMobilePhoto() && hasMobileCityPhoto

  const primeFirstFrame = (v) => {
    if (!v) return
    const seek = () => {
      try { v.currentTime = 0 } catch (e) {}
    }
    if (v.readyState >= HTMLMediaElement.HAVE_METADATA) seek()
    else v.addEventListener('loadedmetadata', seek, { once: true })
  }

  const prefetchHeroReverse = () => {
    if (!vrev) return
    ensureVideoSrc(vrev)
    warmUpVideo(vrev)
    primeFirstFrame(vrev)
  }

  const prefetchCityVideos = () => {
    if (!hasCity) return
    ensureVideoSrc(cvrev)
    warmUpVideo(cvfwd)
    warmUpVideo(cvrev)
    primeFirstFrame(cvfwd)
  }

  const revealMainVideoPoster = () => {
    if (useMobileMainPhoto()) {
      if (slide > 1) return
      showPhotoReverse(mainPhotoFwd, mainPhotoRev)
      mainVideoIntroDone = true
      return
    }
    if (!vfwd || slide > 1 || vfwd.hidden) return
    vfwd.classList.add('is-frame-ready')
    mainVideoIntroDone = true
  }

  const primeMainVideoPoster = () => {
    if (useMobileMainPhoto()) {
      if (slide > 1) return
      showPhotoReverse(mainPhotoFwd, mainPhotoRev)
      requestAnimationFrame(revealMainVideoPoster)
      return
    }
    if (!vfwd || vfwd.hidden || slide > 1) return
    try { vfwd.currentTime = 0 } catch (e) {}
    requestAnimationFrame(revealMainVideoPoster)
  }

  const setupMainVideoPoster = () => {
    if (useMobileMainPhoto()) {
      showPhotoReverse(mainPhotoFwd, mainPhotoRev)
      mainVideoIntroDone = true
      return
    }
    if (!vfwd) return
    const onForwardReady = () => {
      primeMainVideoPoster()
      prefetchHeroReverse()
      prefetchCityVideos()
    }
    vfwd.addEventListener('loadeddata', onForwardReady, { once: true })
    if (vfwd.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) onForwardReady()
  }

  setupInlineVideo(vfwd, { preload: 'auto' })
  setupInlineVideo(vrev, { preload: 'none' })
  if (hasCity) {
    setupInlineVideo(cvfwd, { preload: 'auto' })
    setupInlineVideo(cvrev, { preload: 'none' })
  }

  vrev.hidden = true
  if (hasCity) cvrev.hidden = true

  window.addEventListener('pageshow', () => {
    if (slide > 1 || isSceneDone()) return
    lockPageScroll()
    if (useMobileMainPhoto()) {
      showPhotoReverse(mainPhotoFwd, mainPhotoRev)
    } else {
      showForward()
    }
    primeMainVideoPoster()
    if (!useMobileCityPhoto()) prefetchCityVideos()
  })

  const showForward = () => {
    if (useMobileMainPhoto()) {
      showPhotoForward(mainPhotoFwd, mainPhotoRev)
      return
    }
    vrev.pause()
    vrev.hidden = true
    vfwd.hidden = false
    vfwd.classList.add('is-frame-ready')
    if (mainVideoIntroDone) vfwd.classList.add('is-no-fade')
  }
  const showReverse = () => {
    if (useMobileMainPhoto()) {
      showPhotoReverse(mainPhotoFwd, mainPhotoRev)
      return
    }
    ensureVideoSrc(vrev)
    vfwd.pause()
    vfwd.hidden = true
    vrev.hidden = false
  }
  const durF = () => isFinite(vfwd.duration) && vfwd.duration > 0 ? vfwd.duration : null
  const durR = () => isFinite(vrev.duration) && vrev.duration > 0 ? vrev.duration : null
  const syncReverseFromForward = () => {
    const dF = durF()
    const dR = durR() || dF
    if (!dF || !dR) return
    try { vrev.currentTime = Math.max(0, dR - vfwd.currentTime) } catch (e) {}
  }
  const syncForwardFromReverse = () => {
    const dF = durF()
    const dR = durR() || dF
    if (!dF || !dR) return
    try { vfwd.currentTime = Math.max(0, dF - vrev.currentTime) } catch (e) {}
  }

  const showCityForward = () => {
    if (!hasCity) return
    if (useMobileCityPhoto()) {
      showCityPhoto()
      return
    }
    cvrev.pause()
    cvrev.hidden = true
    cvfwd.hidden = false
  }
  const showCityReverse = () => {
    if (!hasCity) return
    if (useMobileCityPhoto()) {
      showCityPhoto()
      return
    }
    ensureVideoSrc(cvrev)
    cvfwd.pause()
    cvfwd.hidden = true
    cvrev.hidden = false
  }
  const durCF = () => isFinite(cvfwd.duration) && cvfwd.duration > 0 ? cvfwd.duration : null
  const durCR = () => isFinite(cvrev.duration) && cvrev.duration > 0 ? cvrev.duration : null
  const syncCityForwardFromReverse = () => {
    const dF = durCF()
    const dR = durCR() || dF
    if (!dF || !dR) return
    try { cvfwd.currentTime = Math.max(0, dF - cvrev.currentTime) } catch (e) {}
  }
  const pauseCityVideos = () => {
    if (!hasCity) return
    cvfwd.pause()
    cvrev.pause()
  }
  const resetCityVideosToStart = () => {
    if (!hasCity) return
    if (useMobileCityPhoto()) {
      showCityPhoto()
      return
    }
    pauseCityVideos()
    showCityForward()
    try { cvfwd.currentTime = 0 } catch (e) {}
    try { cvrev.currentTime = 0 } catch (e) {}
  }
  const setCityVideosToEnd = () => {
    if (!hasCity) return
    if (useMobileCityPhoto()) return
    pauseCityVideos()
    showCityForward()
    const dF = durCF()
    if (dF) {
      try { cvfwd.currentTime = Math.max(0, dF - 0.02) } catch (e) {}
    }
  }

  const playCityReverseVideo = async () => {
    if (!hasCity) return
    if (useMobileCityPhoto()) return
    ensureVideoSrc(cvrev)
    showCityReverse()
    await nextPaint()
    delete cvrev.dataset.warmed
    try { cvrev.load() } catch (e) {}
    await playVideo(cvrev, { show: showCityReverse, fromStart: true })
  }

  const matchesTransitionProp = (eventProp, expected) => {
    if (!eventProp || !expected) return false
    if (eventProp === expected) return true
    if (expected === 'clip-path' && eventProp.includes('clip-path')) return true
    return false
  }

  const waitTransitionEnd = (el, propertyName, timeoutMs = 3000) => new Promise((resolve) => {
    if (!el) return resolve()
    let done = false
    const finish = () => {
      if (done) return
      done = true
      el.removeEventListener('transitionend', onEnd)
      clearTimeout(fallback)
      resolve()
    }
    const onEnd = (e) => {
      if (e.target !== el) return
      if (!matchesTransitionProp(e.propertyName, propertyName)) return
      finish()
    }
    const fallback = setTimeout(finish, timeoutMs)
    el.addEventListener('transitionend', onEnd)
  })

  const waitPair = (a, b, propertyName, timeoutMs) => Promise.all([
    waitTransitionEnd(a, propertyName, timeoutMs),
    waitTransitionEnd(b, propertyName, timeoutMs)
  ])

  const infoSliderInfo = () => infoSlider?.querySelector('.info-slider__info')
  const infoSliderPhoto = () => infoSlider?.querySelector('.info-slider__photo')

  const waitInfoSliderPanels = () => {
    if (!hasInfoSlider) return Promise.resolve()
    const ms = window.matchMedia('(max-width: 640px)').matches ? INFO_PANEL_MOBILE_MS : INFO_PANEL_MS
    return waitPair(infoSliderInfo(), infoSliderPhoto(), 'transform', ms)
  }

  const nextPaint = () => new Promise((resolve) => {
    requestAnimationFrame(() => {
      requestAnimationFrame(resolve)
    })
  })

  const wait = (ms) => new Promise((r) => setTimeout(r, ms))

  const syncFacadeSceneClass = () => {
    document.body.classList.toggle(
      'is-facade-scene',
      slide === 3
        && section.classList.contains('is-revealed')
        && !section.classList.contains('is-rooms')
    )
  }

  const setShifted = (value, { instant = false } = {}) => {
    section.classList.toggle('is-shifted', value)
    document.body.classList.toggle('is-shifted', value)
    if (value && instant) {
      section.classList.add('is-shifted-static')
    } else {
      section.classList.remove('is-shifted-static')
    }
  }
  const setRevealed = (value, { instant = false } = {}) => {
    section.classList.toggle('is-revealed', value)
    if (!value) {
      section.classList.remove('is-revealed-static')
      syncFacadeSceneClass()
      return
    }
    if (instant) {
      section.classList.add('is-revealed-static')
    }
    syncFacadeSceneClass()
  }
  const setRooms = (value, { reset = false } = {}) => {
    if (!hasRooms) return
    section.classList.toggle('is-rooms', value)
    rooms.classList.toggle('is-open', value)
    syncFacadeSceneClass()
    if (value) {
      if (reset) {
        roomsSlider()?.open?.()
      } else {
        roomsSlider()?.resume?.()
      }
    } else {
      roomsSlider()?.close?.()
    }
  }
  const resetCityVideo = () => {
    cityAwaitingScroll = false
    cityPlaying = false
    cityVideoDone = false
    resetCityVideosToStart()
  }
  const setCity = (value, { resetVideo = true } = {}) => {
    if (!hasCity) return
    section.classList.toggle('is-city', value)
    if (value) {
      section.classList.remove('is-map')
      window.HotelMap?.hide?.()
      prefetchCityVideos()
      if (resetVideo) {
        resetCityVideo()
        cityAwaitingScroll = true
      }
    } else if (resetVideo) {
      resetCityVideo()
    }
  }
  const setMap = (value, { resetCity = false } = {}) => {
    if (!hasMap) return
    section.classList.toggle('is-map', value)
    if (value) {
      section.classList.remove('is-city')
      if (resetCity) resetCityVideo()
      window.HotelMap?.hide?.()
      if (!section.classList.contains('is-map-entering')) {
        requestAnimationFrame(() => {
          window.HotelMap?.centerStage?.()
          window.HotelMap?.updateHintArrows?.()
        })
      }
    } else {
      window.HotelMap?.hide?.()
    }
  }
  const setInfoSlider = (value, { reset = false } = {}) => {
    if (!hasInfoSlider) return
    if (value) {
      const wasActive = section.classList.contains('is-info-slider')
      section.classList.add('is-info-slider')
      if (wasActive) infoSliderApi()?.close?.()
      requestAnimationFrame(() => {
        infoSliderApi()?.open?.({ reset })
      })
      return
    }
    infoSliderApi()?.close?.()
  }

  const finishInfoScene = ({ scrollBy = 0 } = {}) => {
    if (isSceneDone() && isFooterMode()) return
    slide = SCENE_DONE_SLIDE
    footerScrollVisited = false
    document.body.classList.add('is-scene-done')
    document.documentElement.classList.remove('is-hero-scene')
    document.documentElement.classList.add('is-scene-done')
    ensureScrollUnlocked()
    vfwd?.pause()
    vrev?.pause()
    section.classList.add('is-info-slider')
    infoSliderApi()?.ensureOpen?.()
    afterFooterUnlock()
    if (scrollBy > 0) {
      requestAnimationFrame(() => {
        if (getMaxPageScroll() > 0) {
          window.scrollBy({ top: scrollBy, left: 0, behavior: 'auto' })
        }
      })
    }
  }

  const closeRoomsPanels = () => {
    if (!hasRooms) return
    roomsSlider()?.stopAutoplay?.()
    rooms.classList.remove('is-open')
  }

  const openRoomsPanels = ({ reset = false } = {}) => {
    if (!hasRooms) return
    section.classList.add('is-rooms')
    if (reset) {
      roomsSlider()?.open?.()
    } else {
      roomsSlider()?.resume?.()
    }
    rooms.classList.add('is-open')
  }

  const openRoomsPanelsFromCity = () => {
    if (!hasRooms) return
    section.classList.add('is-rooms')
    roomsSlider()?.resumeFromCity?.()
    rooms.classList.add('is-open')
  }

  const goToCity = async () => {
    if (!hasCity || slide !== 4) return
    prefetchCityVideos()
    section.classList.remove('is-rooms-returning')
    setCity(true)
    if (city) city.classList.add('is-ready')
    section.classList.add('is-rooms-leaving')
    closeRoomsPanels()
    const done = waitPair(roomsPhoto, roomsInfo, 'transform', ROOMS_MS)
    await done
    section.classList.remove('is-rooms', 'is-rooms-leaving')
    roomsSlider()?.close?.()
    if (city) city.classList.remove('is-ready')
    slide = 5
  }

  const goToRoomsFromCity = async () => {
    if (!hasRooms || slide !== 5 || !hasCity) return
    setRevealed(true, { instant: true })
    section.classList.add('is-rooms-returning')
    openRoomsPanelsFromCity()
    const done = waitPair(roomsPhoto, roomsInfo, 'transform', ROOMS_MS)
    await done
    slide = 4
    blockInput(250)
  }

  const goToFacadeFromRooms = async () => {
    if (!hasRooms || slide !== 4) return
    setRevealed(true, { instant: true })
    section.classList.add('is-rooms-to-facade')
    setCity(false, { resetVideo: false })
    setMap(false)
    section.classList.remove('is-rooms-returning')
    roomsSlider()?.stopAutoplay?.()
    await wait(50)
    rooms.classList.remove('is-open')
    const done = waitPair(roomsPhoto, roomsInfo, 'transform', ROOMS_MS)
    await done
    setRooms(false)
    section.classList.remove('is-rooms-to-facade')
    slide = 3
    blockInput(250)
  }

  const goToMapFromCity = async () => {
    if (!hasMap || slide !== 5 || !cityVideoDone) return
    if (useMobileCityPhoto()) {
      await animateCityMapCrossfade(true)
      slide = 6
      return
    }
    setCityVideosToEnd()
    showCityForward()
    ensureVideoSrc(cvrev)
    warmUpVideo(cvrev)
    section.classList.add('is-map-entering')
    setMap(true)
    await nextPaint()
    window.HotelMap?.centerStage?.()
    await nextPaint()
    section.classList.remove('is-map-entering')
    await waitTransitionEnd(map, 'opacity', MAP_MS)
    slide = 6
  }

  const leaveMapAndPlayCityReverse = async () => {
    if (!hasCity || slide !== 6 || !hasMap) return

    blockInput(useMobileCityPhoto() ? 400 : INPUT_COOLDOWN_MS)
    cityPlaying = true

    if (useMobileCityPhoto()) {
      cityAwaitingScroll = false
      slide = 5
      try {
        await animateCityMapCrossfade(false)
        window.HotelMap?.hide?.()
        cityVideoDone = false
        cityAwaitingScroll = true
      } finally {
        cityPlaying = false
      }
      return
    }

    section.classList.add('is-map-leaving')
    window.HotelMap?.hide?.()
    cityAwaitingScroll = false
    section.classList.add('is-city')
    slide = 5

    try {
      await playCityReverseVideo()
      await waitTransitionEnd(map, 'opacity', MAP_MS)
      section.classList.remove('is-map', 'is-map-leaving')
      syncCityForwardFromReverse()
      showCityForward()
      try { cvfwd.currentTime = 0 } catch (e) {}
      cityVideoDone = false
      cityAwaitingScroll = true
    } finally {
      cityPlaying = false
    }
  }

  const goToCityFromMap = () => leaveMapAndPlayCityReverse()

  const goToInfoFromMap = async () => {
    if (!hasInfoSlider || slide !== 6 || !hasMap) return
    setInfoSlider(true, { reset: true })
    await waitInfoSliderPanels()
    slide = 7
  }

  const goToMapFromInfo = async () => {
    if (!hasInfoSlider || slide !== 7 || !hasMap) return
    setInfoSlider(false)
    setMap(true)
    await nextPaint()
    window.HotelMap?.centerStage?.()
    await waitInfoSliderPanels()
    section.classList.remove('is-info-slider')
    slide = 6
  }

  const startCityVideo = async () => {
    if (slide !== 5 || !hasCity || !cityAwaitingScroll || cityPlaying || busy) return
    cityAwaitingScroll = false
    cityPlaying = true
    busy = true
    try {
      if (useMobileCityPhoto()) {
        cityAwaitingScroll = false
        cityVideoDone = true
        if (hasMap) await goToMapFromCity()
      } else {
        prefetchCityVideos()
        await playVideo(cvfwd, { show: showCityForward, fromStart: true })
        setCityVideosToEnd()
        showCityForward()
        prefetchCityVideos()
        cityVideoDone = true
        if (hasMap) await goToMapFromCity()
      }
    } finally {
      cityPlaying = false
      busy = false
    }
  }

  const startCityVideoReverse = async () => {
    if (slide !== 5 || !hasCity || !cityVideoDone || cityPlaying || busy) return
    cityPlaying = true
    busy = true
    try {
      if (useMobileCityPhoto()) {
        cityVideoDone = false
        cityAwaitingScroll = true
        showCityPhoto()
      } else {
        await playCityReverseVideo()
        syncCityForwardFromReverse()
        showCityForward()
        try { cvfwd.currentTime = 0 } catch (e) {}
        cityVideoDone = false
        cityAwaitingScroll = true
      }
    } finally {
      cityPlaying = false
      busy = false
    }
  }

  const go = async (target) => {
    if (busy) return
    if (target === slide) return
    if (isSceneDone()) return
    if (target < 0 || target > MAX_SLIDE) return

    if (target > slide) {
      if (slide === 4 && hasRooms && roomsBusy()) return
      if (slide === 5 && hasCity && cityPlaying) return
    } else {
      if (slide === 4 && hasRooms && roomsBusy()) return
      if (slide === 5 && cityPlaying) return
      if (slide === 5 && cityVideoDone) return
    }

    busy = true
    try {
      if (target > slide) {
        if (slide === 0) {
          setShifted(true)
          if (useMobileMainPhoto()) {
            await Promise.all([
              wait(SHIFT_MS),
              playMobileMainPhoto(true)
            ])
            showPhotoForward(mainPhotoFwd, mainPhotoRev)
            mainVideoIntroDone = true
            slide = 2
          } else {
            const token = ++heroPlayToken
            showForward()
            kickVideoPlay(vfwd, { fromStart: true })
            warmUpVideo(vfwd)
            prefetchHeroReverse()
            const fallback = window.setTimeout(() => {
              finishBlockedHeroIntro(token)
            }, SHIFT_MS + 500)
            try {
              await Promise.all([
                wait(SHIFT_MS),
                playVideo(vfwd, { show: showForward, fromStart: true, token })
              ])
            } finally {
              window.clearTimeout(fallback)
            }
            prefetchHeroReverse()
            if (token === heroPlayToken) slide = 2
          }
        } else if (slide === 2) {
          setRevealed(true)
          await nextPaint()
          await waitTransitionEnd(reveal, 'clip-path', 2600)
          section.classList.add('is-revealed-static')
          slide = 3
          syncFacadeSceneClass()
          prefetchCityVideos()
        } else if (slide === 3 && hasRooms) {
          prefetchCityVideos()
          setRevealed(true, { instant: true })
          const done = waitPair(roomsPhoto, roomsInfo, 'transform', ROOMS_MS)
          setRooms(true, { reset: true })
          await done
          slide = 4
        } else if (slide === 4 && hasCity) {
          await goToCity()
        } else if (slide === 5 && hasMap) {
          await goToMapFromCity()
        } else if (slide === 6 && hasInfoSlider) {
          await goToInfoFromMap()
        }
      } else {
        if (slide === 7 && hasInfoSlider) {
          await goToMapFromInfo()
        } else if (slide === 6 && hasMap) {
          await goToCityFromMap()
        } else if (slide === 5 && hasCity) {
          await goToRoomsFromCity()
        } else if (slide === 4 && hasRooms) {
          await goToFacadeFromRooms()
        } else if (slide === 3) {
          section.classList.add('is-reveal-closing')
          setRevealed(false)
          await waitTransitionEnd(reveal, 'clip-path', 2600)
          section.classList.remove('is-reveal-closing')
          slide = 2
        } else if (slide === 2) {
          if (useMobileMainPhoto()) {
            setShifted(false)
            await Promise.all([
              wait(SHIFT_MS),
              playMobileMainPhoto(false)
            ])
            showPhotoReverse(mainPhotoFwd, mainPhotoRev)
            slide = 0
          } else {
            const token = ++heroPlayToken
            setShifted(true, { instant: true })
            ensureVideoSrc(vrev)
            showReverse()
            syncReverseFromForward()
            kickVideoPlay(vrev, { fromStart: true })
            warmUpVideo(vrev)
            await waitMedia(vrev, 'canplaythrough', 8000)
            if (token !== heroPlayToken) return
            await playVideo(vrev, { show: showReverse, fromStart: false, token })
            if (token !== heroPlayToken) return
            syncForwardFromReverse()
            showForward()
            setShifted(false)
            await wait(SHIFT_MS)
            slide = 0
          }
        }
      }
    } finally {
      busy = false
      syncFacadeSceneClass()
    }
  }

  const next = () => {
    if (isSceneDone()) return
    if (busy) return

    if (slide === 5 && hasCity) {
      if (cityPlaying) return
      if (cityAwaitingScroll) {
        startCityVideo()
        return
      }
      return
    }

    if (slide === 6 && hasMap && !hasInfoSlider) {
      return
    }

    if (slide === 7 && hasInfoSlider) {
      finishInfoScene()
      return
    }

    go(slide + 1)
  }

  const prev = () => {
    if (isFooterMode() && atPageTop()) {
      if (tryLeaveFooterScene()) return
    }
    if (isSceneDone()) return

    if (busy && isIntroTransition()) {
      abortHeroPlay()
      setShifted(false)
      showForward()
      try { vfwd.currentTime = 0 } catch (e) {}
      primeMainVideoPoster()
      return
    }

    if (busy) return

    if (slide === 5 && cityPlaying) return

    if (slide === 6 && hasMap && hasCity) {
      if (busy || cityPlaying) return
      busy = true
      leaveMapAndPlayCityReverse().finally(() => { busy = false })
      return
    }

    if (slide === 5 && hasCity && cityVideoDone) {
      if (busy || cityPlaying) return
      busy = true
      startCityVideoReverse().finally(() => { busy = false })
      return
    }

    go(slide - 1)
  }

  const modal = document.querySelector('.modal')
  const INPUT_COOLDOWN_MS = 800
  let inputBlockedUntil = 0

  const blockInput = (ms = INPUT_COOLDOWN_MS) => {
    inputBlockedUntil = performance.now() + ms
  }

  const isModalOpen = () => modal?.classList.contains('open') || document.body.classList.contains('lock')

  const isInputBlocked = () => isModalOpen() || performance.now() < inputBlockedUntil

  const isInsideModal = (target) => target?.closest?.(
    '.modal, .main__map-modal, .services-modal, .events-modal, .shop-modal, .question-modal'
  )
  const isInsideModalScroller = (target) => target?.closest?.(
    '.modal__info, .main__map-modal-info, .services-modal__info, .events-modal__content, .shop-modal__content, .question-modal__panel'
  )

  if (modal) {
    const observer = new MutationObserver(() => {
      if (modal.classList.contains('open')) blockInput(INPUT_COOLDOWN_MS)
      else blockInput(INPUT_COOLDOWN_MS)
    })
    observer.observe(modal, { attributes: true, attributeFilter: ['class'] })
  }

  window.HotelHero = {
    blockInput,
    getSlide: () => slide,
    finishInfoScene,
    resumeHeroScene,
    setRoomsTourDone: () => {},
    onRoomsTourComplete: () => {}
  }

  const syncPageFlowState = () => {
    if (!document.body.classList.contains('is-scene-done')) return
    syncFooterScrollState()
    section.classList.add('is-info-slider')
    infoSliderApi()?.ensureOpen?.()
  }

  syncPageFlowState()
  window.addEventListener('pageshow', syncPageFlowState)

  window.addEventListener('wheel', (e) => {
    if (isPageFlowDone()) {
      handlePageFlowWheel(e)
      return
    }
    if (isInputBlocked()) {
      if (!isInsideModal(e.target)) e.preventDefault()
      return
    }
    if (allowRevealWheelX(e)) return
    if (allowMapWheelX(e)) return
    if (allowRoomsWheelY(e)) return

    if (Math.abs(e.deltaY) >= WHEEL_MIN && e.deltaY > 0 && slide === 7 && hasInfoSlider) {
      finishInfoScene({ scrollBy: e.deltaY })
      e.preventDefault()
      return
    }
    if (busy) {
      e.preventDefault()
      if (e.deltaY > WHEEL_MIN && finishBlockedHeroIntro()) {
        next()
        return
      }
      if (e.deltaY < -WHEEL_MIN && isIntroTransition()) prev()
      return
    }

    wheelAccum += e.deltaY
    clearTimeout(wheelAccumTimer)
    wheelAccumTimer = window.setTimeout(() => { wheelAccum = 0 }, 140)
    if (Math.abs(wheelAccum) < WHEEL_MIN) {
      e.preventDefault()
      return
    }

    const dir = wheelAccum > 0 ? 1 : -1
    wheelAccum = 0
    e.preventDefault()
    if (dir > 0) next()
    else prev()
  }, { passive: false })

  window.addEventListener('keydown', (e) => {
    if (isPageFlowDone()) {
      syncFooterScrollState()
      if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
        if (canPageScrollDown()) {
          window.scrollBy({ top: 120, left: 0, behavior: 'auto' })
          e.preventDefault()
        }
        return
      }
      if (e.key === 'ArrowUp' || e.key === 'PageUp') {
        if (canPageScrollUp()) {
          window.scrollBy({ top: -120, left: 0, behavior: 'auto' })
          e.preventDefault()
          return
        }
        if (atPageTop() && tryLeaveFooterScene()) e.preventDefault()
        return
      }
      return
    }
    if (isInputBlocked()) {
      if (isInsideModal(e.target)) return
      e.preventDefault()
      return
    }
    if (e.key === 'ArrowDown' || e.key === 'PageDown' || e.key === ' ') {
      e.preventDefault(); next()
    } else if (e.key === 'ArrowUp' || e.key === 'PageUp') {
      e.preventDefault(); prev()
    }
  })

  window.addEventListener('touchstart', (e) => {
    touchStartY = e.touches[0].clientY
    touchStartX = e.touches[0].clientX
    if (isPageFlowDone()) {
      syncFooterScrollState()
      resetPanTouch()
      return
    }
    if (isInputBlocked()) {
      resetPanTouch()
      return
    }
    syncPanTouch(e)
  }, { passive: true })

  window.addEventListener('touchmove', (e) => {
    if (isPageFlowDone()) {
      handlePageFlowTouch(e)
      return
    }
    if (facadePanTouch || mapPanTouch) return
    if (slide === 7 && hasInfoSlider) {
      const touch = e.touches[0]
      const dx = Math.abs(touch.clientX - touchStartX)
      const dy = touchStartY - touch.clientY
      const dyAbs = Math.abs(dy)
      if (infoCanSwipeX() && dx > dyAbs) return
      if (dy > TOUCH_UNLOCK_SCENE && dyAbs >= dx) {
        finishInfoScene({ scrollBy: 0 })
        e.preventDefault()
        return
      }
    }
    if (isInputBlocked()) {
      if (isInsideModalScroller(e.target)) return
      e.preventDefault()
      return
    }
    if (allowRevealPan(e)) return
    if (allowMapPan(e)) return
    if (allowRoomsHorizontalPan(e)) return
    if (allowRoomsPan(e)) return
    e.preventDefault()
  }, { passive: false })

  window.addEventListener('touchcancel', resetPanTouch, { passive: true })

  window.addEventListener('touchend', (e) => {
    if (isPageFlowDone()) {
      syncFooterScrollState()
      const dy = touchStartY - e.changedTouches[0].clientY
      tryLeaveFooterBySwipe(dy)
      resetPanTouch()
      return
    }
    if (facadePanTouch && shouldIgnoreVerticalSwipe(e)) {
      resetPanTouch()
      return
    }
    if (mapPanTouch && shouldIgnoreVerticalSwipe(e)) {
      resetPanTouch()
      return
    }
    if (tryRoomsHorizontalSwipe(e)) {
      resetPanTouch()
      return
    }
    if (tryInfoHorizontalSwipe(e)) {
      resetPanTouch()
      return
    }
    resetPanTouch()
    if (isInputBlocked()) {
      e.preventDefault()
      return
    }
    const dy = touchStartY - e.changedTouches[0].clientY
    const dx = touchStartX - e.changedTouches[0].clientX
    if (busy) {
      if (dy > TOUCH_MIN && Math.abs(dy) >= Math.abs(dx) && finishBlockedHeroIntro()) {
        next()
        return
      }
      if (dy < -TOUCH_MIN && Math.abs(dy) >= Math.abs(dx) && isIntroTransition()) prev()
      return
    }
    if (isFacadeScene() && revealCanScrollX() && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= TOUCH_MIN) return
    if (isMapScene() && mapCanScrollX() && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= TOUCH_MIN) return
    if (roomsCanSwipeX() && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= TOUCH_MIN) return
    if (infoCanSwipeX() && Math.abs(dx) > Math.abs(dy) && Math.abs(dx) >= TOUCH_MIN) return
    if (Math.abs(dy) < TOUCH_MIN) return
    if (dy > 0) {
      if (slide === 7 && hasInfoSlider) {
        finishInfoScene({ scrollBy: 0 })
        return
      }
      next()
    } else prev()
  }, { passive: true })

  lockPageScroll()
  if (useMobileMainPhoto()) {
    showPhotoReverse(mainPhotoFwd, mainPhotoRev)
    mainVideoIntroDone = true
  } else {
    primeFirstFrame(vfwd)
    showForward()
      warmUpVideo(vfwd)
    setupMainVideoPoster()
      window.setTimeout(prefetchHeroReverse, 400)
  }
  if (hasCity) {
    if (useMobileCityPhoto()) {
      showCityPhoto()
    } else {
      showCityForward()
    }
  }
})();

(function () {
  'use strict'

  const root = document.querySelector('.main__reveal-svg')
  const stage = document.querySelector('.main__reveal-stage')
  const tooltip = document.querySelector('.main__reveal-tooltip')
  if (!root || !tooltip) return
  const svg = root.querySelector('svg')
  if (!svg) return

  const DEBUG = /[?&]debug\b/.test(location.search)

  const DEV_MODAL_OPEN = false
  const DEV_MODAL_ROOM_ID = '0_51'

  const AMENITY_ICON_BASE = 'img/svg/'
  const FACADE_SCROLL_MQ = window.matchMedia('(max-width: 640px)')
  const roomsCatalog = () => window.HotelRooms || {}

  const isYellow = (el) => (el.getAttribute('fill') || '').toLowerCase() === '#fdde91'

  const labelPaths = Array.from(svg.querySelectorAll('path')).filter(isYellow)
  labelPaths.forEach((el) => {
    el.classList.add('main__reveal-w-label')
    el.removeAttribute('fill')
  })

  const rects = Array.from(svg.querySelectorAll('rect'))
    .filter((el) => isYellow(el) || el.hasAttribute('data-room') || el.classList.contains('main__reveal-w-item'))

  rects.forEach((el) => {
    el.classList.add('main__reveal-w-item')
    el.removeAttribute('fill')
  })

  const buildRooms = () => {
    const byId = new Map()
    rects.forEach((rect, i) => {
      const gid = rect.getAttribute('data-room-id') || ('__win_' + i)
      const name = rect.getAttribute('data-room') || ''
      let room = byId.get(gid)
      if (!room) {
        room = { id: gid, label: name, windows: [] }
        byId.set(gid, room)
      }
      if (!room.label && name) room.label = name
      room.windows.push(rect)
    })
    return [...byId.values()]
  }

  let rooms = buildRooms()
  let map = new Map(rooms.map((r) => [r.id, r]))

  const renderDebug = () => {
    root.querySelectorAll('.main__reveal-w-debug').forEach((n) => n.remove())
    if (!DEBUG) return
    rooms.forEach((r, idx) => {
      let minX = Infinity, maxX = -Infinity, maxY = -Infinity
      r.windows.forEach((w) => {
        const b = w.getBBox()
        if (b.x < minX) minX = b.x
        if (b.x + b.width > maxX) maxX = b.x + b.width
        if (b.y + b.height > maxY) maxY = b.y + b.height
      })
      const t = document.createElementNS('http://www.w3.org/2000/svg', 'text')
      t.setAttribute('x', (minX + maxX) / 2)
      t.setAttribute('y', maxY + 22)
      t.setAttribute('text-anchor', 'middle')
      t.setAttribute('fill', '#FDDE91')
      t.setAttribute('font-size', '18')
      t.setAttribute('font-weight', '700')
      t.setAttribute('class', 'main__reveal-w-debug')
      t.style.pointerEvents = 'none'
      t.textContent = (idx + 1) + ' · ' + (r.label || r.id)
      svg.appendChild(t)
    })
    console.table(rooms.map((r, i) => ({ n: i + 1, id: r.id, label: r.label, windows: r.windows.length })))
  }
  renderDebug()

  const tooltipPositionFromRoom = (room) => {
    const parent = tooltip.offsetParent || tooltip.parentElement
    const parentRect = parent.getBoundingClientRect()
    let minX = Infinity
    let maxBottom = -Infinity
    room.windows.forEach((w) => {
      const r = w.getBoundingClientRect()
      const lx = r.left - parentRect.left
      const by = r.bottom - parentRect.top
      if (lx < minX) minX = lx
      if (by > maxBottom) maxBottom = by
    })
    return { cx: minX, cy: maxBottom + 10 }
  }

  let activeId = null
  let hoverId = null

  const hint = document.querySelector('.main__hint')
  const hintPrev = hint?.querySelector('.main__hint-arrow--prev')
  const hintNext = hint?.querySelector('.main__hint-arrow--next')
  const HINT_SCROLL_RATIO = 0.35

  const hintCanScroll = () => {
    if (!FACADE_SCROLL_MQ.matches || !stage) return false
    return stage.scrollWidth > stage.clientWidth + 1
  }

  const updateHintArrows = () => {
    if (!hint || !hintPrev || !hintNext) return
    const can = hintCanScroll()
    hint.classList.toggle('is-scrollable', can)
    if (!can) {
      hintPrev.disabled = true
      hintNext.disabled = true
      return
    }
    const max = stage.scrollWidth - stage.clientWidth
    const sl = stage.scrollLeft
    hintPrev.disabled = sl <= 1
    hintNext.disabled = sl >= max - 1
  }

  const scrollHint = (dir) => {
    if (!stage || !hintCanScroll()) return
    stage.scrollBy({ left: dir * stage.clientWidth * HINT_SCROLL_RATIO, behavior: 'smooth' })
  }

  hintPrev?.addEventListener('click', (e) => {
    e.stopPropagation()
    scrollHint(-1)
  })
  hintNext?.addEventListener('click', (e) => {
    e.stopPropagation()
    scrollHint(1)
  })

  const centerStage = () => {
    if (!stage) return
    if (!FACADE_SCROLL_MQ.matches) {
      stage.scrollLeft = 0
      updateHintArrows()
      return
    }
    if (stage.scrollWidth <= stage.clientWidth + 1) {
      stage.scrollLeft = 0
      updateHintArrows()
      return
    }
    stage.scrollLeft = (stage.scrollWidth - stage.clientWidth) / 2
    updateHintArrows()
  }

  const refreshTooltip = () => {
    if (activeId) {
      const r = map.get(activeId)
      if (r) pinTooltipTo(r)
      return
    }
    if (hoverId) {
      const r = map.get(hoverId)
      if (r) pinTooltipTo(r)
    }
  }

  const setHover = (id) => {
    hoverId = id
    rooms.forEach((r) => {
      const on = id !== null && r.id === id
      r.windows.forEach((w) => w.classList.toggle('hover', on))
    })
  }
  const setActive = (id) => {
    activeId = id
    rooms.forEach((r) => {
      const on = r.id === id
      r.windows.forEach((w) => w.classList.toggle('active', on))
    })
  }

  const showTooltip = (text, cx, cy) => {
    tooltip.textContent = text
    tooltip.style.left = cx + 'px'
    tooltip.style.top = cy + 'px'
    tooltip.classList.add('active')
  }
  const hideTooltip = () => tooltip.classList.remove('active')

  const pinTooltipTo = (room) => {
    const title = roomPayload(room).title
    const { cx, cy } = tooltipPositionFromRoom(room)
    showTooltip(title, cx, cy)
  }

  
  const normalizeRoomPayload = (raw, fallbackTitle) => {
    if (!raw || typeof raw !== 'object') {
      return {
        title: fallbackTitle || '',
        price: '',
        description: '',
        image: '',
        portrait: '',
        amenities: []
      }
    }
    const amenities = Array.isArray(raw.amenities)
      ? raw.amenities.map((item) => {
          if (typeof item === 'string') return { icon: item, label: item }
          return {
            icon: item.icon || '',
            label: item.label || item.title || ''
          }
        })
      : []
    return {
      title: raw.title || fallbackTitle || '',
      price: raw.price || '',
      description: raw.description || raw.desc || '',
      image: raw.image || raw.photo || '',
      portrait: raw.portrait || '',
      amenities
    }
  }

  const roomPayload = (room) => {
    const raw = roomsCatalog()[room.id]
    return normalizeRoomPayload(raw, room.label)
  }

  const modal = document.querySelector('.modal')
  const modalTitle = modal?.querySelector('.modal__wrapper-info-title')
  const modalPrice = modal?.querySelector('.modal__wrapper-info-price')
  const modalDesc = modal?.querySelector('.modal__wrapper-info-desc')
  const modalPhoto = modal?.querySelector('.modal__wrapper-photo-img')
  const modalPortraitImgs = modal?.querySelectorAll('.modal__wrapper-info-portrait-img')
  const modalAmenities = modal?.querySelector('.modal__wrapper-info-amenities')
  const modalClose = modal?.querySelector('.modal__wrapper-info-close')
  const modalBack = modal?.querySelector('.modal__back')
  const modalWrapper = modal?.querySelector('.modal__wrapper')
  const modalInfoBody = modal?.querySelector('.modal__wrapper-info-body')
  const MODAL_SWIPE_CLOSE = 90
  const MODAL_SWIPE_MIN = 10
  const MODAL_DISMISS_MS = 420
  const MODAL_CLOSE_MS = 850
  const MODAL_CLOSE_MS_MOBILE = 1080
  const MODAL_CLOSE_FALLBACK_MS = 150
  let modalTouchStartY = 0
  let modalTouchStartX = 0
  let modalDragY = 0
  let modalDragging = false
  let modalDismissTimer = 0

  const canModalSwipe = () => {
    if (!FACADE_SCROLL_MQ.matches || !modal?.classList.contains('open')) return false
    return !modal.classList.contains('is-dismissing')
  }

  const resetModalDrag = () => {
    modalDragY = 0
    modalDragging = false
    modal?.classList.remove('is-dragging')
    if (!modalWrapper) return
    modalWrapper.style.transition = ''
    modalWrapper.style.transform = ''
  }

  const clearModalDismissStyles = () => {
    if (modalBack) {
      modalBack.style.transition = ''
      modalBack.style.opacity = ''
    }
    if (modalDismissTimer) {
      window.clearTimeout(modalDismissTimer)
      modalDismissTimer = 0
    }
  }

  const finishCloseModal = () => {
    if (!modal) return
    clearModalDismissStyles()
    modal.classList.remove('open', 'is-dismissing', 'is-dragging', 'is-closing')
    resetModalDrag()
    document.body.classList.remove('lock')
    window.HotelHero?.blockInput?.()
    setActive(null)
    setHover(null)
    hideTooltip()
  }

  const dismissModalAnimated = () => {
    if (!modal || modal.classList.contains('is-dismissing') || modal.classList.contains('is-closing')) return
    resetModalDrag()
    modal.classList.add('is-closing')
    modal.classList.remove('open')

    const photo = modal.querySelector('.modal__wrapper-photo')
    let finished = false

    const finish = () => {
      if (finished) return
      finished = true
      if (modalDismissTimer) {
        window.clearTimeout(modalDismissTimer)
        modalDismissTimer = 0
      }
      photo?.removeEventListener('transitionend', onTransitionEnd)
      finishCloseModal()
    }

    const onTransitionEnd = (e) => {
      if (e.target !== photo) return
      if (e.propertyName !== 'transform' && e.propertyName !== '-webkit-transform') return
      finish()
    }

    photo?.addEventListener('transitionend', onTransitionEnd)

    const ms = (FACADE_SCROLL_MQ.matches ? MODAL_CLOSE_MS_MOBILE : MODAL_CLOSE_MS) + MODAL_CLOSE_FALLBACK_MS
    modalDismissTimer = window.setTimeout(finish, ms)
  }

  const dismissModalBySwipe = (fromY) => {
    if (!modal || !modalWrapper || modal.classList.contains('is-dismissing')) return
    modalDragging = false
    modal.classList.remove('is-dragging')
    modal.classList.add('is-dismissing')

    const distance = modalWrapper.getBoundingClientRect().height
    const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'

    modalWrapper.style.transition = 'none'
    modalWrapper.style.transform = `translate3d(0, ${fromY}px, 0)`
    void modalWrapper.offsetHeight
    modalWrapper.style.transition = `transform ${MODAL_DISMISS_MS}ms ${easing}`
    modalWrapper.style.transform = `translate3d(0, ${distance}px, 0)`

    if (modalBack) {
      modalBack.style.transition = `opacity ${MODAL_DISMISS_MS}ms ease`
      modalBack.style.opacity = '0'
    }

    modalDismissTimer = window.setTimeout(finishCloseModal, MODAL_DISMISS_MS)
  }

  const setModalDrag = (y) => {
    if (!modalWrapper) return
    modalWrapper.style.transition = 'none'
    modalWrapper.style.transform = y > 0 ? `translate3d(0, ${y}px, 0)` : ''
  }

  const snapModalDrag = () => {
    if (!modalWrapper || modalDragY <= 0) {
      resetModalDrag()
      return
    }
    modalDragging = false
    modal?.classList.remove('is-dragging')
    modalWrapper.style.transition = 'transform .25s ease'
    modalWrapper.style.transform = ''
    modalDragY = 0
    window.setTimeout(() => {
      if (modalWrapper) modalWrapper.style.transition = ''
    }, 250)
  }

  const fillAmenities = (items) => {
    if (!modalAmenities) return
    modalAmenities.replaceChildren()
    items.forEach((item) => {
      if (!item.icon) return
      const li = document.createElement('li')
      li.className = 'modal__wrapper-info-amenities-item'
      if (item.label) li.title = item.label
      const img = document.createElement('img')
      img.src = AMENITY_ICON_BASE + item.icon + '.svg'
      img.alt = item.label || ''
      li.appendChild(img)
      modalAmenities.appendChild(li)
    })
  }

  const fillModal = (payload) => {
    if (!modal) return
    if (modalTitle) modalTitle.textContent = payload.title || ''
    if (modalPrice) modalPrice.textContent = payload.price || ''
    if (modalDesc) modalDesc.textContent = payload.description || ''
    if (modalPhoto) {
      modalPhoto.src = payload.image
      modalPhoto.alt = payload.title || ''
    }
    modalPortraitImgs?.forEach((img) => {
      img.src = payload.portrait
      img.alt = payload.title || ''
      img.hidden = !payload.portrait
    })
    fillAmenities(payload.amenities)
  }

  const openModal = (room) => {
    if (!modal || !room) return
    clearModalDismissStyles()
    resetModalDrag()
    modal.classList.remove('is-dismissing', 'is-closing')
    fillModal(roomPayload(room))
    modal.classList.add('open')
    document.body.classList.add('lock')
    setActive(room.id)
    hideTooltip()
    window.HotelHero?.blockInput?.()
  }

  const closeModal = () => {
    if (DEV_MODAL_OPEN) return
    if (!modal || modal.classList.contains('is-dismissing')) return
    dismissModalAnimated()
  }

  modalClose?.addEventListener('click', (e) => {
    e.stopPropagation()
    closeModal()
  })
  modalBack?.addEventListener('click', closeModal)

  modalWrapper?.addEventListener('touchstart', (e) => {
    if (e.target?.closest?.('.modal__wrapper-info-close, .modal__wrapper-info-actions, a, button')) return
    if (!canModalSwipe()) return
    if (modalInfoBody?.contains(e.target) && modalInfoBody.scrollTop > 0) return
    modalTouchStartY = e.touches[0].clientY
    modalTouchStartX = e.touches[0].clientX
    modalDragY = 0
    modalDragging = true
  }, { passive: true })

  modalWrapper?.addEventListener('touchmove', (e) => {
    if (!canModalSwipe() || !modalDragging) return
    const dy = e.touches[0].clientY - modalTouchStartY
    const dx = e.touches[0].clientX - modalTouchStartX
    if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MODAL_SWIPE_MIN) {
      snapModalDrag()
      return
    }
    if (dy <= 0) {
      if (modalDragY > 0) snapModalDrag()
      else resetModalDrag()
      return
    }
    modalDragY = dy
    modal?.classList.add('is-dragging')
    setModalDrag(dy)
    e.preventDefault()
  }, { passive: false })

  modalWrapper?.addEventListener('touchend', () => {
    if (!modalDragging) return
    if (modalDragY >= MODAL_SWIPE_CLOSE) {
      dismissModalBySwipe(modalDragY)
      return
    }
    snapModalDrag()
  }, { passive: true })

  modalWrapper?.addEventListener('touchcancel', snapModalDrag, { passive: true })

  const roomOfRect = (el) => {
    const gid = el.getAttribute('data-room-id')
    return gid ? map.get(gid) : null
  }

  rects.forEach((w) => {
    w.addEventListener('mouseenter', () => {
      const room = roomOfRect(w)
      if (!room) return
      if (activeId && activeId !== room.id) return
      setHover(room.id)
      pinTooltipTo(room)
    })
    w.addEventListener('mouseleave', () => {
      const room = roomOfRect(w)
      if (!room) return
      if (activeId === room.id) return
      setHover(null)
      hideTooltip()
    })
    w.addEventListener('click', (e) => {
      e.stopPropagation()
      const room = roomOfRect(w)
      if (!room) return
      openModal(room)
    })
  })

  window.HotelFacade = {
    openRoom: (roomId) => {
      const room = map.get(roomId)
      if (room) openModal(room)
    },
    closeModal,
    closeModalNow: finishCloseModal,
    fillModal,
    getPayload: roomPayload,
    isStagePanning: () => stagePanning
  }

  window.addEventListener('resize', () => {
    centerStage()
    renderDebug()
    refreshTooltip()
    updateHintArrows()
  })
  FACADE_SCROLL_MQ.addEventListener('change', () => {
    centerStage()
    updateHintArrows()
  })
  stage?.addEventListener('scroll', () => {
    refreshTooltip()
    updateHintArrows()
  }, { passive: true })

  let stagePanning = false

  const bindStageTouchPan = () => {
    if (!stage) return

    let active = false
    let locked = false
    let startX = 0
    let startY = 0
    let startScroll = 0

    stage.addEventListener('touchstart', (e) => {
      if (!FACADE_SCROLL_MQ.matches || !hintCanScroll()) return
      if (e.touches.length !== 1) return
      active = true
      locked = false
      stagePanning = false
      startX = e.touches[0].clientX
      startY = e.touches[0].clientY
      startScroll = stage.scrollLeft
    }, { passive: true })

    stage.addEventListener('touchmove', (e) => {
      if (!active || !FACADE_SCROLL_MQ.matches) return
      const x = e.touches[0].clientX
      const y = e.touches[0].clientY
      const dx = startX - x
      const dy = startY - y
      if (!locked) {
        if (Math.abs(dx) < 6 && Math.abs(dy) < 6) return
        if (Math.abs(dy) > Math.abs(dx)) {
          active = false
          return
        }
        locked = true
      }
      const max = Math.max(0, stage.scrollWidth - stage.clientWidth)
      stagePanning = true
      stage.scrollLeft = Math.max(0, Math.min(max, startScroll + dx))
      refreshTooltip()
      updateHintArrows()
      e.preventDefault()
      e.stopPropagation()
    }, { passive: false })

    const endStagePan = () => {
      active = false
      locked = false
      window.setTimeout(() => {
        stagePanning = false
      }, 80)
    }

    stage.addEventListener('touchend', endStagePan, { passive: true })
    stage.addEventListener('touchcancel', endStagePan, { passive: true })
  }

  bindStageTouchPan()

  centerStage()
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && (activeId || modal?.classList.contains('open'))) {
      closeModal()
    }
  })

  if (DEV_MODAL_OPEN && modal) {
    const room = map.get(DEV_MODAL_ROOM_ID) || rooms[0]
    if (room) openModal(room)
  }
})();

(function () {
  'use strict'

  const EVENTS = [
    {
      date: '2026-05-22',
      day: '22',
      month: '05',
      title: 'Выставка «Точки исчезновения»',
      preview: 'Опираясь на тексты Марты Рослер и Аллана Секулы, Анна Кулинова рассматривает право снимать всё, что попадает в поле зрения, как социальную конструкцию, закрепляющую неравенство между фотографом и человеком в кадре.',
      place: 'Дом М. Балахнина',
      image: 'img/20.jpg',
      imageAlt: 'Выставочное пространство',
      text: [
        'Опираясь на тексты Марты Рослер и Аллана Секулы, Анна Кулинова рассматривает право снимать всё, что попадает в поле зрения, как социальную конструкцию, закрепляющую неравенство между фотографом и человеком в кадре.'
      ],
      notice: 'Билеты приобретаются на стороннем ресурсе. Наш администратор с удовольствием поможет вам с покупкой. Можете написать ему напрямую или подойти на ресепшен'
    },
    {
      date: '2026-05-23',
      day: '23',
      month: '05',
      title: 'Фестиваль «Выходные на Ярмарке»',
      preview: 'Выходные на Нижегородской ярмарке: базар, фуд-корт, мастер-классы, игры, викторины и другие ярмарочные развлечения для всей семьи.',
      place: 'Нижегородская ярмарка',
      image: 'img/21.jpg',
      imageAlt: 'Нижегородская ярмарка',
      text: [
        'Выходные на Нижегородской ярмарке: базар, фуд-корт, мастер-классы, игры, викторины и другие ярмарочные развлечения для всей семьи.'
      ],
      notice: 'Билеты приобретаются на стороннем ресурсе. Наш администратор с удовольствием поможет вам с покупкой. Можете написать ему напрямую или подойти на ресепшен'
    },
    {
      date: '2026-05-29',
      day: '29',
      month: '05',
      title: 'Балет Бориса Эйфмана «Красная Жизель»',
      preview: '«Красная Жизель» повествует о судьбе русской балерины Ольги Спесивцевой. История жизни выдающейся танцовщицы, которая попала в революционный водоворот, эмигрировала из России и, пройдя череду личных драм и потрясений, очутилась в стенах лечебницы для умалишенных, была тонко прочувствована и виртуозно поведана Борисом Эйфманом.',
      place: 'ТЮЗ',
      image: 'img/22.jpg',
      imageAlt: 'Сцена балета Красная Жизель',
      text: [
        '«Красная Жизель» повествует о судьбе русской балерины Ольги Спесивцевой. История жизни выдающейся танцовщицы, которая попала в революционный водоворот, эмигрировала из России и, пройдя череду личных драм и потрясений, очутилась в стенах лечебницы для умалишенных, была тонко прочувствована и виртуозно поведана Борисом Эйфманом. Средствами пластики психологического балетного театра в спектакле передана трагедия беззащитности обладательницы блестящего дара перед ударами рока, гнетущими воспоминаниями и страхами. Спустя почти три десятилетия после премьеры Эйфман «заново сочинил» «Красную Жизель», значительно изменив ее хореографическую партитуру. Усовершенствованию подверглось и художественное оформление знаменитой постановки, в своем модернизированном виде ярко отражающее выразительные возможности современного сценического искусства.'
      ],
      notice: 'Билеты приобретаются на стороннем ресурсе. Наш администратор с удовольствием поможет вам с покупкой. Можете написать ему напрямую или подойти на ресепшен'
    },
    {
      date: '2026-06-03',
      day: '03',
      month: '06',
      title: 'Международный фестиваль искусств «Человек Альфа / ALFA HUMAN»',
      preview: 'Откроет фестиваль масштабный сайт-специфик перформанс и жанр пластично-диджея. Восхождение на Чкаловской лестнице.',
      place: 'Нижний Новгород / разные площадки',
      image: 'img/23.jpg',
      imageAlt: 'Фестиваль на Чкаловской лестнице',
      text: [
        'Откроет фестиваль масштабный сайт-специфик перформанс и жанр пластично-диджея.',
        'Восхождение на Чкаловской лестнице.'
      ],
      notice: 'Билеты приобретаются на стороннем ресурсе. Наш администратор с удовольствием поможет вам с покупкой. Можете написать ему напрямую или подойти на ресепшен'
    }
  ]

  const MODAL_CLOSE_MS = 650

  const createSvgUse = (symbolId) => {
    const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const use = document.createElementNS('http://www.w3.org/2000/svg', 'use')
    svg.setAttribute('viewBox', '0 0 24 24')
    use.setAttributeNS('http://www.w3.org/1999/xlink', 'xlink:href', `img/sprite.svg#${symbolId}`)
    svg.appendChild(use)
    return svg
  }

  const createEventItem = (eventItem, index) => {
    const item = document.createElement('article')
    item.className = 'events__item'

    const date = document.createElement('time')
    date.className = 'events__date'
    date.dateTime = eventItem.date

    const day = document.createElement('span')
    day.textContent = eventItem.day

    const month = document.createElement('small')
    month.textContent = `/ ${eventItem.month}`

    const media = document.createElement('div')
    media.className = 'events__media'

    const img = document.createElement('img')
    img.className = 'events__img'
    img.src = eventItem.image
    img.alt = eventItem.imageAlt || eventItem.title

    const content = document.createElement('div')
    content.className = 'events__content'

    const title = document.createElement('h2')
    title.className = 'events__item-title'
    title.textContent = eventItem.title

    const text = document.createElement('p')
    text.className = 'events__text'
    text.textContent = eventItem.preview

    const place = document.createElement('p')
    place.className = 'events__place'

    const placeText = document.createElement('span')
    placeText.textContent = eventItem.place

    const link = document.createElement('a')
    link.className = 'events__link btn'
    link.href = '#'
    link.dataset.eventMore = String(index)
    link.textContent = 'Подробнее'

    date.append(day, month)
    media.appendChild(img)
    place.append(createSvgUse('location'), placeText)
    content.append(title, text, place, link)
    item.append(date, media, content)

    return item
  }

  const initEvents = () => {
    const list = document.querySelector('[data-events-list]')
    const modal = document.querySelector('[data-events-modal]')
    if (!list || !modal) return

    const modalCloseItems = [...modal.querySelectorAll('[data-events-modal-close]')]
    const modalContent = modal.querySelector('.events-modal__content')
    const modalPhoto = modal.querySelector('[data-events-modal-photo]')
    const modalTitle = modal.querySelector('[data-events-modal-title]')
    const modalDate = modal.querySelector('[data-events-modal-date]')
    const modalPlace = modal.querySelector('[data-events-modal-place]')
    const modalText = modal.querySelector('[data-events-modal-text]')
    const modalNotice = modal.querySelector('[data-events-modal-notice]')

    const fillModalText = (chunks) => {
      if (!modalText) return
      modalText.replaceChildren()
      ;(chunks || []).forEach((chunk) => {
        const p = document.createElement('p')
        p.textContent = chunk
        modalText.appendChild(p)
      })
    }

    const openModal = (eventItem) => {
      if (!eventItem) return
      if (modalContent) modalContent.scrollTop = 0
      if (modalPhoto) {
        modalPhoto.src = eventItem.image
        modalPhoto.alt = eventItem.imageAlt || eventItem.title
      }
      if (modalTitle) modalTitle.textContent = eventItem.title
      if (modalDate) modalDate.textContent = `${eventItem.day}/${eventItem.month}`
      if (modalPlace) modalPlace.textContent = eventItem.place
      fillModalText(eventItem.text)
      if (modalNotice) modalNotice.textContent = eventItem.notice || ''
      modal.hidden = false
      requestAnimationFrame(() => {
        modal.classList.add('is-open')
      })
      document.documentElement.classList.add('is-modal-scroller-open')
      document.body.classList.add('lock')
      window.lenis?.stop?.()
      window.HotelHero?.blockInput?.()
    }

    const closeModal = () => {
      if (!modal.classList.contains('is-open')) return
      modal.classList.remove('is-open')
      document.documentElement.classList.remove('is-modal-scroller-open')
      document.body.classList.remove('lock')
      window.lenis?.start?.()
      window.HotelHero?.blockInput?.()
      window.setTimeout(() => {
        if (!modal.classList.contains('is-open')) modal.hidden = true
      }, MODAL_CLOSE_MS)
    }

    list.replaceChildren(...EVENTS.map(createEventItem))

    list.addEventListener('click', (e) => {
      const link = e.target.closest('[data-event-more]')
      if (!link) return
      e.preventDefault()
      openModal(EVENTS[Number(link.dataset.eventMore)])
    })

    modalCloseItems.forEach((closeItem) => closeItem.addEventListener('click', (e) => {
      e.stopPropagation()
      closeModal()
    }))

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initEvents, { once: true })
  } else {
    initEvents()
  }
})();

(function () {
  'use strict'

  const PRODUCTS = [
    {
      title: 'Зонт',
      price: '3 000 ₽',
      image: 'img/25.jpg',
      size: 'large overlay',
      layout: 'umbrella',
      text: 'Фирменный зонт «Юсупов» в насыщенном винном оттенке. Практичный аксессуар для прогулок по Нижнему Новгороду и памятный сувенир из поездки.',
      gallery: ['img/25.jpg']
    },
    {
      title: 'Багажная бирка',
      price: '900 ₽',
      image: 'img/26.jpg',
      size: 'small',
      layout: 'tag',
      text: 'Представляем эксклюзивную кожаную багажную бирку «Юсупов», выполненную в фирменном стиле нашего бутик-отеля. Идеальный аксессуар для путешественников, ценящих комфорт и элегантность.',
      gallery: ['img/26.jpg']
    },
    {
      title: 'Закладка',
      price: '200 ₽',
      image: 'img/27.jpg',
      size: 'small push',
      layout: 'bookmark',
      text: 'Фирменная закладка для книг в спокойных оттенках. Небольшой сувенир, который сохранит настроение путешествия.',
      gallery: ['img/27.jpg']
    },
    {
      title: 'Тканевый мешочек',
      price: '1 200 ₽',
      image: 'img/28.jpg',
      size: 'wide overlay',
      layout: 'pouch',
      text: 'Тканевый мешочек с фирменной вышивкой «Юсупов». Подойдёт для хранения дорожных мелочей, подарков и памятных сувениров.',
      gallery: ['img/28.jpg']
    },
    {
      title: 'Открытка',
      price: '200 ₽',
      image: 'img/29.jpg',
      size: 'small',
      layout: 'postcard',
      text: 'Памятная открытка с фирменной графикой отеля. Лаконичный подарок или тёплая деталь к основному сувениру.',
      gallery: ['img/29.jpg']
    }
  ]

  const MODAL_CLOSE_MS = 650

  const formatSizeClasses = (size = '') => size
    .split(' ')
    .filter(Boolean)
    .map((part) => `shop__product--${part}`)
    .join(' ')

  const createProduct = (product, index) => {
    const item = document.createElement('button')
    item.className = `shop__product ${formatSizeClasses(product.size)}`
    if (product.layout) item.classList.add(`shop__product--${product.layout}`)
    item.type = 'button'
    item.dataset.shopProduct = String(index)

    const media = document.createElement('span')
    media.className = 'shop__product-media'

    const img = document.createElement('img')
    img.className = 'shop__product-img'
    img.src = product.image
    img.alt = product.title

    const info = document.createElement('span')
    info.className = 'shop__product-info'

    const title = document.createElement('span')
    title.className = 'shop__product-title'
    title.textContent = product.title

    const price = document.createElement('span')
    price.className = 'shop__product-price'
    price.textContent = product.price

    info.append(title, price)
    media.append(img)

    if (product.size?.includes('overlay')) media.append(info)
    else item.append(info)

    item.append(media)

    if (product.size?.includes('overlay')) return item
    item.prepend(media)
    return item
  }

  const initShop = () => {
    const grid = document.querySelector('[data-shop-grid]')
    const modal = document.querySelector('[data-shop-modal]')
    if (!grid || !modal) return

    const modalCloseItems = [...modal.querySelectorAll('[data-shop-modal-close]')]
    const modalSlides = modal.querySelector('[data-shop-modal-slides]')
    const modalDots = modal.querySelector('[data-shop-modal-dots]')
    const modalPrev = modal.querySelector('[data-shop-modal-prev]')
    const modalNext = modal.querySelector('[data-shop-modal-next]')
    const modalContent = modal.querySelector('.shop-modal__content')
    const modalTitle = modal.querySelector('[data-shop-modal-title]')
    const modalText = modal.querySelector('[data-shop-modal-text]')
    const modalPrice = modal.querySelector('[data-shop-modal-price]')

    let activeProduct = null
    let activeSlide = 0

    const setActiveSlide = (index) => {
      const gallery = activeProduct?.gallery || []
      if (!gallery.length) return
      activeSlide = (index + gallery.length) % gallery.length
      modalSlides?.querySelectorAll('.shop-modal__slide').forEach((slide, i) => {
        slide.classList.toggle('is-active', i === activeSlide)
      })
      modalDots?.querySelectorAll('.shop-modal__dot').forEach((dot, i) => {
        dot.classList.toggle('is-active', i === activeSlide)
      })
    }

    const renderSlides = (product) => {
      const gallery = product.gallery?.length ? product.gallery : [product.image]
      modalSlides?.replaceChildren(...gallery.map((src, index) => {
        const slide = document.createElement('div')
        slide.className = `shop-modal__slide${index === 0 ? ' is-active' : ''}`

        const img = document.createElement('img')
        img.src = src
        img.alt = product.title

        slide.appendChild(img)
        return slide
      }))

      modalDots?.replaceChildren(...gallery.map((_, index) => {
        const dot = document.createElement('button')
        dot.className = `shop-modal__dot${index === 0 ? ' is-active' : ''}`
        dot.type = 'button'
        dot.setAttribute('aria-label', `Показать фото ${index + 1}`)
        dot.dataset.shopModalDot = String(index)
        return dot
      }))

      const hasSlider = gallery.length > 1
      if (modalPrev) modalPrev.hidden = !hasSlider
      if (modalNext) modalNext.hidden = !hasSlider
      if (modalDots) modalDots.hidden = !hasSlider
      activeSlide = 0
    }

    const openModal = (product) => {
      activeProduct = product
      if (modalTitle) modalTitle.textContent = product.title
      if (modalText) modalText.textContent = product.text
      if (modalPrice) modalPrice.textContent = product.price
      if (modalContent) modalContent.scrollTop = 0
      renderSlides(product)

      modal.hidden = false
      requestAnimationFrame(() => {
        modal.classList.add('is-open')
      })
      document.documentElement.classList.add('is-modal-scroller-open')
      document.body.classList.add('lock')
      window.lenis?.stop?.()
      window.HotelHero?.blockInput?.()
    }

    const closeModal = () => {
      if (!modal.classList.contains('is-open')) return
      modal.classList.remove('is-open')
      document.documentElement.classList.remove('is-modal-scroller-open')
      document.body.classList.remove('lock')
      window.lenis?.start?.()
      window.HotelHero?.blockInput?.()
      window.setTimeout(() => {
        if (!modal.classList.contains('is-open')) modal.hidden = true
      }, MODAL_CLOSE_MS)
    }

    grid.replaceChildren(...PRODUCTS.map(createProduct))

    grid.addEventListener('click', (e) => {
      const item = e.target.closest('[data-shop-product]')
      if (!item) return
      openModal(PRODUCTS[Number(item.dataset.shopProduct)])
    })

    modalPrev?.addEventListener('click', () => setActiveSlide(activeSlide - 1))
    modalNext?.addEventListener('click', () => setActiveSlide(activeSlide + 1))
    modalDots?.addEventListener('click', (e) => {
      const dot = e.target.closest('[data-shop-modal-dot]')
      if (!dot) return
      setActiveSlide(Number(dot.dataset.shopModalDot))
    })
    modalCloseItems.forEach((closeItem) => closeItem.addEventListener('click', (e) => {
      e.stopPropagation()
      closeModal()
    }))
    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape') closeModal()
      if (!modal.classList.contains('is-open')) return
      if (e.key === 'ArrowLeft') setActiveSlide(activeSlide - 1)
      if (e.key === 'ArrowRight') setActiveSlide(activeSlide + 1)
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initShop, { once: true })
  } else {
    initShop()
  }
})();

(function () {
  'use strict'

  const formModal = document.getElementById('question-modal')
  const thanksModal = document.getElementById('question-thanks-modal')
  const openTriggers = document.querySelectorAll('[data-question-open]')
  if (!formModal || !thanksModal) return

  const form = formModal.querySelector('.question-form')
  const formCloseEls = formModal.querySelectorAll('[data-question-close]')
  const thanksCloseEls = thanksModal.querySelectorAll('[data-thanks-close]')
  const thanksResetBtn = thanksModal.querySelector('[data-thanks-reset]')

  const hasBackendAction = () => {
    const action = (form?.getAttribute('action') || '').trim()
    return action.length > 0 && action !== '#'
  }

  const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const CLOSE_MS = 350

  const createModal = (modalEl) => {
    const panel = modalEl.querySelector('.question-modal__panel')
    let timer = 0

    const isOpen = () => modalEl.classList.contains('is-open')
    const isClosing = () => modalEl.classList.contains('is-closing')

    const open = () => {
      if (timer) {
        window.clearTimeout(timer)
        timer = 0
      }
      modalEl.classList.remove('is-closing')
      modalEl.classList.add('is-open')
      modalEl.setAttribute('aria-hidden', 'false')
    }

    const close = (onDone) => {
      if (!isOpen() || isClosing()) return

      modalEl.classList.remove('is-open')
      modalEl.classList.add('is-closing')
      syncBodyLock()

      let finished = false
      const done = () => {
        if (finished) return
        finished = true
        if (timer) {
          window.clearTimeout(timer)
          timer = 0
        }
        panel?.removeEventListener('transitionend', onTransitionEnd)
        modalEl.classList.remove('is-closing')
        modalEl.setAttribute('aria-hidden', 'true')
        onDone?.()
      }

      const onTransitionEnd = (e) => {
        if (e.target !== panel) return
        if (e.propertyName !== 'opacity') return
        done()
      }

      panel?.addEventListener('transitionend', onTransitionEnd)
      timer = window.setTimeout(done, CLOSE_MS + 50)
    }

    return { open, close, isOpen, isClosing }
  }

  const formModalCtrl = createModal(formModal)
  const thanksModalCtrl = createModal(thanksModal)

  const syncBodyLock = () => {
    if (
      formModalCtrl.isOpen() ||
      thanksModalCtrl.isOpen() ||
      formModalCtrl.isClosing() ||
      thanksModalCtrl.isClosing()
    ) {
      document.body.classList.add('lock')
      return
    }
    document.body.classList.remove('lock')
  }

  const formatPhone = (digits) => {
    if (!digits) return ''
    const rest = digits.slice(1)
    let formatted = '+7'
    if (!rest) return formatted
    formatted += ` (${rest.slice(0, 3)}`
    if (rest.length < 3) return formatted
    formatted += ')'
    if (rest.length <= 3) return formatted
    formatted += ` ${rest.slice(3, 6)}`
    if (rest.length <= 6) return formatted
    formatted += `-${rest.slice(6, 8)}`
    if (rest.length <= 8) return formatted
    formatted += `-${rest.slice(8, 10)}`
    return formatted
  }

  const bindPhoneMask = (input) => {
    if (!input) return

    let lastDigits = ''

    const applyMask = () => {
      let digits = input.value.replace(/\D/g, '')

      if (!digits) {
        lastDigits = ''
        input.value = ''
        return
      }

      if (digits[0] === '8') digits = `7${digits.slice(1)}`

      if (digits[0] !== '7') {
        if (lastDigits && digits.length < lastDigits.length) {
          digits = lastDigits.slice(0, -1)
        } else {
          digits = `7${digits}`
        }
      }

      digits = digits.slice(0, 11)

      if (!digits || digits === '7') {
        lastDigits = digits
        input.value = digits ? '+7' : ''
        return
      }

      lastDigits = digits
      input.value = formatPhone(digits)
    }

    input.addEventListener('keydown', (e) => {
      if (e.ctrlKey || e.metaKey || e.altKey) return
      const allowed = ['Backspace', 'Delete', 'Tab', 'ArrowLeft', 'ArrowRight', 'Home', 'End']
      if (allowed.includes(e.key)) {
        if (e.key === 'Backspace' && (input.value === '+7' || input.value === '+7 (')) {
          lastDigits = ''
          input.value = ''
          e.preventDefault()
        }
        return
      }
      if (/^\d$/.test(e.key)) return
      e.preventDefault()
    })

    input.addEventListener('input', applyMask)

    input.addEventListener('paste', (e) => {
      e.preventDefault()
      let digits = (e.clipboardData?.getData('text') || '').replace(/\D/g, '')
      if (!digits) return
      if (digits[0] === '8') digits = `7${digits.slice(1)}`
      if (digits[0] !== '7') digits = `7${digits}`
      digits = digits.slice(0, 11)
      lastDigits = digits
      input.value = digits.length <= 1 ? (digits === '7' ? '+7' : '') : formatPhone(digits)
    })

    input.addEventListener('blur', () => {
      if (!lastDigits || lastDigits === '7') {
        lastDigits = ''
        input.value = ''
      }
    })
  }

  const setFieldError = (fieldName, isError) => {
    const wrap = formModal.querySelector(`[data-field="${fieldName}"]`)
    if (!wrap) return
    wrap.classList.toggle('error', isError)
    const input = wrap.querySelector('input, textarea')
    if (input) input.classList.toggle('error', isError)
  }

  const syncFieldFilled = (field) => {
    const wrap = field.closest('[data-field-wrap]')
    if (!wrap || wrap.classList.contains('question-form__field--check')) return

    const value = field.value.trim()
    const phoneOnly = field.name === 'phone' && (value === '+7' || value === '+7 (')

    wrap.classList.toggle('is-filled', value.length > 0 && !phoneOnly)
  }

  const syncAllFilled = () => {
    form?.querySelectorAll('.question-form__input, .question-form__textarea').forEach(syncFieldFilled)
  }

  const clearErrors = () => {
    formModal.querySelectorAll('[data-field-wrap]').forEach((wrap) => {
      wrap.classList.remove('error')
      wrap.querySelectorAll('.error').forEach((el) => el.classList.remove('error'))
    })
  }

  const validateForm = () => {
    clearErrors()
    let valid = true

    const email = form.email.value.trim()
    const privacy = form.privacy.checked

    if (!email || !EMAIL_RE.test(email)) {
      setFieldError('email', true)
      valid = false
    }

    if (!privacy) {
      setFieldError('privacy', true)
      valid = false
    }

    return valid
  }

  const resetForm = () => {
    form.reset()
    if (form.phone) {
      form.phone.value = ''
      form.phone.dispatchEvent(new Event('input', { bubbles: true }))
    }
    clearErrors()
    syncAllFilled()
  }

  const openForm = () => {
    formModalCtrl.open()
    syncBodyLock()
    syncAllFilled()
    window.setTimeout(syncAllFilled, 100)
  }

  const closeForm = (onDone) => {
    formModalCtrl.close(() => {
      onDone?.()
      syncBodyLock()
    })
  }

  const openThanks = () => {
    thanksModalCtrl.open()
    syncBodyLock()
  }

  const closeThanks = (onDone) => {
    thanksModalCtrl.close(() => {
      onDone?.()
      syncBodyLock()
    })
  }

  const showSuccess = () => {
    closeForm(() => openThanks())
  }

  const reopenForm = () => {
    closeThanks(() => {
      resetForm()
      openForm()
    })
  }

  openTriggers.forEach((trigger) => {
    trigger.addEventListener('click', (e) => {
      e.preventDefault()
      resetForm()
      openForm()
    })
  })

  formCloseEls.forEach((el) => {
    el.addEventListener('click', () => closeForm())
  })

  thanksCloseEls.forEach((el) => {
    el.addEventListener('click', () => closeThanks())
  })

  thanksResetBtn?.addEventListener('click', reopenForm)

  form?.addEventListener('submit', (e) => {
    if (!validateForm()) {
      e.preventDefault()
      return
    }
    if (!hasBackendAction()) {
      e.preventDefault()
      showSuccess()
    }
  })

  form?.querySelectorAll('input, textarea').forEach((field) => {
    field.addEventListener('input', () => {
      syncFieldFilled(field)
      const wrap = field.closest('[data-field-wrap]')
      if (wrap?.classList.contains('error')) wrap.classList.remove('error')
      field.classList.remove('error')
    })
    field.addEventListener('change', () => syncFieldFilled(field))
  })

  form?.privacy?.addEventListener('change', () => {
    if (form.privacy.checked) setFieldError('privacy', false)
  })

  bindPhoneMask(form?.phone)

  syncAllFilled()
  window.setTimeout(syncAllFilled, 100)

  document.addEventListener('keydown', (e) => {
    if (e.key !== 'Escape') return
    if (thanksModalCtrl.isOpen()) closeThanks()
    else if (formModalCtrl.isOpen()) closeForm()
  })

  window.HotelQuestionForm = {
    open: openForm,
    close: closeForm,
    reset: resetForm,
    openThanks,
    closeThanks,
    validate: validateForm,
    hasBackendAction,
    getForm: () => form,
  }
})();

(function () {
  'use strict'

  const page = document.querySelector('.text-page')
  if (!page) return

  const nav = page.querySelector('.text-page__nav')
  const inner = nav && nav.querySelector('.text-page__nav-inner')
  const markerRoot = inner || nav
  const content = page.querySelector('.text-page__content')
  if (!nav || !content) return

  const list = nav.querySelector('.text-page__nav-list')
  const marker = nav.querySelector('.text-page__nav-marker')
  const sections = [...content.querySelectorAll('h2[id]')]
  if (!list || !marker || !sections.length) return

  if (!list.children.length) {
    sections.forEach((section) => {
      const link = document.createElement('a')
      link.href = `#${section.id}`
      link.textContent = section.textContent.trim()
      const item = document.createElement('li')
      item.appendChild(link)
      list.appendChild(item)
    })
  }

  const links = [...list.querySelectorAll('a[href^="#"]')]
  if (!links.length) return

  const isDesktopNav = () => window.matchMedia('(min-width: 641px)').matches

  const linkById = new Map(
    links.map((link) => [link.getAttribute('href').slice(1), link])
  )
  const scrollOffset = 140

  const moveMarker = (activeLink) => {
    if (!isDesktopNav()) {
      marker.style.top = ''
      return
    }

    const item = activeLink && activeLink.closest('li')
    if (!item) return

    const rootTop = markerRoot.getBoundingClientRect().top
    const itemRect = item.getBoundingClientRect()
    const y = itemRect.top - rootTop + (itemRect.height - marker.offsetHeight) / 2
    marker.style.top = `${Math.round(y)}px`
  }

  const setActive = (id) => {
    if (!linkById.has(id)) return

    let activeLink = null
    links.forEach((link) => {
      const isActive = link.getAttribute('href') === `#${id}`
      link.classList.toggle('is-active', isActive)
      if (isActive) activeLink = link
    })
    moveMarker(activeLink)
  }

  const getActiveSection = () => {
    let active = sections[0]
    sections.forEach((section) => {
      if (section.getBoundingClientRect().top <= scrollOffset) active = section
    })
    return active
  }

  const updateOnScroll = () => {
    if (!isDesktopNav()) return
    setActive(getActiveSection().id)
  }

  links.forEach((link) => {
    link.addEventListener('click', (event) => {
      const id = link.getAttribute('href').slice(1)
      const target = document.getElementById(id)
      if (!target) return
      event.preventDefault()
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
      setActive(id)
    })
  })

  window.addEventListener('scroll', updateOnScroll, { passive: true })
  window.addEventListener('resize', updateOnScroll)

  if (typeof ResizeObserver !== 'undefined') {
    new ResizeObserver(updateOnScroll).observe(list)
  }

  if (document.fonts && document.fonts.ready) {
    document.fonts.ready.then(updateOnScroll)
  }

  updateOnScroll()
})();

(function () {
  'use strict'

  const STORAGE_KEY = 'cookieConsent'

  const initCookieBanner = () => {
    const banner = document.getElementById('cookie-banner')
    if (!banner) return

    const acceptBtn = banner.querySelector('[data-cookie-accept]')

    const hide = () => {
      banner.classList.remove('is-visible')
      banner.setAttribute('hidden', '')
    }

    const show = () => {
      banner.removeAttribute('hidden')
      banner.classList.add('is-visible')
    }

    if (localStorage.getItem(STORAGE_KEY) === '1') {
      hide()
      return
    }

    show()

    acceptBtn?.addEventListener('click', () => {
      localStorage.setItem(STORAGE_KEY, '1')
      hide()
    })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initCookieBanner, { once: true })
  } else {
    initCookieBanner()
  }
})();

(function () {
  'use strict'

  const SERVICES = [
    {
      title: 'Завтраки в номера',
      time: 'с 8:00–11:30',
      image: 'img/12.jpg',
      text: [
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.',
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.',
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.'
      ]
    },
    {
      title: 'Парковка',
      time: 'с 8:00–11:30',
      image: 'img/11.jpg',
      text: [
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.'
      ]
    },
    {
      title: 'Услуги прачечной',
      time: 'с 8:00–11:30',
      image: 'img/03.jpg',
      text: [
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.'
      ]
    },
    {
      title: 'Услуги глажки',
      time: 'с 8:00–11:30',
      image: 'img/13.jpg',
      text: [
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.'
      ]
    },
    {
      title: 'Мелкий ремонт одежды',
      time: 'с 8:00–11:30',
      image: 'img/05.jpg',
      text: [
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.'
      ]
    },
    {
      title: 'Трансфер',
      time: 'с 8:00–11:30',
      image: 'img/06.jpg',
      text: [
        'Каждый день с 9:00 до 11:00 утра мы доставим Вам в номер завтрак, приготовленный с любовью.',
        'Предлагаем Вам на выбор горячие сытные блюда: яичница, каши разных видов, сырники и мини оладьи, а также свежеиспеченная выпечка.',
        'Завтрак можно заказать при бронировании номера или оплатить отдельно.'
      ]
    }
  ]

  const MODAL_MQ = window.matchMedia('(max-width: 640px)')
  const HOVER_MQ = window.matchMedia('(hover: hover) and (pointer: fine)')
  const MODAL_SWIPE_CLOSE = 90
  const MODAL_SWIPE_MIN = 10
  const MODAL_DISMISS_MS = 420
  const MODAL_CLOSE_MS_MOBILE = 850
  const MODAL_CLOSE_FALLBACK_MS = 150

  const initServices = () => {
    const section = document.querySelector('.services')
    if (!section) return

    const items = [...section.querySelectorAll('.services__item')]
    const backgrounds = [...section.querySelectorAll('.services__bg-item')]
    const list = section.querySelector('.services__list')
    const modal = document.querySelector('.services-modal')
    const modalBack = modal?.querySelector('.services-modal__back')
    const modalClose = modal?.querySelector('.services-modal__close')
    const modalPhoto = modal?.querySelector('.services-modal__photo-img')
    const modalTitle = modal?.querySelector('.services-modal__title')
    const modalTime = modal?.querySelector('.services-modal__time')
    const modalText = modal?.querySelector('.services-modal__text')
    const modalWrapper = modal?.querySelector('.services-modal__wrapper')
    const modalInfo = modal?.querySelector('.services-modal__info')
    if (!items.length || !backgrounds.length) return

    let selectedIndex = 0
    let modalTouchStartY = 0
    let modalTouchStartX = 0
    let modalDragY = 0
    let modalDragging = false
    let modalDismissTimer = 0

    const setActive = (index) => {
      if (index < 0 || index >= items.length) return
      items.forEach((item, i) => item.classList.toggle('is-active', i === index))
      backgrounds.forEach((bg, i) => bg.classList.toggle('is-active', i === index))
    }

    const applySelection = (index) => {
      if (index < 0 || index >= items.length) return
      selectedIndex = index
      setActive(index)
    }

    const restoreSelection = () => {
      setActive(selectedIndex)
    }

    const fillModalText = (chunks) => {
      if (!modalText) return
      modalText.replaceChildren()
      ;(chunks || []).forEach((chunk) => {
        const p = document.createElement('p')
        p.textContent = chunk
        modalText.appendChild(p)
      })
    }

    const resetModalInfoScroll = () => {
      if (modalInfo) modalInfo.scrollTop = 0
    }

    const resetModalDrag = () => {
      modalDragY = 0
      modalDragging = false
      modal?.classList.remove('is-dragging')
      if (!modalWrapper) return
      modalWrapper.style.transition = ''
      modalWrapper.style.transform = ''
    }

    const clearModalDismissStyles = () => {
      if (modalBack) {
        modalBack.style.transition = ''
        modalBack.style.opacity = ''
      }
      if (modalDismissTimer) {
        window.clearTimeout(modalDismissTimer)
        modalDismissTimer = 0
      }
    }

    const finishCloseModal = () => {
      if (!modal) return
      modal.classList.remove('is-open', 'is-dismissing', 'is-dragging', 'is-closing')
      document.body.classList.remove('lock')
      resetModalInfoScroll()
      modal.hidden = true
      restoreSelection()
      requestAnimationFrame(() => {
        clearModalDismissStyles()
        resetModalDrag()
      })
    }

    const canModalSwipe = () => {
      if (!MODAL_MQ.matches || !modal?.classList.contains('is-open')) return false
      return !modal.classList.contains('is-dismissing')
    }

    const setModalDrag = (y) => {
      if (!modalWrapper) return
      modalWrapper.style.transition = 'none'
      modalWrapper.style.transform = y > 0 ? `translate3d(0, ${y}px, 0)` : ''
    }

    const snapModalDrag = () => {
      if (!modalWrapper || modalDragY <= 0) {
        resetModalDrag()
        return
      }
      modalDragging = false
      modal?.classList.remove('is-dragging')
      modalWrapper.style.transition = 'transform .25s ease'
      modalWrapper.style.transform = ''
      modalDragY = 0
      window.setTimeout(() => {
        if (modalWrapper) modalWrapper.style.transition = ''
      }, 250)
    }

    const dismissModalBySwipe = (fromY) => {
      if (!modal || !modalWrapper || modal.classList.contains('is-dismissing')) return
      modalDragging = false
      modal.classList.remove('is-dragging')
      modal.classList.add('is-dismissing')

      const distance = modalWrapper.getBoundingClientRect().height
      const easing = 'cubic-bezier(0.22, 1, 0.36, 1)'

      modalWrapper.style.transition = 'none'
      modalWrapper.style.transform = `translate3d(0, ${fromY}px, 0)`
      void modalWrapper.offsetHeight
      modalWrapper.style.transition = `transform ${MODAL_DISMISS_MS}ms ${easing}`
      modalWrapper.style.transform = `translate3d(0, ${distance}px, 0)`

      if (modalBack) {
        modalBack.style.transition = `opacity ${MODAL_DISMISS_MS}ms ease`
        modalBack.style.opacity = '0'
      }

      modalDismissTimer = window.setTimeout(finishCloseModal, MODAL_DISMISS_MS)
    }

    const dismissModalAnimated = () => {
      if (!modal || modal.classList.contains('is-dismissing') || modal.classList.contains('is-closing')) return
      clearModalDismissStyles()
      resetModalDrag()
      modal.classList.add('is-closing')
      modal.classList.remove('is-open')

      const photo = modal.querySelector('.services-modal__photo')
      let finished = false

      const finish = () => {
        if (finished) return
        finished = true
        if (modalDismissTimer) {
          window.clearTimeout(modalDismissTimer)
          modalDismissTimer = 0
        }
        photo?.removeEventListener('transitionend', onTransitionEnd)
        finishCloseModal()
      }

      const onTransitionEnd = (e) => {
        if (e.target !== photo) return
        if (e.propertyName !== 'transform' && e.propertyName !== '-webkit-transform') return
        finish()
      }

      photo?.addEventListener('transitionend', onTransitionEnd)
      modalDismissTimer = window.setTimeout(finish, MODAL_CLOSE_MS_MOBILE + MODAL_CLOSE_FALLBACK_MS)
    }

    const closeModal = () => {
      if (!modal || modal.classList.contains('is-dismissing') || modal.classList.contains('is-closing')) return
      if (MODAL_MQ.matches) {
        dismissModalAnimated()
        return
      }
      clearModalDismissStyles()
      resetModalDrag()
      modal.classList.remove('is-open', 'is-dismissing', 'is-dragging', 'is-closing')
      document.body.classList.remove('lock')
      resetModalInfoScroll()
      window.setTimeout(() => {
        if (!modal.classList.contains('is-open')) {
          modal.hidden = true
          restoreSelection()
        }
      }, 650)
    }

    const openModal = (service) => {
      if (!modal || !service) return
      clearModalDismissStyles()
      resetModalDrag()
      resetModalInfoScroll()
      modal.classList.remove('is-dismissing', 'is-dragging', 'is-closing')
      if (modalTitle) modalTitle.textContent = service.title || ''
      if (modalTime) modalTime.textContent = service.time || ''
      fillModalText(service.text)
      if (modalPhoto) {
        modalPhoto.src = service.image || ''
        modalPhoto.alt = service.title || ''
      }
      modal.hidden = false
      requestAnimationFrame(() => {
        modal.classList.add('is-open')
      })
      document.body.classList.add('lock')
    }

    items.forEach((item, index) => {
      item.addEventListener('mouseenter', () => {
        if (!HOVER_MQ.matches) return
        applySelection(index)
      })
      item.addEventListener('click', () => {
        applySelection(index)
        openModal(SERVICES[index] || SERVICES[0])
      })
    })

    applySelection(0)

    modalBack?.addEventListener('click', closeModal)
    modalClose?.addEventListener('click', (e) => {
      e.stopPropagation()
      closeModal()
    })

    document.addEventListener('keydown', (e) => {
      if (e.key === 'Escape' && modal?.classList.contains('is-open')) closeModal()
    })

    modalWrapper?.addEventListener('touchstart', (e) => {
      if (e.target?.closest?.('.services-modal__close, .services-modal__info')) return
      if (!canModalSwipe()) return
      modalTouchStartY = e.touches[0].clientY
      modalTouchStartX = e.touches[0].clientX
      modalDragY = 0
      modalDragging = true
    }, { passive: true })

    modalWrapper?.addEventListener('touchmove', (e) => {
      if (!canModalSwipe() || !modalDragging) return
      const dy = e.touches[0].clientY - modalTouchStartY
      const dx = e.touches[0].clientX - modalTouchStartX
      if (Math.abs(dx) > Math.abs(dy) && Math.abs(dx) > MODAL_SWIPE_MIN) {
        snapModalDrag()
        return
      }
      if (dy <= 0) {
        if (modalDragY > 0) snapModalDrag()
        else resetModalDrag()
        return
      }
      modalDragY = dy
      modal?.classList.add('is-dragging')
      setModalDrag(dy)
      e.preventDefault()
    }, { passive: false })

    modalWrapper?.addEventListener('touchend', () => {
      if (!modalDragging) return
      if (modalDragY >= MODAL_SWIPE_CLOSE) {
        dismissModalBySwipe(modalDragY)
        return
      }
      snapModalDrag()
    }, { passive: true })

    modalWrapper?.addEventListener('touchcancel', snapModalDrag, { passive: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initServices, { once: true })
  } else {
    initServices()
  }
})()
