const isHomePage = document.querySelector('.main.m')
if (document.querySelector('.artists__nav-mob-dropdown')) {
  const dropdown = document.querySelector('.artists__nav-mob-dropdown')
  const header = dropdown.querySelector('.artists__nav-mob-dropdown-header')
  
  header.addEventListener('click', () => {
    dropdown.classList.toggle('active')
  })
  
  document.addEventListener('click', (e) => {
    if (!dropdown.contains(e.target)) {
      dropdown.classList.remove('active')
    }
  })
} else {
}

document.addEventListener('DOMContentLoaded', () => {
  const birthDateInput = document.getElementById('birthDate');
  if (birthDateInput) {
    birthDateInput.addEventListener('input', function (e) {
      let value = e.target.value.replace(/\D/g, '');
      let formattedValue = '';
      if (value.length > 0) {
        formattedValue = value.substring(0, 2);
        if (value.length > 2) {
          formattedValue += '/' + value.substring(2, 4);
        }
        if (value.length > 4) {
          formattedValue += '/' + value.substring(4, 8);
        }
      }
      e.target.value = formattedValue;
    });
  }

  const burgerBtn = document.querySelector('.header__wrapper-burger')
  const navDropdown = document.querySelector('.header__wrapper-nav-dropdown')

  if (burgerBtn && navDropdown) {
    burgerBtn.addEventListener('click', () => {
      navDropdown.classList.toggle('active')
      burgerBtn.classList.toggle('active')
      const headerEl = document.querySelector('.header')
      if (headerEl) headerEl.classList.toggle('open')
    })
  }

  const header = document.querySelector('.header')
  const main = document.querySelector('.main') || document.querySelector('.about')
  const body = document.body
  const footer = document.querySelector('.footer')
  const isAboutPage = document.querySelector('.about')
  const isObjPage = document.querySelector('.obj')
  const isObjVbt = document.querySelector('.obj.vbt')
  const isObjSt = document.querySelector('.obj.st')
  const contactTitle = document.querySelector('.cntct__wrapper-title')
  const contactSubtitle = document.querySelector('.contacts__wrapper-item-header-subtitle')
  const contactText = document.querySelector('.contacts__wrapper-item-header-subtext')
  const workTitle = document.querySelectorAll('.catalog__wrapper-r-card-info-i-title')
  const workName = document.querySelectorAll('.catalog__wrapper-r-card-info-i-name')
  const workPrice = document.querySelectorAll('.catalog__wrapper-r-card-info-price')
  const sliderName = document.querySelectorAll('.slider__slides-item-info-name')
  const sliderPost = document.querySelectorAll('.slider__slides-item-info-post')
  const sliderDate = document.querySelectorAll('.slider__slides-item-info-date')
  const sliderCardName = document.querySelectorAll('.slider__cards-card-name')
  const moodCardName = document.querySelectorAll('.mood__cards-card-info-name')
  const artistInfoName = document.querySelectorAll('.obj__artist-content-info-name')
  const artistInfoText = document.querySelectorAll('.obj__artist-content-info-text')
  const stText = document.querySelectorAll('.st__last-wrapper-info-text')
  const stTitle = document.querySelectorAll('.st__last-wrapper-info-title')
  const stLink = document.querySelectorAll('.st__last-wrapper-info-link')
  const abtPost = document.querySelectorAll('.about__block-wrapper-cards-card-header-post')
  const abtName = document.querySelectorAll('.about__block-wrapper-cards-card-header-name')
  const abtText = document.querySelectorAll('.about__block-wrapper-cards-card-dropdown-text')
  const abtSvg = document.querySelectorAll('.about__block-wrapper-cards-card-header-arrow svg')
  const abtTitle = document.querySelectorAll('.about__block-wrapper-header-title')
  const textWrapper = document.querySelectorAll('.txt__wrapper')
  const isMobile = window.matchMedia('(max-width: 500px)')

  if (document.querySelector('.err')) header?.classList.add('none-w')

  if (document.querySelector('.obj') && header && !isObjVbt && !isObjSt)  {
    header.classList.remove('none')
  }

  if (footer && header) {
    const mobileHeaderScrollOffset = 280
    function checkScrollState() {
      const workTitle = document.querySelectorAll('.catalog__wrapper-r-card-info-i-title')
      const workName = document.querySelectorAll('.catalog__wrapper-r-card-info-i-name')
      const workPrice = document.querySelectorAll('.catalog__wrapper-r-card-info-price')
      
      const rect = footer.getBoundingClientRect()
      const windowHeight = window.innerHeight || document.documentElement.clientHeight
      const percent = 0.1
      const offset = windowHeight * percent
      const footerVisible = rect.top < windowHeight - offset && rect.bottom > offset
      header.classList.toggle('ftr', !!footerVisible)
      body.classList.toggle('scroll', !!footerVisible)
      if (contactTitle) contactTitle.classList.toggle('ftr', !!footerVisible)
      if (contactSubtitle) contactSubtitle.classList.toggle('ftr', !!footerVisible)
      if (contactText) contactText.classList.toggle('ftr', !!footerVisible)
        if (workTitle) workTitle.forEach(title => title.classList.toggle('ftr', !!footerVisible))
        if (workName) workName.forEach(name => name.classList.toggle('ftr', !!footerVisible))
        if (workPrice) workPrice.forEach(price => price.classList.toggle('ftr', !!footerVisible))
        if (sliderName) sliderName.forEach(name => name.classList.toggle('ftr', !!footerVisible))
        if (sliderPost) sliderPost.forEach(post => post.classList.toggle('ftr', !!footerVisible))
        if (sliderDate) sliderDate.forEach(date => date.classList.toggle('ftr', !!footerVisible))
        if (sliderCardName) sliderCardName.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (moodCardName) moodCardName.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (artistInfoName) artistInfoName.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (artistInfoText) artistInfoText.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (textWrapper) textWrapper.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (stText) stText.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (stTitle) stTitle.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (stLink) stLink.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (abtPost) abtPost.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (abtName) abtName.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (abtText) abtText.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (abtSvg) abtSvg.forEach(el => el.classList.toggle('ftr', !!footerVisible))
        if (abtTitle) abtTitle.forEach(el => el.classList.toggle('ftr', !!footerVisible))
      if (isMobile.matches) {
        if (isObjPage && !isObjVbt && !isObjSt) {
          header.classList.remove('none')
          return
        }

        if (isHomePage || isAboutPage) {
          if (window.scrollY > mobileHeaderScrollOffset) {
            header.classList.remove('scroll')
            if (main) main.classList.add('scroll')
            if (isAboutPage) isAboutPage.classList.add('scroll')
          } else {
            header.classList.add('scroll')
            if (main) main.classList.remove('scroll')
            if (isAboutPage) isAboutPage.classList.remove('scroll')
          }
        } else {
          header.classList.remove('scroll')
          if (main) main.classList.remove('scroll')
          if (isAboutPage) isAboutPage.classList.remove('scroll')
        }
        return
      }

      if (footerVisible) {
        header.classList.add('scroll')
        if (main) main.classList.remove('scroll')
        if (isAboutPage) isAboutPage.classList.remove('scroll')
        return
      }

      
      if (isHomePage || isAboutPage) {
        if (window.scrollY > 80) {
          header.classList.remove('scroll')
          if (main) main.classList.add('scroll')
          if (isAboutPage) isAboutPage.classList.add('scroll')
        } else {
          header.classList.add('scroll')
          if (main) main.classList.remove('scroll')
          if (isAboutPage) isAboutPage.classList.remove('scroll')
        }
      } else if (isObjPage) {
        if (window.scrollY > 80) {
          header.classList.remove('none')
          header.classList.remove('scroll')
        } else {
          if (!isObjVbt) header.classList.add('none')
          if (!isObjSt) header.classList.add('none')
        }
      } else {
        header.classList.remove('scroll')
        if (main) main.classList.remove('scroll')
        if (isAboutPage) isAboutPage.classList.remove('scroll')
      }
    }

    window.addEventListener('scroll', checkScrollState)
    window.addEventListener('resize', checkScrollState)
    checkScrollState()
  }

  if (document.querySelector('.obj__info-slider')) {
    const leftPagination = document.querySelector('.obj__info-slider-btns-pagination--left')
    const rightPagination = document.querySelector('.obj__info-slider-btns-pagination--right')
    const tempPagination = document.createElement('div')
    const isArtistPage = document.querySelector('.artist')
    tempPagination.className = 'obj__info-slider-btns-pagination-temp'
    tempPagination.style.display = 'none'
    document.body.appendChild(tempPagination)

    const swiper = new Swiper('.obj__info-slider', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      centeredSlides: !!isArtistPage,
      centeredSlidesBounds: true,
      roundLengths: true,
      loop: true,
      navigation: {
        nextEl: '.obj__info-slider-btns-arrows .next, .obj__info-slider-arrows .next, .obj__info-slider-arrows-2 .next',
        prevEl: '.obj__info-slider-btns-arrows .prev, .obj__info-slider-arrows .prev, .obj__info-slider-arrows-2 .prev'
      },
      pagination: {
        el: '.obj__info-slider-btns-pagination',
        clickable: true,
        renderBullet: (index, className) => `<span class='${className}' data-index='${index}'></span>`
      }
    })


    const paginationEl = document.querySelector('.obj__info-slider-btns-pagination')
    const syncPagination = () => {
      requestAnimationFrame(() => {
        const bullets = paginationEl?.querySelectorAll('.swiper-pagination-bullet')
        if (!bullets?.length) return
        const active = swiper.realIndex
        bullets.forEach((el, i) => {
          el.classList.toggle('swiper-pagination-bullet-active', i === active)
          el.setAttribute('aria-current', i === active ? 'true' : 'false')
        })
      })
    }
    const renderCustomBullets = () => {
      if (leftPagination && rightPagination) {
        leftPagination.innerHTML = ''
        rightPagination.innerHTML = ''
        const bullets = tempPagination.querySelectorAll('.swiper-pagination-bullet')
        bullets.forEach((b, i) => {
          const custom = b.cloneNode(true)
          custom.addEventListener('click', () => swiper.slideToLoop(i))
          if (i < 2) leftPagination.appendChild(custom)
          else rightPagination.appendChild(custom)
        })
      }
      syncPagination()
    }

    swiper.on('paginationRender', renderCustomBullets)
    swiper.on('slideChange', syncPagination)
    swiper.on('slideChangeTransitionEnd', syncPagination)
    renderCustomBullets()

    document.addEventListener('click', (e) => {
      const target = e.target.closest('.obj__info-slider-btns.moving-clone .prev, .obj__info-slider-btns.moving-clone .next')
      if (target && swiper) {
        e.preventDefault()
        if (target.classList.contains('prev')) {
          swiper.slidePrev()
        } else if (target.classList.contains('next')) {
          swiper.slideNext()
        }
      }

      const paginationBullet = e.target.closest('.obj__info-slider-btns.moving-clone .swiper-pagination-bullet')
      if (paginationBullet && swiper) {
        e.preventDefault()
        const index = parseInt(paginationBullet.dataset.index)
        if (!isNaN(index)) {
          swiper.slideToLoop(index)
        }
      }
    })

    document.addEventListener('click', (e) => {
      if (e.target.matches('.obj__info-slider-btns.moving-clone .swiper-pagination-bullet')) {
        e.preventDefault()
        e.stopPropagation()
        const index = parseInt(e.target.dataset.index)
        if (!isNaN(index) && swiper) {
          swiper.slideTo(index)
        }
      }
    })
  }

  if (document.querySelector('.main__slider')) {
    const isMobileMainSlider = window.matchMedia('(max-width: 1030px)').matches
    const swiper = new Swiper('.main__slider', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      loop: true,
      speed: isMobileMainSlider ? 1200 : 2600,
      fadeEffect: {
        crossFade: true
      },
      pagination: {
        el: '.main__slider-pagination',
        clickable: true,
        bulletClass: 'swiper-pagination-bullet',
        bulletActiveClass: 'swiper-pagination-bullet-active'
      }
    })

    function syncLoadImgHeight() {
      const ref = document.querySelector('.main__slider-slide-img')
      const loadImg = document.querySelector('.load__img')
      if (!ref || !loadImg) return
      const rect = ref.getBoundingClientRect()
      const h = Math.round(rect.height)
      if (h > 0) {
        loadImg.style.height = h + 'px'
      }
    }

    syncLoadImgHeight()

    swiper.on('resize', () => {
      syncLoadImgHeight()
    })
    swiper.on('slideChangeTransitionEnd', () => {
      syncLoadImgHeight()
    })

    window.addEventListener('load', syncLoadImgHeight)
    window.addEventListener('resize', syncLoadImgHeight)

    const prevBtn = document.querySelector('.main__slider-nav-prev')
    const nextBtn = document.querySelector('.main__slider-nav-next')

    if (prevBtn && nextBtn) {
      prevBtn.addEventListener('click', () => {
        swiper.slidePrev()
      })

      nextBtn.addEventListener('click', () => {
        swiper.slideNext()
      })
    }

    const mainSlider = document.querySelector('.main__slider')
    const slideImages = document.querySelectorAll('.main__slider-slide-img')
    const zoomEnabled = mainSlider && !mainSlider.closest('.events')
    if (zoomEnabled) {
      const ZOOM = 1.1
      function applyPan(el, x, y) {
        const img = el.querySelector('img')
        if (!img) return
        img.style.transform = `translate(${x}px, ${y}px) scale(${ZOOM})`
      }
      slideImages.forEach((container) => {
        const img = container.querySelector('img')
        if (!img) return
        const isMainSlider = container.closest('.main__slider')
        const onMove = (e) => {
          if (container.classList.contains('active')) {
            img.style.transform = ''
            return
          }
          const rect = container.getBoundingClientRect()
          const w = rect.width
          const h = rect.height
          const maxX = Math.max(0, (w * ZOOM - w) / 2)
          const maxY = Math.max(0, (h * ZOOM - h) / 2)
          const x = e.clientX - rect.left
          const y = e.clientY - rect.top
          const t = (x / w - 0.5) * 2
          const u = (y / h - 0.5) * 2
          const offsetX = Math.max(-maxX, Math.min(maxX, t * maxX))
          const offsetY = Math.max(-maxY, Math.min(maxY, u * maxY))
          applyPan(container, offsetX, offsetY)
        }
        const handleZoomEnter = (e) => {
          if (container.classList.contains('active')) return
          if (isMainSlider && window.innerWidth <= 1030) return
          onMove(e)
        }
        const handleZoomMove = (e) => {
          if (container.classList.contains('active')) return
          if (isMainSlider && window.innerWidth <= 1030) return
          onMove(e)
        }
        const handleZoomLeave = () => {
          if (container.classList.contains('active')) return
          if (isMainSlider && window.innerWidth <= 1030) return
          img.style.transform = ''
        }
        container.addEventListener('mouseenter', handleZoomEnter)
        container.addEventListener('mousemove', handleZoomMove)
        container.addEventListener('mouseleave', handleZoomLeave)
        if (!isMainSlider) {
          container.addEventListener('click', (e) => {
            if (window.innerWidth <= 1030) return
            e.stopPropagation()
            img.style.transform = ''
            container.classList.toggle('active')
            if (!container.classList.contains('active')) {
              img.style.transform = ''
            }
            const loadImg = document.querySelector('.load__img')
            if (loadImg) {
              const rect = container.getBoundingClientRect()
              const h = Math.round(rect.height)
              if (h > 0) loadImg.style.height = h + 'px'
            }
          })
        }
      })
    }

    document.querySelectorAll('.main__slider-slide-img').forEach(block => {
      const img = block.querySelector('img')
      if (!img) return
      let rafId = null
      let targetTranslateY = 0
      let lastAppliedTranslateY = NaN

      const getMaxOffset = () => {
        const rect = block.getBoundingClientRect()
        const imgHeight = img.offsetHeight || img.getBoundingClientRect().height
        return Math.max(0, imgHeight - rect.height)
      }

      const handleMouseMove = e => {
        if (window.innerWidth <= 1030) return
        if (!block.classList.contains('active')) return

        const maxOffsetY = getMaxOffset()
        const percentY = Math.min(1, Math.max(0, e.clientY / window.innerHeight))

        if (maxOffsetY <= 0) {
          targetTranslateY = 0
          img.style.transition = 'transform 0.3s ease-out'
          img.style.transform = `translateY(0)`
          lastAppliedTranslateY = 0
          return
        }

        targetTranslateY = -maxOffsetY * percentY
        
        if (!Number.isFinite(lastAppliedTranslateY) || Math.abs(targetTranslateY - lastAppliedTranslateY) >= 1) {
          img.style.willChange = 'transform'
          img.style.transition = 'transform 0.3s ease-out'
          img.style.transform = `translateY(${targetTranslateY}px)`
          lastAppliedTranslateY = targetTranslateY
        }
      }

      const handleMouseLeave = () => {
        if (!block.classList.contains('active')) return
      }

      if (window.innerWidth > 1030) {
        block.addEventListener('mousemove', handleMouseMove, { passive: true })
        block.addEventListener('mouseleave', handleMouseLeave)
      }

      block.addEventListener('click', (e) => {
        if (window.innerWidth <= 1030) return
        e.preventDefault()
        e.stopPropagation()
        block.classList.toggle('active')
        if (block.classList.contains('active')) {
          img.style.transform = ''
          setTimeout(() => {
            const maxOffsetY = getMaxOffset()
            const centerY = maxOffsetY > 0 ? -maxOffsetY / 2 : 0
            targetTranslateY = centerY
            img.style.willChange = 'transform'
            img.style.transition = 'transform 0.3s ease-out'
            img.style.transform = `translateY(${centerY}px)`
            lastAppliedTranslateY = centerY
          }, 150)
        } else {
          img.style.transition = ''
          img.style.transform = ''
          img.style.willChange = ''
        }
      })

      let lastScrollY = window.scrollY
      const mobileScrollActivationOffset = 140
      window.addEventListener('scroll', () => {
        if (window.innerWidth > 1030) return
        const currentScrollY = window.scrollY
        if (currentScrollY > mobileScrollActivationOffset && lastScrollY <= mobileScrollActivationOffset) {
          block.classList.add('active')
        } else if (currentScrollY <= mobileScrollActivationOffset && lastScrollY > mobileScrollActivationOffset) {
          block.classList.remove('active')
          img.style.transition = ''
          img.style.transform = ''
          img.style.willChange = ''
        }
        lastScrollY = currentScrollY
      }, { passive: true })

      window.addEventListener('resize', () => {
        if (window.innerWidth <= 1030) return
        if (block.classList.contains('active')) {
          const maxOffsetY = getMaxOffset()
          const centerY = maxOffsetY > 0 ? -maxOffsetY / 2 : 0
          targetTranslateY = centerY
          img.style.transition = 'transform 0.3s ease-out'
          img.style.transform = `translateY(${centerY}px)`
          lastAppliedTranslateY = centerY
        }
      })
    })

    if (swiper) {
      swiper.on('slideChange', () => {
        document.querySelectorAll('.main__slider-slide-img').forEach(block => {
          block.classList.remove('active')
          const img = block.querySelector('img')
          if (img) {
            img.style.transform = ''
            img.style.transition = ''
            img.style.willChange = ''
            img.style.objectFit = ''
            img.style.width = ''
            img.style.height = ''
          }
        })
      })
    }
  }

  function addDragScrollListeners(element) {
    let isDragging = false
    let startX
    let scrollLeft
    let dragged = false
  
    element.addEventListener('mousedown', (event) => {
      if (event.target.tagName.toLowerCase() === 'a') {
        event.preventDefault()
      }
      isDragging = true
      dragged = false
      startX = event.pageX - element.offsetLeft
      scrollLeft = element.scrollLeft
    })
  
    element.addEventListener('mousemove', (event) => {
      if (!isDragging) return
      event.preventDefault()
      const x = event.pageX - element.offsetLeft
      const walk = (x - startX) * 2
      element.scrollLeft = scrollLeft - walk
      
      if (Math.abs(walk) > 5) {
        dragged = true
      }
    })
  
    element.addEventListener('mouseup', () => {
      isDragging = false
    })
  
    element.addEventListener('mouseleave', () => {
      isDragging = false
    })
  
    element.addEventListener('wheel', (event) => {
      if (Math.abs(event.deltaX) > Math.abs(event.deltaY)) {
        event.preventDefault()
        element.scrollLeft += event.deltaX
      }
    })

    element.addEventListener('click', (event) => {
      if (dragged) {
        event.preventDefault()
        event.stopPropagation()
      }
    })
  }

  const slides = document.querySelectorAll('.slider__slides')
  slides.forEach(slide => addDragScrollListeners(slide))

  function wireArSliderToSlides(arSlider, slidesEl) {
    const prevBtn = arSlider.querySelector('.prev')
    const nextBtn = arSlider.querySelector('.next')
    if (!prevBtn || !nextBtn) return
    const getScrollAmount = () => {
      const slide = slidesEl.querySelector('.slider__slides-item') || slidesEl.querySelector('.catalog__wrapper-r-card')
      return slide ? slide.offsetWidth : slidesEl.offsetWidth * 0.8
    }
    const updateArrows = () => {
      const { scrollLeft, clientWidth, scrollWidth } = slidesEl
      prevBtn.classList.toggle('disabled', scrollLeft <= 1)
      nextBtn.classList.toggle('disabled', scrollLeft + clientWidth >= scrollWidth - 1)
    }
    prevBtn.addEventListener('click', () => {
      if (!prevBtn.classList.contains('disabled')) {
        slidesEl.scrollBy({ left: -getScrollAmount(), behavior: 'smooth' })
      }
    })
    nextBtn.addEventListener('click', () => {
      if (!nextBtn.classList.contains('disabled')) {
        slidesEl.scrollBy({ left: getScrollAmount(), behavior: 'smooth' })
      }
    })
    slidesEl.addEventListener('scroll', updateArrows)
    window.addEventListener('resize', updateArrows)
    updateArrows()
  }
  document.querySelectorAll('.slider').forEach(section => {
    const ar = section.querySelector('.ar__slider')
    const slides = section.querySelector('.slider__slides')
    if (ar && slides) wireArSliderToSlides(ar, slides)
  })
  document.querySelectorAll('.obj__content-item').forEach(item => {
    const ar = item.querySelector('.ar__slider')
    const slides = item.querySelector('.slider__slides')
    if (ar && slides) wireArSliderToSlides(ar, slides)
  })

  const aboutSliders = document.querySelectorAll('.about__block-wrapper-scroll')
  aboutSliders.forEach(slide => addDragScrollListeners(slide))

  const initAccordion = (
    headerSelector,
    parentSelector,
    activeClass = 'active'
  ) => {
    const headers = document.querySelectorAll(headerSelector)
    if (!headers.length) return

    headers.forEach(header => {
      const container = header.closest(parentSelector) || header

      header.addEventListener('click', () => {
        container.classList.toggle(activeClass)
      })
    })
  }

  initAccordion(
    '.catalog__wrapper-l-filters-header',
    '.catalog__wrapper-l',
    'active'
  )

  initAccordion(
    '.catalog__wrapper-l-items-item-header',
    '.catalog__wrapper-l-items-item',
    'active'
  )

  initAccordion(
    '.obj__info-info-w-dropdown-header',
    '.obj__info-info-w-dropdown',
    '_active'
  )

  initAccordion(
    '.obj__info-info-w-selects-item-header',
    '.obj__info-info-w-selects-item',
    '_active'
  )

  document.addEventListener('click', (e) => {
    const activeSelects = document.querySelectorAll('.obj__info-info-w-selects-item._active')
    activeSelects.forEach(select => {
      if (!select.contains(e.target)) {
        select.classList.remove('_active')
      }
    })
  })

  const artistText = document.querySelector('.artist .obj__info-info-w-text')
  const artistMore = document.querySelector('.artist .obj__info-info-w-text-more')
  if (artistText && artistMore) {
    const expandText = 'Load more'
    const collapseText = 'Collapse'
    const updateArtistMoreText = () => {
      artistMore.textContent = artistText.classList.contains('expanded') ? collapseText : expandText
    }
    updateArtistMoreText()
    artistMore.addEventListener('click', e => {
      e.preventDefault()
      artistText.classList.toggle('expanded')
      updateArtistMoreText()
    })
  }

  const filterContainer = document.querySelector('.catalog__wrapper')
  if (filterContainer) {
    const checkBoxes = filterContainer.querySelectorAll('.custom-checkbox input[type="checkbox"]')
    const priceInputs = filterContainer.querySelectorAll('.catalog__wrapper-l-items-price input')
    const tagsContainer = filterContainer.querySelector('.catalog__wrapper-r-tags-items')
    const clearAllBtn = filterContainer.querySelector('.catalog__wrapper-r-tags-del')
    const applyBtn = filterContainer.querySelector('.catalog__wrapper-l-btns .apply')
    const deleteAllBtn = filterContainer.querySelector('.catalog__wrapper-l-btns .dlt')
    
    let activeFilters = {
      checkboxes: new Set(),
      priceMin: '',
      priceMax: ''
    }

    const createTag = (text, type, value) => {
      const tag = document.createElement('div')
      tag.className = 'catalog__wrapper-r-tags-items-item'
      tag.dataset.type = type
      tag.dataset.value = value
      tag.innerHTML = `
        <p>${text}</p>
        <svg viewBox="0 0 12 12"><use xlink:href="img/sprite.svg#plus"></use></svg>
      `
      
      tag.querySelector('svg').addEventListener('click', () => {
        if (type === 'checkbox') {
          const checkbox = [...checkBoxes].find(cb => cb.closest('label').textContent.trim() === value)
          if (checkbox) checkbox.checked = false
        } else if (type === 'price') {
          const input = priceInputs[value === 'min' ? 0 : 1]
          if (input) input.value = ''
        }
        updateActiveFilters()
        updateTags()
        updateApplyButton()
      })
      
      return tag
    }

    const updateActiveFilters = () => {
      activeFilters.checkboxes.clear()
      checkBoxes.forEach(checkbox => {
        if (checkbox.checked) {
          activeFilters.checkboxes.add(checkbox.closest('label').textContent.trim())
        }
      })
      
      activeFilters.priceMin = priceInputs[0].value
      activeFilters.priceMax = priceInputs[1].value

      updateApplyButton()
    }

    const updateTags = () => {
      tagsContainer.innerHTML = ''
      
      activeFilters.checkboxes.forEach(value => {
        tagsContainer.appendChild(createTag(value, 'checkbox', value))
      })
      
      if (activeFilters.priceMin) {
        tagsContainer.appendChild(createTag(`from ${activeFilters.priceMin}€`, 'price', 'min'))
      }
      if (activeFilters.priceMax) {
        tagsContainer.appendChild(createTag(`to ${activeFilters.priceMax}€`, 'price', 'max'))
      }

      const tagsWrapper = tagsContainer.closest('.catalog__wrapper-r-tags')
      if (tagsWrapper) {
        const hasFilters = activeFilters.checkboxes.size > 0 || activeFilters.priceMin || activeFilters.priceMax
        tagsWrapper.classList.toggle('active', hasFilters)
      }
    }

    const updateApplyButton = () => {
      const activeCount = activeFilters.checkboxes.size + (activeFilters.priceMin ? 1 : 0) + (activeFilters.priceMax ? 1 : 0)
      
      if (activeCount > 0) {
        applyBtn.textContent = `Apply (${activeCount})`
        applyBtn.classList.add('active')
      } else {
        applyBtn.textContent = 'Apply'
        applyBtn.classList.remove('active')
      }
    }

    const clearAllFilters = () => {
      checkBoxes.forEach(cb => cb.checked = false)
      priceInputs.forEach(input => input.value = '')
      updateActiveFilters()
      updateTags()
    }

    checkBoxes.forEach(checkbox => {
      checkbox.addEventListener('change', () => {
        updateActiveFilters()
        updateTags()
      })
    })

    const parentCheckboxes = filterContainer.querySelectorAll('.catalog__wrapper-l-items-parent')
    parentCheckboxes.forEach(parentContainer => {
      const parentHeader = parentContainer.querySelector('.catalog__wrapper-l-items-parent-header')
      const parentLabel = parentHeader?.querySelector('label')
      const parentCheckbox = parentLabel?.querySelector('input[type="checkbox"]')
      const subCheckboxes = parentContainer.querySelectorAll('.catalog__wrapper-l-items-sub input[type="checkbox"]')
      const subArrow = parentHeader?.querySelector('.sub-arrow')
      const subContainer = parentContainer.querySelector('.catalog__wrapper-l-items-sub')
      
      if (parentCheckbox && subCheckboxes.length > 0) {
        if (subArrow) {
          subArrow.addEventListener('click', (e) => {
            e.preventDefault()
            e.stopPropagation()
            const isExpanded = subContainer.classList.contains('expanded')
            subContainer.classList.toggle('expanded', !isExpanded)
          })
        }
        
        parentCheckbox.addEventListener('change', () => {
          subCheckboxes.forEach(subCheckbox => {
            subCheckbox.checked = parentCheckbox.checked
          })
          updateActiveFilters()
          updateTags()
        })
        
        subCheckboxes.forEach(subCheckbox => {
          subCheckbox.addEventListener('change', () => {
            const allChecked = Array.from(subCheckboxes).every(cb => cb.checked)
            const someChecked = Array.from(subCheckboxes).some(cb => cb.checked)
            
            parentCheckbox.checked = allChecked
            parentCheckbox.indeterminate = someChecked && !allChecked
            
            updateActiveFilters()
            updateTags()
          })
        })
      }
    })

    priceInputs.forEach(input => {
      input.addEventListener('input', () => {
        updateActiveFilters()
        updateTags()
      })
    })

    if (clearAllBtn) {
      clearAllBtn.addEventListener('click', (e) => {
        e.preventDefault()
        clearAllFilters()
      })
    }
    
    if (deleteAllBtn) {
      deleteAllBtn.addEventListener('click', (e) => {
        e.preventDefault()
        clearAllFilters()
      })
    }

    if (applyBtn) {
      applyBtn.addEventListener('click', (e) => {
        e.preventDefault()
        const filterWrapper = applyBtn.closest('.catalog__wrapper-l')
        if (filterWrapper) {
          filterWrapper.classList.remove('active')
        }
      })
    }

    updateActiveFilters()
    updateTags()
  }

  document.querySelectorAll('.obj__info-info-w').forEach(infoWBlock => {
    const selectsBlock = infoWBlock.querySelector('.obj__info-info-w-selects')
    const addToBagBtn = infoWBlock.querySelector('.obj__info-info-w-btn')

    if (!selectsBlock || !addToBagBtn) return
    
    const selectItems = selectsBlock.querySelectorAll('.obj__info-info-w-selects-item')

    const checkSelections = () => {
      const allSelected = selectItems.length === 0 || Array.from(selectItems).every(item =>
        !!item.querySelector('.obj__info-info-w-selects-item-dropdown li.active')
      )
      
      if (allSelected) {
        addToBagBtn.classList.remove('disabled')
        addToBagBtn.removeAttribute('disabled')
      } else {
        addToBagBtn.classList.add('disabled')
        addToBagBtn.setAttribute('disabled', 'disabled')
      }
    }

    selectItems.forEach(item => {
      const headerP = item.querySelector('.obj__info-info-w-selects-item-header p')
      const placeholder = headerP?.dataset.placeholder
      if (headerP && placeholder) headerP.textContent = placeholder
      
      item.querySelectorAll('.obj__info-info-w-selects-item-dropdown li').forEach(li => {
        li.classList.remove('active')
      })
    })

    selectItems.forEach(item => {
      const header = item.querySelector('.obj__info-info-w-selects-item-header')
      const dropdownItems = item.querySelectorAll('.obj__info-info-w-selects-item-dropdown li')

      header.addEventListener('click', () => {
        const wasActive = item.classList.contains('active')
        selectItems.forEach(i => i.classList.remove('active'))
        if (!wasActive) {
          item.classList.add('active')
        }
      })

      dropdownItems.forEach(dropdownItem => {
        dropdownItem.addEventListener('click', e => {
          e.stopPropagation()
          const headerP = item.querySelector('.obj__info-info-w-selects-item-header p')
          if (headerP) {
            headerP.textContent = dropdownItem.textContent
          }

          const currentActive = item.querySelector('.obj__info-info-w-selects-item-dropdown li.active')
          if (currentActive) currentActive.classList.remove('active')
          
          dropdownItem.classList.add('active')
          item.classList.remove('active')
          checkSelections()
        })
      })
    })

    document.addEventListener('click', e => {
      if (!selectsBlock.contains(e.target)) {
        selectItems.forEach(i => i.classList.remove('active'))
      }
    })

    checkSelections()
  })

  const bagContinueBtn = document.getElementById('bagContinueBtn')
  const bagOverlay = document.querySelector('.overlay')
  const bagOverlayClose = document.querySelector('.overlay__content-header-close')

  if (bagContinueBtn && bagOverlay && bagOverlayClose) {
    bagContinueBtn.addEventListener('click', e => {
      e.preventDefault()
      bagOverlay.classList.add('active')
    })
    bagOverlayClose.addEventListener('click', () => {
      bagOverlay.classList.remove('active')
    })
    bagOverlay.addEventListener('click', e => {
      if (e.target === bagOverlay) bagOverlay.classList.remove('active')
    })
  }

  (() => {
    const calculators = document.querySelectorAll('.overlay__content-content-items-item-info-text-calc')
  
    const updateSubtotal = () => {
      const items = document.querySelectorAll('.overlay__content-content-items-item')
      const subtotalEl = document.querySelector('.overlay__content-content-total-price-price')
      if (!subtotalEl) return
  
      let total = 0
  
      items.forEach(item => {
        const priceEl = item.querySelector('.overlay__content-content-items-item-info-text-price')
        const quantityEl = item.querySelector('.overlay__content-content-items-item-info-text-calc p')
        
        if (priceEl && quantityEl) {
          const priceText = priceEl.textContent.replace('€', '').replace(/\s/g, '').replace(',', '.')
          const price = parseFloat(priceText)
          const quantity = parseInt(quantityEl.textContent, 10)
          if (!isNaN(price) && !isNaN(quantity)) {
            total += price * quantity
          }
        }
      })
  
      subtotalEl.textContent = `€${total.toLocaleString('fr-FR')}`
    }
  
    calculators.forEach(calc => {
      const minusBtn = calc.querySelector('svg:first-of-type')
      const plusBtn = calc.querySelector('svg:last-of-type')
      const quantityEl = calc.querySelector('p')
  
      if (!minusBtn || !plusBtn || !quantityEl) return
  
      minusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityEl.textContent, 10)
        if (quantity > 1) {
          quantity--
          quantityEl.textContent = quantity
          updateSubtotal()
        }
      })
  
      plusBtn.addEventListener('click', () => {
        let quantity = parseInt(quantityEl.textContent, 10)
        quantity++
        quantityEl.textContent = quantity
        updateSubtotal()
      })
    })
    
    updateSubtotal()
  })()

  document.querySelectorAll('.overlay__content-form-in-w-select').forEach(select => {
    const header = select.querySelector('.overlay__content-form-in-w-select-header')
    const dropdown = select.querySelector('.overlay__content-form-in-w-select-dropdown')
    const items = dropdown.querySelectorAll('li')
    let isOpen = false

    const close = () => {
      select.classList.remove('active')
      isOpen = false
    }

    header.addEventListener('click', e => {
      e.stopPropagation()
      document.querySelectorAll('.overlay__content-form-in-w-select').forEach(s => {
        if (s !== select) s.classList.remove('active')
      })
      select.classList.toggle('active')
      isOpen = select.classList.contains('active')
    })

    items.forEach(item => {
      item.addEventListener('click', e => {
        e.stopPropagation()
        header.querySelector('p').textContent = item.textContent
        items.forEach(i => i.classList.remove('active'))
        item.classList.add('active')
        close()
      })
    })

    document.addEventListener('click', e => {
      if (!select.contains(e.target)) close()
    })
  })

  const bagLogin = document.getElementById('bagLogin')
  const bagReg = document.getElementById('bagReg')

  if (bagLogin && bagReg && bagContinueBtn) {
    bagLogin.classList.remove('active')
    bagReg.classList.remove('active')

    bagContinueBtn.addEventListener('click', e => {
      e.preventDefault()
      bagLogin.classList.add('active')
      bagReg.classList.remove('active')
    })

    const regLink = bagLogin.querySelector('.overlay__content-log-reg')
    if (regLink) {
      regLink.addEventListener('click', e => {
        e.preventDefault()
        bagLogin.classList.remove('active')
        bagReg.classList.add('active')
      })
    }

    const loginLink = bagReg.querySelector('.overlay__content-log-reg')
    if (loginLink) {
      loginLink.addEventListener('click', e => {
        e.preventDefault()
        bagReg.classList.remove('active')
        bagLogin.classList.add('active')
      })
    }

    const closeBtns = document.querySelectorAll('.overlay__content-header-close')
    closeBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        bagLogin.classList.remove('active')
        bagReg.classList.remove('active')
      })
    })

    document.addEventListener('mousedown', e => {
      if (bagLogin.classList.contains('active')) {
        if (!bagLogin.querySelector('.overlay__content').contains(e.target)) {
          bagLogin.classList.remove('active')
        }
      }
      if (bagReg.classList.contains('active')) {
        if (!bagReg.querySelector('.overlay__content').contains(e.target)) {
          bagReg.classList.remove('active')
        }
      }
    })
  }

  let justOpenedObjPopup = false

  document.addEventListener('click', e => {
    const btn = e.target.closest('.obj__info-info-w-btn')
    if (!btn) return
    e.preventDefault()
    if (btn.classList.contains('disabled') || btn.hasAttribute('disabled')) return
    let objPopup = null
    if (btn.id === 'objBtn2') {
      objPopup = document.getElementById('objPopup2')
    } else {
      objPopup = document.getElementById('objPopup')
    }
    if (objPopup) {
      objPopup.classList.add('active')
      justOpenedObjPopup = true
      setTimeout(() => { justOpenedObjPopup = false }, 0)
    }
  })

  document.addEventListener('click', e => {
    const objPopup = document.getElementById('objPopup')
    if (!objPopup || !objPopup.classList.contains('active')) return
    if (justOpenedObjPopup) return
    if (e.target.closest('.overlay__content-header-close')) {
      objPopup.classList.remove('active')
      return
    }
    const content = objPopup.querySelector('.overlay__content')
    if (content && !content.contains(e.target)) {
      objPopup.classList.remove('active')
    }
  })

  document.addEventListener('click', e => {
    const objPopup2 = document.getElementById('objPopup2')
    if (!objPopup2 || !objPopup2.classList.contains('active')) return
    if (justOpenedObjPopup) return
    if (e.target.closest('.overlay__content-header-close')) {
      objPopup2.classList.remove('active')
      return
    }
    const content = objPopup2.querySelector('.overlay__content')
    if (content && !content.contains(e.target)) {
      objPopup2.classList.remove('active')
    }
  })

  document.querySelectorAll('.bag__wrapper-items-item-info-calc').forEach(calc => {
    const minusBtn = calc.querySelector('svg:first-of-type')
    const plusBtn = calc.querySelector('svg:last-of-type')
    const quantityEl = calc.querySelector('p')
    if (!minusBtn || !plusBtn || !quantityEl) return
    minusBtn.addEventListener('click', () => {
      let quantity = parseInt(quantityEl.textContent, 10)
      if (quantity > 1) {
        quantity--
        quantityEl.textContent = quantity
        updateBagTotal()
      }
    })
    plusBtn.addEventListener('click', () => {
      let quantity = parseInt(quantityEl.textContent, 10)
      quantity++
      quantityEl.textContent = quantity
      updateBagTotal()
    })
  })
  function updateBagTotal() {
    let total = 0
    document.querySelectorAll('.bag__wrapper-items-item-info-w').forEach(item => {
      const priceEl = item.querySelector('.bag__wrapper-items-item-info-price')
      const quantityEl = item.querySelector('.bag__wrapper-items-item-info-calc p')
      if (!priceEl || !quantityEl) return
      const price = parseFloat(priceEl.textContent.replace('€', '').replace(/\s/g, '').replace(',', '.'))
      const quantity = parseInt(quantityEl.textContent, 10)
      if (!isNaN(price) && !isNaN(quantity)) {
        total += price * quantity
      }
    })
    const totalEl = document.querySelector('.bag__wrapper-total')
    if (totalEl) totalEl.textContent = `€${total.toLocaleString('fr-FR')}`
  }
  updateBagTotal()

  const dropdowns = document.querySelectorAll('.form__dropdown')
  
  dropdowns.forEach(dropdown => {
    const header = dropdown.querySelector('.form__dropdown-header')
    const list = dropdown.querySelector('.form__dropdown-dropdown')
    const items = dropdown.querySelectorAll('.form__dropdown-dropdown li')
    const selectedText = header.querySelector('p')
    
    header.addEventListener('click', () => {
      dropdown.classList.toggle('active')
    })
    
    items.forEach(item => {
      item.addEventListener('click', () => {
        selectedText.textContent = item.textContent
        items.forEach(i => i.classList.remove('active'))
        item.classList.add('active')
      })
    })
    
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active')
      }
    })
  })

  const messageTextarea = document.getElementById('message')
  const counter = document.querySelector('.form__counter')
  
  if (messageTextarea && counter) {
    messageTextarea.addEventListener('input', () => {
      const length = messageTextarea.value.length
      counter.textContent = `${length}/240`
    })
  }

  {
    const details = document.querySelector('.details')
    const form = document.querySelector('.details__form')
    if (details && form) {
      const inputs = [...form.querySelectorAll('.form__input')]
      const country = form.querySelector('.form__dropdown')
      const countryHeader = country?.querySelector('.form__dropdown-header')
      const saveBtn = document.querySelector('.sna')

      const emailRe = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      const isFilled = el => el && el.value.trim().length > 1
      const isEmail = el => el && emailRe.test(el.value.trim())
      const isSelectedCountry = () => !!country?.querySelector('li.active')

      const map = {
        firstName: inputs[0] || null,
        lastName: inputs[1] || null,
        email: inputs[2] || null,
        phone: inputs[3] || null,
        city: inputs[4] || null,
        address: inputs[5] || null,
        postal: inputs[6] || null
      }

      const validate = (show = false) => {
        const v = {
          firstName: isFilled(map.firstName),
          lastName: isFilled(map.lastName),
          email: isEmail(map.email),
          city: isFilled(map.city),
          address: isFilled(map.address),
          postal: isFilled(map.postal),
          country: isSelectedCountry()
        }

        if (show) {
          if (map.firstName) map.firstName.classList.toggle('rr', !v.firstName)
          if (map.lastName) map.lastName.classList.toggle('rr', !v.lastName)
          if (map.email) map.email.classList.toggle('rr', !v.email)
          if (map.city) map.city.classList.toggle('rr', !v.city)
          if (map.address) map.address.classList.toggle('rr', !v.address)
          if (map.postal) map.postal.classList.toggle('rr', !v.postal)
          countryHeader?.classList.toggle('error', !v.country)
        } else {
          inputs.forEach(i => i.classList.remove('rr'))
          countryHeader?.classList.remove('error')
        }

        return Object.values(v).every(Boolean)
      }

      inputs.forEach(i => i.addEventListener('input', () => validate(true)))
      country?.querySelectorAll('li').forEach(li => li.addEventListener('click', () => validate(true)))

      if (saveBtn) {
        saveBtn.addEventListener('click', e => {
          if (!validate(true)) {
            e.preventDefault()
          }
        })
      }
    }
  }

  if (document.querySelector('.contacts')) {
    const form = document.getElementById('contactForm')
    const firstName = document.getElementById('firstName')
    const lastName = document.getElementById('lastName')
    const email = document.getElementById('email')
    const privacy = document.getElementById('privacy')
    const submitBtn = document.querySelector('.form__btn')
    const dropdown = document.querySelector('.form__dropdown')
    const dropdownHeader = document.querySelector('.form__dropdown-header')
    const dropdownList = document.querySelector('.form__dropdown-dropdown')
    const selectedTheme = document.getElementById('selectedTheme')

    let selectedThemeValue = 'Artist Proposal'

    if (dropdownHeader && dropdownList) {
      dropdownHeader.addEventListener('click', () => {
        dropdownList.classList.toggle('active')
      })

      dropdownList.addEventListener('click', (e) => {
        if (e.target.tagName === 'LI') {
          selectedThemeValue = e.target.dataset.value
          selectedTheme.textContent = selectedThemeValue
          dropdownList.classList.remove('active')
          validateForm()
        }
      })
    }

    const validateEmail = (email) => {
      const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
      return re.test(email)
    }

    const validateForm = () => {
      if (!firstName || !lastName || !email || !messageTextarea || !privacy || !submitBtn) return

      const isFirstNameValid = firstName.value.trim().length >= 2
      const isLastNameValid = lastName.value.trim().length >= 2
      const isEmailValid = validateEmail(email.value)
      const isMessageValid = messageTextarea.value.trim().length >= 10
      const isPrivacyChecked = privacy.checked

      const isValid = isFirstNameValid && isLastNameValid && isEmailValid && isMessageValid && isPrivacyChecked

      submitBtn.disabled = !isValid
      
      firstName.classList.toggle('error', !isFirstNameValid && firstName.value)
      lastName.classList.toggle('error', !isLastNameValid && lastName.value)
      email.classList.toggle('error', !isEmailValid && email.value)
      messageTextarea.classList.toggle('error', !isMessageValid && messageTextarea.value)
    }

    if (firstName) firstName.addEventListener('input', validateForm)
    if (lastName) lastName.addEventListener('input', validateForm)
    if (email) email.addEventListener('input', validateForm)
    if (privacy) privacy.addEventListener('change', validateForm)

    if (form) {
      form.addEventListener('submit', (e) => {
        e.preventDefault()
        
        const formData = {
          firstName: firstName.value.trim(),
          lastName: lastName.value.trim(),
          email: email.value.trim(),
          theme: selectedThemeValue,
          message: messageTextarea.value.trim()
        }
        
        console.log('Form data:', formData)
        alert('Form submitted successfully!')
      })
    }
  }

  document.querySelectorAll('.about__block-wrapper-cards-card').forEach(card => {
    const header = card.querySelector('.about__block-wrapper-cards-card-header')
    if (!header) return
    header.addEventListener('click', () => {
      card.classList.toggle('active')
    })
  })

  const video = document.querySelector('.about__block-video video')
  const videoBlock = document.querySelector('.about__block-video')
  const controls = document.querySelector('.about__block-video-controls')
  const playBtn = document.querySelector('.about__block-video-controls-play')
  const pauseBtn = document.querySelector('.about__block-video-controls-pause')
  let controlsTimeout
  let controlsEverInteracted = false

  if (videoBlock && controls && video) {
    const showControls = () => {
      videoBlock.classList.add('active-controls')
      videoBlock.classList.remove('hide-controls')
      clearTimeout(controlsTimeout)
      if (controlsEverInteracted) {
        controlsTimeout = setTimeout(() => {
          videoBlock.classList.remove('active-controls')
          videoBlock.classList.add('hide-controls')
        }, 2000)
      }
    }

    videoBlock.addEventListener('mousemove', () => {
      controlsEverInteracted = true
      showControls()
    })
    videoBlock.addEventListener('mouseleave', () => {
      videoBlock.classList.remove('active-controls')
      videoBlock.classList.add('hide-controls')
      clearTimeout(controlsTimeout)
    })
    videoBlock.addEventListener('focusin', () => {
      controlsEverInteracted = true
      showControls()
    })

    videoBlock.addEventListener('click', e => {
      const isPlayBtn = e.target.closest('.about__block-video-controls-play')
      const isPauseBtn = e.target.closest('.about__block-video-controls-pause')
      const isControls = e.target.closest('.about__block-video-controls')
      if (!isPlayBtn && !isPauseBtn && !isControls) {
        if (video.paused) {
          video.play()
        } else {
          video.pause()
        }
      }
    })

    if (playBtn && pauseBtn) {
      playBtn.addEventListener('click', e => {
        e.stopPropagation()
        if (video.paused) video.play()
      })
      pauseBtn.addEventListener('click', e => {
        e.stopPropagation()
        if (!video.paused) video.pause()
      })
      video.addEventListener('play', () => {
        playBtn.classList.add('none')
        pauseBtn.classList.remove('none')
      })
      video.addEventListener('pause', () => {
        playBtn.classList.remove('none')
        pauseBtn.classList.add('none')
      })
      if (video.paused) {
        playBtn.classList.remove('none')
        pauseBtn.classList.add('none')
      } else {
        playBtn.classList.add('none')
        pauseBtn.classList.remove('none')
      }
    }
  }

  const timeline = document.querySelector('.about__block-video-controls-btn-timeline')
  const volume = document.querySelector('.about__block-video-controls-btn-vol')

  if (video && timeline) {
    const updateTime = () => {
      const cur = formatTime(video.currentTime)
      const dur = formatTime(video.duration || 0)
      timeline.textContent = `${cur}/${dur}`
    }
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateTime)
    video.addEventListener('durationchange', updateTime)
    updateTime()
  }

  if (video && volume) {
    volume.addEventListener('input', () => {
      video.volume = volume.value
    })
    video.addEventListener('volumechange', () => {
      volume.value = video.volume
    })
  }

  const timeEl = document.querySelector('.about__block-video-controls-time')
  const volBtn = document.querySelector('.about__block-video-controls-btn-vol')

  function formatTime(sec) {
    sec = Math.floor(sec)
    const m = Math.floor(sec / 60)
    const s = sec % 60
    return `${m}:${s.toString().padStart(2, '0')}`
  }

  if (video && timeEl) {
    const updateTime = () => {
      const cur = formatTime(video.currentTime)
      const dur = formatTime(video.duration || 0)
      timeEl.textContent = `${cur}/${dur}`
    }
    video.addEventListener('timeupdate', updateTime)
    video.addEventListener('loadedmetadata', updateTime)
    video.addEventListener('durationchange', updateTime)
    updateTime()
  }

  if (video && volBtn) {
    volBtn.addEventListener('click', () => {
      video.muted = !video.muted
      volBtn.classList.toggle('muted', video.muted)
    })
    video.addEventListener('volumechange', () => {
      volBtn.classList.toggle('muted', video.muted)
    })
  }

  if (document.querySelector('.about__nav')) {
    const navLinks = document.querySelectorAll('.about__nav a')
    const sections = Array.from(navLinks).map(link => {
      const href = link.getAttribute('href')
      return href.startsWith('#') ? document.querySelector(href) : null
    }).filter(Boolean)
    
    const navMob = document.querySelector('.about__nav-mob')
    const navMobText = navMob.querySelector('p')
    const prevArrow = navMob.querySelector('.p')
    const nextArrow = navMob.querySelector('.n')
    let currentIndex = 0

  if (document.querySelector('.artists__nav-mob-dropdown')) {
    console.log('Найден дропдаун художников')
    const dropdown = document.querySelector('.artists__nav-mob-dropdown')
    const header = dropdown.querySelector('.artists__nav-mob-dropdown-header')
    const closeBtn = header.querySelector('svg')
    const list = dropdown.querySelector('.artists__nav-mob-dropdown-list')
    const links = list.querySelectorAll('a')
    
    console.log('Элементы найдены:', { dropdown, header, closeBtn, list, links: links.length })
    
    header.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Клик по заголовку')
      dropdown.classList.toggle('active')
      console.log('Класс active:', dropdown.classList.contains('active'))
    })
    
    closeBtn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      console.log('Клик по кнопке закрытия')
      dropdown.classList.remove('active')
    })
    
    links.forEach(link => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        console.log('Клик по ссылке:', link.textContent)
        dropdown.classList.remove('active')
      })
    })
    
    document.addEventListener('click', (e) => {
      if (!dropdown.contains(e.target)) {
        dropdown.classList.remove('active')
      }
    })
  } else {
  }
    const smoothScrollTo = (element) => {
      if (!element) return
      const elementPosition = element.getBoundingClientRect().top + window.pageYOffset
      const elementHeight = element.offsetHeight
      const viewportHeight = window.innerHeight
      const centerPosition = elementPosition - (viewportHeight / 2) + (elementHeight / 2)
      window.scrollTo({
        top: centerPosition,
        behavior: 'smooth'
      })
    }
    
    const footer = document.querySelector('.footer')
    let isFooterVisible = false

    const updateMobileNav = () => {
      if (navLinks[currentIndex]) {
        navMobText.textContent = navLinks[currentIndex].textContent
      }
      navMobText.style.opacity = isFooterVisible ? '0' : '1'
    }

    navLinks.forEach((link) => {
      link.addEventListener('click', (e) => {
        e.preventDefault()
        const section = document.querySelector(link.getAttribute('href'))
        smoothScrollTo(section)
      })
    })

    const setActiveLink = (sectionId) => {
        navLinks.forEach(link => {
            if (link.getAttribute('href') === `#${sectionId}`) {
                link.classList.add('active')
                const newIndex = Array.from(navLinks).indexOf(link)
                if (currentIndex !== newIndex) {
                    currentIndex = newIndex
                    updateMobileNav()
                }
            } else {
                link.classList.remove('active')
            }
        })
    }

    prevArrow.addEventListener('click', () => {
      currentIndex = (currentIndex - 1 + sections.length) % sections.length
      smoothScrollTo(sections[currentIndex])
      updateMobileNav()
    })

    nextArrow.addEventListener('click', () => {
      currentIndex = (currentIndex + 1) % sections.length
      smoothScrollTo(sections[currentIndex])
      updateMobileNav()
    })
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                setActiveLink(entry.target.id)
            }
        })
    }, { rootMargin: '-40% 0px -40% 0px' })

    sections.forEach(section => {
        if (section) {
            observer.observe(section)
        }
    })

    if (footer) {
      const footerObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
          isFooterVisible = entry.isIntersecting
          updateMobileNav()
        })
      }, { rootMargin: '-40% 0px -40% 0px' })
      footerObserver.observe(footer)
    }

    updateMobileNav()
  }

  const cookiePopup = document.querySelector('.cookie')
  const settingsPopup = document.querySelector('.settings')

  if (cookiePopup && settingsPopup) {
    setTimeout(() => {
      cookiePopup.classList.add('show')
    }, 500)

    const settingsButton = Array.from(cookiePopup.querySelectorAll('.cookie__wrapper-link')).find(
      (el) => el.textContent.trim() === 'Manage settings'
    )
    const toggleSwitch = settingsPopup.querySelector('.settings__col-toggle')
    const closeButton = cookiePopup.querySelector('.cookie__wrapper-close')
    const acceptButton = Array.from(cookiePopup.querySelectorAll('.cookie__wrapper-link')).find(
      (el) => el.textContent.trim() === 'Accept all'
    )

    const hideCookiePopup = () => cookiePopup.classList.remove('show')

    if (settingsButton) {
      settingsButton.addEventListener('click', (event) => {
        event.preventDefault()
        hideCookiePopup()
        setTimeout(() => {
          settingsPopup.classList.add('show')
        }, 300)
      })
    }

    if (closeButton) {
      closeButton.addEventListener('click', hideCookiePopup)
    }

    if (acceptButton) {
      acceptButton.addEventListener('click', (event) => {
        event.preventDefault()
        hideCookiePopup()
      })
    }

    if (toggleSwitch) {
      const textElement = toggleSwitch.querySelector('p')
      toggleSwitch.addEventListener('click', () => {
        toggleSwitch.classList.toggle('active')
        if (textElement) {
          textElement.textContent = toggleSwitch.classList.contains('active') ? 'Enable' : 'Disable'
        }
      })
    }

    const settingsActionButtons = settingsPopup.querySelectorAll('.settings__col-btns a')
    const hideSettingsPopup = () => settingsPopup.classList.remove('show')

    settingsActionButtons.forEach(button => {
      button.addEventListener('click', (event) => {
        event.preventDefault()
        hideSettingsPopup()
      })
    })

    const dropdown = settingsPopup.querySelector('.settings__dropdown')
    const desktopNavItems = settingsPopup.querySelectorAll('.settings__col.f .settings__col-text')
    const contentTitle = settingsPopup.querySelector('.settings__col.l .settings__col-title')
    const contentText = settingsPopup.querySelector('.settings__col.l .settings__col-text')
    const contentToggle = settingsPopup.querySelector('.settings__col.l .settings__col-toggle')

    if (dropdown) {
      const header = dropdown.querySelector('.settings__dropdown-header')
      const listItems = dropdown.querySelectorAll('li')
      const headerText = header.querySelector('p')

      const settingsContent = {
        'Privacy overview': {
          title: 'Privacy Overview',
          text: 'This website uses cookies to improve your experience. See an overview of your privacy settings below.',
          showToggle: false,
        },
        'Strictly necessary cookies': {
          title: 'Strictly Necessary Cookies',
          text: 'Strictly Necessary Cookie should be enabled at all times so that we can save your preferences for cookie settings.',
          showToggle: true,
        },
        '3rd party cookies': {
          title: '3rd Party Cookies',
          text: 'These cookies are used by third-party services. You can manage their settings here.',
          showToggle: true,
        },
        'Additional cookies': {
          title: 'Additional Cookies',
          text: 'These cookies help us with analytics and marketing. You can choose to enable or disable them.',
          showToggle: true,
        },
      }

      const updateContent = (tabKey) => {
        const content = settingsContent[tabKey]
        if (!content || !contentTitle || !contentText || !contentToggle) return

        contentTitle.textContent = content.title
        contentText.textContent = content.text
        contentToggle.style.display = content.showToggle ? 'flex' : 'none'
      }

      const setActiveTab = (tabKey) => {
        desktopNavItems.forEach(item => {
          item.classList.toggle('active', item.textContent.trim() === tabKey)
        })
        if (headerText) headerText.textContent = tabKey
      }

      header.addEventListener('click', () => {
        dropdown.classList.toggle('active')
      })

      listItems.forEach(item => {
        item.addEventListener('click', () => {
          const tabKey = item.textContent.trim()
          setActiveTab(tabKey)
          updateContent(tabKey)
          dropdown.classList.remove('active')
        })
      })

      desktopNavItems.forEach(item => {
        item.addEventListener('click', () => {
          const tabKey = item.textContent.trim()
          setActiveTab(tabKey)
          updateContent(tabKey)
        })
      })

      const initialTabKey = desktopNavItems[0]?.textContent.trim() || 'Privacy overview'
      setActiveTab(initialTabKey)
      updateContent(initialTabKey)
      dropdown.classList.remove('active')
    }
  }

  if (document.querySelector('.txt__nav.desk')) {
    const navLinks = document.querySelectorAll('.txt__nav.desk a')
    navLinks.forEach(link => {
      link.addEventListener('click', e => {
        e.preventDefault()
        const target = document.querySelector(link.getAttribute('href'))
        smoothScrollTo(target)
      })
    })
  }

  const smoothScrollTo = (element) => {
    if (!element) return
    const headerOffset = header?.offsetHeight || 0
    const extraOffset = 60 
    const elementPosition = element.getBoundingClientRect().top
    const offsetPosition = elementPosition + window.pageYOffset - headerOffset - extraOffset
    window.scrollTo({
      top: offsetPosition,
      behavior: 'smooth'
    })
  }

  document.querySelectorAll('ul[class$="__nav"], ul[class*="__nav "]').forEach(nav => {
    const links = Array.from(nav.querySelectorAll('a'))
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean)
    if (!sections.length) return
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === '#' + entry.target.id)
          })
        }
      })
    }, { rootMargin: '-20% 0px -75% 0px' })
    sections.forEach(section => observer.observe(section))
  })

  document.querySelectorAll('.txt__nav.mob').forEach(mobNav => {
    const header = mobNav.querySelector('.txt__nav-header')
    const headerText = header?.querySelector('p')
    const dropdown = mobNav.querySelector('.txt__nav-dropdown')
    const links = Array.from(mobNav.querySelectorAll('a'))
    const sections = links.map(link => document.querySelector(link.getAttribute('href'))).filter(Boolean)
    if (!header || !headerText || !dropdown || !links.length || !sections.length) return
    header.addEventListener('click', () => {
      dropdown.classList.toggle('active')
      header.classList.toggle('active')
    })
    const updateHeader = idx => {
      headerText.textContent = links[idx]?.textContent || ''
    }
    links.forEach((link, i) => {
      link.addEventListener('click', e => {
        e.preventDefault()
        links.forEach(l => l.classList.remove('active'))
        link.classList.add('active')
        updateHeader(i)
        dropdown.classList.remove('active')
        header.classList.remove('active')
        const target = document.querySelector(link.getAttribute('href'))
        smoothScrollTo(target)
      })
    })
    const observer = new IntersectionObserver(entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          links.forEach((link, i) => {
            const isActive = link.getAttribute('href') === '#' + entry.target.id
            link.classList.toggle('active', isActive)
            if (isActive) updateHeader(i)
          })
        }
      })
    }, { rootMargin: '-20% 0px -75% 0px' })
    sections.forEach(section => observer.observe(section))
    updateHeader(0)
  })

  const filtersHeader = document.querySelector('.catalog__wrapper-l-filters-header')
  if (filtersHeader) {
    filtersHeader.addEventListener('click', () => {
      const items = document.querySelectorAll('.catalog__wrapper-l-items-item')
      items.forEach((item, i) => {
        if (i === 0) {
          item.classList.add('active')
        } else {
          item.classList.remove('active')
        }
      })
    })
  }

  document.querySelectorAll('.catalog__wrapper-r-card-img').forEach(container => {
    if (!(container instanceof Element)) return
    const arrows = container.parentElement?.querySelector('.catalog__wrapper-r-card-img-arrows')
    const card = container.closest('.catalog__wrapper-r-card')
    
    if (container.classList.contains('swiper-initialized')) {
      console.log('Уничтожаем существующий слайдер:', container)
      container.className = container.className.replace(/swiper-\w+/g, '').trim()
      container.className += ' swiper'
      
      const wrapper = container.querySelector('.swiper-wrapper')
      if (wrapper) {
        wrapper.innerHTML = wrapper.innerHTML
      }
    }
    
    const swiper = new Swiper(container, {
      slidesPerView: 1,
      loop: true,
      autoplay: false,
      effect: 'fade',
      fadeEffect: {
        crossFade: true
      },
      speed: 200,
      navigation: arrows
        ? {
            nextEl: arrows.querySelector('.next'),
            prevEl: arrows.querySelector('.prev')
          }
        : false
    })
    
    if (swiper) {
      let originalSlideIndex = 0
      let isMouseOver = false
      
      container.addEventListener('mouseenter', () => {
        isMouseOver = true
        originalSlideIndex = swiper.realIndex
        swiper.slideNext()
      })
      
      container.addEventListener('mouseleave', () => {
        isMouseOver = false
        swiper.slideToLoop(originalSlideIndex)
      })
      
      swiper.on('slideChange', () => {
        if (!isMouseOver) {
          originalSlideIndex = swiper.realIndex
        }
      })
    }
  })

  {
    const form = document.querySelector('.overlay__content-f')
    if (form) {
      const firstName = form.querySelector('#firstName')
      const lastName = form.querySelector('#lastName')
      const email = form.querySelector('#email')
      const message = form.querySelector('#message')
      const countryDropdown = form.querySelector('.overlay__content-f-dropdown')
      const countryHeader = countryDropdown?.querySelector('.overlay__content-f-dropdown-header')
      const countryList = countryDropdown?.querySelector('.overlay__content-f-dropdown-dropdown')
      const countryItems = countryList?.querySelectorAll('li')
      const submitBtn = form.querySelector('.overlay__content-f-btn')
      let selectedCountry = ''

      if (countryDropdown && countryHeader && countryList && countryItems?.length) {
        countryItems.forEach(item => {
          item.addEventListener('click', e => {
            e.stopPropagation()
            const p = countryHeader.querySelector('p')
            if (!p) {
              return
            }
            p.textContent = item.textContent
            selectedCountry = item.textContent
            countryItems.forEach(i => i.classList.remove('active'))
            item.classList.add('active')
            countryDropdown.classList.remove('active')
            validate()
          })
        })
        document.addEventListener('click', e => {
          if (!countryDropdown.contains(e.target)) countryDropdown.classList.remove('active')
        })
      } else {
        if (!countryDropdown) console.error('countryDropdown не найден')
        if (!countryHeader) console.error('countryHeader не найден')
        if (!countryList) console.error('countryList не найден')
        if (!countryItems?.length) console.error('countryItems не найдены')
      }

      function validate(showErrors = false) {
        const isFirstName = firstName.value.trim().length > 1
        const isLastName = lastName.value.trim().length > 1
        const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)
        const isMessage = message.value.trim().length > 3
        const isCountry = !!selectedCountry
        // error-классы только если showErrors === true
        if (showErrors) {
          firstName.classList.toggle('error', !isFirstName && firstName.value)
          lastName.classList.toggle('error', !isLastName && lastName.value)
          email.classList.toggle('error', !isEmail && email.value)
          message.classList.toggle('error', !isMessage && message.value)
          countryHeader?.classList.toggle('error', !isCountry)
          countryHeader?.classList.toggle('invalid', !isCountry)
        } else {
          firstName.classList.remove('error')
          lastName.classList.remove('error')
          email.classList.remove('error')
          message.classList.remove('error')
          countryHeader?.classList.remove('error')
          countryHeader?.classList.remove('invalid')
        }
      }
      ;[firstName, lastName, email, message].forEach(input => input && input.addEventListener('input', () => validate(false)))
      form.addEventListener('submit', e => {
        e.preventDefault()
        let valid = true
        ;[firstName, lastName, email, message].forEach(input => {
          if (input && !input.value.trim()) {
            input.classList.add('invalid')
            valid = false
          } else {
            input.classList.remove('invalid')
          }
        })
        if (!selectedCountry) {
          countryHeader.classList.add('invalid')
          valid = false
        } else {
          countryHeader.classList.remove('invalid')
        }
        validate(true)
        if (!valid) return
        const objPopup3 = document.getElementById('objPopup3')
        if (objPopup3) {
          objPopup3.classList.add('active')
        }
        form.reset()
        countryHeader.querySelector('p').textContent = 'Select country'
        selectedCountry = ''
        countryItems?.forEach(i => i.classList.remove('active'))
        validate(false)
      })
      validate(false)
    }
  }

  const dropdown = document.querySelector('.account__wrapper-nav-dropdown')
  const accountHeader = dropdown?.querySelector('.account__wrapper-nav-dropdown-header')
  const list = dropdown?.querySelector('.account__wrapper-nav-dropdown-dropdown')
  if (dropdown && accountHeader && list) {
    accountHeader.addEventListener('click', e => {
      e.stopPropagation()
      list.classList.toggle('active')
      dropdown.classList.toggle('active')
    })
    document.addEventListener('click', e => {
      if (!dropdown.contains(e.target)) {
        list.classList.remove('active')
        dropdown.classList.remove('active')
      }
    })
  }

  const loader = document.querySelector('.load')
  if (loader) {
    const prevent = e => e.preventDefault()
    const preventKeys = e => {
      const tag = e.target.tagName
      if (tag === 'INPUT' || tag === 'TEXTAREA' || tag === 'SELECT' || e.target.isContentEditable) return
      const keys = [' ', 'PageUp', 'PageDown', 'Home', 'End', 'ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight']
      if (keys.includes(e.key)) e.preventDefault()
    }
    const lock = () => {
      window.scrollTo(0, 0)
      document.documentElement.style.overflow = 'hidden'
      document.body.style.overflow = 'hidden'
      document.body.style.position = 'fixed'
      document.body.style.top = '0'
      document.body.style.left = '0'
      document.body.style.right = '0'
      document.body.style.width = '100%'
      document.addEventListener('wheel', prevent, { passive: false })
      document.addEventListener('touchmove', prevent, { passive: false })
      document.addEventListener('keydown', preventKeys, { passive: false })
      window.addEventListener('scroll', prevent, { passive: false })
    }
    const unlock = () => {
      document.documentElement.style.overflow = ''
      document.body.style.overflow = ''
      document.body.style.position = ''
      document.body.style.top = ''
      document.body.style.left = ''
      document.body.style.right = ''
      document.body.style.width = ''
      document.removeEventListener('wheel', prevent, { passive: false })
      document.removeEventListener('touchmove', prevent, { passive: false })
      document.removeEventListener('keydown', preventKeys, { passive: false })
      window.removeEventListener('scroll', prevent, { passive: false })
      if (loader) loader.style.display = 'none'
    }
    lock()
    loader.addEventListener('animationend', e => { if (e.animationName === 'dn') unlock() })
    setTimeout(unlock, 4800)
  }

  const deleteProjectBtn = document.querySelector('.account__wrapper-content-nav-del')
  const deleteProjectPopup = document.getElementById('deleteProjectPopup')
  const cancelDeleteBtn = document.getElementById('cancelDelete')
  const confirmDeleteBtn = document.getElementById('confirmDelete')
  const closePopupBtn = deleteProjectPopup?.querySelector('.overlay__content-header-close')

  if (deleteProjectBtn) {
    deleteProjectBtn.addEventListener('click', (e) => {
      e.preventDefault()
      if (deleteProjectPopup.classList.contains('active')) {
        deleteProjectPopup.classList.remove('active')
      } else {
        deleteProjectPopup.classList.add('active')
      }
    })
  }

  if (cancelDeleteBtn) {
    cancelDeleteBtn.addEventListener('click', () => {
      deleteProjectPopup.classList.remove('active')
    })
  }

  if (closePopupBtn) {
    closePopupBtn.addEventListener('click', () => {
      deleteProjectPopup.classList.remove('active')
    })
  }

  if (deleteProjectPopup) {
    deleteProjectPopup.addEventListener('click', (e) => {
      if (e.target === deleteProjectPopup) {
        deleteProjectPopup.classList.remove('active')
      }
    })
  }

  document.addEventListener('click', (e) => {
    if (deleteProjectPopup?.classList.contains('active')) {
      const navDel = document.querySelector('.account__wrapper-content-nav-del')
      if (navDel && !navDel.contains(e.target)) {
        deleteProjectPopup.classList.remove('active')
      }
    }
  })

  if (confirmDeleteBtn) {
    confirmDeleteBtn.addEventListener('click', () => {
      deleteProjectPopup.classList.remove('active')
    })
  }

  const editProjectBtn = document.querySelector('#editProjectBtn')
  const editProjectPopup = document.getElementById('editProject')
  const closeEditPopupBtn = editProjectPopup?.querySelector('.overlay__content-header-close')

  if (editProjectBtn && editProjectPopup) {
    editProjectBtn.addEventListener('click', (e) => {
      e.preventDefault()
      editProjectPopup.classList.add('active')
    })
  }

  if (closeEditPopupBtn) {
    closeEditPopupBtn.addEventListener('click', () => {
      editProjectPopup.classList.remove('active')
    })
  }

  if (editProjectPopup) {
    editProjectPopup.addEventListener('click', (e) => {
      if (e.target === editProjectPopup) {
        editProjectPopup.classList.remove('active')
      }
    })
  }

  const editFormBackBtn = editProjectPopup?.querySelector('.overlay__content-form-back')
  if (editFormBackBtn) {
    editFormBackBtn.addEventListener('click', () => {
      editProjectPopup.classList.remove('active')
    })
  }

  const closeButtons = document.querySelectorAll('.overlay__content-content-w-btn')
  closeButtons.forEach(btn => {
    btn.addEventListener('mousedown', (e) => {
      e.preventDefault()
      e.stopPropagation()
    })
    
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      e.stopPropagation()
      e.stopImmediatePropagation()
      const popup = btn.closest('.overlay')
      if (popup) {
        popup.classList.remove('active')
      }
      return false
    })
    
    btn.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault()
        e.stopPropagation()
      }
    })
  })

  const deleteProjectItemBtns = document.querySelectorAll('.catalog__wrapper-r-card-img-wishlist')

  if (deleteProjectItemBtns.length > 0) {
    deleteProjectItemBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        const allActivePopups = document.querySelectorAll('#deleteProjectItemPopup.active')
        allActivePopups.forEach(activePopup => {
          activePopup.classList.remove('active')
        })
        const card = btn.closest('.catalog__wrapper-r-card')
        const popup = card.querySelector('#deleteProjectItemPopup')
        if (popup) {
          popup.classList.add('active')
        }
      })
    })
  }

  const allDeletePopups = document.querySelectorAll('#deleteProjectItemPopup')
  allDeletePopups.forEach(popup => {
    const cancelBtn = popup.querySelector('.del__btns-cancel')
    const confirmBtn = popup.querySelector('.del__btns-delete')
    const closeDeleteBtn = popup.querySelector('#closeDelete')

    if (cancelBtn) {
      cancelBtn.addEventListener('click', () => {
        popup.classList.remove('active')
      })
    }

    if (closeDeleteBtn) {
      closeDeleteBtn.addEventListener('click', (e) => {
        e.preventDefault()
        popup.classList.remove('active')
      })
    }

    popup.addEventListener('click', (e) => {
      if (e.target === popup) {
        popup.classList.remove('active')
      }
    })

    if (confirmBtn) {
      confirmBtn.addEventListener('click', () => {
        const card = popup.closest('.catalog__wrapper-r-card')
        const itemTitle = card?.querySelector('.catalog__wrapper-r-card-info-i-title')?.textContent
        console.log('Удаляем элемент:', itemTitle)
        
        popup.classList.remove('active')
      })
    }
  })

  document.addEventListener('click', (e) => {
    const activeDeleteItemPopups = document.querySelectorAll('#deleteProjectItemPopup.active')
    if (activeDeleteItemPopups.length > 0) {
      const isClickInsideAnyPopup = Array.from(activeDeleteItemPopups).some(popup => {
        const trigger = popup.closest('.catalog__wrapper-r-card')?.querySelector('.catalog__wrapper-r-card-img-wishlist')
        return popup.contains(e.target) || (trigger && trigger.contains(e.target))
      })
      
      if (!isClickInsideAnyPopup) {
        activeDeleteItemPopups.forEach(popup => {
          popup.classList.remove('active')
        })
      }
    }
  })

  const downloadProjectBtn = document.getElementById('downloadProjectBtn')
  const downloadPopup = document.getElementById('downloadProject')
  const closeDownloadPopupBtn = downloadPopup?.querySelector('.overlay__content-header-close')

  if (downloadProjectBtn && downloadPopup) {
    downloadProjectBtn.addEventListener('click', function(e) {
      e.preventDefault()
      downloadPopup.classList.add('active')
    })
  }

  if (closeDownloadPopupBtn && downloadPopup) {
    closeDownloadPopupBtn.addEventListener('click', () => {
      downloadPopup.classList.remove('active')
    })
  }

  if (downloadPopup) {
    downloadPopup.addEventListener('click', (e) => {
      if (e.target === downloadPopup) {
        downloadPopup.classList.remove('active')
      }
    })
  }

  const shareProjectBtn = document.getElementById('shareProjectBtn')
  const sharePopup = document.getElementById('shareProject')
  const closeSharePopupBtn = sharePopup?.querySelector('.overlay__content-header-close')

  if (shareProjectBtn && sharePopup) {
    shareProjectBtn.addEventListener('click', function(e) {
      e.preventDefault()
      sharePopup.classList.add('active')
    })
  }

  if (closeSharePopupBtn && sharePopup) {
    closeSharePopupBtn.addEventListener('click', () => {
      sharePopup.classList.remove('active')
    })
  }

  if (sharePopup) {
    sharePopup.addEventListener('click', (e) => {
      if (e.target === sharePopup) {
        sharePopup.classList.remove('active')
      }
    })
  }

})

