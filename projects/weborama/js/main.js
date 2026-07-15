document.addEventListener('DOMContentLoaded', function () {
  // плавный скролл
  ;(() => {
    if (!window.Lenis) return
    
    const isMobile = window.innerWidth < 769
    const isJobsMobile = isMobile && !!document.querySelector('.vacancy')
    if (isJobsMobile) return
    
    const lenis = new Lenis({
      duration: isMobile ? 1.6 : 1.8,
      easing: t => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      smoothTouch: isMobile,
      syncTouch: isMobile,
      touchInertiaMultiplier: isMobile ? 1.2 : 0.8,
      touchMultiplier: isMobile ? 2.2 : 1.2,
      wheelMultiplier: isMobile ? 2.2 : 1.0,
      gestureOrientation: 'vertical',
      normalizeWheel: true
    })
    if (window.gsap) {
      gsap.ticker.add((time) => { lenis.raf(time * 1000) })
      gsap.ticker.lagSmoothing(0)
    } else {
      const raf = (t) => { lenis.raf(t); requestAnimationFrame(raf) }
      requestAnimationFrame(raf)
    }
    if (window.ScrollTrigger) {
      lenis.on('scroll', ScrollTrigger.update)
    }
    window.__lenis = lenis
  })()

  // scroll header
  ;(() => {
   const header = document.querySelector('.header.w')
   if (!header) return
   const getThreshold = () => window.innerHeight
   const update = () => {
     const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
     const passed = y >= getThreshold()
     header.classList.toggle('scroll', passed)
   }
   update()
   window.addEventListener('scroll', update, { passive: true })
   window.addEventListener('resize', update)
   if (window.__lenis) window.__lenis.on('scroll', update)
 })()

 // mobile header hide/show
 ;(() => {
   const header = document.querySelector('.header')
   if (!header) return
   let lastY = 0
   let ticking = false
   
   const update = () => {
     const y = window.scrollY || window.pageYOffset || document.documentElement.scrollTop || 0
    if (header.classList.contains('is-open') || header.classList.contains('search')) {
      header.style.transform = 'translateY(0)'
      lastY = y
      ticking = false
      return
    }
     const isScrollingDown = y > lastY && y > 100
     const isScrollingUp = y < lastY
     
     if (isScrollingDown) {
       header.style.transform = 'translateY(-100%)'
     } else if (isScrollingUp) {
       header.style.transform = 'translateY(0)'
     }
     lastY = y
     ticking = false
   }
   
   const requestUpdate = () => {
     if (!ticking) {
       requestAnimationFrame(update)
       ticking = true
     }
   }
   
   if (window.__lenis) {
     window.__lenis.on('scroll', requestUpdate)
   } else {
     window.addEventListener('scroll', requestUpdate, { passive: true })
   }
 })()

  // синхронизация ширины: serch__wrapper-col2 = ширина header__wrapper-wr
  ;(() => {
    const panel = document.querySelector('.serch__wrapper')
    const col2 = document.querySelector('.serch__wrapper-col2')
    const wr = document.querySelector('.header__wrapper-wr')
    if (!panel || !col2 || !wr) return
    let onResize = null
    const sync = () => {
      const w = wr.getBoundingClientRect().width
      if (w > 0) col2.style.width = w + 'px'
    }
    const handle = () => {
      const open = panel.classList.contains('is-open')
      if (open) {
        sync()
        if (!onResize) { onResize = () => sync(); window.addEventListener('resize', onResize) }
      } else if (onResize) {
        window.removeEventListener('resize', onResize)
        onResize = null
      }
    }
    const mo = new MutationObserver(handle)
    mo.observe(panel, { attributes: true, attributeFilter: ['class'] })
    handle()
  })()

  // переключение на поиск desk
  ;(() => {
    const wrap = document.querySelector('.header__wrapper-wr')
    const btn = document.querySelector('.header__wrapper-search')
    const input = document.querySelector('.header__wrapper-input')
    const header = document.querySelector('.header')
    const panel = document.querySelector('.serch__wrapper')
    const closeBtn = document.querySelector('.serch__wrapper-close')
    if (!wrap || !btn) return
    const setLenisAllow = (allow) => {
      if (!panel) return
      if (allow) {
        panel.setAttribute('data-lenis-prevent', '')
        panel.setAttribute('data-lenis-prevent-wheel', '')
        panel.setAttribute('data-lenis-prevent-touch', '')
      } else {
        panel.removeAttribute('data-lenis-prevent')
        panel.removeAttribute('data-lenis-prevent-wheel')
        panel.removeAttribute('data-lenis-prevent-touch')
      }
    }
    const open = () => { wrap.classList.add('search'); header && header.classList.add('search'); setLenisAllow(true); input && input.focus() }
    const close = () => { wrap.classList.remove('search'); header && header.classList.remove('search'); panel && panel.classList.remove('is-open'); setLenisAllow(false) }
    const toggle = e => { e.preventDefault(); wrap.classList.toggle('search'); if (wrap.classList.contains('search')) { input && input.focus() } }
    btn.addEventListener('click', toggle)
    closeBtn && closeBtn.addEventListener('click', e => { e.preventDefault(); close() })
    const onDocClick = e => {
      const insideSearch = e.target.closest && (e.target.closest('.header__wrapper-wr') || e.target.closest('.serch__wrapper'))
      if (!insideSearch) close()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('touchstart', onDocClick, { passive: true })
  })()

  // резаультаты поиска desk
  ;(() => {
    const input = document.querySelector('.header__wrapper-input')
    const panel = document.querySelector('.serch__wrapper')
    const tab = document.querySelector('.header__mob-tab')
    const wrap = document.querySelector('.header__wrapper-wr')
    const header = document.querySelector('.header')
    if (!input || !panel) return
    const update = () => {
      const has = input.value.trim().length > 0
      if (has) {
        panel.classList.add('is-open')
        tab.classList.add('is-close')
        wrap && wrap.classList.add('search')
        header && header.classList.add('search')
        panel.setAttribute('data-lenis-prevent', '')
        panel.setAttribute('data-lenis-prevent-wheel', '')
        panel.setAttribute('data-lenis-prevent-touch', '')
      } else {
        panel.classList.remove('is-open')
        tab.classList.remove('is-close')
        header && header.classList.remove('search')
        panel.removeAttribute('data-lenis-prevent')
        panel.removeAttribute('data-lenis-prevent-wheel')
        panel.removeAttribute('data-lenis-prevent-touch')
      }
    }
    input.addEventListener('input', update)
  })()

  // меню mob
  ;(() => {
    const header = document.querySelector('.header')
    const menu = document.querySelector('.header__wrapper-menu')
    const scrollerMenu = document.querySelector('.header__mob-w')
    const scrollerResults = document.querySelector('.header__mob-search')
    if (!header || !menu) return
    const openIcon = menu.querySelector('.b')
    const closeIcon = menu.querySelector('.c')
    const setPreventOn = (el, on) => {
      if (!el) return
      if (on) {
        el.setAttribute('data-lenis-prevent', '')
        el.setAttribute('data-lenis-prevent-wheel', '')
        el.setAttribute('data-lenis-prevent-touch', '')
      } else {
        el.removeAttribute('data-lenis-prevent')
        el.removeAttribute('data-lenis-prevent-wheel')
        el.removeAttribute('data-lenis-prevent-touch')
      }
    }
    const setLenisAllow = allow => {
      setPreventOn(scrollerMenu, allow)
      setPreventOn(scrollerResults, allow)
    }
    const open = () => { header.classList.add('is-open'); setLenisAllow(true); openIcon && openIcon.classList.remove('active'); closeIcon && closeIcon.classList.add('active') }
    const close = () => { header.classList.remove('is-open'); setLenisAllow(false); closeIcon && closeIcon.classList.remove('active'); openIcon && openIcon.classList.add('active') }
    const toggle = e => { e.preventDefault(); header.classList.contains('is-open') ? close() : open() }
    menu.addEventListener('click', toggle)
  })()

  // резаультаты поиска mob
  ;(() => {
    const input = document.querySelector('.header__mob-w-search-input')
    const menu = document.querySelector('.header__mob-w')
    const results = document.querySelector('.header__mob-search')
    if (!input || !menu || !results) return

    const apply = () => {
      const has = input.value.trim().length > 0
      menu.classList.toggle('hide', has)
      results.classList.toggle('hide', !has)
      if (has) {
        results.setAttribute('data-lenis-prevent', '')
        results.setAttribute('data-lenis-prevent-wheel', '')
        results.setAttribute('data-lenis-prevent-touch', '')
        menu.removeAttribute('data-lenis-prevent')
        menu.removeAttribute('data-lenis-prevent-wheel')
        menu.removeAttribute('data-lenis-prevent-touch')
      } else {
        menu.setAttribute('data-lenis-prevent', '')
        menu.setAttribute('data-lenis-prevent-wheel', '')
        menu.setAttribute('data-lenis-prevent-touch', '')
        results.removeAttribute('data-lenis-prevent')
        results.removeAttribute('data-lenis-prevent-wheel')
        results.removeAttribute('data-lenis-prevent-touch')
      }
    }
    input.addEventListener('input', apply)
    window.addEventListener('load', apply)
  })()

  ;(() => {
    const nav = document.querySelector('.header__mob-tab-nav')
    if (!nav) return
    nav.setAttribute('data-lenis-prevent', '')
    nav.setAttribute('data-lenis-prevent-wheel', '')
    nav.setAttribute('data-lenis-prevent-touch', '')
  })()

  ;(() => {
    const host = document.querySelector('.header__mob-search-header-tags')
    if (!host) return
    host.addEventListener('click', e => {
      const span = e.target.closest('span')
      if (!span || !host.contains(span)) return
      Array.from(host.querySelectorAll('span')).forEach(s => s.classList.remove('active'))
      span.classList.add('active')
    })
  })()

  // выпадающий список в мобильном меню
  ;(() => {
    const items = Array.from(document.querySelectorAll('.header__mob-w-nav-dropdown'))
    if (!items.length) return

    const closeItem = (root) => {
      const header = root.querySelector('.header__mob-w-nav-dropdown-header')
      const content = root.querySelector('.header__mob-w-nav-dropdown-content')
      root.classList.remove('is-open')
      header && header.setAttribute('aria-expanded', 'false')
      if (content) content.style.maxHeight = ''
    }

    const closeAll = () => items.forEach(closeItem)

    items.forEach(root => {
      const header = root.querySelector('.header__mob-w-nav-dropdown-header')
      const content = root.querySelector('.header__mob-w-nav-dropdown-content')
      if (!header || !content) return

      header.setAttribute('role', 'button')
      header.setAttribute('tabindex', '0')
      header.setAttribute('aria-expanded', 'false')

      const open = () => {
        root.classList.add('is-open')
        header.setAttribute('aria-expanded', 'true')
        content.style.maxHeight = content.scrollHeight + 'px'
      }

      const toggle = () => {
        const isOpen = root.classList.contains('is-open')
        if (isOpen) {
          closeItem(root)
        } else {
          closeAll()
          open()
        }
      }

      header.addEventListener('click', e => { e.preventDefault(); toggle() })
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
        if (e.key === 'Escape') closeItem(root)
      })

      window.addEventListener('resize', () => {
        if (root.classList.contains('is-open')) {
          content.style.maxHeight = content.scrollHeight + 'px'
        }
      })
    })
  })()

  ;(() => {
    const host = document.querySelector('.serch__wrapper-col1-filters')
    if (!host) return
    host.addEventListener('click', e => {
      const span = e.target.closest('span')
      if (!span || !host.contains(span)) return
      Array.from(host.querySelectorAll('span')).forEach(s => s.classList.remove('active'))
      span.classList.add('active')
    })
  })()

  //вверх
  const goTop = document.querySelector('.top')
  if (goTop) {
    goTop.addEventListener('click', e => {
      e.preventDefault()
      if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
        window.__lenis.scrollTo(0, { immediate: false, duration: 1.2, lock: true })
      } else {
        window.scrollTo({ top: 0, behavior: 'smooth' })
      }
    })
    let lastY = window.scrollY || window.pageYOffset || 0
    let tickingTop = false
    const getLuminance = (r, g, b) => {
      const [rs, gs, bs] = [r, g, b].map(c => {
        c = c / 255
        return c <= 0.03928 ? c / 12.92 : Math.pow((c + 0.055) / 1.055, 2.4)
      })
      return 0.2126 * rs + 0.7152 * gs + 0.0722 * bs
    }
    
    const getBackgroundColor = (element) => {
      const computed = window.getComputedStyle(element)
      let bg = computed.backgroundColor
      
      if (bg === 'rgba(0, 0, 0, 0)' || bg === 'transparent') {
        const parent = element.parentElement
        if (parent && parent !== document.body) {
          return getBackgroundColor(parent)
        }
        return 'rgb(255, 255, 255)'
      }
      return bg
    }
    
    const updateTop = () => {
      const y = window.scrollY || window.pageYOffset || 0
      if (y !== lastY) {
        if (y < lastY && y > 0) {
          goTop.classList.add('visible')
        } else if (y > lastY) {
          goTop.classList.remove('visible')
        }
        lastY = y
      }
      const footer = document.querySelector('footer, .footer')
      if (footer) {
        const footerRect = footer.getBoundingClientRect()
        const goTopRect = goTop.getBoundingClientRect()
        const isInFooter = goTopRect.bottom >= footerRect.top
        goTop.classList.toggle('invert', isInFooter)
      }
      tickingTop = false
    }
    const requestUpdateTop = () => {
      if (!tickingTop) {
        requestAnimationFrame(updateTop)
        tickingTop = true
      }
    }
    if (window.__lenis) {
      window.__lenis.on('scroll', requestUpdateTop)
    } else {
      window.addEventListener('scroll', requestUpdateTop, { passive: true })
    }
    updateTop()
  }

  //расчет высоты блока для анимации
  const syncDoubleHeight = (targetSel, refSel) => {
    const target = document.querySelector(targetSel)
    const ref = document.querySelector(refSel)
    if (!target || !ref) return
    const apply = () => {
      const h = ref.getBoundingClientRect().height
      const k = window.innerWidth > 769 ? 2 : 4
      target.style.height = `${h * k}px`
    }
    const ro = new ResizeObserver(() => apply())
    ro.observe(ref)
    window.addEventListener('load', apply)
    window.addEventListener('resize', apply)
    apply()
  }

  syncDoubleHeight('#three .three__squares', '#three .three__squares .square')

  //слайдеры
  const setSwiperLenisPrevent = (selector, isMobile) => {
    const container = typeof selector === 'string' ? document.querySelector(selector) : selector
    if (!container) return
    if (isMobile) {
      if (!container._swiperTouchHandler) {
        container._swiperTouchHandler = true
        let touchStartX = 0
        let touchStartY = 0
        let isHorizontal = null
        const handleTouchStart = (e) => {
          touchStartX = e.touches[0].clientX
          touchStartY = e.touches[0].clientY
          isHorizontal = null
        }
        const handleTouchMove = (e) => {
          if (touchStartX === 0 || touchStartY === 0) return
          const diffX = Math.abs(e.touches[0].clientX - touchStartX)
          const diffY = Math.abs(e.touches[0].clientY - touchStartY)
          if (isHorizontal === null && (diffX > 5 || diffY > 5)) {
            isHorizontal = diffX > diffY
            if (isHorizontal) {
              container.setAttribute('data-lenis-prevent', '')
              container.setAttribute('data-lenis-prevent-touch', '')
            }
          }
        }
        const handleTouchEnd = () => {
          touchStartX = 0
          touchStartY = 0
          isHorizontal = null
          container.removeAttribute('data-lenis-prevent')
          container.removeAttribute('data-lenis-prevent-touch')
        }
        container.addEventListener('touchstart', handleTouchStart, { passive: true })
        container.addEventListener('touchmove', handleTouchMove, { passive: true })
        container.addEventListener('touchend', handleTouchEnd, { passive: true })
        container.addEventListener('touchcancel', handleTouchEnd, { passive: true })
      }
      container.style.touchAction = 'pan-x'
    } else {
      container.style.touchAction = ''
      container.removeAttribute('data-lenis-prevent')
      container.removeAttribute('data-lenis-prevent-touch')
    }
  }

  let casesSwiper = null
  let casesMobiconHidden = false
  let casesObserver = null
  const initCasesSwiper = () => {
    const mobile = window.innerWidth < 769
    const selector = '.cases__wrapper-items'
    const base = {
    slidesPerGroup: 1,
    spaceBetween: 43,
    loop: true,
    autoplay: { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true },
    navigation: {
      nextEl: '.cases__wrapper-items-container .slider__arrow .next',
      prevEl: '.cases__wrapper-items-container .slider__arrow .prev'
      }
    }
    const opts = mobile
      ? { ...base, slidesPerView: 1 }
      : { ...base, slidesPerView: 2 }

    if (!casesSwiper) {
      const containerEl = document.querySelector('.cases__wrapper-items-container')
      const mobicon = containerEl?.querySelector('.mobicon')
      const optsWithCallback = {
        ...opts,
        on: {
          slideChange: function() {
            if (mobicon && !casesMobiconHidden && this.realIndex !== 0) {
              mobicon.style.display = 'none'
              casesMobiconHidden = true
            }
          }
        }
      }
      casesSwiper = new Swiper(selector, optsWithCallback)
      setSwiperLenisPrevent(selector, mobile)
      if (mobile && containerEl) {
        if (casesObserver) casesObserver.disconnect()
        casesObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && mobicon) {
              mobicon.style.display = 'block'
              casesMobiconHidden = false
            }
          })
        }, { threshold: 0.1 })
        casesObserver.observe(containerEl)
      }
      return
    }
    const currentMobile = casesSwiper.params.slidesPerView === 1
    const targetSlides = mobile ? 1 : 2
    const needRecreate = currentMobile !== mobile || casesSwiper.params.slidesPerView !== targetSlides
    if (needRecreate) {
      casesSwiper.destroy(true, true)
      casesMobiconHidden = false
      const containerEl = document.querySelector('.cases__wrapper-items-container')
      const mobicon = containerEl?.querySelector('.mobicon')
      if (mobicon) mobicon.style.display = mobile ? 'block' : ''
      const optsWithCallback = mobile ? {
        ...opts,
        on: {
          slideChange: function() {
            if (mobicon && !casesMobiconHidden && this.realIndex !== 0) {
              mobicon.style.display = 'none'
              casesMobiconHidden = true
            }
          }
        }
      } : opts
      casesSwiper = new Swiper(selector, optsWithCallback)
      setSwiperLenisPrevent(selector, mobile)
      if (mobile && containerEl) {
        if (casesObserver) casesObserver.disconnect()
        casesObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && mobicon) {
              mobicon.style.display = 'block'
              casesMobiconHidden = false
            }
          })
        }, { threshold: 0.1 })
        casesObserver.observe(containerEl)
      } else if (!mobile && casesObserver) {
        casesObserver.disconnect()
        casesObserver = null
      }
    } else {
      casesSwiper.params.spaceBetween = 43
      casesSwiper.params.autoplay = { delay: 5000, disableOnInteraction: false, pauseOnMouseEnter: true }
      casesSwiper.autoplay && casesSwiper.autoplay.start && casesSwiper.autoplay.start()
      casesSwiper.update()
      setSwiperLenisPrevent(selector, mobile)
      const containerEl = document.querySelector('.cases__wrapper-items-container')
      const mobicon = containerEl?.querySelector('.mobicon')
      if (mobile && containerEl) {
        if (casesObserver) casesObserver.disconnect()
        casesObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && mobicon) {
              mobicon.style.display = 'block'
              casesMobiconHidden = false
            }
          })
        }, { threshold: 0.1 })
        casesObserver.observe(containerEl)
      } else if (!mobile && casesObserver) {
        casesObserver.disconnect()
        casesObserver = null
      }
    }
  }
  initCasesSwiper()
  let csTO
  window.addEventListener('resize', () => { clearTimeout(csTO); csTO = setTimeout(initCasesSwiper, 150) })

  new Swiper('.gallery__wrapper', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    effect: 'fade',
    navigation: {
      nextEl: '.gallery__wrapper .slider__arrow .next',
      prevEl: '.gallery__wrapper .slider__arrow .prev'
    }
  })
  setSwiperLenisPrevent('.gallery__wrapper', true)

  let insideSwiper = null
  let insideMobiconHidden = false
  let insideObserver = null
  const initInsideSwiper = () => {
    const w = window.innerWidth
    const need = w < 1101
    const spv = w < 769 ? 1 : 2
    const selector = '.inside__wrapper-items'
    const rem = () => {
      const fs = getComputedStyle(document.documentElement).fontSize
      const n = parseFloat(fs)
      return Number.isFinite(n) ? n : 10
    }
    const gapPx = Math.round(rem() * (w < 769 ? 4.2 : 4.2))
    const wrapper = document.querySelector('.inside__wrapper-items .swiper-wrapper')
    const base = {
      slidesPerGroup: 1,
      spaceBetween: gapPx,
      loop: true,
      navigation: {
        nextEl: '.inside__wrapper-items-container .slider__arrow .next',
        prevEl: '.inside__wrapper-items-container .slider__arrow .prev'
      }
    }
    const opts = spv === 1 ? { ...base, slidesPerView: 1 } : { ...base, slidesPerView: 2 }
    if (need && !insideSwiper) {
      if (wrapper) {
        wrapper.style.display = ''
        wrapper.style.gridTemplateColumns = ''
        wrapper.style.gap = ''
      }
      const containerEl = document.querySelector('.inside__wrapper-items-container')
      const mobicon = containerEl?.querySelector('.mobicon')
      const optsWithCallback = {
        ...opts,
        on: {
          slideChange: function() {
            if (mobicon && !insideMobiconHidden && this.realIndex !== 0) {
              mobicon.style.display = 'none'
              insideMobiconHidden = true
            }
          }
        }
      }
      insideSwiper = new Swiper(selector, optsWithCallback)
      setSwiperLenisPrevent(selector, true)
      if (spv === 1 && containerEl) {
        if (insideObserver) insideObserver.disconnect()
        insideObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && mobicon) {
              mobicon.style.display = 'block'
              insideMobiconHidden = false
            }
          })
        }, { threshold: 0.1 })
        insideObserver.observe(containerEl)
      }
    } else if (need && insideSwiper) {
      const currentSpv = insideSwiper.params.slidesPerView
      const needRecreate = currentSpv !== spv
      if (needRecreate) {
        insideSwiper.destroy(true, true)
        insideMobiconHidden = false
        const containerEl = document.querySelector('.inside__wrapper-items-container')
        const mobicon = containerEl?.querySelector('.mobicon')
        if (mobicon) mobicon.style.display = ''
        const optsWithCallback = spv === 1 ? {
          ...opts,
          on: {
            slideChange: function() {
              if (mobicon && !insideMobiconHidden && this.realIndex !== 0) {
                mobicon.style.display = 'none'
                insideMobiconHidden = true
              }
            }
          }
        } : opts
        insideSwiper = new Swiper(selector, optsWithCallback)
        if (spv === 1 && containerEl) {
          if (insideObserver) insideObserver.disconnect()
          insideObserver = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && mobicon) {
                mobicon.style.display = 'block'
                insideMobiconHidden = false
              }
            })
          }, { threshold: 0.1 })
          insideObserver.observe(containerEl)
        } else if (insideObserver) {
          insideObserver.disconnect()
          insideObserver = null
        }
      } else {
        insideSwiper.params.spaceBetween = gapPx
        insideSwiper.update()
        if (spv === 1) {
          const containerEl = document.querySelector('.inside__wrapper-items-container')
          const mobicon = containerEl?.querySelector('.mobicon')
          if (containerEl) {
            if (insideObserver) insideObserver.disconnect()
            insideObserver = new IntersectionObserver(entries => {
              entries.forEach(entry => {
                if (entry.isIntersecting && mobicon) {
                  mobicon.style.display = 'block'
                  insideMobiconHidden = false
                }
              })
            }, { threshold: 0.1 })
            insideObserver.observe(containerEl)
          }
        } else if (insideObserver) {
          insideObserver.disconnect()
          insideObserver = null
        }
      }
      setSwiperLenisPrevent(selector, true)
    } else if (!need && insideSwiper) {
      insideSwiper.destroy(true, true)
      insideSwiper = null
      insideMobiconHidden = false
      const mobicon = document.querySelector('.inside__wrapper-items-container .mobicon')
      if (mobicon) mobicon.style.display = ''
      if (insideObserver) {
        insideObserver.disconnect()
        insideObserver = null
      }
      setSwiperLenisPrevent(selector, false)
      if (wrapper) {
        const desktopGapPx = Math.round(rem() * 1.2)
        wrapper.style.display = 'grid'
        wrapper.style.gridTemplateColumns = '1fr 1fr 1fr'
        wrapper.style.gap = `${desktopGapPx}px`
      }
    } else if (!need && !insideSwiper) {
      setSwiperLenisPrevent(selector, false)
      if (wrapper) {
        const desktopGapPx = Math.round(rem() * 1.2)
        wrapper.style.display = 'grid'
        wrapper.style.gridTemplateColumns = '1fr 1fr 1fr'
        wrapper.style.gap = `${desktopGapPx}px`
      }
      if (insideObserver) {
        insideObserver.disconnect()
        insideObserver = null
      }
    }
  }
  initInsideSwiper()
  let insideTO
  window.addEventListener('resize', () => {
    clearTimeout(insideTO)
    insideTO = setTimeout(initInsideSwiper, 150)
  })

  let advSwiper = null
  let mobiconHidden = false
  let advObserver = null
  const advSelector = '.advantages__items'
  const initAdvSwiper = () => {
    const need = window.innerWidth < 769
    if (need && !advSwiper) {
      const containerEl = document.querySelector('.advantages__items')
      const mobicon = containerEl?.querySelector('.mobicon')
      advSwiper = new Swiper(advSelector, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 43,
        loop: true,
        navigation: {
          nextEl: '.advantages__items .slider__arrow .next',
          prevEl: '.advantages__items .slider__arrow .prev'
        },
        on: {
          slideChange: function() {
            if (mobicon && !mobiconHidden && this.realIndex !== 0) {
              mobicon.style.display = 'none'
              mobiconHidden = true
            }
          }
        }
      })
      setSwiperLenisPrevent(advSelector, true)
      if (containerEl) {
        if (advObserver) advObserver.disconnect()
        advObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && mobicon) {
              mobicon.style.display = 'block'
              mobiconHidden = false
            }
          })
        }, { threshold: 0.1 })
        advObserver.observe(containerEl)
      }
    } else if (need && advSwiper) {
      advSwiper.params.slidesPerView = 1
      advSwiper.params.spaceBetween = 43
      advSwiper.update()
      setSwiperLenisPrevent(advSelector, true)
      const containerEl = document.querySelector('.advantages__items')
      const mobicon = containerEl?.querySelector('.mobicon')
      if (containerEl) {
        if (advObserver) advObserver.disconnect()
        advObserver = new IntersectionObserver(entries => {
          entries.forEach(entry => {
            if (entry.isIntersecting && mobicon) {
              mobicon.style.display = 'block'
              mobiconHidden = false
            }
          })
        }, { threshold: 0.1 })
        advObserver.observe(containerEl)
      }
    } else if (!need && advSwiper) {
      advSwiper.destroy(true, true)
      advSwiper = null
      mobiconHidden = false
      const mobicon = document.querySelector('.advantages__items .mobicon')
      if (mobicon) mobicon.style.display = ''
      setSwiperLenisPrevent(advSelector, false)
      if (advObserver) {
        advObserver.disconnect()
        advObserver = null
      }
    }
  }
  initAdvSwiper()
  let advTO
      window.addEventListener('resize', () => {
    clearTimeout(advTO)
    advTO = setTimeout(initAdvSwiper, 150)
  })

  let dropdownSwipers = []
  let dropdownMobiconHidden = []
  let dropdownObservers = []
  const initDropdownSwiper = () => {
    const containers = document.querySelectorAll('.dropdown__wrapper-item-content-slider-slider')
    const mobile = window.innerWidth < 769
    
      containers.forEach((container, index) => {
      const sliderContainer = container.closest('.dropdown__wrapper-item-content-slider')
      const mobicon = sliderContainer?.querySelector('.mobicon')
      
      const opts = {
        slidesPerView: mobile ? 1 : 2,
        slidesPerGroup: 1,
        spaceBetween: mobile ? 8 : 15,
        navigation: {
          nextEl: sliderContainer?.querySelector('.slider__arrow .next'),
          prevEl: sliderContainer?.querySelector('.slider__arrow .prev')
        },
        on: mobile ? {
          slideChange: function() {
            if (mobicon && !dropdownMobiconHidden[index] && this.realIndex !== 0) {
              mobicon.style.display = 'none'
              dropdownMobiconHidden[index] = true
            }
          }
        } : {}
      }
      
      if (!dropdownSwipers[index]) {
        if (mobicon && mobile) mobicon.style.display = 'block'
        dropdownSwipers[index] = new Swiper(container, opts)
        setSwiperLenisPrevent(container, mobile)
        
        if (mobile && sliderContainer) {
          if (dropdownObservers[index]) {
            dropdownObservers[index].disconnect()
          }
          dropdownObservers[index] = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && mobicon) {
                mobicon.style.display = 'block'
                dropdownMobiconHidden[index] = false
              }
            })
          }, { threshold: 0.1 })
          dropdownObservers[index].observe(sliderContainer)
        }
        return
      }
      
      const current = dropdownSwipers[index].params.slidesPerView
      const target = opts.slidesPerView
      if (current !== target) {
        dropdownSwipers[index].destroy(true, true)
        dropdownMobiconHidden[index] = false
        if (mobicon) mobicon.style.display = mobile ? 'block' : ''
        dropdownSwipers[index] = new Swiper(container, opts)
        
        if (mobile && sliderContainer) {
          if (dropdownObservers[index]) {
            dropdownObservers[index].disconnect()
          }
          dropdownObservers[index] = new IntersectionObserver(entries => {
            entries.forEach(entry => {
              if (entry.isIntersecting && mobicon) {
                mobicon.style.display = 'block'
                dropdownMobiconHidden[index] = false
              }
            })
          }, { threshold: 0.1 })
          dropdownObservers[index].observe(sliderContainer)
        }
      } else {
        dropdownSwipers[index].params.spaceBetween = opts.spaceBetween
        dropdownSwipers[index].update()
      }
      setSwiperLenisPrevent(container, mobile)
    })
  }
  initDropdownSwiper()
  let ddTO
  window.addEventListener('resize', () => { clearTimeout(ddTO); ddTO = setTimeout(initDropdownSwiper, 150) })

  new Swiper('.cs__img', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    effect: 'fade',
    loop: true,
    pagination: {
      el: '.cs__img .swiper-pagination',
      clickable: true
    }
  })
  setSwiperLenisPrevent('.cs__img', true)

  //аккордеон (dropdown)
  ;(() => {
    const items = Array.from(document.querySelectorAll('.dropdown__wrapper-item'))
    if (!items.length) return

    const syncLenis = () => {
      const l = window.__lenis
      if (!l) return
      if (typeof l.resize === 'function') l.resize()
      else if (typeof l.raf === 'function') l.raf(performance.now())
      if (window.ScrollTrigger && typeof window.ScrollTrigger.refresh === 'function') {
        window.ScrollTrigger.refresh()
      }
    }

    const closeItem = item => {
      item.classList.remove('is-open')
      const header = item.querySelector('.dropdown__wrapper-item-header')
      const content = item.querySelector('.dropdown__wrapper-item-content')
      header && header.setAttribute('aria-expanded', 'false')
      if (content) {
        content.style.maxHeight = ''
        if (content._ro) { content._ro.disconnect(); content._ro = null }
      }
      syncLenis()
    }

    const openItem = item => {
      item.classList.add('is-open')
      const header = item.querySelector('.dropdown__wrapper-item-header')
      const content = item.querySelector('.dropdown__wrapper-item-content')
      header && header.setAttribute('aria-expanded', 'true')
      if (content) {
        content.style.maxHeight = content.scrollHeight + 'px'
        if (!content._ro) {
          content._ro = new ResizeObserver(() => {
            if (item.classList.contains('is-open')) {
              content.style.maxHeight = content.scrollHeight + 'px'
              syncLenis()
            }
          })
          content._ro.observe(content)
        }
      }
      syncLenis()
    }

    const singleOpen = false

    items.forEach(item => {
      const header = item.querySelector('.dropdown__wrapper-item-header')
      const content = item.querySelector('.dropdown__wrapper-item-content')
      if (!header || !content) return

      header.setAttribute('role', 'button')
      header.setAttribute('tabindex', '0')
      header.setAttribute('aria-expanded', 'false')

      const toggle = () => {
        const isOpen = item.classList.contains('is-open')
        if (singleOpen) {
          items.forEach(i => { if (i !== item) closeItem(i) })
        }
        isOpen ? closeItem(item) : openItem(item)
      }

      header.addEventListener('click', toggle)
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
        if (e.key === 'Escape') closeItem(item)
      })

      window.addEventListener('resize', () => {
        if (item.classList.contains('is-open')) {
          content.style.maxHeight = content.scrollHeight + 'px'
        }
        syncLenis()
      })
    })
  })()

  //валидация
  ;(() => {
    const forms = Array.from(document.querySelectorAll('.form__wrapper-form'))
    if (!forms.length) return

    const emailRe = /^[\w.!#$%&'*+/=?`{|}~-]+@[A-Za-z0-9-]+(?:\.[A-Za-z0-9-]+)+$/
    const phoneRe = /^\+?\s?7\s?\(?\d{3}\)?\s?\d{3}[-\s]?\d{2}[-\s]?\d{2}$/

    const addError = (el, msg) => {
      el.setAttribute('aria-invalid', 'true')
      el.dataset.error = msg
      el.classList.add('is-error')
    }
    const clearError = el => {
      el.removeAttribute('aria-invalid')
      delete el.dataset.error
      el.classList.remove('is-error')
    }

    const openPopup = id => {
      const popup = document.getElementById(id)
      if (!popup) return
      if (!popup._inited) {
        const close = () => { popup.classList.remove('is-open'); document.removeEventListener('keydown', onEsc) }
        const onEsc = e => { if (e.key === 'Escape') close() }
        popup.addEventListener('click', ev => {
          if (ev.target.classList.contains('popup') || ev.target.closest('.popup__wrapper-btn')) close()
        })
        popup._inited = true
        popup._close = close
        popup._onEsc = onEsc
      }
      document.addEventListener('keydown', popup._onEsc)
      popup.classList.add('is-open')
    }

    const initForm = form => {
      form.noValidate = true
      const isFooterForm = form.classList.contains('footer__wrapper-col-form')
      
      const fields = isFooterForm ? {
        email: form.querySelector('input[name="email"]'),
        consentMarketing: form.querySelector('input[name="consent_marketing"]')
      } : {
        name: form.querySelector('input[name="name"]'),
        email: form.querySelector('input[name="email"]'),
        company: form.querySelector('input[name="company"]'),
        phone: form.querySelector('input[name="phone"]'),
        position: form.querySelector('input[name="position"]'),
        message: form.querySelector('input[name="message"], textarea[name="message"]'),
        resume: form.querySelector('input[name="resume"]'),
        consent: form.querySelector('input[name="consent_personal"]'),
        consentMarketing: form.querySelector('input[name="consent_marketing"]')
      }

      const setCheckboxVisualState = (input, { error, checked }) => {
        if (!input) return
        const checkmark = input.closest('.form__checkbox')?.querySelector('.checkmark')
        if (error) {
          input.classList.add('is-error')
          checkmark && checkmark.classList.add('is-error')
        } else {
          input.classList.remove('is-error')
          checkmark && checkmark.classList.remove('is-error')
        }
        if (typeof checked === 'boolean') {
          checkmark && checkmark.classList.toggle('is-checked', checked)
        }
      }

      const submitBtn = form.querySelector('button[type="submit"], .form__submit')
      const updateSubmitState = () => {
        if (!submitBtn) return
        if (isFooterForm) {
          const requiredConsent = fields.consentMarketing
          const emailVal = fields.email?.value?.trim() || ''
          const emailOk = emailVal && emailRe.test(emailVal)
          const consentOk = requiredConsent ? !!requiredConsent.checked : false
          submitBtn.disabled = !(emailOk && consentOk)
        } else {
          submitBtn.disabled = false
        }
      }

      const isRequired = el => {
        if (!el) return false
        if (el.hasAttribute('required')) return true
        const ph = el.getAttribute('placeholder') || ''
        return ph.includes('*')
      }

      const validateField = el => {
        if (!el) return true
        const name = el.getAttribute('name')
        clearError(el)
        if (name === 'name') {
          if (el.value.trim().length < 2) { addError(el, 'Укажите имя'); return false }
        }
        if (name === 'email') {
          const required = isRequired(el)
          const v = el.value.trim()
          if ((required && !v) || (v && !emailRe.test(v))) { addError(el, 'Некорректный email'); return false }
        }
        if (name === 'company') {
          if (el.value.trim().length < 2) { addError(el, 'Укажите компанию'); return false }
        }
        if (name === 'phone') {
          const required = isRequired(el)
          const v = el.value.trim()
          if ((required && !v) || (v && !phoneRe.test(v))) { addError(el, 'Формат: +7 (999) 999-99-99'); return false }
        }
        if (name === 'message') {
          const v = el.value.trim()
          if (v && v.length < 10) { addError(el, 'Минимум 10 символов'); return false }
        }
        return true
      }

      const validateForm = () => {
        let ok = true
        
        if (isFooterForm) {
          const emailRequired = true
          if (fields.email) {
            const v = fields.email.value.trim()
            if (!v) { 
              addError(fields.email, 'Введите email')
              ok = false 
            } else if (!emailRe.test(v)) { 
              addError(fields.email, 'Некорректный email')
              ok = false 
            }
          }
          if (fields.consentMarketing && !fields.consentMarketing.checked) {
            setCheckboxVisualState(fields.consentMarketing, { error: true, checked: fields.consentMarketing.checked })
            ok = false
          } else {
            setCheckboxVisualState(fields.consentMarketing, { error: false, checked: fields.consentMarketing?.checked })
          }
        } else {
          ok = validateField(fields.name) && ok
          ok = validateField(fields.email) && ok
          ok = validateField(fields.company) && ok
          ok = validateField(fields.phone) && ok
          ok = validateField(fields.message) && ok
          if (fields.consent && !fields.consent.checked) {
            setCheckboxVisualState(fields.consent, { error: true, checked: fields.consent.checked })
            ok = false
          } else {
            setCheckboxVisualState(fields.consent, { error: false, checked: fields.consent?.checked })
          }
          if (fields.consentMarketing) {
            setCheckboxVisualState(fields.consentMarketing, { error: false, checked: fields.consentMarketing.checked })
          }
        }
        return ok
      }

      if (fields.phone) {
        const format = v => {
          const d = v.replace(/\D/g, '').replace(/^8/, '7')
          const p = ['+7', ' (', d.slice(1,4), ') ', d.slice(4,7), '-', d.slice(7,9), '-', d.slice(9,11)]
          return p.join('').replace(/[-()\s]+$/,'')
        }
        const onInput = e => {
          const i = e.target
          const start = i.selectionStart
          const before = i.value
          i.value = format(i.value)
          const diff = i.value.length - before.length
          const pos = Math.max(0, (start || 0) + diff)
          requestAnimationFrame(() => i.setSelectionRange(pos, pos))
        }
        fields.phone.addEventListener('input', onInput)
        fields.phone.addEventListener('blur', () => validateField(fields.phone))
        fields.phone.addEventListener('focus', () => { if (!fields.phone.value) fields.phone.value = '+7 ' })
        fields.phone.addEventListener('paste', e => setTimeout(() => onInput({ target: fields.phone }), 0))
      }

      form.addEventListener('input', e => {
        const t = e.target
        if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement || t instanceof HTMLSelectElement)) return
        clearError(t)
        if (isFooterForm && (t.name === 'email' || t.name === 'consent_marketing')) updateSubmitState()
      })

      ;(() => {
        const fileInput = fields.resume
        if (!fileInput) return
        const host = fileInput.closest('.form__field--file')
        if (!host) return
        const btn = host.querySelector('.form__file-btn')
        const svgs = btn?.querySelectorAll('svg')
        const textNode = Array.from(btn?.childNodes || []).find(n => n.nodeType === 3 && n.textContent.trim())
        const originalText = textNode?.textContent.trim() || 'Прикрепить резюме'
        
        const update = () => {
          const f = fileInput.files && fileInput.files[0]
          if (f) {
            if (textNode) textNode.textContent = ' Файл прикреплен '
            if (svgs && svgs.length >= 2) {
              svgs[0].style.display = 'none'
              svgs[1].style.display = ''
            }
          } else {
            if (textNode) textNode.textContent = ' ' + originalText + ' '
            if (svgs && svgs.length >= 2) {
              svgs[0].style.display = ''
              svgs[1].style.display = 'none'
            }
          }
        }
        
        btn && btn.addEventListener('click', e => { e.preventDefault(); fileInput.click() })
        fileInput.addEventListener('change', () => { clearError(fileInput); update() })
        update()
      })()

      const bindCheckbox = input => {
        if (!input) return
        const sync = () => { 
          setCheckboxVisualState(input, { error: false, checked: input.checked })
          updateSubmitState()
        }
        sync()
        input.addEventListener('input', sync)
        input.addEventListener('change', sync)
      }
      if (isFooterForm && fields.email) fields.email.addEventListener('input', updateSubmitState)
      const allCbs = form.querySelectorAll('.form__consents input[type="checkbox"]')
      allCbs.forEach(cb => bindCheckbox(cb))
      const consentsBox = form.querySelector('.form__consents')
      const resolveInput = el => {
        if (!el) return null
        if (el.matches && el.matches('input[type="checkbox"]')) return el
        const label = el.closest ? el.closest('.form__checkbox') : null
        return label ? label.querySelector('input[type="checkbox"]') : null
      }
      consentsBox?.addEventListener('click', e => {
        const input = resolveInput(e.target)
        if (!input) return
        setTimeout(() => { 
          setCheckboxVisualState(input, { error: false, checked: input.checked })
          updateSubmitState()
        }, 0)
      })
      consentsBox?.addEventListener('change', e => {
        const input = resolveInput(e.target)
        if (!input) return
        setCheckboxVisualState(input, { error: false, checked: input.checked })
        updateSubmitState()
      })
      updateSubmitState()
      form.addEventListener('blur', e => {
        const t = e.target
        if (!(t instanceof HTMLInputElement || t instanceof HTMLTextAreaElement)) return
        validateField(t)
      }, true)

      form.addEventListener('submit', async e => {
        e.preventDefault()
        if (!validateForm()) return
        const fd = new FormData(form)
        try {
          const simulate = !form.action || form.action === '#'
          if (!simulate) {
            const res = await fetch(form.action, { method: 'POST', body: fd })
            if (!res.ok) throw new Error('network')
          }
          form.reset()
          form.classList.add('is-sent')
          updateSubmitState()
          const footerSuccessHost = form.querySelector('.f_form')
          if (footerSuccessHost) {
            footerSuccessHost.classList.add('done')
          } else {
            openPopup('f01')
          }
        } catch (err) {
          form.reset()
          form.classList.add('is-sent')
          updateSubmitState()
          const footerSuccessHost = form.querySelector('.f_form')
          if (footerSuccessHost) {
            footerSuccessHost.classList.add('done')
          } else {
            openPopup('f01')
          }
        }
      })
    }

    forms.forEach(initForm)
  })()

  ;(() => {
    const roots = Array.from(document.querySelectorAll('.form__wrapper-form'))
    if (!roots.length) return

    roots.forEach(root => {
      const selects = Array.from(root.querySelectorAll('.custom-select'))
      if (!selects.length) return

      const closeAll = () => {
        selects.forEach(s => {
          const btn = s.querySelector('.custom-select__toggle')
          const list = s.querySelector('.custom-select__list')
          btn?.setAttribute('aria-expanded', 'false')
          if (list) {
            list.classList.remove('is-open')
            list.removeAttribute('hidden')
          }
          s.classList.remove('is-open')
        })
      }

      selects.forEach(sel => {
        const hidden = sel.querySelector('input[type="hidden"]')
        const btn = sel.querySelector('.custom-select__toggle')
        const list = sel.querySelector('.custom-select__list')
        if (!hidden || !btn || !list) return
        const labelEl = sel.querySelector('.custom-select__toggle p')
        list.removeAttribute('hidden')

        const setValue = (val, label, itemEl) => {
          hidden.value = val
          if (labelEl) labelEl.textContent = label
          btn.classList.add('has-value')
          btn.focus()
          closeAll()
          const all = list.querySelectorAll('.custom-select__option')
          all.forEach(o => { o.classList.remove('is-selected'); o.removeAttribute('aria-selected') })
          if (itemEl) { itemEl.classList.add('is-selected'); itemEl.setAttribute('aria-selected', 'true') }
        }

        const open = () => {
          btn.setAttribute('aria-expanded', 'true')
          list.classList.add('is-open')
          sel.classList.add('is-open')
        }
        const close = () => {
          btn.setAttribute('aria-expanded', 'false')
          list.classList.remove('is-open')
          sel.classList.remove('is-open')
        }

        btn.addEventListener('click', e => {
          const expanded = btn.getAttribute('aria-expanded') === 'true'
          closeAll()
          if (!expanded) open()
        })

        btn.addEventListener('keydown', e => {
          if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); const ex = btn.getAttribute('aria-expanded')==='true'; closeAll(); if (!ex) open() }
          if (e.key === 'Escape') close()
        })

        list.addEventListener('click', e => {
          const item = e.target.closest('.custom-select__option')
          if (!item) return
          const val = item.dataset.value || item.textContent.trim()
          setValue(val, item.textContent.trim(), item)
        })

        sel.addEventListener('keydown', e => {
          if (e.key === 'Escape') closeAll()
        })
      })

      const onDocClick = e => {
        const anyHost = e.target.closest('.custom-select')
        if (!anyHost) closeAll()
      }
      document.addEventListener('mousedown', onDocClick)
      document.addEventListener('touchstart', onDocClick, { passive: true })
      document.addEventListener('click', onDocClick)
    })
  })()

  // popup
  ;(() => {
    const btns = Array.from(document.querySelectorAll('#tks__btn'))
    const popup = document.getElementById('tsk')
    if (!btns.length || !popup) return
    const closeBtn = popup.querySelector('.tsk__close')
    const open = () => {
      popup.classList.add('is-open')
      popup.setAttribute('data-lenis-prevent', '')
      popup.setAttribute('data-lenis-prevent-wheel', '')
      popup.setAttribute('data-lenis-prevent-touch', '')
      document.addEventListener('keydown', onEsc)
    }
    const close = () => {
      popup.classList.remove('is-open')
      popup.removeAttribute('data-lenis-prevent')
      popup.removeAttribute('data-lenis-prevent-wheel')
      popup.removeAttribute('data-lenis-prevent-touch')
      document.removeEventListener('keydown', onEsc)
    }
    const onEsc = e => { if (e.key === 'Escape') close() }
    btns.forEach(btn => btn.addEventListener('click', e => { e.preventDefault(); open() }))
    closeBtn && closeBtn.addEventListener('click', e => { e.preventDefault(); close() })
    popup.addEventListener('click', e => { if (e.target === popup) close() })
  })()

  // выпадающие списки фильтров на странице кейсов
  ;(() => {
    const dropdowns = Array.from(document.querySelectorAll('.cs__all-filters-item-dropdown'))
    if (!dropdowns.length) return

    const closeAll = () => {
      dropdowns.forEach(dd => {
        dd.classList.remove('is-open')
        const header = dd.querySelector('.cs__all-filters-item-dropdown-header')
        const list = dd.querySelector('.cs__all-filters-item-dropdown-list')
        header && header.setAttribute('aria-expanded', 'false')
        list && list.setAttribute('aria-hidden', 'true')
      })
    }

    dropdowns.forEach(dd => {
      const header = dd.querySelector('.cs__all-filters-item-dropdown-header')
      const list = dd.querySelector('.cs__all-filters-item-dropdown-list')
      const label = header?.querySelector('p')
      if (!header || !list) return

      header.setAttribute('role', 'button')
      header.setAttribute('tabindex', '0')
      header.setAttribute('aria-expanded', 'false')
      list.setAttribute('role', 'listbox')
      list.setAttribute('aria-hidden', 'true')

      const toggle = () => {
        const isOpen = dd.classList.contains('is-open')
        closeAll()
        if (!isOpen) {
          dd.classList.add('is-open')
          header.setAttribute('aria-expanded', 'true')
          list.setAttribute('aria-hidden', 'false')
        }
      }

      header.addEventListener('click', toggle)
      header.addEventListener('keydown', e => {
        if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); toggle() }
        if (e.key === 'Escape') closeAll()
      })

      list.addEventListener('click', e => {
        const item = e.target.closest('li')
        if (!item) return
        if (label) label.textContent = item.textContent.trim()
        const all = list.querySelectorAll('li')
        all.forEach(li => li.classList.remove('is-selected'))
        item.classList.add('is-selected')
        dd.classList.remove('is-open')
        header.setAttribute('aria-expanded', 'false')
        list.setAttribute('aria-hidden', 'true')
      })
    })

    const onDocClick = e => {
      if (!e.target.closest('.cs__all-filters-item-dropdown')) closeAll()
    }
    document.addEventListener('mousedown', onDocClick)
    document.addEventListener('touchstart', onDocClick, { passive: true })
    document.addEventListener('click', onDocClick)
  })()

  // cases сетка 
  ;(() => {
    const root = document.querySelector('.cs__all-cards')
    if (!root) return
    const items = Array.from(root.querySelectorAll('.cases__wrapper-items-item'))
    if (items.length === 5) root.classList.add('col2')
  })()

  // cases показать еще
  ;(() => {
    const root = document.querySelector('.cs__all')
    if (!root) return
    const cards = root.querySelector('.cs__all-cards')
    if (!cards) return
    const items = Array.from(cards.querySelectorAll('.cases__wrapper-items-item'))
    const btn = root.querySelector('.cases__wrapper-btn')
    let expanded = false
    const syncLenis = () => {
      const l = window.__lenis
      if (!l) return
      if (typeof l.resize === 'function') l.resize()
      else if (typeof l.raf === 'function') l.raf(performance.now())
    }
    
    const revealFrom = startIdx => {
      items.forEach((it, idx) => {
        if (idx >= startIdx) {
          it.style.display = ''
          it.style.opacity = '0'
          it.style.transform = 'translateY(8px)'
          it.getBoundingClientRect()
          setTimeout(() => {
            it.style.transition = 'opacity .3s ease, transform .3s ease'
            it.style.opacity = '1'
            it.style.transform = 'translateY(0)'
          }, (idx - startIdx) * 60)
        }
      })
    }
    
    const apply = () => {
      const visibleCount = expanded ? items.length : 6
      items.forEach((it, idx) => {
        if (idx < visibleCount) {
          it.style.display = ''
          it.style.opacity = '1'
          it.style.transform = 'translateY(0)'
        } else {
          it.style.display = 'none'
        }
      })
      const hiddenAny = items.length > visibleCount
      if (btn) btn.style.display = hiddenAny ? '' : 'none'
      syncLenis()
    }
    
    apply()
    
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault()
        if (expanded) return
        expanded = true
        revealFrom(6)
        if (btn) btn.style.display = 'none'
        syncLenis()
      })
    }
  })()

  // products сетка
  ;(() => {
    const root = document.querySelector('.stack__wrapper-cards')
    if (!root) return
    const items = Array.from(root.querySelectorAll('.stack__wrapper-cards-item'))
    if (items.length === 5) root.classList.add('col2')
  })()

  // products показать еще
  ;(() => {
    const root = document.querySelector('.stack')
    if (!root) return
    const cards = root.querySelector('.stack__wrapper-cards')
    if (!cards) return
    const items = Array.from(cards.querySelectorAll('.stack__wrapper-cards-item'))
    const btn = root.querySelector('.stack__wrapper-btn')
    let expanded = false
    const syncLenis = () => {
      const l = window.__lenis
      if (!l) return
      if (typeof l.resize === 'function') l.resize()
      else if (typeof l.raf === 'function') l.raf(performance.now())
    }
    const revealFrom = startIdx => {
      items.forEach((it, idx) => {
        if (idx >= startIdx) {
          it.style.display = ''
          it.style.opacity = '0'
          it.style.transform = 'translateY(8px)'
          it.getBoundingClientRect()
          setTimeout(() => {
            it.style.transition = 'opacity .3s ease, transform .3s ease'
            it.style.opacity = '1'
            it.style.transform = 'translateY(0)'
          }, (idx - startIdx) * 60)
        }
      })
    }
    const apply = () => {
      const mobile = window.innerWidth < 769
      const limit = mobile ? 3 : 6
      const visibleCount = expanded ? items.length : limit
      items.forEach((it, idx) => {
        if (idx < visibleCount) {
          it.style.display = ''
          it.style.opacity = '1'
          it.style.transform = 'translateY(0)'
        } else {
          it.style.display = 'none'
        }
      })
      const hiddenAny = items.length > visibleCount
      if (btn) btn.style.display = hiddenAny ? '' : 'none'
      syncLenis()
    }
    apply()
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault()
        if (expanded) return
        const mobile = window.innerWidth < 769
        const limit = mobile ? 3 : 6
        expanded = true
        revealFrom(limit)
        if (btn) btn.style.display = 'none'
        syncLenis()
      })
    }
    let to
    window.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(() => { if (!expanded) { apply(); syncLenis() } }, 150) })
  })()

  // vacancy сетка
  ;(() => {
    const cards = document.querySelector('.vacancy__wrapper-cards')
    if (!cards) return
    const items = Array.from(cards.querySelectorAll('.vacancy__wrapper-cards-item'))
    if (items.length <= 1) return
    const btn = cards.parentElement?.querySelector('.logos__wrapper-btn')
    let expanded = false
    const syncLenis = () => {
      const l = window.__lenis
      if (!l) return
      if (typeof l.resize === 'function') l.resize()
      else if (typeof l.raf === 'function') l.raf(performance.now())
    }
    const apply = () => {
      const mobile = window.innerWidth < 769
      const visible = expanded ? items.length : (mobile ? 1 : 3)
      items.forEach((it, idx) => { it.style.display = idx < visible ? '' : 'none' })
      syncLenis()
    }
    apply()
    if (btn) {
      const showAll = e => {
        e.preventDefault()
        expanded = true
        apply()
        btn.style.display = 'none'
        syncLenis()
      }
      btn.addEventListener('click', showAll)
    }
    let to
    window.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(() => { if (!expanded) { apply(); syncLenis() } }, 150) })
  })()

  // vacancy показать еще
  ;(() => {
    const root = document.querySelector('.vacancy__wrapper')
    if (!root) return
    const cards = root.querySelector('.vacancy__wrapper-cards')
    const btn = root.querySelector('.logos__wrapper-btn')
    if (!cards) return
    const items = Array.from(cards.querySelectorAll('.vacancy__wrapper-cards-item'))
    if (items.length <= 1) return
    let expanded = false
    const revealFrom = startIdx => {
      items.forEach((it, idx) => {
        if (idx >= startIdx) {
          it.style.display = ''
          it.style.opacity = '0'
          it.style.transform = 'translateY(8px)'
          it.getBoundingClientRect()
          setTimeout(() => {
            it.style.transition = 'opacity .3s ease, transform .3s ease'
            it.style.opacity = '1'
            it.style.transform = 'translateY(0)'
          }, (idx - startIdx) * 60)
        }
      })
    }
    const apply = () => {
      const mobile = window.innerWidth < 769
      const visibleCount = expanded ? items.length : (mobile ? 1 : 3)
      items.forEach((it, idx) => {
        if (idx < visibleCount) {
          it.style.display = ''
          it.style.opacity = '1'
          it.style.transform = 'translateY(0)'
        } else {
          it.style.display = 'none'
        }
      })
      if (btn) btn.style.display = expanded || items.length <= visibleCount ? 'none' : ''
    }
    apply()
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault()
        if (expanded) return
        const mobile = window.innerWidth < 769
        const start = mobile ? 1 : 3
        expanded = true
        revealFrom(start)
        if (btn) btn.style.display = 'none'
      })
    }
    let to
    window.addEventListener('resize', () => { clearTimeout(to); to = setTimeout(() => { if (!expanded) apply() }, 150) })
  })()

  // insides показать еще
  ;(() => {
    const root = document.querySelector('.insides')
    if (!root) return
    const wrapper = document.querySelector('.insides__wrapper')
    if (!wrapper) return
    const items = Array.from(wrapper.querySelectorAll('.inside__wrapper-items-item'))
    const btn = document.querySelector('.insides__btn')
    let expanded = false
    const syncLenis = () => {
      const l = window.__lenis
      if (!l) return
      if (typeof l.resize === 'function') l.resize()
      else if (typeof l.raf === 'function') l.raf(performance.now())
    }
    
    const revealFrom = startIdx => {
      items.forEach((it, idx) => {
        if (idx >= startIdx) {
          it.style.display = ''
          it.style.opacity = '0'
          it.getBoundingClientRect()
          setTimeout(() => {
            it.style.opacity = '1'
          }, (idx - startIdx) * 60)
        }
      })
    }
    
    const apply = () => {
      const visibleCount = expanded ? items.length : 3
      items.forEach((it, idx) => {
        if (idx < visibleCount) {
          it.style.display = ''
          it.style.opacity = '1'
        } else {
          it.style.display = 'none'
        }
      })
      const hiddenAny = items.length > visibleCount
      if (btn) btn.style.display = hiddenAny ? '' : 'none'
      syncLenis()
    }
    
    apply()
    
    if (btn) {
      btn.addEventListener('click', e => {
        e.preventDefault()
        if (expanded) return
        expanded = true
        revealFrom(3)
        if (btn) btn.style.display = 'none'
        syncLenis()
      })
    }
  })()

  // u__wrapper-cards сетка
  ;(() => {
    const containers = document.querySelectorAll('.u__wrapper-cards')
    containers.forEach(container => {
      const cards = container.querySelectorAll('.u__wrapper-cards-card')
      if (cards.length === 2) {
        container.classList.add('col2')
      }
    })
  })()

  // видео
  ;(() => {
    const hosts = document.querySelectorAll('.video__wrapper-video')
    if (!hosts.length) return

    hosts.forEach(host => {
      const video = host.querySelector('video')
      const iframe = host.querySelector('iframe')
      const overlay = host.querySelector('.video__wrapper-video-play')
      if (!overlay || (!video && !iframe)) return

      const showOverlay = () => overlay.classList.add('is-visible')
      const hideOverlay = () => overlay.classList.remove('is-visible')

      if (video) {
        if (video.paused) showOverlay()

        const toggle = async () => {
          try {
            if (video.paused) {
              hideOverlay()
              await video.play()
            } else {
              video.pause()
              showOverlay()
            }
          } catch (e) {
            showOverlay()
          }
        }

        overlay.addEventListener('click', toggle)
        video.addEventListener('click', toggle)
        video.addEventListener('play', hideOverlay)
        video.addEventListener('pause', showOverlay)
        video.addEventListener('ended', showOverlay)
      } else if (iframe) {
        const img = host.querySelector('img')
        overlay.addEventListener('click', () => {
          overlay.style.display = 'none'
          if (img) img.style.display = 'none'
          const autoplaySrc = iframe.getAttribute('data-autoplay-src')
          if (autoplaySrc && iframe.src !== autoplaySrc) {
            iframe.src = autoplaySrc
          }
        })
      }
    })
  })()
  
  // бегущая строка
  ;(() => {
    const rows = []
    document.querySelectorAll('.logos__wrapper-items-row').forEach((row, idx) => {
      if (row.dataset.tickerReady) return
      const items = Array.from(row.children)
      if (!items.length) return
      const track = document.createElement('div')
      track.className = 'logos__ticker-track'
      const set = document.createElement('div')
      set.className = 'logos__ticker-set'
      items.forEach(item => set.appendChild(item))
      const clone = set.cloneNode(true)
      track.append(set, clone)
      row.append(track)
      row.dataset.tickerReady = '1'
      const speed = parseFloat(row.dataset.speed) || 60
      const dir = idx % 2 === 0 ? -1 : 1
      rows.push({ row, track, setWidth: 0, offset: dir > 0 ? 0 : 0, dir, speed })
    })
    if (!rows.length) return

    const measure = () => {
      rows.forEach(ticker => {
        const set = ticker.track.firstElementChild
        if (!set) return
        const width = set.getBoundingClientRect().width
        if (!width) return
        ticker.setWidth = width
        ticker.offset = ticker.dir > 0 ? -width : 0
        ticker.track.style.transform = `translate3d(${ticker.offset}px,0,0)`
      })
    }
    measure()

    let resizeTo
    window.addEventListener('resize', () => {
      clearTimeout(resizeTo)
      resizeTo = setTimeout(measure, 150)
    })

    const mq = window.matchMedia('(prefers-reduced-motion: reduce)')
    let rafId = null
    let last = null

    const step = now => {
      if (!rows.length) return
      if (last === null) last = now
      const dt = (now - last) / 1000
      last = now
      rows.forEach(ticker => {
        if (!ticker.setWidth) return
        ticker.offset += ticker.dir * ticker.speed * dt
        if (ticker.dir < 0 && ticker.offset <= -ticker.setWidth) {
          ticker.offset += ticker.setWidth
        } else if (ticker.dir > 0 && ticker.offset >= 0) {
          ticker.offset -= ticker.setWidth
        }
        ticker.track.style.transform = `translate3d(${ticker.offset}px,0,0)`
      })
      rafId = requestAnimationFrame(step)
    }

    const start = () => {
      if (rafId || mq.matches) return
      last = null
      rafId = requestAnimationFrame(step)
    }

    const stop = () => {
      if (!rafId) return
      cancelAnimationFrame(rafId)
      rafId = null
    }

    const handleMotion = () => {
      if (mq.matches) stop()
      else start()
    }

    handleMotion()
    if (typeof mq.addEventListener === 'function') mq.addEventListener('change', handleMotion)
    else if (typeof mq.addListener === 'function') mq.addListener(handleMotion)

    document.addEventListener('visibilitychange', () => {
      if (document.hidden) stop()
      else start()
    })
  })()

  // cookies
  ;(() => {
    const root = document.querySelector('.cookies')
    if (!root) return
    const btn = root.querySelector('.cookies__btn')
    const key = 'cookiesAccepted'
    const hide = () => { root.style.display = 'none' }
    try {
      if (localStorage.getItem(key) === '1') { hide(); return }
    } catch (e) {}
    btn?.addEventListener('click', e => {
      e.preventDefault()
      try { localStorage.setItem(key, '1') } catch (e) {}
      hide()
    })
  })()

  // скролл к форме
  ;(() => {
    const onClick = e => {
      const host = e.target.closest && (e.target.closest('[data-scroll-to="form"]') || e.target.closest('a[href="#form"]') || e.target.closest('#formBtn'))
      if (!host) return
      e.preventDefault()
      const target = document.getElementById('form')
      if (!target) return
      if (window.__lenis && typeof window.__lenis.scrollTo === 'function') {
        window.__lenis.scrollTo(target, { offset: 0, immediate: false })
        return
      }
      target.scrollIntoView({ behavior: 'smooth', block: 'start' })
    }
    document.addEventListener('click', onClick)
  })()

  document.querySelectorAll('.rating__wrapper-items').forEach(wrapper => {
    const itemsCount = wrapper.querySelectorAll('.rating__wrapper-items-item').length
    if (itemsCount < 5) wrapper.classList.add('df')
  })
})