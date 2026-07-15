const infoName = document.querySelector('.obj__info-info-w-name')
const infoBtns = Array.from(document.querySelectorAll('.obj__info-info-w-btn'))
const slider = document.querySelector('.obj__info-slider')
const sliderBtns = document.querySelector('.obj__info-slider-btns')

let moved = false
let nameRect, btnRects, btnsRect, btnsStart = {}
let sliderBtnsClone = null
let placeholder = null
let btnsToHide = []
let closeBtnEl = null

const getRemSize = () => {
  const fs = getComputedStyle(document.documentElement).fontSize
  const n = parseFloat(fs)
  return Number.isFinite(n) && n > 0 ? n : 10
}

const pxToRem = px => `${px / getRemSize()}rem`

const TRANSITION = '0.8s cubic-bezier(.4,0,.2,1)'

const fullBtn = document.querySelector('.obj__info-slider-full')
if (fullBtn) {
  fullBtn.addEventListener('click', e => {
    if (window.innerWidth <= 768) return
    e.stopPropagation()
    if (slider.classList.contains('fullscreen') || moved) return

    moved = false
    sliderBtnsClone = null
    placeholder = null
    btnsToHide = []
    closeBtnEl = null

    slider.style.transition = ''
    slider.style.position = ''
    slider.style.left = ''
    slider.style.top = ''
    slider.style.width = ''
    slider.style.height = ''
    slider.style.zIndex = ''
    slider.style.background = ''

    if (infoBtns.length) {
      infoBtns.forEach(btn => {
        btn.style.transition = ''
        btn.style.transform = ''
        btn.style.position = ''
        btn.style.left = ''
        btn.style.right = ''
        btn.style.top = ''
        btn.style.bottom = ''
        btn.style.zIndex = ''
        btn.style.width = ''
      })
    }
    if (infoName) {
      infoName.style.transition = ''
      infoName.style.transform = ''
      infoName.style.position = ''
      infoName.style.left = ''
      infoName.style.right = ''
      infoName.style.top = ''
      infoName.style.bottom = ''
      infoName.style.zIndex = ''
      infoName.style.width = ''
    }

    document.querySelectorAll('.obj__info-slider-img').forEach(block => {
      if (block.resetImageStyles) {
        block.resetImageStyles()
      }
    })

    nameRect = infoName.getBoundingClientRect()
    btnRects = infoBtns.map(btn => btn.getBoundingClientRect())
    btnsRect = sliderBtns?.getBoundingClientRect()
    const rem = getRemSize()
    const leftPaddingPx = 1.6 * rem
    const rightPaddingPx = 1.6 * rem
    const spacingBtnPx = 6.5 * rem
    btnsStart = {
      left: btnsRect.left + window.scrollX,
      top: btnsRect.top + window.scrollY,
      width: btnsRect.width,
      height: btnsRect.height
    }

    const btnsChildren = Array.from(sliderBtns.children)
    const btnsToClone = btnsChildren
    btnsToHide = btnsToClone
    sliderBtnsClone = document.createElement('div')
    sliderBtnsClone.className = sliderBtns.className
    btnsToClone.forEach(el => sliderBtnsClone.appendChild(el.cloneNode(true)))
    sliderBtnsClone.style.position = 'fixed'
    sliderBtnsClone.style.left = `${btnsStart.left}px`
    sliderBtnsClone.style.top = `${btnsStart.top}px`
    sliderBtnsClone.style.width = pxToRem(btnsStart.width)
    sliderBtnsClone.style.height = pxToRem(btnsStart.height)
    sliderBtnsClone.style.zIndex = '1003'
    sliderBtnsClone.style.margin = '0'
    sliderBtnsClone.style.transition = 'none'
    sliderBtnsClone.classList.add('moving-clone')
    document.body.appendChild(sliderBtnsClone)

    const swiper = document.querySelector('.obj__info-slider')?.swiper
    if (swiper) {
      const leftArrow = sliderBtnsClone.querySelector('.obj__info-slider-btns-pagination--left')
      const rightArrow = sliderBtnsClone.querySelector('.obj__info-slider-btns-pagination--right')
      if (leftArrow) {
        leftArrow.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()
          swiper.slidePrev()
        })
      }
      if (rightArrow) {
        rightArrow.addEventListener('click', e => {
          e.preventDefault()
          e.stopPropagation()
          swiper.slideNext()
        })
      }

      const bullets = Array.from(sliderBtnsClone.querySelectorAll('.swiper-pagination-bullet'))
      const setActiveBullet = () => {
        const activeIndex = swiper.realIndex ?? swiper.activeIndex ?? 0
        bullets.forEach((b, i) => b.classList.toggle('swiper-pagination-bullet-active', i === activeIndex))
      }
      if (bullets.length) {
        bullets.forEach((b, i) => {
          b.addEventListener('click', e => {
            e.preventDefault()
            e.stopPropagation()
            if (typeof swiper.slideToLoop === 'function') {
              swiper.slideToLoop(i)
            } else {
              swiper.slideTo(i)
            }
          })
        })
        setActiveBullet()
        swiper.on('slideChange', setActiveBullet)
      }
    }

    sliderBtnsClone.getBoundingClientRect()
    requestAnimationFrame(() => {
      btnsToClone.forEach(el => el.style.visibility = 'hidden')
      sliderBtnsClone.style.transition = `left ${TRANSITION}, top ${TRANSITION}, bottom ${TRANSITION}, width ${TRANSITION}`
      sliderBtnsClone.style.left = pxToRem(leftPaddingPx)
      sliderBtnsClone.style.top = ''
      sliderBtnsClone.style.bottom = pxToRem(16)
      
      const minBtnLeft = btnRects.length ? Math.min(...btnRects.map(r => r.left)) : 0
      const computedWidth = minBtnLeft - leftPaddingPx - spacingBtnPx
      sliderBtnsClone.style.width = pxToRem(computedWidth)
    })

    const btnDeltas = btnRects.map(r => ({
      dx: window.innerWidth - r.right - rightPaddingPx,
      dy: window.innerHeight - r.bottom - 24,
      width: r.width,
      bottom: window.innerHeight - r.bottom - 24
    }))
    const nameDx = window.innerWidth - nameRect.right - 16
    const nameBottomOffset = document.querySelector('.obj.artist') ? 28 : 88
    const nameDy = window.innerHeight - nameRect.bottom - nameBottomOffset

    if (infoBtns.length) {
      infoBtns.forEach((btn, i) => {
        const d = btnDeltas[i] || btnDeltas[0]
        btn.style.transition = `transform ${TRANSITION}`
        btn.style.transform = `translate(${pxToRem(d.dx)}, ${pxToRem(d.dy)})`
        btn.style.zIndex = '1001'
        btn.style.width = pxToRem(d.width)
      })
    }
    if (infoName) {
      infoName.style.transition = `transform ${TRANSITION}`
      infoName.style.transform = `translate(${pxToRem(nameDx)}, ${pxToRem(nameDy)})`
      infoName.style.zIndex = '1002'
      infoName.style.width = pxToRem(nameRect.width)
    }

    setTimeout(() => {
      if (sliderBtnsClone) {
        const minBtnLeft2 = btnRects.length ? Math.min(...btnRects.map(r => r.left)) : 0
        const computedWidth = minBtnLeft2 - leftPaddingPx - spacingBtnPx

        sliderBtnsClone.style.transition = ''
        sliderBtnsClone.style.left = pxToRem(leftPaddingPx)
        sliderBtnsClone.style.top = ''
        sliderBtnsClone.style.bottom = pxToRem(16)
        sliderBtnsClone.style.position = 'fixed'
        sliderBtnsClone.style.zIndex = '1003'
        sliderBtnsClone.style.width = pxToRem(computedWidth)
        sliderBtnsClone.style.height = pxToRem(btnsRect.height)
      }
      if (infoBtns.length) {
        infoBtns.forEach((btn, i) => {
          const r = btnRects[i] || btnRects[0]
          btn.style.transition = ''
          btn.style.transform = ''
          btn.style.position = 'fixed'
          btn.style.right = pxToRem(rightPaddingPx)
          btn.style.left = ''
          btn.style.bottom = pxToRem(24)
          btn.style.zIndex = '1001'
          btn.style.width = pxToRem(r.width)
        })
      }
      if (infoName) {
        infoName.style.transition = ''
        infoName.style.transform = ''
        infoName.style.position = 'fixed'
        infoName.style.right = pxToRem(16)
        infoName.style.left = ''
        infoName.style.bottom = pxToRem(nameBottomOffset)
        infoName.style.zIndex = '1002'
        infoName.style.width = pxToRem(nameRect.width)
      }
    }, 800)
    moved = true
    const style = getComputedStyle(slider)
    const rect = slider.getBoundingClientRect()
    placeholder = document.createElement('div')
    placeholder.style.width = style.width
    placeholder.style.height = style.height === 'auto' ? rect.height + 'px' : style.height
    placeholder.style.display = style.display
    placeholder.style.margin = style.margin
    placeholder.style.boxSizing = style.boxSizing
    placeholder.style.padding = style.padding
    placeholder.style.border = style.border
    placeholder.style.minWidth = style.minWidth
    placeholder.style.maxWidth = style.maxWidth
    placeholder.style.minHeight = style.minHeight
    placeholder.style.maxHeight = style.maxHeight
    placeholder.style.flexShrink = '0'
    placeholder.style.flexBasis = style.flexBasis
    placeholder.style.alignSelf = style.alignSelf
    placeholder.style.order = style.order
    placeholder.style.float = style.float
    placeholder.style.verticalAlign = style.verticalAlign
    placeholder.style.gap = style.gap
    placeholder.style.transition = 'none'
    slider.parentNode.insertBefore(placeholder, slider)

    slider.style.position = 'fixed'
    slider.style.left = 0
    slider.style.top = 0
    slider.style.width = '100vw'
    slider.style.height = rect.height + 'px'
    slider.style.zIndex = 4
    slider.style.background = '#fff'
    slider.style.transition = `all ${TRANSITION}`
    document.body.style.overflow = 'hidden'
    requestAnimationFrame(() => {
      slider.style.height = '100vh'
    })
    slider.classList.add('fullscreen')
    document.querySelector('.header')?.classList.add('none-w')
    infoName?.classList.add('fullscreen')

    if (closeBtnEl) closeBtnEl.remove()
    closeBtnEl = document.createElement('div')
    closeBtnEl.className = 'obj__info-slider-close'
    closeBtnEl.innerHTML = '<svg class="obj__info-slider-close" viewBox="0 0 12 12"><use xlink:href="img/sprite.svg#plus"></use></svg>'
    document.body.appendChild(closeBtnEl)

    const exitFullscreen = () => {
      if (!slider.classList.contains('fullscreen')) return
      closeBtnEl?.remove()
      closeBtnEl = null
      document.body.style.overflow = ''
      document.querySelector('.header')?.classList.remove('none-w')
      infoName?.classList.remove('fullscreen')

      btnsToHide.forEach(el => el.style.visibility = '')
      btnsToHide = []
      sliderBtnsClone?.remove()
      sliderBtnsClone = null

      if (placeholder && placeholder.parentNode) {
        placeholder.replaceWith(slider)
      }
      placeholder = null

      slider.style.transition = ''
      slider.style.position = ''
      slider.style.left = ''
      slider.style.top = ''
      slider.style.width = ''
      slider.style.height = ''
      slider.style.zIndex = ''
      slider.style.background = ''
      slider.classList.remove('fullscreen')

      if (infoBtns.length) {
        infoBtns.forEach(btn => {
          btn.removeAttribute('style')
          btn.style.transition = ''
          btn.style.transform = ''
          btn.style.position = ''
          btn.style.left = ''
          btn.style.right = ''
          btn.style.top = ''
          btn.style.bottom = ''
          btn.style.zIndex = ''
          btn.style.width = ''
        })
      }
      if (infoName) {
        infoName.removeAttribute('style')
        infoName.style.transition = ''
        infoName.style.transform = ''
        infoName.style.position = ''
        infoName.style.left = ''
        infoName.style.right = ''
        infoName.style.top = ''
        infoName.style.bottom = ''
        infoName.style.zIndex = ''
        infoName.style.width = ''
      }

      document.querySelectorAll('.obj__info-slider-img').forEach(block => {
        if (block.resetImageStyles) {
          block.resetImageStyles()
        }
        const img = block.querySelector('img')
        if (img) {
          img.removeAttribute('style')
        }
      })
      
      
      moved = false
    }

    closeBtnEl.addEventListener('click', e => {
      e.stopPropagation()
      exitFullscreen()
    })
  })
}