const qs = (s, p = document) => p.querySelector(s)
const qsa = (s, p = document) => [...p.querySelectorAll(s)]
const on = (el, ev, fn) => el && el.addEventListener(ev, fn)
const off = (el, ev, fn) => el && el.removeEventListener(ev, fn)

document.addEventListener('click', e => {
  const header = e.target.closest('.overlay__content-f-dropdown-header')
  if (header) {
    e.stopPropagation()
    header.closest('.overlay__content-f-dropdown').classList.toggle('active')
    return
  }
  const item = e.target.closest('.overlay__content-f-dropdown-dropdown li')
  if (item) {
    e.stopPropagation()
    const dropdown = item.closest('.overlay__content-f-dropdown')
    const header = qs('.overlay__content-f-dropdown-header', dropdown)
    const p = qs('p', header)
    if (p) p.textContent = item.textContent
    dropdown.querySelectorAll('li').forEach(i => i.classList.remove('active'))
    item.classList.add('active')
    header.classList.add('active')
    dropdown.classList.remove('active')
    return
  }
  qsa('.overlay__content-f-dropdown.active').forEach(dropdown => {
    if (!dropdown.contains(e.target)) dropdown.classList.remove('active')
  })
  if (e.target.closest('#objPopup .continue')) {
    e.preventDefault()
    qs('#objPopup')?.classList.remove('active')
    return
  }
  for (const id of ['objPopup', 'objPopup2']) {
    const popup = qs(`#${id}`)
    if (popup?.classList.contains('active')) {
      if (window.justOpenedObjPopup) return
      if (e.target.closest('.overlay__content-header-close')) {
        popup.classList.remove('active')
        return
      }
      const content = qs('.overlay__content', popup)
      if (content && !content.contains(e.target)) popup.classList.remove('active')
    }
  }
  const search = qs('.search')
  const wrap = qs('.search__wrapper-w')
  const headerEl = qs('.header')
  if (search?.classList.contains('active') && wrap && !wrap.contains(e.target) && !e.target.closest('.header__wrapper-info-search')) {
    search.classList.remove('active')
    headerEl?.classList.remove('open')
  }
  const accDropdown = qs('.account__wrapper-nav-dropdown')
  if (accDropdown && !accDropdown.contains(e.target)) {
    qs('.account__wrapper-nav-dropdown-dropdown', accDropdown)?.classList.remove('active')
    accDropdown.classList.remove('active')
  }
  qsa('.obj__info-info-w-selects-item._active').forEach(select => {
    if (!select.contains(e.target)) select.classList.remove('_active')
  })
})

