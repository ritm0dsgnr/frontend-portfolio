(function () {
  'use strict'

  // --- флаги ---
  const FLAGS = {
    formClearOnSubmit: false,
    smoothScroll: true
  }

  // --- константы и утилиты ---
  const BREAKPOINTS = { mobile: 500, tablet: 769 }
  const debounce = (fn, delay = 100) => {
    let timer
    return (...args) => {
      clearTimeout(timer)
      timer = setTimeout(() => fn(...args), delay)
    }
  }
  const rem = (v) => parseFloat(getComputedStyle(document.documentElement).fontSize) * v
  const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  const isStrongPassword = (val) => {
    if (val.length < 8) return false
    if (!/[A-ZА-Я]/.test(val)) return false
    if (!/[0-9]/.test(val)) return false
    if (!/[^A-Za-zА-Яа-я0-9]/.test(val)) return false
    return true
  }
  const setActiveInGroup = (container, selector, el) => {
    if (!container || !el) return
    container.querySelectorAll(selector).forEach((item) => {
      item.classList.toggle('active', item === el)
    })
  }
  const getPhoneRuCore = (v) => {
    const d = v.replace(/\D/g, '').slice(0, 11)
    if (!d) return ''
    return (d.startsWith('7') || d.startsWith('8') ? d.slice(1) : d).slice(0, 10)
  }
  const formatPhoneRu = (v) => {
    const core = getPhoneRuCore(v)
    if (!core) return ''
    const [a, b, c, d2] = [core.slice(0, 3), core.slice(3, 6), core.slice(6, 8), core.slice(8, 10)]
    let r = '+7 '
    if (a) r += `(${a}`
    if (a?.length === 3) r += ') '
    if (b) r += b
    if (b?.length === 3) r += '-'
    if (c) r += c
    if (c?.length === 2) r += '-'
    if (d2) r += d2
    return r
  }
  function bindPlkAccordion(item, header, panel, opts = {}) {
    if (!item || !header || !panel) return
    const { ignoreLinks = false } = opts
    panel.style.overflow = 'hidden'
    panel.style.height = '0'
    panel.style.transition = 'height 0.25s ease-out'
    const open = () => {
      item.classList.add('is-open')
      panel.style.height = `${panel.scrollHeight}px`
      const onEnd = (e) => {
        if (e.propertyName !== 'height') return
        if (item.classList.contains('is-open')) panel.style.height = 'auto'
        panel.removeEventListener('transitionend', onEnd)
      }
      panel.addEventListener('transitionend', onEnd)
    }
    const close = () => {
      panel.style.height = `${panel.scrollHeight}px`
      panel.offsetHeight
      panel.style.height = '0'
      const onEnd = (e) => {
        if (e.propertyName !== 'height') return
        item.classList.remove('is-open')
        panel.removeEventListener('transitionend', onEnd)
      }
      panel.addEventListener('transitionend', onEnd)
    }
    header.classList.add('has-items')
    header.addEventListener('click', (e) => {
      if (ignoreLinks && e.target.closest('a')) return
      item.classList.contains('is-open') ? close() : open()
    })
  }
  function bindTogglePanel(trigger, panel, opts = {}) {
    if (!trigger || !panel) return
    const { closeOnOutside = false, closeSelectors = '', toggleTriggerClass = true } = opts
    const close = () => {
      panel.classList.remove('active')
      if (toggleTriggerClass) trigger.classList.remove('active')
    }
    trigger.addEventListener('click', (e) => {
      if (e.target.closest('a')) e.preventDefault()
      panel.classList.toggle('active')
      if (toggleTriggerClass) trigger.classList.toggle('active')
    })
    if (closeSelectors) {
      panel.querySelectorAll(closeSelectors).forEach((el) => el.addEventListener('click', close))
    }
    if (closeOnOutside) {
      document.addEventListener('click', (e) => {
        if (panel.classList.contains('active') && !panel.contains(e.target) && !trigger.contains(e.target)) close()
      })
    }
  }

  // --- формы: базовая форма и валидация ---
  // Отправка через кнопку [data-submit] (лучше type="button"): проверка → onBeforeSubmit (капча и т.п.) → отправка. Сброс полей и плавная прокрутка — во FLAGS выше.
  function initForm(formSelector, options = {}) {
    const form = document.querySelector(formSelector)
    if (!form) return
    const submitBtn = form.querySelector('[data-submit]')
    if (!submitBtn) return
    submitBtn.addEventListener('click', async (e) => {
      e.preventDefault()
      const inputs = form.querySelectorAll('input[required], textarea[required], select[required]')
      let valid = true
      inputs.forEach((input) => {
        if (!input.value.trim()) {
          valid = false
          input.classList.add('error')
        } else {
          input.classList.remove('error')
        }
      })
      if (!valid) return
      if (options.onBeforeSubmit && !(await options.onBeforeSubmit(form))) return
      form.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      if (FLAGS.formClearOnSubmit) form.reset()
    })
  }
  function initFormValidation(formSelector, rules, onSuccessOrOpts) {
    const form = document.querySelector(formSelector)
    if (!form) return
    const opts = typeof onSuccessOrOpts === 'function' ? { onSuccess: onSuccessOrOpts } : onSuccessOrOpts || {}
    const { onSuccess, onBeforeSubmit } = opts
    let hasSubmitAttempt = false
    const fieldWrapSelector = '[data-field-wrap], .form-field, .footer__wrapper-pre-form-field, .footer__wrapper-pre-form-checkbox'
    const isRequiredCheckbox = (field) => field?.classList?.contains('is-required')
    const validateField = (field, type) => {
      if (!field) return true
      const isChk = field.type === 'checkbox'
      const parent = field.closest(fieldWrapSelector)
      let ok = isChk ? (!isRequiredCheckbox(field) || field.checked) : true
      if (!isChk) {
        const v = field.value.trim()
        if (type === 'required') ok = v.length > 0
        else if (type === 'email') ok = v.length > 0 && EMAIL_REGEX.test(v)
        else if (type === 'phone') ok = v.replace(/\D/g, '').length >= 10
        else if (type === 'passwordStrong') ok = v.length > 0 && isStrongPassword(v)
        else if (type === 'passwordRepeat') {
          const p = form.querySelector('[name="password"]')
          ok = v && p?.value.trim() && v === p.value.trim()
        }
        else if (type === 'checkbox') ok = !isRequiredCheckbox(field) || field.checked
      }
      field.classList.toggle('error', !ok)
      if (parent) parent.classList.toggle('error', !ok)
      return ok
    }
    const logTitle = document.querySelector('.log__wrapper-title')?.textContent?.trim() || ''
    const isLoginForm = form.id === 'subscribe-form' && logTitle === 'Вход'
    rules.forEach((r) => {
      const field = form.querySelector(`[name="${r.name}"]`)
      if (!field) return
      if (!isLoginForm) {
        field.addEventListener(r.type === 'checkbox' ? 'change' : 'input', () => {
          if (!hasSubmitAttempt) return
          validateField(field, r.type)
        })
      }
    })
    if (!isLoginForm) {
      form.querySelectorAll('input[type="checkbox"].is-required').forEach((cb) => {
        cb.addEventListener('change', () => {
          if (!hasSubmitAttempt) return
          validateField(cb, 'checkbox')
        })
      })
    }
    let isDispatchingValidatedSubmit = false
    const runSubmit = async (formEl) => {
      hasSubmitAttempt = true
      let valid = true
      rules.forEach((r) => {
        if (!validateField(formEl.querySelector(`[name="${r.name}"]`), r.type)) valid = false
      })
      formEl.querySelectorAll('input[type="checkbox"].is-required').forEach((cb) => {
        if (!validateField(cb, 'checkbox')) valid = false
      })
      if (!valid) return
      if (onBeforeSubmit && !(await onBeforeSubmit(formEl))) return
      isDispatchingValidatedSubmit = true
      try {
        formEl.dispatchEvent(new Event('submit', { bubbles: true, cancelable: true }))
      } finally {
        isDispatchingValidatedSubmit = false
      }
      if (FLAGS.formClearOnSubmit) formEl.reset()
      if (onSuccess) onSuccess(formEl)
    }
    form.addEventListener('submit', function (e) {
      if (isDispatchingValidatedSubmit) return
      e.preventDefault()
      runSubmit(this)
    })
    const submitBtn = form.querySelector('[data-submit]')
    if (submitBtn) {
      submitBtn.addEventListener('click', (e) => {
        e.preventDefault()
        runSubmit(form)
      })
    }
  }

  // --- галерея товара (fullscreen) ---
  let galleryMain = null
  let galleryThumbs = null
  let galleryBound = false
  function openFullscreenGallery(images, startIndex = 0) {
    const list = images ? (Array.isArray(images) ? images : Array.from(images)) : []
    if (!list.length) return
    const el = document.querySelector('.item-gallery[data-gallery]') || document.querySelector('.item-gallery')
    if (!el) return
    const mainW = el.querySelector('.item-gallery__main .swiper-wrapper')
    const thumbsW = el.querySelector('.item-gallery__thumbs .swiper-wrapper')
    const mainEl = el.querySelector('.item-gallery__main')
    const thumbsEl = el.querySelector('.item-gallery__thumbs')
    const prevEl = el.querySelector('.item-gallery__arrow--prev')
    const nextEl = el.querySelector('.item-gallery__arrow--next')
    if (!mainEl || !thumbsEl || !mainW || !thumbsW || !prevEl || !nextEl) return
    if (galleryMain) {
      galleryMain.destroy()
      galleryMain = null
    }
    if (galleryThumbs) {
      galleryThumbs.destroy()
      galleryThumbs = null
    }
    mainW.innerHTML = list.map((img) => `<div class="swiper-slide"><img src="${img.dataset?.full || img.getAttribute?.('src') || ''}" alt=""></div>`).join('')
    thumbsW.innerHTML = list.map((img) => `<div class="swiper-slide"><img src="${img.dataset?.thumb || img.dataset?.full || img.getAttribute?.('src') || ''}" alt=""></div>`).join('')
    el.classList.add('item-gallery--open')
    el.offsetHeight
    galleryThumbs = new Swiper(thumbsEl, {
      slidesPerView: 'auto',
      spaceBetween: rem(0.5),
      loop: true,
      freeMode: true,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      watchSlidesProgress: true,
      slideToClickedSlide: true,
      breakpoints: { [BREAKPOINTS.tablet]: { spaceBetween: rem(0.6) } }
    })
    galleryMain = new Swiper(mainEl, {
      loop: true,
      slidesPerView: 1,
      speed: 400,
      observer: true,
      observeParents: true,
      observeSlideChildren: true,
      navigation: { prevEl, nextEl },
      thumbs: { swiper: galleryThumbs }
    })
    if (!galleryBound) {
      el.addEventListener('click', (e) => {
        if (e.target.closest('[data-close]')) el.classList.remove('item-gallery--open')
      })
      galleryBound = true
    }
    requestAnimationFrame(() => {
      if (galleryMain && galleryThumbs) {
        galleryMain.update()
        galleryThumbs.update()
        galleryMain.slideToLoop(startIndex, 0)
        galleryThumbs.slideToLoop(startIndex, 0)
      }
    })
  }

  // --- адаптивные слайдеры ---
  const slidersRegistry = new Map()
  function initResponsiveSlider(selector, config) {
    const slider = document.querySelector(selector)
    if (!slider) return
    const { breakpoints = {}, defaultSlidesPerView = 1, spaceBetween = 0, loop = true, arrowSelector = null, destroyBelow = null, destroyAbove = null } = config
    const getConfig = () => {
      const w = window.innerWidth
      let s = defaultSlidesPerView
      Object.keys(breakpoints).map(Number).sort((a, b) => b - a).forEach((bp) => {
        if (w < bp) s = breakpoints[bp]
      })
      return s
    }
    const shouldDestroy = () => {
      const w = window.innerWidth
      return (destroyBelow && w < destroyBelow) || (destroyAbove && w >= destroyAbove)
    }
    const init = () => {
      const ex = slidersRegistry.get(selector)
      if (shouldDestroy()) {
        if (ex) {
          ex.destroy(true, true)
          slidersRegistry.delete(selector)
        }
        return
      }
      if (ex) ex.destroy(true, true)
      const arrowBtn = arrowSelector ? slider.querySelector(arrowSelector) : null
      slidersRegistry.set(selector, new Swiper(slider, {
        slidesPerView: getConfig(),
        spaceBetween,
        loop,
        navigation: arrowBtn ? { nextEl: arrowBtn } : false,
        observer: true,
        observeParents: true
      }))
    }
    init()
    window.addEventListener('resize', debounce(init))
  }

  // --- табы ---
  function initTabs(containerSelector, tabSelector, itemSelector, options = {}) {
    const container = document.querySelector(containerSelector)
    if (!container) return
    const tabs = container.querySelectorAll(tabSelector)
    const items = container.querySelectorAll(itemSelector)
    if (!tabs.length || !items.length) return
    const { onlyMobile = false, onlyDesktop = false, headerSelector = null, syncPanelsSelector = null, syncPanelsRoot = null } = options
    const header = headerSelector ? container.querySelector(headerSelector) : container
    const syncPanels = syncPanelsSelector
      ? (syncPanelsRoot || container).querySelectorAll(syncPanelsSelector)
      : null
    const showTab = (i) => {
      tabs.forEach((t) => t.classList.remove('active'))
      items.forEach((it) => it.style.display = 'none')
      if (tabs[i]) tabs[i].classList.add('active')
      if (items[i]) items[i].style.display = ''
      if (syncPanels?.length) {
        syncPanels.forEach((pane, j) => pane.classList.toggle('active', j === i))
      }
    }
    const initDisplay = () => {
      const w = window.innerWidth
      if (onlyDesktop && w < BREAKPOINTS.tablet) {
        if (header) header.style.display = 'none'
        items.forEach((it) => it.style.display = '')
        return
      }
      if (onlyMobile && w >= BREAKPOINTS.tablet) {
        items.forEach((it) => it.style.display = '')
        return
      }
      if (onlyDesktop && header) header.style.display = ''
      const activeTab = container.querySelector(`${tabSelector}.active`)
      const idx = activeTab ? Array.from(tabs).indexOf(activeTab) : 0
      items.forEach((it, i) => {
        it.style.display = i === idx ? '' : 'none'
      })
    }
    if (header) {
      header.addEventListener('click', (e) => {
        if (onlyMobile && window.innerWidth >= BREAKPOINTS.tablet) return
        if (onlyDesktop && window.innerWidth < BREAKPOINTS.tablet) return
        const tab = e.target.closest(tabSelector)
        if (tab) showTab(Array.from(tabs).indexOf(tab))
      })
    }
    initDisplay()
    if (onlyMobile || onlyDesktop) window.addEventListener('resize', debounce(initDisplay))
  }

  // --- хедер и поиск ---
  function initHeader() {
    document.addEventListener('click', (e) => {
      const nav = document.querySelector('.nav')
      const iconLink = e.target.closest('.header__wrapper-nav-icons a')
      if (iconLink) {
        return
      }
      const navItem = e.target.closest('.header__wrapper-nav-nav-item')
      if (navItem && (navItem.closest('.header') || navItem.closest('.nav'))) {
        const isSearch = navItem.classList.contains('search') || !!navItem.querySelector('use[href*="#search"],use[xlink\\:href*="#search"]')
        if (!isSearch) setActiveInGroup(navItem.closest('.header__wrapper-nav-nav'), '.header__wrapper-nav-nav-item', navItem)
        const search = document.querySelector('.header__wrapper-search:not(.mob)')
        if (isSearch && search) {
          search.classList.add('active')
          const inp = search.querySelector('input')
          if (inp) {
            inp.focus()
            inp.dispatchEvent(new Event('input', { bubbles: true }))
          }
        }
        const srh = document.querySelector('.srh')
        if (isSearch && srh) {
          srh.classList.add('active')
          const mob = srh.querySelector('.header__wrapper-search.mob')
          if (mob) mob.classList.add('active')
        }
        if (isSearch && navItem.closest('.nav')) nav?.classList.remove('active')
        if (navItem.classList.contains('burger')) nav?.classList.add('active')
        if (navItem.classList.contains('close')) nav?.classList.remove('active')
      }
      const searchClose = e.target.closest('.header__wrapper-search-close')
      if (searchClose) {
        const search = searchClose.closest('.header__wrapper-search')
        if (search) search.classList.remove('active')
        const srh = document.querySelector('.srh')
        if (srh) {
          srh.classList.remove('active')
          const mob = srh.querySelector('.header__wrapper-search.mob')
          if (mob) mob.classList.remove('active')
        }
        document.querySelector('.srh__rslt')?.classList.remove('active')
        return
      }
      if (nav && !e.target.closest('.header__wrapper-nav-nav-item.burger') && !nav.contains(e.target)) nav.classList.remove('active')
    })
  }
  function initSearch(searchEl) {
    if (!searchEl) return
    const input = searchEl.querySelector('input')
    const btn = searchEl.querySelector('a.header__wrapper-search-btn')
    const sync = () => {
      if (!btn || !input) return
      const has = !!input.value.trim()
      btn.classList.toggle('active', has)
      const srh = document.querySelector('.srh__rslt')
      if (srh) {
        srh.classList.toggle('active', has)
        const m = srh.querySelector('.header__wrapper-search.mob')
        if (m) m.classList.toggle('active', has)
      }
    }
    if (input) {
      input.addEventListener('input', sync)
      sync()
      input.addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && btn) {
          e.preventDefault()
          window.location.href = input.value.trim() ? `search.html?q=${encodeURIComponent(input.value.trim())}` : btn.href
        }
      })
    }
    if (btn) {
      btn.addEventListener('click', (e) => {
        if (input?.value.trim()) {
          e.preventDefault()
          window.location.href = `search.html?q=${encodeURIComponent(input.value.trim())}`
        }
      })
    }
  }

  // --- карта контактов ---
  function initMap() {
    const mapEl = document.getElementById('contacts-map')
    if (!mapEl || typeof ymaps === 'undefined') return
    ymaps.ready(() => {
      try {
        const items = Array.from(document.querySelectorAll('.contacts__wrapper-info-i[data-coords]'))
      const coordsList = items.map((el) => el.dataset.coords.split(',').map(Number))
      const center = coordsList[0] || [55.75, 37.62]
      const map = new ymaps.Map(mapEl, { center, zoom: 11, controls: ['zoomControl'] })
      const labelLayout = ymaps.templateLayoutFactory.createClass('<div class="contacts-map-label"><div class="contacts-map-label-logo"><img src="img/logo.svg" alt="Ceram"></div><div class="contacts-map-label-content"><div class="contacts-map-label-row"><span class="contacts-map-label-title">{{ properties.title }}</span><span class="contacts-map-label-rating">★ {{ properties.rating }}</span></div><div class="contacts-map-label-sub">{{ properties.time }}</div></div></div>')
      const placemarks = coordsList.map((coords, i) => {
        const { title = '', rating = '', time = '' } = items[i]?.dataset || {}
        const pm = new ymaps.Placemark(coords, { title, rating, time }, { iconLayout: labelLayout, iconOffset: [0, 0], iconShape: { type: 'Rectangle', coordinates: [[0, 0], [180, 45]] }, hasBalloon: false, zIndex: 1000, cursor: 'pointer' })
        pm.events.add('click', () => {
          if (window.innerWidth >= BREAKPOINTS.tablet) {
            const tabs = document.querySelectorAll('.contacts__wrapper-header-item')
            const infoItems = document.querySelectorAll('.contacts__wrapper-info-i')
            tabs.forEach((t, j) => t.classList.toggle('active', j === i))
            infoItems.forEach((it, j) => {
              it.style.display = j === i ? '' : 'none'
            })
          }
          map.setCenter(coords, 16)
        })
        return pm
      })
      placemarks.forEach((pm) => map.geoObjects.add(pm))
      const header = document.querySelector('.contacts__wrapper-header')
      const tabs = header?.querySelectorAll('.contacts__wrapper-header-item')
      header?.addEventListener('click', (e) => {
        const tab = e.target.closest('.contacts__wrapper-header-item')
        if (tab && tabs) {
          const idx = Array.from(tabs).indexOf(tab)
          if (coordsList[idx]) map.setCenter(coordsList[idx], 16)
        }
      })
      if (coordsList.length > 1) map.setBounds(ymaps.util.bounds.fromPoints(coordsList), { checkZoomRange: true, zoomMargin: 50 })
      } catch (err) {
        console.error(err)
      }
    })
  }

  // --- каталог: данные фильтров (slug категории + id значения) ---
  const mkFilterItems = (prefix, count) => Array.from({ length: count }, (_, i) => ({ id: i + 1, label: `${prefix} ${i + 1}` }))
  const filterCategories = {
    badge: { title: 'Теги', items: [{ id: 1, label: 'New' }, { id: 2, label: 'Outlet' }, { id: 3, label: 'Last chance' }] },
    country: { title: 'Страна', items: mkFilterItems('Страна', 30) },
    factory: { title: 'Фабрика', items: mkFilterItems('Фабрика', 30) },
    collection: { title: 'Коллекция', items: mkFilterItems('Коллекция', 30) },
    application: { title: 'Применение', items: mkFilterItems('Применение', 30) },
    pattern: { title: 'Рисунок', items: mkFilterItems('Рисунок', 30) },
    surface: { title: 'Поверхность', items: mkFilterItems('Поверхность', 30) },
    size: { title: 'Размер', items: ['75×75', '120×75', '75×20', '60×60', '30×60', '60×120', '80×80', '100×100', '45×90', '90×90', '120×120', '15×90', '20×120', '25×50', '40×40', '50×50', '70×70', '85×85', '95×95', '110×110', '130×130', '10×20', '20×40', '30×30', '40×80', '50×100', '35×35', '55×55', '65×65', '125×125'].map((label, i) => ({ id: i + 1, label })) },
    material: { title: 'Материал', items: mkFilterItems('Материал', 30) },
    color: { title: 'Цвет', items: mkFilterItems('Цвет', 30) },
    'element-type': { title: 'Вид элемента', items: mkFilterItems('Вид элемента', 30) },
    thickness: { title: 'Толщина', items: mkFilterItems('Толщина', 30) },
    'r-coefficient': { title: 'Коэффициент R', items: mkFilterItems('R', 30) },
    'c-class': { title: 'Класс C', items: mkFilterItems('Класс C', 30) },
    pei: { title: 'PEI', items: mkFilterItems('PEI', 30) },
    rectified: { title: 'Ректификат', type: 'toggle', items: [{ id: 1, label: 'Ректификат' }] },
    'frost-resistant': { title: 'Морозостойкость', type: 'toggle', items: [{ id: 1, label: 'Морозостойкость' }] }
  }
  let catalogFilterParamsGetter = null

  // --- каталог: карточки, корзина, фильтры, сортировка, табы каталога ---
  function initCatalog() {
    const pricesToggle = document.querySelector('.catalog__wrapper-header-w-toggle')
    if (pricesToggle) {
      pricesToggle.addEventListener('click', (e) => {
        e.preventDefault()
        pricesToggle.classList.toggle('active')
      })
    }
    document.querySelectorAll('.catalog__wrapper-cat-col-filter-list-w-search').forEach((wrap) => {
      const input = wrap.querySelector('input')
      if (!input) return
      const sync = () => {
        wrap.classList.toggle('active', !!input.value.trim())
      }
      input.addEventListener('input', sync)
      sync()
    })
    document.querySelectorAll('.block__w-cards-card-like, .item__wrapper-info-i-name-like').forEach((like) => {
      like.addEventListener('click', (e) => {
        e.stopPropagation()
        like.classList.toggle('active')
      })
    })
    const cardSlides = document.querySelectorAll('.block__w-cards-c')
    document.querySelectorAll('.block__w-cards-card .block__wrapper-slider-info-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const slide = btn.closest('.block__w-cards-c')
        if (!slide) return
        const overlay = slide.querySelector('.block__w-cards-card-in')
        if (!overlay) return
        cardSlides.forEach((item) => {
          if (item !== slide) item.classList.remove('active')
        })
        slide.classList.add('active')
        overlay.querySelector('input')?.focus()
      })
    })
    document.querySelectorAll('.block__w-cards-card-in input').forEach((input) => {
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '')
      })
    })
    document.querySelectorAll('.block__w-cards-card-in-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        btn.closest('.block__w-cards-c')?.classList.remove('active')
      })
    })

    const filterList = document.querySelector('.catalog__wrapper-cat-col-filter-list-w-list')
    const filterContainer = document.querySelector('.catalog__wrapper-cat-col-filter')
    const filterCon = document.querySelector('.catalog__wrapper-cat-col-filter-con')
    const filterTitle = document.querySelector('.catalog__wrapper-cat-col-filter-con-title')
    const filterConList = document.querySelector('.catalog__wrapper-cat-col-filter-con-list')
    const filterClose = document.querySelector('.catalog__wrapper-cat-col-filter-con-close')
    const filterApplyBtn = document.querySelector('.catalog__wrapper-cat-col-filter-con-btn')
    const filterInlineApply = document.querySelector('.catalog__wrapper-cat-col-filter-list-w-list-btn')
    const filterTabs = document.querySelector('.catalog__wrapper-cat-col-cards-header-tabs')
    const filtersMobile = document.querySelector('.filters')
    const filtersContainer = document.querySelector('.filters__wrapper-wr-fil')
    const filBtn = document.querySelector('.catalog__wrapper-cat-col-cards-header-fil')
    const filtersClose = document.querySelector('.filters__wrapper-header-close')
    const filtersReset = document.querySelector('.filters__wrapper-btns-res')
    const filtersApply = document.querySelector('.filters__wrapper-btns-ap')

    const CART = {
      wrap: '.cart__wrapper-cards',
      card: '.cart__wrapper-cards-card',
      delBtn: '.cart__wrapper-cards-card-info-del-btn',
      delWrap: '.cart__wrapper-cards-card-info-del',
      popup: '.cart__wrapper-cards-card-info-del-popup',
      popupConfirm: '.cart__wrapper-cards-card-info-del-popup .btn',
      popupClose: '.cart__wrapper-cards-card-info-del-popup-header-close, .cart__wrapper-cards-card-info-del-popup-btns-r'
    }
    const cartWrap = document.querySelector(CART.wrap)
    if (cartWrap) {
      cartWrap.addEventListener('click', (e) => {
        const confirmBtn = e.target.closest(CART.popupConfirm)
        if (confirmBtn) {
          e.preventDefault()
          confirmBtn.closest(CART.card)?.remove()
          return
        }
        const delBtn = e.target.closest(CART.delBtn)
        if (delBtn) {
          e.preventDefault()
          const wrap = delBtn.closest(CART.delWrap)
          const popup = wrap?.querySelector(CART.popup)
          if (popup) {
            popup.classList.add('active')
            popup.querySelectorAll(CART.popupClose).forEach((el) => {
              el.addEventListener('click', (ev) => {
                ev.preventDefault()
                popup.classList.remove('active')
              }, { once: true })
            })
          }
          return
        }
        const closeEl = e.target.closest(CART.popupClose)
        if (closeEl) {
          e.preventDefault()
          closeEl.closest(CART.popup)?.classList.remove('active')
        }
      })
    }

    const selectedItems = {}
    const priceRange = { min: '', max: '' }
    let currentFilterSlug = ''
    const isFilterToggle = (el) => el?.classList.contains('is-toggle')
    const getFilterSlug = (el) => el?.dataset?.filterSlug || ''
    const getFilterItemId = (el) => Number(el?.dataset?.filterId)
    const getFilterLabel = (slug, id) => filterCategories[slug]?.items.find((item) => item.id === id)?.label || ''
    const isToggleCategory = (slug) => filterCategories[slug]?.type === 'toggle'
    const renderFilterOption = (item, selectedIds) => `<span class="${selectedIds.includes(item.id) ? 'active' : ''}" data-filter-id="${item.id}"><p>${item.label}</p><svg viewBox="0 0 32 32"><use xlink:href="img/sprite.svg#close"></use></svg></span>`
    const findFilterTab = (slug, id) => filterTabs?.querySelector(`span[data-filter-slug="${slug}"][data-filter-id="${id}"]`)
    const syncFilterOption = (slug, id, active) => {
      filterConList?.querySelector(`span[data-filter-id="${id}"]`)?.classList.toggle('active', active)
      filtersMobile?.querySelector(`.filters__wrapper-wr-fil-item[data-filter-slug="${slug}"] span[data-filter-id="${id}"]`)?.classList.toggle('active', active)
    }
    const removeFilterSelection = (slug, id) => {
      if (!selectedItems[slug]) return
      selectedItems[slug] = selectedItems[slug].filter((x) => x !== id)
      syncFilterOption(slug, id, false)
      findFilterTab(slug, id)?.remove()
      if (slug === 'badge') syncBadgeTagElements()
      updateTabsActive()
    }
    const syncBadgeTagElements = () => {
      const sel = selectedItems.badge || []
      document.querySelectorAll('.catalog__wrapper-cat-col-filter-list-tags span[data-filter-slug="badge"][data-filter-id]').forEach((span) => {
        const id = getFilterItemId(span)
        if (id) span.classList.toggle('active', sel.includes(id))
      })
    }

    if (filterList && filterContainer && filterCon && filterTitle && filterConList) {
      const limitTagsToRows = (tagsList, maxRows = 2) => {
        if (!tagsList) return 0
        const spans = Array.from(tagsList.querySelectorAll('span'))
        if (!spans.length) return 0
        const rowTops = []
        let hidden = 0
        spans.forEach((span) => {
          const top = span.offsetTop
          let ri = rowTops.findIndex((t) => Math.abs(t - top) <= 2)
          if (ri === -1) {
            rowTops.push(top)
            ri = rowTops.length - 1
          }
          if (ri >= maxRows) {
            span.style.display = 'none'
            hidden++
          } else {
            span.style.display = ''
          }
        })
        return hidden
      }
      const updatePriceTag = () => {
        if (!filterTabs) return
        const min = (priceRange.min || '').trim()
        const max = (priceRange.max || '').trim()
        const resetLink = filterTabs.querySelector('a')
        const addPriceTab = (type, text, onClose) => {
          filterTabs.querySelector(`.filter-price-tag[data-price="${type}"]`)?.remove()
          if (!text) return
          const t = document.createElement('span')
          t.className = 'filter-price-tag'
          t.dataset.price = type
          t.innerHTML = `${text} <svg viewBox="0 0 32 32"><use xlink:href="img/sprite.svg#close"></use></svg>`
          ;(resetLink ? filterTabs.insertBefore(t, resetLink) : filterTabs.appendChild(t))
          t.querySelector('svg').addEventListener('click', (e) => {
            e.stopPropagation()
            t.remove()
            onClose()
            updateTabsActive()
          })
        }
        addPriceTab('min', min ? `от ${min}` : '', () => {
          priceRange.min = ''
          const inpMin = filterContainer?.querySelector('.filter-price__input[data-price="min"]')
          if (inpMin) inpMin.value = ''
          const mobMin = filtersMobile?.querySelector('.filter-price__input[data-price="min"]')
          if (mobMin) mobMin.value = ''
        })
        addPriceTab('max', max ? `до ${max}` : '', () => {
          priceRange.max = ''
          const inpMax = filterContainer?.querySelector('.filter-price__input[data-price="max"]')
          if (inpMax) inpMax.value = ''
          const mobMax = filtersMobile?.querySelector('.filter-price__input[data-price="max"]')
          if (mobMax) mobMax.value = ''
        })
        updateTabsActive()
      }
      const updateTabsActive = () => {
        if (!filterTabs && !filtersApply && !filterInlineApply) return
        const hasTags = filterTabs ? filterTabs.querySelectorAll('span').length > 0 : false
        const hasToggles = !!filterList?.querySelector('.is-toggle.active')
        const hasPrice = !!(priceRange.min || priceRange.max)
        const isActive = hasTags || hasToggles || hasPrice
        if (filterTabs) {
          filterTabs.classList.toggle('active', isActive)
          const resetLink = filterTabs.querySelector('a')
          if (resetLink) resetLink.classList.toggle('active', isActive)
        }
        if (filtersApply) filtersApply.classList.toggle('active', isActive)
        const canInlineBeActive = !filterContainer?.classList.contains('active')
        if (filterInlineApply) filterInlineApply.classList.toggle('active', isActive && canInlineBeActive)
      }
      const saveSelectedState = (slug, id, sel) => {
        if (!selectedItems[slug]) selectedItems[slug] = []
        if (sel) {
          if (!selectedItems[slug].includes(id)) selectedItems[slug].push(id)
        } else {
          selectedItems[slug] = selectedItems[slug].filter((x) => x !== id)
        }
      }
      const addFilterTab = (slug, id) => {
        if (!filterTabs || findFilterTab(slug, id)) return
        const label = getFilterLabel(slug, id)
        if (!label) return
        const newTab = document.createElement('span')
        newTab.dataset.filterSlug = slug
        newTab.dataset.filterId = String(id)
        newTab.innerHTML = `${label} <svg viewBox="0 0 32 32"><use xlink:href="img/sprite.svg#close"></use></svg>`
        const rl = filterTabs.querySelector('a')
        ;(rl ? filterTabs.insertBefore(newTab, rl) : filterTabs.appendChild(newTab))
        newTab.querySelector('svg').addEventListener('click', (e) => {
          e.stopPropagation()
          removeFilterSelection(slug, id)
        })
        updateTabsActive()
      }
      const restoreTabs = () => {
        if (!filterTabs) return
        filterTabs.querySelectorAll('span').forEach((tab) => tab.remove())
        Object.keys(selectedItems).forEach((slug) => {
          (selectedItems[slug] || []).forEach((id) => {
            if (isToggleCategory(slug)) return
            addFilterTab(slug, id)
          })
        })
        syncBadgeTagElements()
        filterList.querySelectorAll('.is-toggle').forEach((s) => {
          const slug = getFilterSlug(s)
          if (slug) s.classList.toggle('active', (selectedItems[slug]?.length || 0) > 0)
        })
        if (filtersMobile) {
          filtersMobile.querySelectorAll('.filters__wrapper-wr-fil-item[data-filter-slug]').forEach((item) => {
            const slug = getFilterSlug(item)
            const toggleEl = item.querySelector('.is-toggle')
            const tagsList = item.querySelector('.filters__wrapper-wr-fil-item-tags')
            if (toggleEl && slug) toggleEl.classList.toggle('active', (selectedItems[slug]?.length || 0) > 0)
            if (tagsList && slug && filterCategories[slug]?.items) {
              const sel = selectedItems[slug] || []
              tagsList.querySelectorAll('span').forEach((s) => {
                const id = getFilterItemId(s)
                if (id) s.classList.toggle('active', sel.includes(id))
              })
            }
          })
          const mPrice = filtersMobile.querySelectorAll('.filter-price__input')
          if (mPrice.length >= 2) {
            mPrice[0].value = priceRange.min
            mPrice[1].value = priceRange.max
          }
        }
        if (priceRange.min || priceRange.max) updatePriceTag()
        const priceInp = filterContainer.querySelectorAll('.filter-price__input')
        if (priceInp.length >= 2) {
          priceInp[0].value = priceRange.min
          priceInp[1].value = priceRange.max
        }
        updateTabsActive()
      }

      filterList.querySelectorAll('span').forEach((span) => {
        span.addEventListener('click', () => {
          const slug = getFilterSlug(span)
          if (!slug || !filterCategories[slug]) return
          if (isFilterToggle(span)) {
            span.classList.toggle('active')
            const toggleId = filterCategories[slug].items[0]?.id
            selectedItems[slug] = span.classList.contains('active') && toggleId ? [toggleId] : []
            const mt = filtersMobile?.querySelector(`.filters__wrapper-wr-fil-item[data-filter-slug="${slug}"] .is-toggle`)
            if (mt) mt.classList.toggle('active', span.classList.contains('active'))
            updateTabsActive()
            return
          }
          filterList.querySelectorAll('span:not(.is-toggle)').forEach((s) => s.classList.remove('active'))
          span.classList.add('active')
          currentFilterSlug = slug
          filterTitle.textContent = filterCategories[slug].title
          const selected = selectedItems[slug] || []
          filterConList.innerHTML = filterCategories[slug].items.map((item) => renderFilterOption(item, selected)).join('')
          restoreTabs()
          filterContainer.classList.add('active')
          updateTabsActive()
        })
      })

      const closeFilter = () => {
        filterContainer.classList.remove('active')
        filterList.querySelectorAll('span:not(.is-toggle)').forEach((s) => s.classList.remove('active'))
      }
      filterClose?.addEventListener('click', closeFilter)
      document.addEventListener('click', (e) => {
        if (filterContainer.classList.contains('active') && !filterContainer.contains(e.target)) closeFilter()
      })
      filterApplyBtn?.addEventListener('click', (e) => {
        e.preventDefault()
        closeFilter()
      })

      if (filterConList && filterTabs) {
        filterConList.addEventListener('click', (e) => {
          const itemSpan = e.target.closest('span')
          if (!itemSpan || !filterConList.contains(itemSpan)) return
          e.stopPropagation()
          const itemId = getFilterItemId(itemSpan)
          if (!itemId || !currentFilterSlug) return
          const slug = currentFilterSlug
          const isClose = e.target.closest('svg') || e.target.tagName === 'svg'
          if (isClose) {
            itemSpan.classList.remove('active')
            saveSelectedState(slug, itemId, false)
            findFilterTab(slug, itemId)?.remove()
            syncFilterOption(slug, itemId, false)
            updateTabsActive()
          } else {
            itemSpan.classList.toggle('active')
            const isActive = itemSpan.classList.contains('active')
            saveSelectedState(slug, itemId, isActive)
            if (isActive) addFilterTab(slug, itemId)
            else removeFilterSelection(slug, itemId)
          }
        })
        const resetLink = filterTabs.querySelector('a')
        if (resetLink) {
          resetLink.addEventListener('click', (e) => {
            e.preventDefault()
            filterTabs.querySelectorAll('span').forEach((tab) => tab.remove())
            filterConList.querySelectorAll('span.active').forEach((s) => s.classList.remove('active'))
            filterList.querySelectorAll('.is-toggle').forEach((s) => s.classList.remove('active'))
            filterTabs.querySelector('.filter-price-tag')?.remove()
            priceRange.min = ''
            priceRange.max = ''
            filterContainer.querySelectorAll('.filter-price__input').forEach((inp) => inp.value = '')
            Object.keys(selectedItems).forEach((k) => { selectedItems[k] = [] })
            syncBadgeTagElements()
            updateTabsActive()
            if (filtersMobile && filtersContainer) {
              filtersContainer.querySelectorAll('.filters__wrapper-wr-fil-item').forEach((item) => {
                const tagsList = item.querySelector('.filters__wrapper-wr-fil-item-tags')
                const showAllBtn = item.querySelector('.filters__wrapper-wr-fil-item-btn')
                const toggleEl = item.querySelector('.is-toggle')
                const priceEl = item.querySelector('.filter-price')
                if (tagsList) {
                  tagsList.querySelectorAll('span.active').forEach((s) => s.classList.remove('active'))
                  const h = limitTagsToRows(tagsList, 2)
                  if (showAllBtn) {
                    showAllBtn.style.display = h ? '' : 'none'
                    showAllBtn.dataset.expanded = '0'
                    showAllBtn.textContent = 'показать все'
                  }
                }
                if (toggleEl) toggleEl.classList.remove('active')
                if (priceEl) priceEl.querySelectorAll('.filter-price__input').forEach((inp) => inp.value = '')
              })
            }
          })
        }
      }

      filterContainer.querySelectorAll('.filter-price__input').forEach((input, i) => {
        input.addEventListener('input', () => {
          input.value = input.value.replace(/\D/g, '')
          priceRange[i === 0 ? 'min' : 'max'] = input.value
          updatePriceTag()
        })
      })
      restoreTabs()

      document.querySelectorAll('.catalog__wrapper-cat-col-filter-list-tags').forEach((wrap) => {
        wrap.addEventListener('click', (e) => {
          const span = e.target.closest('span')
          if (!span || !wrap.contains(span)) return
          const slug = getFilterSlug(span)
          const id = getFilterItemId(span)
          if (slug !== 'badge' || !id) return
          e.stopPropagation()
          if (e.target.closest('svg') || e.target.tagName === 'svg') {
            saveSelectedState('badge', id, false)
            removeFilterSelection('badge', id)
            syncBadgeTagElements()
          } else {
            const isActive = !(selectedItems.badge || []).includes(id)
            saveSelectedState('badge', id, isActive)
            if (isActive) addFilterTab('badge', id)
            else removeFilterSelection('badge', id)
            syncBadgeTagElements()
          }
        })
      })

      catalogFilterParamsGetter = () => {
        const filters = {}
        Object.keys(selectedItems).forEach((slug) => {
          if (selectedItems[slug]?.length) filters[slug] = [...selectedItems[slug]]
        })
        return { filters, price: { ...priceRange } }
      }

      const SORT_LABELS = {
        popular: 'СНАЧАЛА популярное',
        new: 'СНАЧАЛА НОВИНКИ',
        az: 'по алфавиту А_Z',
        za: 'по алфавиту Z_A'
      }
      const sortBtn = document.querySelector('.catalog__wrapper-cat-col-cards-header-sort-btn')
      const sortBlock = document.querySelector('.catalog__wrapper-cat-col-cards-header-sort')
      const sortTexts = document.querySelectorAll('.catalog__wrapper-cat-col-cards-header-text')
      if (sortBtn && sortBlock) {
        bindTogglePanel(sortBtn, sortBlock, { closeOnOutside: true, closeSelectors: '.catalog__wrapper-cat-col-cards-header-sort-close', toggleTriggerClass: false })
        sortBlock.querySelectorAll('.catalog__wrapper-cat-col-cards-header-sort-list a[data-sort]').forEach((link) => {
          link.addEventListener('click', (e) => {
            e.preventDefault()
            const sortId = link.dataset.sort
            if (!sortId || !SORT_LABELS[sortId]) return
            sortTexts.forEach((el) => {
              el.dataset.sort = sortId
              el.textContent = SORT_LABELS[sortId]
            })
            sortBlock.classList.remove('active')
          })
        })
      }

      if (filBtn && filtersMobile && filtersContainer) {
        const createMobileFilter = (slug, items) => {
          const item = document.createElement('div')
          item.className = 'filters__wrapper-wr-fil-item'
          item.dataset.filterSlug = slug
          const selected = selectedItems[slug] || []
          const toShow = 6
          item.innerHTML = `<div class="filters__wrapper-wr-fil-item-header"><p class="filters__wrapper-wr-fil-item-header-title">${filterCategories[slug].title}</p><svg viewBox="0 0 41 16"><use xlink:href="img/sprite.svg#sliderArrow"></use></svg></div><div class="filters__wrapper-wr-fil-item-tags catalog__wrapper-cat-col-filter-con-list">${items.slice(0, toShow).map((t) => renderFilterOption(t, selected)).join('')}</div>${items.length > toShow ? '<a href="#" class="filters__wrapper-wr-fil-item-btn">показать все</a>' : ''}`
          return item
        }
        const createMobileToggle = (slug) => {
          const item = document.createElement('div')
          item.className = 'filters__wrapper-wr-fil-item'
          item.dataset.filterSlug = slug
          item.innerHTML = `<div class="filters__wrapper-wr-fil-item-header"><p class="filters__wrapper-wr-fil-item-header-title">${filterCategories[slug].title}</p><svg viewBox="0 0 41 16"><use xlink:href="img/sprite.svg#sliderArrow"></use></svg></div><span class="is-toggle"><span class="toggle-switch" aria-hidden="true"></span></span>`
          return item
        }
        const createMobilePrice = () => {
          const item = document.createElement('div')
          item.className = 'filters__wrapper-wr-fil-item'
          item.innerHTML = `<div class="filters__wrapper-wr-fil-item-header"><p class="filters__wrapper-wr-fil-item-header-title">Цена</p><svg viewBox="0 0 41 16"><use xlink:href="img/sprite.svg#sliderArrow"></use></svg></div><div class="filter-price"><div class="filter-price__inputs"><input type="text" class="filter-price__input" placeholder="от" inputmode="numeric" data-price="min"><input type="text" class="filter-price__input" placeholder="до" inputmode="numeric" data-price="max"></div></div>`
          return item
        }
        Object.entries(filterCategories).forEach(([slug, cat]) => {
          if (cat.type === 'toggle') filtersContainer.appendChild(createMobileToggle(slug))
          else filtersContainer.appendChild(createMobileFilter(slug, cat.items))
        })
        filtersContainer.appendChild(createMobilePrice())
        const initMobileFilters = () => {
          filtersContainer.querySelectorAll('.filters__wrapper-wr-fil-item').forEach((item) => {
            const header = item.querySelector('.filters__wrapper-wr-fil-item-header')
            const tagsList = item.querySelector('.filters__wrapper-wr-fil-item-tags')
            const showAllBtn = item.querySelector('.filters__wrapper-wr-fil-item-btn')
            const toggleEl = item.querySelector('.is-toggle')
            const priceEl = item.querySelector('.filter-price')
            const slug = getFilterSlug(item)
            if (!slug) return
            if (header && tagsList && filterCategories[slug]?.items) {
              header.addEventListener('click', () => item.classList.toggle('active'))
              const renderTags = (expanded) => {
                const all = filterCategories[slug].items
                const sel = selectedItems[slug] || []
                tagsList.innerHTML = all.map((t) => renderFilterOption(t, sel)).join('')
                const spans = Array.from(tagsList.querySelectorAll('span'))
                if (!expanded && spans.length) {
                  const h = limitTagsToRows(tagsList, 2)
                  if (showAllBtn) {
                    showAllBtn.style.display = h ? '' : 'none'
                    showAllBtn.dataset.expanded = '0'
                    showAllBtn.textContent = 'показать все'
                  }
                } else {
                  spans.forEach((s) => s.style.display = '')
                  if (showAllBtn) {
                    showAllBtn.style.display = spans.length ? '' : 'none'
                    showAllBtn.dataset.expanded = expanded ? '1' : '0'
                    showAllBtn.textContent = expanded ? 'свернуть' : 'показать все'
                  }
                }
              }
              renderTags(false)
              tagsList.addEventListener('click', (e) => {
                const ispan = e.target.closest('span')
                if (!ispan || !tagsList.contains(ispan)) return
                e.stopPropagation()
                const itemId = getFilterItemId(ispan)
                if (!itemId) return
                if (e.target.closest('svg') || e.target.tagName === 'svg') {
                  ispan.classList.remove('active')
                  saveSelectedState(slug, itemId, false)
                  findFilterTab(slug, itemId)?.remove()
                  syncFilterOption(slug, itemId, false)
                  updateTabsActive()
                } else {
                  ispan.classList.toggle('active')
                  const isActive = ispan.classList.contains('active')
                  saveSelectedState(slug, itemId, isActive)
                  if (isActive) addFilterTab(slug, itemId)
                  else removeFilterSelection(slug, itemId)
                }
              })
              if (showAllBtn) {
                showAllBtn.dataset.expanded = '0'
                showAllBtn.textContent = 'показать все'
                showAllBtn.addEventListener('click', (e) => {
                  e.preventDefault()
                  renderTags(showAllBtn.dataset.expanded !== '1')
                })
              }
            }
            if (toggleEl && isFilterToggle(toggleEl) && isToggleCategory(slug)) {
              toggleEl.addEventListener('click', () => {
                toggleEl.classList.toggle('active')
                const toggleId = filterCategories[slug].items[0]?.id
                selectedItems[slug] = toggleEl.classList.contains('active') && toggleId ? [toggleId] : []
                filterList?.querySelector(`span.is-toggle[data-filter-slug="${slug}"]`)?.classList.toggle('active', toggleEl.classList.contains('active'))
                updateTabsActive()
              })
              if (selectedItems[slug]?.length > 0) toggleEl.classList.add('active')
            }
            if (priceEl) {
              priceEl.querySelectorAll('.filter-price__input').forEach((input, i) => {
                input.addEventListener('input', () => {
                  input.value = input.value.replace(/\D/g, '')
                  priceRange[i === 0 ? 'min' : 'max'] = input.value
                  updatePriceTag()
                })
                input.value = i === 0 ? priceRange.min : priceRange.max
              })
            }
          })
        }
        initMobileFilters()
        filBtn.addEventListener('click', () => filtersMobile.classList.add('active'))
        filtersClose?.addEventListener('click', () => filtersMobile.classList.remove('active'))
        document.addEventListener('click', (e) => {
          if (filtersMobile.classList.contains('active') && !filtersMobile.contains(e.target) && !filBtn.contains(e.target)) filtersMobile.classList.remove('active')
        })
        filtersReset?.addEventListener('click', (e) => {
          e.preventDefault()
          filterTabs?.querySelectorAll('span').forEach((t) => t.remove())
          filterConList?.querySelectorAll('span.active').forEach((s) => s.classList.remove('active'))
          filtersContainer.querySelectorAll('.filters__wrapper-wr-fil-item').forEach((item) => {
            item.querySelector('.filters__wrapper-wr-fil-item-tags')?.querySelectorAll('span.active').forEach((s) => s.classList.remove('active'))
            item.querySelector('.is-toggle')?.classList.remove('active')
            item.querySelector('.filter-price')?.querySelectorAll('.filter-price__input').forEach((inp) => inp.value = '')
          })
          filterList?.querySelectorAll('.is-toggle').forEach((s) => s.classList.remove('active'))
          filterContainer?.querySelectorAll('.filter-price__input').forEach((inp) => inp.value = '')
          filterTabs?.querySelector('.filter-price-tag')?.remove()
          priceRange.min = ''
          priceRange.max = ''
          Object.keys(selectedItems).forEach((k) => { selectedItems[k] = [] })
          syncBadgeTagElements()
          updateTabsActive()
          filtersContainer.querySelectorAll('.filters__wrapper-wr-fil-item').forEach((item) => {
            const tagsList = item.querySelector('.filters__wrapper-wr-fil-item-tags')
            const showAllBtn = item.querySelector('.filters__wrapper-wr-fil-item-btn')
            if (tagsList) {
              const h = limitTagsToRows(tagsList, 2)
              if (showAllBtn) {
                showAllBtn.style.display = h ? '' : 'none'
                showAllBtn.dataset.expanded = '0'
                showAllBtn.textContent = 'показать все'
              }
            }
          })
        })
        filtersApply?.addEventListener('click', (e) => {
          e.preventDefault()
          filtersMobile.classList.remove('active')
        })
      }

      initTabs('.catalog__wrapper-cat', '.catalog__wrapper-cat-header p', '.catalog__wrapper-cat-col-cards-items, .catalog__wrapper-cat-col-cards-col, .catalog__wrapper-cat-col-cards-fac', {
        syncPanelsSelector: '.catalog__wrapper-header-pane',
        syncPanelsRoot: document.querySelector('.catalog__wrapper')
      })
    }

    document.querySelectorAll('.catalog__partners-row-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const row = btn.closest('.catalog__partners-row')
        const form = row?.querySelector('.catalog__partners-row-in')
        if (!form) return
        btn.classList.add('hide')
        form.classList.add('active')
        form.querySelector('input')?.focus()
      })
    })
    document.querySelectorAll('.catalog__partners-row-in .btn').forEach((okBtn) => {
      okBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const form = okBtn.closest('.catalog__partners-row-in')
        form?.classList.remove('active')
        form?.closest('.catalog__partners-row')?.querySelector('.catalog__partners-row-btn')?.classList.remove('hide')
      })
    })
    document.querySelectorAll('.catalog__partners-row-mob-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const row = btn.closest('.catalog__partners-row-mob')
        const form = row?.querySelector('.catalog__partners-row-mob-in')
        if (!form) return
        btn.classList.add('hide')
        form.classList.add('active')
        form.querySelector('input')?.focus()
      })
    })
    document.querySelectorAll('.catalog__partners-row-mob-in .btn').forEach((okBtn) => {
      okBtn.addEventListener('click', (e) => {
        e.preventDefault()
        e.stopPropagation()
        const form = okBtn.closest('.catalog__partners-row-mob-in')
        form?.classList.remove('active')
        form?.closest('.catalog__partners-row-mob')?.querySelector('.catalog__partners-row-mob-btn')?.classList.remove('hide')
      })
    })
    document.querySelectorAll('.catalog__partners-row-in input, .catalog__partners-row-mob-in input').forEach((input) => {
      input.addEventListener('click', (e) => e.stopPropagation())
      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '')
      })
    })
  }

  // --- аккаунт: выпадающий список, табы, настройки ---
  function initAccount() {
    const accountNav = document.querySelector('.account__wrapper-info-nav')
    if (accountNav) {
      const accountHeader = accountNav.querySelector('.account__wrapper-info-nav-header')
      const accountList = accountNav.querySelector('.account__wrapper-info-nav-list')
      if (accountHeader && accountList) {
        bindTogglePanel(accountHeader, accountNav, { closeOnOutside: true, toggleTriggerClass: false })
        accountList.addEventListener('click', (e) => {
          const link = e.target.closest('a')
          if (!link || link.classList.contains('log')) return
          e.preventDefault()
          const headerLink = accountHeader.querySelector('a')
          if (!headerLink) return
          headerLink.replaceWith(link.cloneNode(true))
          link.replaceWith(headerLink.cloneNode(true))
          accountNav.classList.remove('active')
        })
      }
    }
    const accountTabs = document.querySelector('.account__wrapper-info-tab')
    if (accountTabs) {
      const tabs = accountTabs.querySelectorAll('p')
      const col1 = document.querySelector('.account__wrapper-info-col')
      const col2 = document.querySelector('.account__wrapper-info-col2')
      if (tabs.length >= 2 && col1 && col2) {
        accountTabs.addEventListener('click', (e) => {
          const tab = e.target.closest('p')
          if (!tab) return
          const idx = Array.from(tabs).indexOf(tab)
          tabs.forEach((t) => t.classList.remove('active'))
          tab.classList.add('active')
          if (idx === 0) {
            col1.style.display = ''
            col2.style.display = 'none'
          } else {
            col1.style.display = 'none'
            col2.style.display = ''
          }
        })
        tabs[0].classList.add('active')
        col1.style.display = ''
        col2.style.display = 'none'
      }
    }
    const accountSettings = document.querySelector('.account__wrapper-info') || document.querySelector('.plk__wrapper-wrapper')
    if (!accountSettings?.querySelector('.account__settings')) return
    const rows = accountSettings.querySelectorAll('.account__settings-row'), stateBlocks = accountSettings.querySelectorAll('.account__settings[data-settings-state]'), messages = accountSettings.querySelectorAll('.account__settings-message')
    const emailBlock = accountSettings.querySelector('.account__settings--email'), passwordBlock = accountSettings.querySelector('.account__settings--password'), addressBlock = accountSettings.querySelector('.account__settings--address'), legalBlock = accountSettings.querySelector('.account__settings--legal')
    const emailInput = emailBlock?.querySelector('input[name="new_email"]'), passwordCurrentInput = passwordBlock?.querySelector('input[name="current_password"]'), passwordNewInput = passwordBlock?.querySelector('input[name="new_password"]'), passwordRepeatInput = passwordBlock?.querySelector('input[name="repeat_password"]')
    const emailSaveBtn = emailBlock?.querySelector('.btn'), passwordSaveBtn = passwordBlock?.querySelector('.btn'), addressAddBtn = addressBlock?.querySelector('.account__settings--address-btn'), legalAddBtn = legalBlock?.querySelector('.account__settings--legal-btn')
    let addressInputs = addressBlock ? Array.from(addressBlock.querySelectorAll('input')) : []
    addressInputs.forEach((inp) => {
      inp.dataset.initial = inp.value.trim()
    })

    let addressGroups = addressBlock
      ? Array.from(addressBlock.querySelectorAll('.account__settings-actions')).map((actions) => {
          const save = actions.querySelector('[data-address-save]')
          const remove = actions.querySelector('.btn:not([data-address-save])')
          const fields = actions.closest('.account__settings-fields')
          const inputs = fields ? Array.from(fields.querySelectorAll('input')) : []
          return { save, remove, fields, actions, inputs }
        }).filter((g) => g.save && g.remove && g.fields && g.inputs.length)
      : []
    let legalGroups = legalBlock
      ? Array.from(legalBlock.querySelectorAll('.account__settings-actions')).map((actions) => {
          const save = actions.querySelector('[data-legal-save]')
          const remove = actions.querySelector('.btn:not([data-legal-save])')
          const fields = actions.closest('.account__settings-fields')
          const inputs = fields ? Array.from(fields.querySelectorAll('input')) : []
          return { save, remove, fields, actions, inputs }
        }).filter((g) => g.save && g.remove && g.fields && g.inputs.length)
      : []
    let legalInputs = legalGroups.flatMap((g) => g.inputs)
    legalInputs.forEach((inp) => {
      inp.dataset.initial = inp.value.trim()
    })
    const emailMessage = accountSettings.querySelector('.account__settings-message--email'), passwordMessage = accountSettings.querySelector('.account__settings-message--password')
    const setError = (input, err) => {
      if (!input) return
      const f = input.closest('.account__settings-field')
      input.classList.toggle('error', err)
      if (f) f.classList.toggle('error', err)
    }
    const showOverview = () => {
      stateBlocks.forEach((b) => b.hidden = true)
      rows.forEach((r) => r.hidden = false)
      messages.forEach((m) => m.hidden = true)
    }
    const showState = (name) => {
      if (!name) return
      stateBlocks.forEach((b) => b.hidden = b.dataset.settingsState !== name)
      rows.forEach((r) => r.hidden = r.dataset.settingsRow === name)
      messages.forEach((m) => m.hidden = true)
    }
    const showResult = (type) => {
      showOverview()
      const targetMsg = type === 'email' ? emailMessage : type === 'password' ? passwordMessage : null
      messages.forEach((m) => m.hidden = m !== targetMsg)
    }
    const validateEmail = (withErr) => {
      if (!emailInput) return true
      const ok = emailInput.value.trim().length > 0 && EMAIL_REGEX.test(emailInput.value.trim())
      if (withErr) setError(emailInput, !ok)
      return ok
    }
    const validatePassword = (withErr) => {
      if (!passwordCurrentInput || !passwordNewInput || !passwordRepeatInput) return true
      let v = true
      if (!passwordCurrentInput.value.trim().length) {
        v = false
        if (withErr) setError(passwordCurrentInput, true)
      }
      const newOk = passwordNewInput.value.trim().length > 0 && isStrongPassword(passwordNewInput.value.trim())
      if (!newOk) {
        v = false
        if (withErr) setError(passwordNewInput, true)
      }
      if (passwordRepeatInput.value.trim() !== passwordNewInput.value.trim()) {
        v = false
        if (withErr) setError(passwordRepeatInput, true)
      }
      return v
    }
    const normalizeCity = (val) => {
      const v = val.replace(/\s+/g, ' ').trim()
      const noPrefix = v.replace(/^г\.\s*/i, '')
      return noPrefix ? `г. ${noPrefix}` : 'г. '
    }
    const normalizeStreet = (val) => {
      const v = val.replace(/\s+/g, ' ').trim()
      const noPrefix = v.replace(/^ул\.\s*/i, '')
      return noPrefix ? `ул. ${noPrefix}` : 'ул. '
    }
    const normalizeHouse = (val) => {
      const v = val.replace(/\s+/g, ' ').trim()
      const noPrefix = v.replace(/^д\.\s*/i, '')
      return noPrefix ? `д. ${noPrefix}` : 'д. '
    }
    const normalizeApartment = (val) => {
      const digits = val.replace(/\D/g, '')
      return digits ? `кв. ${digits}` : 'кв. '
    }
    const validateAddress = (withErr) => {
      if (!addressInputs.length) return true
      let v = true
      addressInputs.forEach((inp) => {
        const val = inp.value.trim()
        let ok = true
        if (inp.name && inp.name.startsWith('apartment')) {
          const digits = val.replace(/^кв\.\s*/i, '').trim()
          if (digits.length && !/^\d+$/.test(digits)) ok = false
        } else {
          if (inp.name === 'city' || inp.name === 'city_2') {
            const suffix = val.replace(/^г\.\s*/i, '').trim()
            if (!suffix.length) ok = false
          } else if (inp.name === 'street' || inp.name === 'street_2') {
            const suffix = val.replace(/^ул\.\s*/i, '').trim()
            if (!suffix.length) ok = false
          } else if (inp.name === 'house' || inp.name === 'house_2') {
            const suffix = val.replace(/^д\.\s*/i, '').trim()
            if (!suffix.length) ok = false
          } else {
            if (!val.length) ok = false
          }
        }
        if (!ok) v = false
        if (withErr) setError(inp, !ok)
      })
      return v
    }
    const updateEmailSaveState = () => {
      if (emailSaveBtn) emailSaveBtn.disabled = !validateEmail(false)
    }
    const updatePasswordSaveState = () => {
      if (passwordSaveBtn && passwordCurrentInput && passwordNewInput && passwordRepeatInput) passwordSaveBtn.disabled = ![passwordCurrentInput, passwordNewInput, passwordRepeatInput].every((i) => i.value.trim().length > 0)
    }
    const updateAddressSaveState = () => {
      if (!addressGroups.length) return
      addressGroups.forEach((group) => {
        const changed = group.inputs.some((inp) => inp.value.trim() !== (inp.dataset.initial || ''))
        if (group.save) group.save.disabled = !changed
      })
    }
    const syncLegalOverview = () => {
      const row = accountSettings.querySelector('.account__settings-row[data-settings-row="legal"]')
      const list = row?.querySelector('.account__settings-row-addresses')
      if (!list) return
      list.innerHTML = ''
      legalGroups.forEach((group) => {
        const value = group.inputs[0]?.value.trim()
        if (!value) return
        const item = document.createElement('div')
        item.className = 'account__settings-row-addresses-item'
        item.innerHTML = `<p>${value}</p>`
        list.appendChild(item)
      })
    }
    const updateLegalSaveState = () => {
      if (!legalGroups.length) return
      legalGroups.forEach((group) => {
        const input = group.inputs[0]
        if (!input || !group.save) return
        const changed = input.value.trim() !== (input.dataset.initial || '')
        const hasValue = input.value.trim().length > 0
        group.save.disabled = !(changed && hasValue)
      })
    }
    showOverview()
    updateEmailSaveState()
    updatePasswordSaveState()
    updateAddressSaveState()
    updateLegalSaveState()
    accountSettings.addEventListener('click', (e) => {
      e.stopPropagation()
      const openBtn = e.target.closest('[data-settings-open]')
      if (openBtn) {
        e.preventDefault()
        showState(openBtn.dataset.settingsOpen)
        return
      }
      if (e.target.closest('[data-settings-close]')) {
        e.preventDefault()
        showOverview()
      }
    })
    emailInput?.addEventListener('input', () => {
      setError(emailInput, false)
      updateEmailSaveState()
    })
    emailSaveBtn?.addEventListener('click', (e) => {
      e.preventDefault()
      if (!validateEmail(true)) return
      showResult('email')
    })
    if (passwordCurrentInput && passwordNewInput && passwordRepeatInput) {
      const passwordInputs = [passwordCurrentInput, passwordNewInput, passwordRepeatInput]
      passwordInputs.forEach((input) => {
        input.addEventListener('input', () => {
          setError(input, false)
          updatePasswordSaveState()
        })
      })
    }
    passwordSaveBtn?.addEventListener('click', (e) => {
      e.preventDefault()
      if (!validatePassword(true)) return
      showResult('password')
    })
    const bindAddressInput = (inp) => {
      inp.addEventListener('input', () => {
        if (inp.name === 'city' || inp.name === 'city_2') {
          inp.value = normalizeCity(inp.value)
        } else if (inp.name === 'street' || inp.name === 'street_2') {
          inp.value = normalizeStreet(inp.value)
        } else if (inp.name === 'house' || inp.name === 'house_2') {
          inp.value = normalizeHouse(inp.value)
        } else if (inp.name && inp.name.startsWith('apartment')) {
          inp.value = normalizeApartment(inp.value)
        }
        setError(inp, false)
        updateAddressSaveState()
      })
    }
    const bindAddressGroup = (group) => {
      if (!group?.save || !group?.remove || !group.inputs?.length) return
      group.save.addEventListener('click', (e) => {
        e.preventDefault()
        if (!validateAddress(true)) return
        group.inputs.forEach((inp) => {
          inp.dataset.initial = inp.value.trim()
        })
        updateAddressSaveState()
      })
      group.remove.addEventListener('click', (e) => {
        e.preventDefault()
        if (addressGroups.length <= 1) {
          showOverview()
          return
        }
        group.fields.remove()
        addressGroups = addressGroups.filter((item) => item !== group)
        addressInputs = addressInputs.filter((inp) => !group.inputs.includes(inp))
        updateAddressSaveState()
      })
    }
    addressInputs.forEach(bindAddressInput)
    addressGroups.forEach(bindAddressGroup)
    const bindLegalGroup = (group) => {
      if (!group?.save || !group?.remove || !group.inputs?.length) return
      const input = group.inputs[0]
      input?.addEventListener('input', () => {
        setError(input, false)
        updateLegalSaveState()
      })
      group.save.addEventListener('click', (e) => {
        e.preventDefault()
        const value = input?.value.trim() || ''
        setError(input, !value.length)
        if (!value.length) return
        input.dataset.initial = value
        syncLegalOverview()
        updateLegalSaveState()
      })
      group.remove.addEventListener('click', (e) => {
        e.preventDefault()
        if (legalGroups.length <= 1) {
          showOverview()
          return
        }
        group.fields.remove()
        legalGroups = legalGroups.filter((item) => item !== group)
        legalInputs = legalInputs.filter((inp) => !group.inputs.includes(inp))
        syncLegalOverview()
        updateLegalSaveState()
      })
    }
    legalGroups.forEach(bindLegalGroup)
    legalAddBtn?.addEventListener('click', (e) => {
      e.preventDefault()
      if (!legalBlock) return
      const index = legalGroups.length + 1
      const fields = document.createElement('div')
      fields.className = 'account__settings-fields'
      fields.innerHTML = `<label class="account__settings-field"><input type="text" name="legal_name_${index}" placeholder="Название организации*" value=""></label><div class="account__settings-actions"><button type="button" class="btn">УДАЛИТЬ</button><button type="button" class="btn" data-legal-save disabled>СОХРАНИТЬ</button></div>`
      legalAddBtn.insertAdjacentElement('beforebegin', fields)
      const actions = fields.querySelector('.account__settings-actions')
      const input = fields.querySelector('input')
      if (!input || !actions) return
      input.dataset.initial = input.value.trim()
      const group = {
        save: actions.querySelector('[data-legal-save]'),
        remove: actions.querySelector('.btn:not([data-legal-save])'),
        fields,
        actions,
        inputs: [input]
      }
      legalGroups.push(group)
      legalInputs = [...legalInputs, input]
      bindLegalGroup(group)
      updateLegalSaveState()
    })
    addressAddBtn?.addEventListener('click', (e) => {
      e.preventDefault()
      if (!addressBlock) return
      const index = addressGroups.length + 1
      const fields = document.createElement('div')
      fields.className = 'account__settings-fields grid-m'
      fields.innerHTML = `<div class="account__settings-fields account__settings-fields--grid"><label class="account__settings-field"><input type="text" name="city_${index}" placeholder="Город*" value="г. "></label><label class="account__settings-field"><input type="text" name="street_${index}" placeholder="Улица*" value="ул. "></label><label class="account__settings-field"><input type="text" name="house_${index}" placeholder="Дом*" value="д. "></label><label class="account__settings-field"><input type="text" name="apartment_${index}" placeholder="Номер квартиры*" value="кв. "></label></div><div class="account__settings-actions"><button type="button" class="btn">УДАЛИТЬ</button><button type="button" class="btn" data-address-save disabled>СОХРАНИТЬ</button></div>`
      addressAddBtn.insertAdjacentElement('beforebegin', fields)
      const actions = fields.querySelector('.account__settings-actions')
      if (!actions) return
      const inputs = Array.from(fields.querySelectorAll('input'))
      inputs.forEach((inp) => {
        inp.dataset.initial = inp.value.trim()
      })
      addressInputs = [...addressInputs, ...inputs]
      const group = {
        save: actions.querySelector('[data-address-save]'),
        remove: actions.querySelector('.btn:not([data-address-save])'),
        fields,
        actions,
        inputs
      }
      addressGroups.push(group)
      inputs.forEach(bindAddressInput)
      bindAddressGroup(group)
      updateAddressSaveState()
    })
  }

  // --- ui: куки, скролл, контакты, реквизиты, избранное, бегущие строки, селект ---
  function initUi() {
    const cookies = document.querySelector('.cookies')
    if (cookies) {
      cookies.style.display = 'none'
      if (!localStorage.getItem('cookiesAccepted')) {
        cookies.style.display = ''
        cookies.querySelector('.cookies__wrapper-btn')?.addEventListener('click', (e) => {
          e.preventDefault()
          localStorage.setItem('cookiesAccepted', '1')
          cookies.style.display = 'none'
        })
      }
    }

    document.querySelectorAll('[data-sticky="cart-total"]').forEach((el) => {
      const header = document.querySelector('.header')
      const getOffset = () => Math.max(0, Math.floor(header?.getBoundingClientRect().height || 0))

      const holder = document.createElement('div')
      holder.className = 'cart__wrapper-count-sticky-holder'
      el.parentNode.insertBefore(holder, el)

      const ph = document.createElement('div')
      ph.className = 'cart__wrapper-count-sticky-ph'
      holder.appendChild(ph)
      holder.appendChild(el)

      let anchorY = 0
      const syncTop = () => {
        el.style.setProperty('--cart-sticky-top', `${getOffset()}px`)
      }
      const syncPlaceholderBox = () => {
        const r = el.getBoundingClientRect()
        ph.style.width = `${r.width}px`
        ph.style.marginLeft = 'auto'
      }
      const syncPlaceholder = () => {
        ph.style.height = el.classList.contains('is-stuck') ? `${el.getBoundingClientRect().height}px` : '0px'
      }
      const syncFixedGeom = () => {
        if (!el.classList.contains('is-stuck')) return
        const r = ph.getBoundingClientRect()
        el.style.left = `${r.left}px`
        el.style.width = `${r.width}px`
      }
      const setStuck = (next) => {
        if (next && !el.classList.contains('is-stuck')) syncPlaceholderBox()
        el.classList.toggle('is-stuck', next)
        if (!next) {
          el.style.left = ''
          el.style.width = ''
        }
        syncTop()
        syncPlaceholder()
        syncFixedGeom()
      }

      const recalcAnchor = () => {
        const was = el.classList.contains('is-stuck')
        if (was) setStuck(false)
        const r = holder.getBoundingClientRect()
        anchorY = Math.round(r.top + (window.pageYOffset || document.documentElement.scrollTop))
        syncPlaceholderBox()
        if (was) setStuck(true)
      }

      let ticking = false
      const update = () => {
        ticking = false
        const offset = getOffset()
        const y = (window.pageYOffset || document.documentElement.scrollTop) + offset
        setStuck(y >= anchorY)
      }
      const onScroll = () => {
        if (ticking) return
        ticking = true
        requestAnimationFrame(update)
      }

      window.addEventListener('scroll', onScroll, { passive: true })
      window.addEventListener('resize', () => {
        recalcAnchor()
        onScroll()
      })
      recalcAnchor()
      onScroll()
    })

    document.querySelectorAll('.item__wrapper-info-i-name-header-btn').forEach((wrap) => {
      const addBtn = wrap.querySelector('a.btn')
      const qty = wrap.querySelector('.cart__wrapper-cards-card-info-i-bot')
      const link = wrap.querySelector('.item__wrapper-info-i-name-header-btn-link')
      const input = qty?.querySelector('input')
      const okBtn = qty?.querySelector('.block__w-cards-card-in-btn')
      if (!addBtn || !qty || !input) return

      const addBtnDefaultText = addBtn.textContent.trim()

      const showQty = () => {
        addBtn.classList.add('hide')
        addBtn.style.display = ''
        addBtn.textContent = addBtnDefaultText
        qty.classList.add('active')
        link?.classList.remove('active')
        input.focus()
        input.select?.()
      }

      const showLink = () => {
        addBtn.classList.remove('hide')
        addBtn.style.display = ''
        addBtn.textContent = 'Добавлено'
        qty.classList.remove('active')
        link?.classList.add('active')
      }

      const hasValue = () => {
        const v = input.value.replace(/\s+/g, '').replace(',', '.')
        const n = Number(v)
        return Number.isFinite(n) && n > 0
      }

      input.addEventListener('input', () => {
        input.value = input.value.replace(/\D/g, '')
      })

      addBtn.addEventListener('click', (e) => {
        e.preventDefault()
        showQty()
      })

      okBtn?.addEventListener('click', (e) => {
        e.preventDefault()
        if (hasValue()) showLink()
      })

      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter') return
        e.preventDefault()
        if (hasValue()) showLink()
      })
    })
    document.querySelector('.main__arrow')?.addEventListener('click', () => {
      const section = document.querySelector('.main__arrow')?.closest('section')
      if (!section?.nextElementSibling) return
      const rect = section.nextElementSibling.getBoundingClientRect()
      const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - parseFloat(getComputedStyle(document.documentElement).fontSize) * 9.5
      window.scrollTo({ top, behavior: FLAGS.smoothScroll ? 'smooth' : 'auto' })
    })
    const mContactBtn = document.querySelector('.m__contact__wrapper-btn')
    const mContact = document.querySelector('.m__contact')
    if (mContactBtn && mContact) {
      mContactBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        mContact.classList.toggle('active')
      })
      document.addEventListener('click', (e) => {
        if (!mContact.contains(e.target)) mContact.classList.remove('active')
      })
    }
    document.querySelectorAll('.requisites__wrapper-cards-card-bottom a').forEach((link) => {
      if (!link.textContent.trim().toLowerCase().includes('скопировать')) return
      link.addEventListener('click', function (e) {
        e.preventDefault()
        const card = this.closest('.requisites__wrapper-cards-card')
        const textEl = card?.querySelector('.requisites__wrapper-cards-card-w-text h3')
        if (!textEl) return
        const text = textEl.textContent.trim()
        const done = () => {
          const o = this.textContent
          this.textContent = 'Скопировано'
          setTimeout(() => { this.textContent = o }, 2000)
        }
        navigator.clipboard.writeText(text).then(done).catch(() => {
          const ta = document.createElement('textarea')
          ta.value = text
          ta.style.cssText = 'position:fixed;opacity:0'
          document.body.appendChild(ta)
          ta.select()
          try {
            document.execCommand('copy')
            done.call(this)
          } catch (err) {
            console.error(err)
          }
          document.body.removeChild(ta)
        })
      })
    })
    document.querySelectorAll('.favourites__wrapper-link').forEach((link) => {
      const textEl = link.querySelector('.favourites__wrapper-link-text')
      const maxLen = 30
      const path = window.location.pathname + window.location.search
      const displayUrl = link.dataset.shareUrl || (window.location.host + path)
      const copyUrl = link.dataset.shareUrl || (window.location.origin + path)
      const clipped = displayUrl.length > maxLen ? displayUrl.slice(0, maxLen) + '...' : displayUrl
      const initialText = textEl?.textContent || ''
      let shown = false
      let timer

      const setText = (v) => {
        if (textEl) textEl.textContent = v
      }

      const copyText = async (text) => {
        if (navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(text)
          return
        }
        const ta = document.createElement('textarea')
        ta.value = text
        ta.setAttribute('readonly', '')
        ta.style.position = 'fixed'
        ta.style.left = '-9999px'
        document.body.appendChild(ta)
        ta.select()
        document.execCommand('copy')
        ta.remove()
      }

      const showCopied = () => {
        clearTimeout(timer)
        setText('Скопировано')
        timer = setTimeout(() => setText(clipped), 1200)
      }

      link.addEventListener('click', async (e) => {
        e.preventDefault()
        link.classList.add('active')
        if (!shown) {
          shown = true
          clearTimeout(timer)
          setText(clipped)
          return
        }
        try {
          await copyText(copyUrl)
        } catch {}
        showCopied()
      })

      if (link.classList.contains('active') && initialText !== clipped) {
        shown = true
      }
    })
    document.querySelectorAll('.rl').forEach((line) => {
      const text = line.textContent.trim()
      if (!text) return
      line.textContent = ''
      const track = document.createElement('div')
      track.className = 'rl__track'
      const createItem = () => {
        const s = document.createElement('span')
        s.className = 'rl__item'
        s.textContent = text
        return s
      }
      const first = createItem()
      track.append(first)
      line.append(track)
      const w = first.offsetWidth
      if (!w) return
      for (let i = 1; i < Math.max(2, Math.ceil((line.offsetWidth + w) / w)); i++) track.append(first.cloneNode(true))
      let x = 0
      let last = performance.now()
      const tick = (now) => {
        x -= 40 * (now - last) / 1000
        last = now
        if (x <= -w) x += w
        track.style.transform = `translateX(${x}px)`
        requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    })
    const customSelect = document.querySelector('.mo__select')
    if (customSelect) {
      const select = customSelect.querySelector('select')
      const selected = customSelect.querySelector('.mo__select-selected')
      const options = customSelect.querySelectorAll('.mo__select-option')
      const updateSelected = () => {
        const opt = options[Array.from(select.options).findIndex((o) => o.value === select.value)]
        if (opt) {
          selected.querySelector('span').textContent = opt.textContent
          options.forEach((o) => o.classList.remove('selected'))
          opt.classList.add('selected')
        }
      }
      selected.addEventListener('click', (e) => {
        e.stopPropagation()
        customSelect.classList.toggle('active')
      })
      options.forEach((opt) => {
        opt.addEventListener('click', (e) => {
          e.stopPropagation()
          select.value = opt.dataset.value
          updateSelected()
          customSelect.classList.remove('active')
        })
      })
      document.addEventListener('click', (e) => {
        if (!customSelect.contains(e.target)) customSelect.classList.remove('active')
      })
      updateSelected()
    }
    document.querySelectorAll('.mo__wrapper-info-icon').forEach((icon) => {
      icon.addEventListener('click', (e) => {
        e.preventDefault()
        window.scrollTo({ top: 0, behavior: FLAGS.smoothScroll ? 'smooth' : 'auto' })
      })
    })
    const partnerRequestBtn = document.querySelector('.partners__wrapper-col-btns-o')
    if (partnerRequestBtn) {
      partnerRequestBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const section = document.querySelector('.cooperation.p') || document.querySelector('.cooperation')
        if (!section) return
        const rect = section.getBoundingClientRect()
        const header = document.querySelector('.header')
        const headerH = header ? header.getBoundingClientRect().height : 0
        const top = rect.top + (window.pageYOffset || document.documentElement.scrollTop) - headerH - rem(2)
        window.scrollTo({ top, behavior: FLAGS.smoothScroll ? 'smooth' : 'auto' })
      })
    }
  }

  // --- партнерский кабинет: табы, drag-scroll, остатки, моб. меню ---
  function initPlk() {
    const plkCatalogTabs = document.querySelector('.plk__wrapper-wrapper-tabs')
    if (plkCatalogTabs) {
      const tabButtons = Array.from(plkCatalogTabs.querySelectorAll('span'))
      const lists = Array.from(document.querySelectorAll('.plk__wrapper-wrapper-list'))
      if (tabButtons.length && lists.length) {
        const setTab = (i) => {
          tabButtons.forEach((btn, j) => btn.classList.toggle('active', j === i))
          lists.forEach((list, j) => list.style.display = j === i ? '' : 'none')
        }
        setTab(0)
        tabButtons.forEach((btn, i) => {
          btn.addEventListener('click', (e) => {
            e.preventDefault()
            setTab(i)
          })
        })
      }
    }
    document.querySelectorAll('.plk__wrapper-wrapper-list-item').forEach((item) => {
      const header = item.querySelector(':scope > .plk__wrapper-wrapper-list-item-header')
      const itemsBox = item.querySelector(':scope > .plk__wrapper-wrapper-list-item-header-items')
      bindPlkAccordion(item, header, itemsBox, { ignoreLinks: true })
    })
    const refreshPlkBalanceListsHeight = (listsBox) => {
      if (!listsBox || listsBox.style.height === 'auto' || listsBox.style.height === '0px') return
      listsBox.style.height = `${listsBox.scrollHeight}px`
    }
    document.querySelectorAll('.plk__wrapper-wrapper-balance-item').forEach((item) => {
      const header = item.querySelector(':scope > .plk__wrapper-wrapper-balance-item-header')
      const listsBox = item.querySelector(':scope > .plk__wrapper-wrapper-balance-item-lists')
      bindPlkAccordion(item, header, listsBox)
    })
    document.querySelectorAll('.plk__wrapper-wrapper-balance-item-list').forEach((item) => {
      const header = item.querySelector(':scope > .plk__wrapper-wrapper-balance-item-list-title')
      const body = item.querySelector(':scope > .plk__wrapper-wrapper-balance-item-list-body')
      if (!header || !body || !body.children.length) return
      bindPlkAccordion(item, header, body)
      body.addEventListener('transitionend', (e) => {
        if (e.propertyName !== 'height') return
        refreshPlkBalanceListsHeight(item.closest('.plk__wrapper-wrapper-balance-item')?.querySelector(':scope > .plk__wrapper-wrapper-balance-item-lists'))
      })
    })
    const dragScroll = document.querySelector('.plk__wrapper-wrapper-cols-item-sc')
    if (dragScroll && window.innerWidth >= BREAKPOINTS.tablet) {
      let isDown = false
      let startX
      let scrollLeft
      dragScroll.addEventListener('mousedown', (e) => {
        isDown = true
        dragScroll.classList.add('dragging')
        startX = e.pageX - dragScroll.offsetLeft
        scrollLeft = dragScroll.scrollLeft
      })
      dragScroll.addEventListener('mouseleave', () => {
        isDown = false
        dragScroll.classList.remove('dragging')
      })
      dragScroll.addEventListener('mouseup', () => {
        isDown = false
        dragScroll.classList.remove('dragging')
      })
      dragScroll.addEventListener('mousemove', (e) => {
        if (!isDown) return
        e.preventDefault()
        dragScroll.scrollLeft = scrollLeft - (e.pageX - dragScroll.offsetLeft - startX) * 2
      })
    }
    document.querySelectorAll('.plk__wrapper-wrapper-balance-item-list-i-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const item = btn.closest('.plk__wrapper-wrapper-balance-item-list-i')
        const form = item?.querySelector('.plk__wrapper-wrapper-balance-item-list-i-in')
        if (form) {
          form.classList.add('active')
          btn.classList.add('hide')
        }
      })
    })
    document.querySelectorAll('.plk__wrapper-wrapper-balance-item-list-i-in .btn').forEach((okBtn) => {
      okBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const form = okBtn.closest('.plk__wrapper-wrapper-balance-item-list-i-in')
        form?.classList.remove('active')
        form?.closest('.plk__wrapper-wrapper-balance-item-list-i')?.querySelector('.plk__wrapper-wrapper-balance-item-list-i-btn')?.classList.remove('hide')
      })
    })
    document.querySelectorAll('.plk__wrapper-wrapper-balance-item-list-mob-item-btn').forEach((btn) => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const item = btn.closest('.plk__wrapper-wrapper-balance-item-list-mob-item')
        const form = item?.querySelector('.plk__wrapper-wrapper-balance-item-list-mob-item-in')
        if (form) {
          form.classList.add('active')
          btn.classList.add('hide')
        }
      })
    })
    document.querySelectorAll('.plk__wrapper-wrapper-balance-item-list-mob-item-in .btn').forEach((okBtn) => {
      okBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const form = okBtn.closest('.plk__wrapper-wrapper-balance-item-list-mob-item-in')
        form?.classList.remove('active')
        form?.closest('.plk__wrapper-wrapper-balance-item-list-mob-item')?.querySelector('.plk__wrapper-wrapper-balance-item-list-mob-item-btn')?.classList.remove('hide')
      })
    })
    const plkMobHeader = document.querySelector('.plk__wrapper-wrapper-mob-header')
    const plkMobDropdown = document.querySelector('.plk__wrapper-wrapper-mob-dropdown')
    if (plkMobHeader && plkMobDropdown) bindTogglePanel(plkMobHeader, plkMobDropdown, { closeOnOutside: true })
  }

  // --- инициализация при загрузке ---
  let isMainInitialized = false
  const initMain = () => {
    if (isMainInitialized) return
    isMainInitialized = true
    initForm('#contact-form', {
      onBeforeSubmit: async (form) => (window.YaCaptcha ? await window.YaCaptcha.check() : true)
    })
    document.querySelectorAll('input[type="tel"][name="phone"]').forEach((input) => {
      input.addEventListener('keydown', (e) => {
        if (e.key !== 'Backspace' && e.key !== 'Delete') return
        e.preventDefault()
        const { selectionStart = 0, selectionEnd = 0, value } = input
        const core = getPhoneRuCore(value)
        const getCoreIndex = (pos) => Math.max(0, value.slice(0, pos).replace(/\D/g, '').length - 1)
        const start = getCoreIndex(selectionStart)
        const end = getCoreIndex(selectionEnd)
        let next = core
        if (selectionStart !== selectionEnd) {
          next = core.slice(0, start) + core.slice(end)
        } else if (e.key === 'Backspace') {
          if (!start) {
            input.value = ''
            return
          }
          next = core.slice(0, start - 1) + core.slice(start)
        } else {
          next = core.slice(0, start) + core.slice(start + 1)
        }
        input.value = formatPhoneRu(next)
        input.setSelectionRange(input.value.length, input.value.length)
      })
      input.addEventListener('input', () => {
        input.value = formatPhoneRu(input.value)
        input.setSelectionRange(input.value.length, input.value.length)
      })
    })
    const logTitleText = document.querySelector('.log__wrapper-title')?.textContent?.trim() || ''
    const logRules = {
      'Регистрация': [{ name: 'first_name', type: 'required' }, { name: 'last_name', type: 'required' }, { name: 'email', type: 'email' }, { name: 'phone', type: 'phone' }, { name: 'password', type: 'passwordStrong' }, { name: 'password_repeat', type: 'passwordRepeat' }, { name: 'privacy', type: 'checkbox' }],
      'Стать партнером': [{ name: 'first_name', type: 'required' }, { name: 'last_name', type: 'required' }, { name: 'email', type: 'email' }, { name: 'phone', type: 'phone' }, { name: 'privacy', type: 'checkbox' }],
      'Восстановление пароля': [{ name: 'email', type: 'email' }]
    }
    if (document.querySelector('.log__wrapper-done') && document.querySelector('.log__wrapper-title') && logRules[logTitleText]) {
      initFormValidation('#subscribe-form', logRules[logTitleText], (form) => {
        form.closest('.log__wrapper')?.querySelector('.log__wrapper-done')?.classList.add('active')
        form.closest('.log__wrapper')?.querySelector('.log__wrapper-cols')?.classList.add('hide')
      })
    } else {
      initFormValidation('#subscribe-form', [{ name: 'first_name', type: 'required' }, { name: 'email', type: 'email' }, { name: 'newsletter', type: 'checkbox' }, { name: 'privacy', type: 'checkbox' }], () => document.querySelector('.footer__wrapper-pre-done')?.classList.add('active'))
    }
    initFormValidation('#cooperation-form', [{ name: 'first_name', type: 'required' }, { name: 'last_name', type: 'required' }, { name: 'email', type: 'email' }, { name: 'phone', type: 'phone' }, { name: 'privacy', type: 'checkbox' }], (form) => {
      (form.closest('.vacancy__wrapper-form') || form.closest('.cooperation__wrapper-form-form'))?.querySelector('.cooperation__wrapper-form-form-done')?.classList.add('active')
    })

    if (document.querySelector('.main__bg .swiper-wrapper')) {
      new Swiper('.main__bg.swiper', {
        slidesPerView: 1,
        loop: true,
        effect: 'fade',
        speed: 700,
        allowTouchMove: false,
        autoplay: { delay: 3500, disableOnInteraction: false }
      })
    }
    document.querySelectorAll('.block__wrapper-slider.swiper').forEach((sliderEl) => {
      new Swiper(sliderEl, {
        slidesPerView: 1,
        spaceBetween: rem(2),
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 600,
        pagination: {
          el: sliderEl.querySelector('.block__wrapper-slider-info-bottom-pagination'),
          clickable: true
        },
        navigation: {
          nextEl: sliderEl.querySelector('.block__wrapper-slider-info-bottom-arrow')
        }
      })
    })
    const collectionMain = document.querySelector('.collection__wrapper-sliders-main-swiper'), collectionTh = document.querySelector('.collection__wrapper-sliders-th'), collectionArrow = document.querySelector('.collection__wrapper-sliders-arrow')
    if (collectionMain && collectionTh) {
      const thumbs = new Swiper(collectionTh, {
        slidesPerView: 'auto',
        spaceBetween: rem(0.5),
        loop: true,
        freeMode: true,
        watchSlidesProgress: true,
        slideToClickedSlide: true,
        breakpoints: { [BREAKPOINTS.tablet]: { spaceBetween: rem(0.8) } }
      })
      const mainSwiper = new Swiper(collectionMain, {
        slidesPerView: 1,
        spaceBetween: 0,
        loop: true,
        speed: 400,
        autoplay: { delay: 4000, disableOnInteraction: false },
        navigation: collectionArrow ? { nextEl: collectionArrow } : false,
        thumbs: { swiper: thumbs }
      })
      collectionMain.closest('.collection__wrapper-sliders-main')?.addEventListener('click', (e) => {
        if (e.target.closest('.block__w-cards-card-like, .block__wrapper-slider-info-header-tags a')) return
        const rect = e.currentTarget.getBoundingClientRect()
        const x = e.clientX - rect.left
        const w = rect.width
        if (x < w * 0.3) mainSwiper.slidePrev()
        else if (x > w * 0.7) mainSwiper.slideNext()
        else {
          const imgs = collectionMain.querySelectorAll('.swiper-slide img')
          if (imgs.length) openFullscreenGallery(imgs, mainSwiper.realIndex)
        }
      })
    }
    const itemGal = document.querySelector('.item__wrapper-gal')
    if (itemGal) {
      const nextBtn = itemGal.querySelector('.item__wrapper-gal-w-arrow') || itemGal.querySelector('.item__wrapper-gal-down')
      const paginationEl = itemGal.querySelector('.item__wrapper-gal-w-pag') || itemGal.querySelector('.item__wrapper-gal-pag')
      const itemSwiper = new Swiper(itemGal, {
        loop: true,
        effect: 'fade',
        fadeEffect: { crossFade: true },
        speed: 400,
        autoplay: { delay: 4000, disableOnInteraction: false },
        navigation: nextBtn ? { nextEl: nextBtn } : false,
        pagination: paginationEl ? { el: paginationEl, clickable: true } : false
      })
      const info = document.querySelector('.item__wrapper-info')
      const infoTab = document.querySelector('.item__wrapper-info-tab')
      const infoToggle = infoTab?.querySelector('.load')
      const infoToggleText = infoToggle?.querySelector('p')?.textContent?.trim() || ''
      const getInfoRows = () => infoTab ? Array.from(infoTab.children).filter((el) => !el.classList.contains('load')) : []
      const setInfoTabExpanded = (exp) => {
        if (!infoTab || !infoToggle) return
        const startHeight = infoTab.getBoundingClientRect().height
        infoTab.style.maxHeight = `${startHeight}px`
        infoTab.dataset.expanded = exp ? '1' : '0'
        infoToggle.classList.toggle('active', exp)
        const t = infoToggle.querySelector('p')
        if (t && infoToggleText) t.textContent = exp ? 'Свернуть' : infoToggleText
        getInfoRows().forEach((r) => r.style.display = '')
        infoToggle.style.display = ''
        if (!exp) applyInfoTabClamp()
        const targetHeight = infoTab.scrollHeight
        requestAnimationFrame(() => {
          infoTab.style.maxHeight = `${targetHeight}px`
        })
      }
      const applyInfoTabClamp = () => {
        if (!info || !infoTab || !infoToggle || infoTab.dataset.expanded === '1') return
        const galH = Math.floor(itemGal.getBoundingClientRect().height)
        if (!galH) return
        const rows = getInfoRows()
        if (!rows.length) return
        const infoTop = info.getBoundingClientRect().top
        const tabTop = infoTab.getBoundingClientRect().top
        const offsetTop = Math.max(0, Math.floor(tabTop - infoTop))
        const availableH = Math.max(0, galH - offsetTop)
        if (window.innerWidth < BREAKPOINTS.tablet) {
          rows.forEach((r, i) => r.style.display = i < 17 ? '' : 'none')
          infoToggle.style.display = ''
          if (!rows.filter((r) => r.style.display === 'none').length) {
            infoToggle.style.display = 'none'
            infoToggle.classList.remove('active')
          }
          return
        }
        rows.forEach((r) => r.style.display = '')
        infoToggle.style.display = ''
        let safety = 0
        while (infoTab.scrollHeight > availableH + 2 && safety < rows.length) {
          const last = [...rows].reverse().find((r) => r.style.display !== 'none')
          if (!last) break
          last.style.display = 'none'
          safety++
        }
        if (!rows.filter((r) => r.style.display === 'none').length) {
          infoToggle.style.display = 'none'
          infoToggle.classList.remove('active')
        }
      }
      if (infoTab && infoToggle) {
        infoTab.dataset.expanded = '0'
        applyInfoTabClamp()
        infoToggle.addEventListener('click', (e) => {
          e.preventDefault()
          setInfoTabExpanded(infoTab.dataset.expanded !== '1')
        })
        window.addEventListener('resize', debounce(applyInfoTabClamp))
      }
      const getItemImages = () => Array.from(itemGal.querySelectorAll('.swiper-slide img'))
      itemGal.addEventListener('click', (e) => {
        if (e.target.closest('.item__wrapper-gal-down, .item__wrapper-gal-w-pag, .item__wrapper-gal-w-arrow')) return
        const imgs = getItemImages()
        const baseImg = e.target.closest('.swiper-slide img') || itemGal.querySelector('.swiper-slide.swiper-slide-active img') || imgs[itemSwiper.realIndex] || imgs[0]
        if (!baseImg) return
        e.preventDefault()
        openFullscreenGallery(imgs, imgs.indexOf(baseImg) > -1 ? imgs.indexOf(baseImg) : (itemSwiper.realIndex || 0))
      })
    }
    const cardsSliders = document.querySelectorAll('.block__w-cards-slider')
    const cardsSwipers = new Map()
    const initCardsSliders = () => {
      cardsSliders.forEach((container, i) => {
        const slider = container.querySelector('.block__w-cards')
        const nextBtn = container.querySelector('.block__w-cards-slider-next')
        if (!slider) return
        const w = window.innerWidth
        const need = w > BREAKPOINTS.mobile && w < BREAKPOINTS.tablet + 1
        if (need) {
          if (!cardsSwipers.has(i)) cardsSwipers.set(i, new Swiper(slider, { slidesPerView: 2.2, spaceBetween: rem(1), loop: true, navigation: nextBtn ? { nextEl: nextBtn } : false }))
        } else {
          if (cardsSwipers.has(i)) {
            cardsSwipers.get(i).destroy(true, true)
            cardsSwipers.delete(i)
          }
        }
      })
    }
    if (cardsSliders.length) {
      initCardsSliders()
      window.addEventListener('resize', debounce(initCardsSliders))
    }
    initResponsiveSlider('.team__wrapper-slider.swiper', { defaultSlidesPerView: 3.7, spaceBetween: rem(0.5), breakpoints: { [BREAKPOINTS.tablet + 1]: 2, [BREAKPOINTS.mobile + 1]: 1.5 }, arrowSelector: '.team__wrapper-slider-arrow' })
    initResponsiveSlider('.vac__slider', { defaultSlidesPerView: 3, breakpoints: { [BREAKPOINTS.tablet + 1]: 1.6, [BREAKPOINTS.mobile + 1]: 1 }, arrowSelector: '.vac__slider-arrow' })
    initResponsiveSlider('.cat__slider.swiper', { defaultSlidesPerView: 4, spaceBetween: rem(0.4), breakpoints: { [BREAKPOINTS.tablet + 1]: 2.1 }, arrowSelector: '.cat__slider-arrow', destroyBelow: BREAKPOINTS.mobile + 1 })
    initResponsiveSlider('.plk .cat__slider.swiper', { defaultSlidesPerView: 3.2, spaceBetween: rem(0.4), breakpoints: { [BREAKPOINTS.tablet + 1]: 2.15 }, arrowSelector: '.cat__slider-arrow', destroyBelow: BREAKPOINTS.mobile + 1 })
    function initScrollReveal() {
      const sel = {
        blockW: ['.block__w-wrapper-h', '.block__wrapper-slider', '.block__w-cards', '.block__w-cards-slider']
      }
      const targets = []
      document.querySelectorAll('.block__w').forEach((c) => sel.blockW.forEach((s) => c.querySelectorAll(s).forEach((el) => targets.push(el))))
      targets.forEach((el) => el.classList.add('reveal-on-scroll'))
      const blockWrappers = document.querySelectorAll('.block .block__wrapper')
      blockWrappers.forEach((wrap) => {
        const kids = [wrap.querySelector('.block__wrapper-info'), wrap.querySelector('.block__wrapper-slider')].filter(Boolean)
        kids.forEach((el) => el.classList.add('reveal-on-scroll'))
      })
      const opts = { rootMargin: '0px 0px -60px 0px', threshold: 0.05 }
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          if (!e.isIntersecting) return
          const wrap = e.target
          if (wrap.classList.contains('block__wrapper')) {
            const info = wrap.querySelector('.block__wrapper-info.reveal-on-scroll')
            const slider = wrap.querySelector('.block__wrapper-slider.reveal-on-scroll')
            const isRev = wrap.closest('.block.rev')
            if (isRev) {
              if (slider) slider.classList.add('in-view')
              if (info) setTimeout(() => info.classList.add('in-view'), 420)
            } else {
              if (info) info.classList.add('in-view')
              if (slider) setTimeout(() => slider.classList.add('in-view'), 420)
            }
            return
          }
          wrap.classList.add('in-view')
        })
      }, opts)
      targets.forEach((el) => io.observe(el))
      blockWrappers.forEach((el) => io.observe(el))
    }
    if (document.querySelector('.main')) initScrollReveal()
    initHeader()
    initSearch(document.querySelector('.header__wrapper-search:not(.mob)'))
    document.querySelectorAll('.header__wrapper-search.mob').forEach((mob) => initSearch(mob))
    initTabs('.srh__page', '.srh__rslt__wrapper-col-item-title', '.srh__rslt__wrapper-col-item', { onlyMobile: true, headerSelector: '.srh__rslt__wrapper-header' })
    initTabs('.a__f__wrapper', '.a__f__wrapper-header-name', '.a__f__wrapper-item')
    initTabs('.contacts__wrapper', '.contacts__wrapper-header-item', '.contacts__wrapper-info-i', { headerSelector: '.contacts__wrapper-header', onlyDesktop: true })
    initMap()
    initCatalog()
    initAccount()
    initUi()
    const header = document.querySelector('.header')
    if (header) {
      const updateHeaderScroll = () => {
        header.classList.toggle('scroll', window.scrollY > 0)
      }
      window.addEventListener('scroll', updateHeaderScroll)
      updateHeaderScroll()
    }
    initPlk()
  }
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initMain, { once: true })
  } else {
    initMain()
  }
  window.Ceram = {
    ...(window.Ceram || {}),
    init: initMain,
    initForm,
    initFormValidation,
    openFullscreenGallery,
    initResponsiveSlider,
    initTabs,
    initHeader,
    initSearch,
    initMap,
    initCatalog,
    getCatalogFilterParams: () => (catalogFilterParamsGetter ? catalogFilterParamsGetter() : { filters: {}, price: { min: '', max: '' } }),
    filterCategories,
    initAccount,
    initUi,
    initPlk,
    formatPhoneRu,
    bindPlkAccordion,
  }
})()