document.querySelectorAll('.obj__info-slider-img').forEach(block => {
  const img = block.querySelector('img')
  if (!img) return
  const slider = document.querySelector('.obj__info-slider')
  if (!slider) return
  let rafId = null
  let targetTranslateY = 0
  let lastAppliedTranslateY = NaN
  let stylesApplied = false
  let rectTop = 0
  let rectHeight = 0
  let maxOffsetYCached = 0
  let metricsReady = false

  const updateMetrics = () => {
    const rect = block.getBoundingClientRect()
    rectTop = rect.top
    rectHeight = rect.height
    if (img.naturalHeight > 0 && img.naturalWidth > 0) {
      const imgRect = img.getBoundingClientRect()
      const scaledImgHeight = img.naturalHeight * (imgRect.width / img.naturalWidth)
      maxOffsetYCached = Math.max(0, scaledImgHeight - rect.height)
    } else {
      maxOffsetYCached = 0
    }
    metricsReady = true
  }

  img.addEventListener('load', () => {
    img.style.transform = ''
    img.style.transition = 'transform 0.7s linear'
    metricsReady = false
    updateMetrics()
  })

  const resetImageStyles = () => {
    stylesApplied = false
    metricsReady = false
    img.style.transform = ''
    img.style.transition = ''
    img.style.objectFit = ''
    img.style.width = ''
    img.style.height = ''
    img.style.willChange = ''
  }

  block.resetImageStyles = resetImageStyles

  const handleMouseMove = e => {
    if (window.innerWidth <= 768) return
    if (!slider.classList.contains('fullscreen')) return
    if (!stylesApplied) {
      requestAnimationFrame(() => {
        img.style.objectFit = 'cover'
        img.style.width = '100%'
        img.style.height = 'auto'
        img.style.willChange = 'transform'
        img.style.transition = ''
        stylesApplied = true
        updateMetrics()
      })
    }

    if (!metricsReady) {
      updateMetrics()
    }
    const y = e.clientY - rectTop
    const percentY = Math.min(1, Math.max(0, y / rectHeight))

    if (img.naturalHeight === 0 || img.naturalWidth === 0) return
    const maxOffsetY = maxOffsetYCached
    if (maxOffsetY <= 0) {
      targetTranslateY = 0
      if (!rafId) {
        rafId = requestAnimationFrame(() => {
          img.style.transform = ''
          lastAppliedTranslateY = 0
          rafId = null
        })
      }
      return
    }

    targetTranslateY = -maxOffsetY * percentY
    if (!rafId) {
      rafId = requestAnimationFrame(() => {
        if (!Number.isFinite(lastAppliedTranslateY) || Math.abs(targetTranslateY - lastAppliedTranslateY) >= 0.1) {
          img.style.transform = `translate3d(0, ${targetTranslateY}px, 0)`
          lastAppliedTranslateY = targetTranslateY
        }
        rafId = null
      })
    }
  }

  const handleMouseLeave = () => {
    if (window.innerWidth <= 768) return
    if (!slider.classList.contains('fullscreen')) return
    if (rafId) cancelAnimationFrame(rafId)
    rafId = null
    img.style.transition = ''
  }

  block.addEventListener('mousemove', handleMouseMove, { passive: true })
  block.addEventListener('mouseleave', handleMouseLeave)

  window.addEventListener('resize', () => {
    if (window.innerWidth <= 768) return
    if (!slider.classList.contains('fullscreen')) return
    metricsReady = false
    updateMetrics()
  })

  block.addEventListener('click', e => {
    if (window.innerWidth <= 768) return
    if (!slider.classList.contains('fullscreen')) return
    const swiper = document.querySelector('.obj__info-slider')?.swiper
    if (!swiper) return
    const rect = block.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    const percentX = x / rect.width
    const percentY = y / rect.height
    if (percentX < 0.2) {
      swiper.slidePrev()
    } else if (percentX > 0.8) {
      swiper.slideNext()
    }
  })
})