// document.querySelector('.header__wrapper-nav-dropdown-links a.active')?.addEventListener('click',e=>{e.preventDefault();document.querySelector('.header__wrapper-nav-dropdown-w')?.classList.add('active')})

document.querySelectorAll('.header__wrapper-info-search').forEach(el=>{
	el.addEventListener('click',()=>{
		document.querySelector('.search')?.classList.add('active')
		document.querySelector('.header')?.classList.add('open')
	})
})

const headerEl2 = document.querySelector('.header')
const maskEl = document.querySelector('.mask')
const openHeader = () => { headerEl2?.classList.add('open'); maskEl?.classList.add('active') }
const closeHeader = () => { headerEl2?.classList.remove('open'); maskEl?.classList.remove('active') }

document.querySelectorAll('.header__wrapper-nav > li.nav').forEach(navItem => {
	const dropdown = navItem.nextElementSibling?.classList?.contains('header__wrapper-nav-dropdown')
		? navItem.nextElementSibling
		: null
	if (!dropdown) return

	const isHovered = () => navItem.matches(':hover') || dropdown.matches(':hover')

	navItem.addEventListener('mouseenter', openHeader)
	dropdown.addEventListener('mouseenter', openHeader)

	navItem.addEventListener('mouseleave', () => {
		setTimeout(() => { if (!isHovered()) closeHeader() }, 0)
	})
	dropdown.addEventListener('mouseleave', () => {
		setTimeout(() => { if (!isHovered()) closeHeader() }, 0)
	})
})

document.addEventListener('click',e=>{
	const search = document.querySelector('.search')
	const wrap = document.querySelector('.search__wrapper-w')
	const header = document.querySelector('.header')
	if(search?.classList.contains('active') && wrap && !wrap.contains(e.target) && !e.target.closest('.header__wrapper-info-search')){
		search.classList.remove('active')
		header?.classList.remove('open')
	}
})

document.addEventListener('click', e => {
  if (e.target.closest('#objBtnSave')) {
    e.preventDefault()
    document.querySelector('#objPopupSave').classList.add('active')
  }

  if (e.target.closest('#eventbtn')) {
    e.preventDefault()
    document.querySelector('#eventPopup').classList.add('active')
  }

  if (e.target.closest('#objPopupSave2')) {
    e.preventDefault()
    document.querySelector('#objPopupSave').classList.remove('active')
    document.querySelector('#objPopupAdd').classList.add('active')
  }

  if (e.target.closest('#objPopupBack')) {
    e.preventDefault()
    document.querySelector('#objPopupAdd').classList.remove('active')
    document.querySelector('#objPopupSave').classList.add('active')
  }

  if (e.target.closest('.overlay__content-header-close')) {
    e.preventDefault()
    e.target.closest('.overlay').classList.remove('active')
  }
})



document.addEventListener('click', e => {
  if (e.target.closest('#objBtnSave')) {
    e.preventDefault()
    document.querySelector('#objPopupSave').classList.add('active')
  }

  if (e.target.closest('#objPopupSave2')) {
    e.preventDefault()
    document.querySelector('#objPopupSave').classList.remove('active')
    document.querySelector('#objPopupAdd').classList.add('active')
  }

  if (e.target.closest('#objPopupBack')) {
    e.preventDefault()
    document.querySelector('#objPopupAdd').classList.remove('active')
    document.querySelector('#objPopupSave').classList.add('active')
  }

  if (e.target.closest('.overlay__content-header-close')) {
    e.preventDefault()
    e.target.closest('.overlay').classList.remove('active')
  }
})