if (slider && slider.swiper) {
  slider.swiper.on('slideChange', () => {
    document.querySelectorAll('.obj__info-slider-img img').forEach(img => {
      img.style.transform = ''
      img.style.transition = 'transform 0.7s linear'
      img.style.willChange = ''
      img.style.objectFit = ''
      img.style.width = ''
      img.style.height = ''
    })
  })
}

if (window.innerWidth <= 768) {
  const mobileSlider = document.querySelector('.obj__info-slider')
  if (mobileSlider) {
    const mobileSwiper = new Swiper('.obj__info-slider', {
      slidesPerView: 1,
      slidesPerGroup: 1,
      loop: true,
      navigation: {
        nextEl: '.obj__info-slider-btns-arrows .next, .obj__info-slider-arrows .next',
        prevEl: '.obj__info-slider-btns-arrows .prev, .obj__info-slider-arrows .prev'
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
        const active = mobileSwiper.realIndex
        bullets.forEach((el, i) => {
          el.classList.toggle('swiper-pagination-bullet-active', i === active)
          el.setAttribute('aria-current', i === active ? 'true' : 'false')
        })
      })
    }
    mobileSwiper.on('slideChange', syncPagination)
    mobileSwiper.on('slideChangeTransitionEnd', syncPagination)
    syncPagination()

    const slides = mobileSlider.querySelectorAll('.swiper-slide img')
    const items = []
    
    slides.forEach((img, index) => {
      items.push({
        src: img.src,
        title: `Slide ${index + 1}`
      })
    })

    const openFancybox = () => {
      $.fancybox.open(items, {
        index: mobileSwiper.realIndex,
        loop: true,
        buttons: [],
        animationEffect: 'fade',
        transitionEffect: 'slide',
        touch: {
          vertical: true,
          momentum: true
        },
        mobile: {
          clickContent: 'close',
          clickSlide: 'close'
        },
        arrows: false,
        infobar: false,
        toolbar: false,
        clickContent: false,
        clickSlide: false,
        beforeShow: function() {
          const oldArrows = document.querySelectorAll('.fancybox-custom-arrows-wrapper')
          oldArrows.forEach(arrow => arrow.remove())
          
          const oldCloseBtn = document.querySelectorAll('.fancybox-custom-close')
          oldCloseBtn.forEach(btn => btn.remove())
          
          const oldPagination = document.querySelectorAll('.fancybox-custom-pagination')
          oldPagination.forEach(pag => pag.remove())
          
          const closeBtn = document.createElement('div')
          closeBtn.className = 'fancybox-custom-close'
          closeBtn.innerHTML = '<svg class="close" viewBox="0 0 12 12"><use xlink:href="img/sprite.svg#plus"></use></svg>'
          
          closeBtn.addEventListener('click', () => {
            $.fancybox.close()
          })
          
          document.querySelector('.fancybox-container').appendChild(closeBtn)
          
          const pagination = document.createElement('div')
          pagination.className = 'fancybox-custom-pagination'
          
          const totalSlides = items.length
          for (let i = 0; i < totalSlides; i++) {
            const bullet = document.createElement('span')
            bullet.className = 'fancybox-pagination-bullet'
            bullet.setAttribute('data-index', i)
            bullet.addEventListener('click', () => {
              $.fancybox.getInstance().jumpTo(i)
            })
            pagination.appendChild(bullet)
          }
          
          document.querySelector('.fancybox-container').appendChild(pagination)
          
          const updatePagination = (event, instance) => {
            const currentIndex = instance.currIndex
            const bullets = pagination.querySelectorAll('.fancybox-pagination-bullet')
            bullets.forEach((bullet, index) => {
              bullet.classList.toggle('active', index === currentIndex)
            })
          }
          
          setTimeout(() => {
            const instance = $.fancybox.getInstance()
            if (instance) {
              updatePagination(null, instance)
            }
          }, 100)
          
          $(document).on('afterShow.fb', updatePagination)
          
          $(document).on('beforeClose.fb', () => {
            $(document).off('afterShow.fb', updatePagination)
          })
        }
      })
    }
    
    mobileSlider.addEventListener('click', (e) => {
      if (e.target.tagName === 'IMG') {
        openFancybox()
      }
    })
    
    const fullscreenBtn = document.querySelector('.obj__info-slider-full')
    if (fullscreenBtn) {
      fullscreenBtn.addEventListener('click', (e) => {
        e.stopPropagation()
        openFancybox()
      })
    }
  }
} 