const overlay2Form = document.querySelector('.overlay__content-f')
if (overlay2Form) {
  overlay2Form.addEventListener('submit', e => {
    let valid = true
    overlay2Form.querySelectorAll('input, textarea').forEach(input => {
      if (!input.value.trim()) {
        input.classList.add('invalid')
        valid = false
      } else {
        input.classList.remove('invalid')
      }
    })
    if (!valid) e.preventDefault()
  })
}

const aboutLinks = document.querySelectorAll('.about__main-link[data-popup]')
const aboutBgs = document.querySelectorAll('.about__bg')
if (aboutLinks.length && aboutBgs.length) {
  aboutLinks.forEach(link => {
    link.addEventListener('mouseenter', () => {
      if (link.dataset.popup === 'objects') {
        aboutBgs[0].style.opacity = '1'
        aboutBgs[1].style.opacity = '0'
      } else if (link.dataset.popup === 'design') {
        aboutBgs[0].style.opacity = '0'
        aboutBgs[1].style.opacity = '1'
      }
    })
    link.addEventListener('mouseleave', () => {
      aboutBgs[0].style.opacity = '0'
      aboutBgs[1].style.opacity = '0'
    })
    link.addEventListener('focus', () => {
      if (link.dataset.popup === 'objects') {
        aboutBgs[0].style.opacity = '1'
        aboutBgs[1].style.opacity = '0'
      } else if (link.dataset.popup === 'design') {
        aboutBgs[0].style.opacity = '0'
        aboutBgs[1].style.opacity = '1'
      }
    })
    link.addEventListener('blur', () => {
      aboutBgs[0].style.opacity = '0'
      aboutBgs[1].style.opacity = '0'
    })
  })
}

document.addEventListener('DOMContentLoaded', () => {
  const phoneInputs = document.querySelectorAll('input[type=\'tel\']')
  const isMobile = window.matchMedia('(max-width: 767px)').matches

  phoneInputs.forEach(phoneInput => {
    if (isMobile) {
      phoneInput.addEventListener('input', () => {
        const digits = phoneInput.value.replace(/\D/g, '')
        if (!digits) {
          phoneInput.value = ''
          return
        }
        phoneInput.value = `+${digits}`
      })
      return
    }

    const phoneInputInstance = window.intlTelInput(phoneInput, {
      initialCountry: 'gb',
      preferredCountries: ['cy', 'gb', 'us', 'ae', 'de', 'fr', 'be', 'it', 'nl', 'at', 'ch', 'es', 'dk', 'se'],
      allowDropdown: true,
      separateDialCode: true,
      dropdownContainer: phoneInput.closest('.form__group')
    })

    let mask

    const updateMask = () => {
      const countryData = phoneInputInstance.getSelectedCountryData()

      if (!countryData || !countryData.dialCode) {
        return
      }

      if (mask) {
        mask.destroy()
      }

      const dialCode = countryData.dialCode

      mask = IMask(phoneInput, {
        mask: `+${dialCode} (000) 000 - 00 - 00`,
        lazy: false
      })
    }

    phoneInputInstance.promise.then(() => {
      updateMask()
      phoneInput.addEventListener('countrychange', updateMask)
    }).catch(error => {
      console.error(error)
    })
  })
})

document.addEventListener('click', e => {
  const delBtn = e.target.closest('.bag__wrapper-items-item-info-del')
  if (delBtn) {
    e.preventDefault()
    const item = delBtn.closest('.bag__wrapper-items-item')
    const popup = item?.querySelector('.bag__wrapper-items-item-popup')
    document.querySelectorAll('.bag__wrapper-items-item-popup.active').forEach(p => p.classList.remove('active'))
    popup?.classList.add('active')
    return
  }

  const closeBtn = e.target.closest('.bag__wrapper-items-item-popup-btns-btn.close')
  if (closeBtn) {
    e.preventDefault()
    closeBtn.closest('.bag__wrapper-items-item-popup')?.classList.remove('active')
    return
  }

  const confirmBtn = e.target.closest('.bag__wrapper-items-item-popup-btns-btn.delete')
  if (confirmBtn) {
    e.preventDefault()
    const item = confirmBtn.closest('.bag__wrapper-items-item')
    item?.remove()
    document.querySelectorAll('.bag__wrapper-items-item-popup.active').forEach(p => p.classList.remove('active'))
    const recalc = () => {
      let total = 0
      document.querySelectorAll('.bag__wrapper-items-item-info-w').forEach(it => {
        const priceEl = it.querySelector('.bag__wrapper-items-item-info-price')
        const quantityEl = it.querySelector('.bag__wrapper-items-item-info-calc p')
        if (!priceEl || !quantityEl) return
        const price = parseFloat(priceEl.textContent.replace('€', '').replace(/\s/g, '').replace(',', '.'))
        const quantity = parseInt(quantityEl.textContent, 10)
        if (!isNaN(price) && !isNaN(quantity)) total += price * quantity
      })
      const totalEl = document.querySelector('.bag__wrapper-total')
      if (totalEl) totalEl.textContent = `€${total.toLocaleString('fr-FR')}`
    }
    recalc()
    return
  }

  const opened = document.querySelector('.bag__wrapper-items-item-popup.active')
  if (opened && !opened.contains(e.target) && !e.target.closest('.bag__wrapper-items-item-info-del')) {
    opened.classList.remove('active')
  }
})