document.addEventListener('DOMContentLoaded', function () {
  const cookies = document.querySelectorAll('.cookie')
  let startY = 0
  let currentY = 0

  cookies.forEach(cookie => {
    const cookieBtns = cookie.querySelectorAll('.btn-black')
    
    cookieBtns.forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault()
        cookie.style.display = 'none'
      })
    })

    cookie.addEventListener('touchstart', (e) => {
      startY = e.touches[0].clientY
    })

    cookie.addEventListener('touchmove', (e) => {
      currentY = e.touches[0].clientY
      const diff = currentY - startY
      
      if (diff > 50) {
        cookie.style.display = 'none'
      }
    })
  })

  document.querySelectorAll('.category:not(.sr) .swiper-container').forEach((container) => {
    const cat = new Swiper(container, {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      spaceBetween: 20,
      // on: {
      //   slideChange() {
      //     const { slides, width, activeIndex } = cat
      //     const slidesInView = Math.floor(width / slides[0].offsetWidth)
      //     const progress = (activeIndex / (slides.length - slidesInView)) * 100
  
      //     const paginationFilled = container.closest('.category').querySelector('.vacancy__slider-pagination-filled')
      //     if (paginationFilled) {
      //       paginationFilled.style.width = `${progress}%`
      //     }
      //   }
      // }
    })
  })

  function initLinkedSwipers(mainSelectors, linkedSelector) {
    const mainSwipers = mainSelectors.map(selector => {
      return new Swiper(selector, {
        slidesPerView: 1,
        slidesPerGroup: 1,
        loop: true,
        effect: 'fade',
        navigation: {
          nextEl: `${selector} .preview__sliders-nav .next`,
          prevEl: `${selector} .preview__sliders-nav .prev`,
        },
      })
    })

    const linkedSwiper = new Swiper(linkedSelector, {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      speed: 400,
      loop: true,
      effect: 'fade',
    })

    mainSwipers.forEach(swiper => {
      swiper.on('slideChange', () => {
        const activeIndex = swiper.realIndex
        linkedSwiper.slideToLoop(activeIndex)
      })
    })
  }

  initLinkedSwipers(
    ['.preview__sliders-01.swiper-container', '.preview__sliders-02.swiper-container', '.preview__sliders-03.swiper-container'], 
    '.preview__sliders-04.swiper-container'
  )

  new Swiper('.case-slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    effect: 'fade',
    loop: true,
    navigation: {
      nextEl: '.case-slider .slider-nav .next',
      prevEl: '.case-slider .slider-nav .prev',
    },
  })

  new Swiper('.case-slider .img-slide .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    speed: 400,
    effect: 'fade',
    loop: true,
    navigation: {
      nextEl: '.case-slider .slider-nav .next',
      prevEl: '.case-slider .slider-nav .prev',
    },
  })

  document.querySelectorAll('.service__block-wrapper-r .swiper-container').forEach(slider => {
    const sliderWrapper = slider.closest('.service__block-wrapper-r')

    new Swiper(slider, {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      speed: 400,
      effect: 'fade',
      loop: true,
      navigation: {
        nextEl: sliderWrapper.querySelector('.next'),
        prevEl: sliderWrapper.querySelector('.prev'),
      },
    })
  })

  if (window.innerWidth < 730) {
    new Swiper('.case-tab .swiper-container', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      pagination: {
        el: '.case-tab-pagination',
        clickable: true,
      }
    })

    new Swiper('.sr__cards.sr .swiper-container', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
    })
  }

  
  
  const burger = document.querySelector('.burger'),
        menu = document.querySelector('.menu'),
        videoSections = document.querySelectorAll('.case-video'),
        videoAmbassador = document.querySelectorAll('.ambassador__wrapper-video'),
        advantages = document.querySelector('.advantages__wrapper'),
        sliderW = document.querySelectorAll('.vacancy__slider'),
        tagsWrapper = document.querySelector('.vacancy__tags'),
        tags = document.querySelectorAll('.vacancy__tags span'),
        navBtns = document.querySelectorAll('.nav span'),
        line = document.querySelector('.abt__line-wrapper'),
        nav = document.querySelector('.nav'),
        images = document.querySelectorAll('.about__wrapper.desk img'),
        tabSr = document.querySelectorAll('.service__btns-wrapper span'),
        loc = document.querySelector('.location__wrapper-map-info-dropdown '),
        abtImg = document.querySelector('.abt__line-img')
        
  burger.addEventListener('click', () => {
    burger.classList.toggle('active')
    menu.classList.toggle('active')
  })

  if (loc) {
    loc.addEventListener('click', () => {
      loc.classList.toggle('active')
    })
  }

  if (tabSr){
    tabSr.forEach((item) => {
      item.addEventListener('click', () => {
        tabSr.forEach((el) => el.classList.remove('active'))
        item.classList.add('active')
      })
    })
  }

  if (images) {
    let lastImages = new Set()
    let hideTimeout
  
    images.forEach(img => {
      img.addEventListener('mouseenter', () => {
        img.style.opacity = '1'
        lastImages.add(img)
  
        if (lastImages.size > 9) {
          lastImages.delete([...lastImages][0])
        }
      })
  
      img.addEventListener('mouseleave', () => {
        if (!lastImages.has(img)) {
          img.style.opacity = '0'
        }
      })
    })
  
    document.addEventListener('mousemove', () => {
      clearTimeout(hideTimeout)
  
      hideTimeout = setTimeout(() => {
        images.forEach(img => {
          if (!lastImages.has(img)) {
            img.style.opacity = '0'
          }
        })
      }, 0)
    })
  }

  if  (nav) {
    const placeholder = document.querySelector('.nav-placeholder')
    const navHeight = nav.offsetHeight
    const navTop = nav.offsetTop

    window.addEventListener('scroll', () => {
      if (window.scrollY >= navTop) {
        nav.classList.add('fixed')
        placeholder.style.height = `${navHeight}px`
      } else {
        nav.classList.remove('fixed')
        placeholder.style.height = '0px'
      }
    })
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

  if (nav) {
    addDragScrollListeners(nav)
  }

  if (abtImg) {
    addDragScrollListeners(abtImg)
  }

  document.querySelectorAll('[data-scroll]').forEach(function(element) {
    element.addEventListener('click', function(event) {
      event.preventDefault()

      const blockId = this.getAttribute('data-scroll')
      const headerOffset = document.querySelector('.your-header-class')?.offsetHeight || 70
      const blockElement = document.querySelector(blockId)

      if (blockElement) {
        const blockOffset = blockElement.getBoundingClientRect().top + window.pageYOffset - headerOffset

        window.scrollTo({
          top: blockOffset,
          behavior: 'smooth'
        })
      }
    })
  })

  window.addEventListener('scroll', function() {
    const elements = document.querySelectorAll('[data-scroll]')
    const headerOffset = document.querySelector('.your-header-class')?.offsetHeight || 70
    let activeElement = null

    elements.forEach(function(el) {
        const targetId = el.getAttribute('data-scroll')
        const targetElement = document.querySelector(targetId)

        if (targetElement) {
          const elementTop = targetElement.getBoundingClientRect().top - headerOffset

          if (elementTop <= 10 && elementTop >= -targetElement.offsetHeight / 2) {
            activeElement = el
          }
        }
    })

    if (activeElement) {
      elements.forEach(el => el.classList.remove('active'))
      activeElement.classList.add('active')

      activeElement.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' })
    }
  })

  sliderW.forEach(slider => {
    addDragScrollListeners(slider)
  })

  if (tagsWrapper) {
    addDragScrollListeners(tagsWrapper)
  }

  if (line) {
    addDragScrollListeners(line)
  }


  if (tags) {
    tags.forEach(tag => {
      tag.addEventListener('click', function () {
        tags.forEach(el => {
          if (el.classList.contains('active')) {
            el.classList.remove('active')
          }
        })
        this.classList.add('active')
  
        const targetId = this.dataset.swiper?.substring(1)
        if (!targetId) return
  
        const target = document.querySelector(`.vacancy__slider #${targetId}`)
        if (target) {
          target.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          })
        }
      })
    })
  }
  
  const checkActiveButton = () => {
    const slides = document.querySelectorAll('.vacancy__slider .swiper-slide')
    const buttons = document.querySelectorAll('.vacancy__tags span')
    let activeSlideId = null
  
    slides.forEach((slide) => {
      const rect = slide.getBoundingClientRect()
      if (rect.left <= window.innerWidth / 2 && rect.right >= window.innerWidth / 2) {
        activeSlideId = slide.id
      }
    })
  
    buttons.forEach((button) => {
      const targetId = button.dataset.swiper?.substring(1)
      if (targetId === activeSlideId) {
        if (!button.classList.contains('active')) {
          button.classList.add('active')
          button.scrollIntoView({
            behavior: 'smooth',
            block: 'nearest',
            inline: 'center'
          })
        }
      } else {
        if (button.classList.contains('active')) {
          button.classList.remove('active')
        }
      }
    })
  }

  document.querySelector('.vacancy__slider').addEventListener('scroll', checkActiveButton)
  

  // if (navBtns){
  //   navBtns.forEach((navBtn) => {
  //     navBtn.addEventListener('click', () => {
  //       navBtns.forEach((el) => el.classList.remove('active'))
  //       navBtn.classList.add('active')
  //     })
  //   })
  // }

  function handleVideoPlay(section) {
    const playButton = section.querySelector('.case-video__wrapper-play')
    const video = section.querySelector('video')
    const iframe = section.querySelector('iframe')

    if (playButton){
      playButton.addEventListener('click', function() {
        if (video) {
          video.play()
          video.setAttribute('controls', '')
        } else if (iframe) {
          const src = iframe.src;
          if (!src.includes('autoplay')) {
            iframe.src = src.includes('?') ? `${src}&autoplay=1` : `${src}?autoplay=1`
          }
        }
        playButton.classList.add('hidden')
      })
    }
  }
  
  videoAmbassador.forEach(section => {
    handleVideoPlay(section)
  })
  
  videoSections.forEach(section => {
    handleVideoPlay(section)
  })

  const observer = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      entry.target.classList.toggle('anim-show', entry.isIntersecting)
    })
  }, { threshold: 0.15 })
  
  document.querySelectorAll('.anim').forEach(elm => observer.observe(elm))

  const marquees = document.querySelectorAll('.marquee')
  
  marquees.forEach((marqueeContent, index) => {
    const previewLine = marqueeContent.querySelector('.marquee__content')
    
    let dynamicStyle = document.createElement('style')
    document.head.appendChild(dynamicStyle)
  
    function updateMarqueeAnimation() {
      setTimeout(() => {
        const previewWidth = previewLine.offsetWidth
   
        if (previewWidth === 0) {
          return
        }
  
        const animationDuration = (previewWidth * 1) / 100
        const animationName = `marqueeAnimation${index}`

        dynamicStyle.innerHTML += `
          @keyframes ${animationName} {
            0% {
              transform: translateX(0)
            }
            100% {
              transform: translateX(-${previewWidth}px)
            }
          }
        `

        marqueeContent.style.animation = `${animationName} ${animationDuration}s linear infinite`
      }, 100)
    }
  
    updateMarqueeAnimation()
  
    window.addEventListener('resize', () => {
      updateMarqueeAnimation()
    })
  })

  // const caseNav = document.querySelector('.case__nav')

  // if (caseNav) {
  //   const caseNavOffsetTop = caseNav.offsetTop

  //   window.addEventListener('scroll', () => {
  //     if (window.scrollY >= caseNavOffsetTop) {
  //       caseNav.classList.add('fixed')
  //     } 
  //     else {
  //       caseNav.classList.remove('fixed')
  //     }
  //   })
  // }
  

  document.querySelectorAll('.service__btns-wrapper span').forEach(span => {
    span.addEventListener('click', function() {
      document.querySelectorAll('.service__btns-wrapper span').forEach(s => s.classList.remove('active'))
      this.classList.add('active')
  
      let sectionId = this.getAttribute('data-section')
  
      document.querySelectorAll('[section-id]').forEach(div => {
        div.style.display = 'none'
      })
  
      document.querySelector(`[section-id='${sectionId}']`).style.display = 'block'
    })
  })

  const sliders = document.querySelectorAll('.sl')

  sliders.forEach(slider => {
    const sliderWrapper = slider.querySelector('.vacancy__slider')
    const scrollbar = slider.querySelector('.custom-scrollbar')
    const thumb = slider.querySelector('.custom-scrollbar-thumb')

    function syncThumbPosition() {
      const scrollPercentage = sliderWrapper.scrollLeft / (sliderWrapper.scrollWidth - sliderWrapper.clientWidth)
      const thumbMaxOffset = scrollbar.clientWidth - thumb.clientWidth
      thumb.style.left = `${scrollPercentage * thumbMaxOffset}px`
    }

    sliderWrapper.addEventListener('scroll', syncThumbPosition)

    thumb.addEventListener('mousedown', (e) => {
      const startX = e.clientX
      const thumbStartLeft = thumb.offsetLeft

      function onMouseMove(e) {
        const deltaX = e.clientX - startX
        const newLeft = Math.min(Math.max(0, thumbStartLeft + deltaX), scrollbar.clientWidth - thumb.clientWidth)
        const scrollPercentage = newLeft / (scrollbar.clientWidth - thumb.clientWidth)
        sliderWrapper.scrollLeft = scrollPercentage * (sliderWrapper.scrollWidth - sliderWrapper.clientWidth)
      }

      function onMouseUp() {
        document.removeEventListener('mousemove', onMouseMove)
        document.removeEventListener('mouseup', onMouseUp)
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    })
  })

  const videoWrapper = document.querySelector('.ambassador__wrapper-video')

  if (videoWrapper) {
    const video = videoWrapper.querySelector('.ambassador__wrapper-video video')
    const playButton = videoWrapper.querySelector('.ambassador__wrapper-video-play img')
    const progressBar = videoWrapper.querySelector('.progress-bar')
    
    video.addEventListener('timeupdate', function () {
      const percent = (video.currentTime / video.duration) * 314
      progressBar.style.strokeDashoffset = 314 - percent
    });
    
    playButton.addEventListener('click', function () {
      if (video.paused || video.ended) {
        video.play()
        playButton.src = 'img/pause.svg'
      } else {
        video.pause()
        playButton.src = 'img/play.svg'
      }
    })
  }

  const ambsdrT = document.querySelectorAll('.ambsdr .about__info-title')

  if (ambsdrT.length > 0) {
    let index = 0
    
    function changeTitle() {
      if (ambsdrT[index]) {
        ambsdrT[index].style.opacity = 0;
        setTimeout(() => {
          ambsdrT[index].style.display = 'none'
          index = (index + 1) % ambsdrT.length
          ambsdrT[index].style.display = 'block'
      
          setTimeout(() => {
            ambsdrT[index].style.opacity = 1
          }, 50)
        }, 1000)
      }
    }
  
    ambsdrT[index].style.display = 'block'
    ambsdrT[index].style.opacity = 1

    setInterval(changeTitle, 3000)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const forms = document.querySelectorAll('.form')

  forms.forEach(form => {
    let currentStep = 0
    const inputs = form.querySelectorAll('.input-field')
    const formWrapper = form.querySelector('.form__wrapper-form')
    const nextButton = form.querySelector('.form__wrapper-form-bottom-next')
    const infoData = form.querySelector('.form__wrapper-info-data')
    const countText = form.querySelector('.form__wrapper-form-bottom-count')
    const progressBar = form.querySelector('.form__wrapper-form-progress span')
    const doneBlock = form.querySelector('.form__wrapper-done')
    const titleM = form.querySelector('.form__wrapper-info-title.m')
    const titleD = form.querySelector('.form__wrapper-info-title.d')
    const bottom = form.querySelector('.form__wrapper-info-bottom')
    const data = form.querySelector('.form__wrapper-info-data')
    const btn = form.querySelector('.form__wrapper-info-btn')
    const subtitle = form.querySelector('.form__wrapper-info-subtitle')
    const text = form.querySelector('.form__wrapper-info-text')
    const back = form.querySelector('.form__wrapper-form-back')
    const dateSpans = form.querySelectorAll('.form__wrapper-form-choose-calendar span.open')
    const timeSpans = form.querySelectorAll('.form__wrapper-form-choose-time span')
    const dateBlock = form.querySelector('.form__wrapper-form-choose.date')
    const timeBlock = form.querySelector('.form__wrapper-form-choose.time')

    if (timeBlock) {
      timeSpans.forEach(span => {
        span.addEventListener('click', function () {
          timeSpans.forEach(s => s.classList.remove('active'))
          span.classList.add('active')
        })
      })
    }
 
    if (dateBlock) {
      dateSpans.forEach(span => {
        span.addEventListener('click', function () {
          dateSpans.forEach(s => s.classList.remove('active'))
          span.classList.add('active')
        })
      })
    }

    function showCurrentStep() {
      inputs.forEach((input, index) => {
        input.classList.add('hide')
        if (index === currentStep) {
          input.classList.remove('hide')
        }
      })

      if (dateBlock) {
        if (currentStep === 2) {
          dateBlock.classList.remove('hide')
        } else {
          dateBlock.classList.add('hide')
        }
      }

      if (timeBlock) {
        if (currentStep === 3) {
          timeBlock.classList.remove('hide')
        } else {
          timeBlock.classList.add('hide')
        }
      }

      updateCountText()
      updateProgressBar()
    }

    function updateCountText() {
      const totalSteps = inputs.length + (dateBlock ? 1 : 0) + (timeBlock ? 1 : 0)
      countText.textContent = `${currentStep + 1} / ${totalSteps}`
    }

    function updateProgressBar() {
      const totalSteps = inputs.length + (dateBlock ? 1 : 0) + (timeBlock ? 1 : 0)
      const progress = ((currentStep + 1) / totalSteps) * 100
      progressBar.style.width = progress + '%'
    }

    function addToInfoData() {
      if (currentStep < inputs.length) {
        const currentInput = inputs[currentStep]
        const inputValue = currentInput.value.trim()

        if (inputValue !== "") {
          const dataItems = Array.from(infoData.getElementsByTagName('p'))
          const isAlreadyAdded = dataItems.some(item => item.textContent === inputValue)

          if (!isAlreadyAdded) {
            const dataItem = document.createElement('p')
            dataItem.textContent = inputValue
            infoData.appendChild(dataItem)
          }
        }
      }

      if (currentStep === 2 && dateBlock) {
        const selectedDate = Array.from(dateSpans).find(span => span.classList.contains('active'))
        if (selectedDate) {
          const dateText = selectedDate.textContent.trim()
          const dateItem = document.createElement('p')
          dateItem.textContent = `${dateText}`
          infoData.appendChild(dateItem)
        }
      }
  
      if (currentStep === 3 && timeBlock) {
        const selectedTime = Array.from(timeSpans).find(span => span.classList.contains('active'))
        if (selectedTime) {
          const timeText = selectedTime.textContent.trim()
          const timeItem = document.createElement('p')
          timeItem.textContent = `${timeText}`
          infoData.appendChild(timeItem)
        }
      }
    }

    nextButton.addEventListener('click', function () {
      if (currentStep < 2) {
        const currentInput = inputs[currentStep]
        if (currentInput.value.trim() === "") {
          return
        }
      }

      subtitle.classList.remove('hide')
      text.classList.add('hide')
      back.classList.remove('hide')

      addToInfoData()

      currentStep++
      const totalSteps = inputs.length + (dateBlock ? 1 : 0) + (timeBlock ? 1 : 0)

      if (currentStep >= totalSteps) {
        currentStep = totalSteps - 1
        formWrapper.classList.add('ok')
        bottom.classList.add('hide')
        btn.style.display = 'flex'
        data.style.display = 'none'
        subtitle.classList.add('hide')
        text.classList.remove('hide')
        titleM.classList.remove('hide')
        titleD.classList.add('hide')
        setTimeout(function () {
          formWrapper.style.display = 'none'
          doneBlock.style.display = 'flex'
        }, 300)
        setTimeout(function () {
          bottom.style.display = 'none'
          btn.classList.remove('hide')
        }, 300)
      }
      showCurrentStep()
    })

    back.addEventListener('click', function () {
      currentStep = 0
      data.style.display = 'block'
      subtitle.classList.add('hide')
      text.classList.remove('hide')
      infoData.innerHTML = ""

      showCurrentStep()
    })

    btn.addEventListener('click', function () {
      currentStep = 0
      formWrapper.style.display = 'flex'
      setTimeout(function () {
        formWrapper.classList.remove('ok')
      }, 300)
      bottom.style.display = 'flex'
      setTimeout(function () {
        bottom.classList.remove('hide')
      }, 300)
      btn.classList.add('hide')
      setTimeout(function () {
        btn.style.display = 'none'
      }, 300)
      data.style.display = 'block'
      subtitle.classList.add('hide')
      text.classList.remove('hide')
      titleM.classList.add('hide')
      titleD.classList.remove('hide')
      doneBlock.style.display = 'none'

      infoData.innerHTML = ""

      showCurrentStep()
    })

    showCurrentStep()
  })
})

document.addEventListener('DOMContentLoaded', function () {
  const wrapper = document.querySelector('.sr__calc-block-wrapper-item-b-line')

  if (wrapper) {
    const resultTitle = document.querySelector('.sr__calc-col-title')
    const options = document.querySelectorAll('.sr__calc-block-wrapper-item-list li')
    const header = document.querySelector('.sr__calc-block-wrapper-item-b-header')
    const firstValue = header.querySelector('p:first-child')
    const lastValue = header.querySelector('p:last-child')
    const span = document.getElementById('draggable')
    const toggleButtons = document.querySelectorAll('.sr__calc-col-header span')

    let isDragging = false
    let startX = 0
    let startLeft = 0
    const maxValue = 50
    const wrapperWidth = wrapper.clientWidth
    let selectedOptions = new Set()
    let displayMode = 'salary'

    function updateResult(value) {
      let baseValue = 2.1
      let multiplier = 1 + selectedOptions.size * 0.1
      let calculatedValue = (baseValue * (1 + value / 100) * multiplier).toFixed(1)

      if (displayMode === 'salary') {
          resultTitle.textContent = `${calculatedValue} оклада`
      } else {
          let percentageValue = (calculatedValue * 8.33).toFixed(1)
          resultTitle.textContent = `${percentageValue} %`
      }

      firstValue.style.display = value === 1 ? 'none' : 'block'
      lastValue.style.display = value === maxValue ? 'none' : 'block'
    }

    function startDrag(e) {
      isDragging = true
      startX = e.touches ? e.touches[0].clientX : e.clientX
      startLeft = span.offsetLeft
      span.style.cursor = 'grabbing'
    }

    function handleMove(e) {
      if (!isDragging) return
      const clientX = e.touches ? e.touches[0].clientX : e.clientX
      const deltaX = clientX - startX
      let newLeft = startLeft + deltaX

      newLeft = Math.max(0, Math.min(newLeft, wrapperWidth - span.offsetWidth))
      const value = Math.round((newLeft / (wrapperWidth - span.offsetWidth)) * (maxValue - 1)) + 1
      span.style.left = `${(newLeft / wrapperWidth) * 100}%`
      span.innerHTML = `&lt; ${value} &gt;`

      updateResult(value)
    }

    function endDrag() {
      isDragging = false
    }

    span.addEventListener('mousedown', startDrag)
    document.addEventListener('mousemove', handleMove)
    document.addEventListener('mouseup', endDrag)

    span.addEventListener('touchstart', startDrag)
    document.addEventListener('touchmove', handleMove)
    document.addEventListener('touchend', endDrag)

    options.forEach((item) => {
      item.addEventListener('click', () => {
        if (item.classList.contains('active')) {
          item.classList.remove('active')
          selectedOptions.delete(item.textContent.trim())
        } else {
          item.classList.add('active')
          selectedOptions.add(item.textContent.trim())
        }
        const currentValue = parseInt(span.textContent.replace(/\D/g, ''), 10) || 0
        updateResult(currentValue)
      })
    })

    toggleButtons.forEach((button) => {
      button.addEventListener('click', () => {
        toggleButtons.forEach((btn) => btn.classList.remove('active'))
        button.classList.add('active')

        displayMode = button.textContent.includes('%') ? 'percentage' : 'salary'
        const currentValue = parseInt(span.textContent.replace(/\D/g, ''), 10) || 0
        updateResult(currentValue)
      })
    })
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const { ScrollObserver, valueAtPercentage } = aat


  const infoContainerT = document.querySelector('.panel.i')
  if (window.innerWidth >= 730) {
    if(infoContainerT) {
      const panelInfo = infoContainerT.querySelectorAll('.info')
      // infoContainerT.style.setProperty('--cards-count', panelInfo.length)

      // if (panelInfo.length > 0) {
      //   infoContainerT.style.setProperty('--card-height', `${panelInfo[0].clientHeight}px`)
      // }

      Array.from(panelInfo).forEach((card, index) => {

        const viewportWidth = window.innerWidth
        const baseValue = 5
        const maxValue = 9.7
      
        const dynamicValue = baseValue + (maxValue - baseValue) * ((viewportWidth - 730) / (1920 - 730))
        const clampedValue = Math.max(baseValue, Math.min(maxValue, dynamicValue))
        
        const offsetTop = 0 + index * clampedValue
        if (index < 3) {
          card.style.paddingTop = `${offsetTop}em`
        }

        if (index === panelInfo.length - 1) {
          return
        }
        const windowHeight = window.innerHeight
        const cardHeight = (windowHeight / 10) - offsetTop
        const wrapper = card.querySelector('.info__wrapper')
        if (wrapper) {
          wrapper.style.height = `${cardHeight}em`
        }
      })
    }
  }

  const prsnContainer = document.querySelector('.panel.a')
  if(prsnContainer){
    const cards = document.querySelectorAll('.prsn')
    // prsnContainer.style.setProperty('--cards-count', cards.length)
    
    if (window.innerWidth >= 550) {
      // let marginBottom = `${55 + (cards.length - 4) * 14}rem`
      // prsnContainer.style.margin = `6.7rem 0 ${marginBottom} 0`
      if (cards.length > 0) {
        prsnContainer.style.setProperty('--card-height', `${cards[0].clientHeight}px`)
      }
    }
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        const card = entry.target
        const index = Array.from(cards).indexOf(card)
    
        if (index === 0) {
          card.style.paddingTop = '0rem';
        } else {
          if (entry.isIntersecting) {
            card.style.paddingTop = '14rem';
          } else {
            card.style.paddingTop = '0rem';
          }
        }
    
        const previousCard = cards[index - 1]
        if (previousCard) {
          previousCard.style.paddingTop = '0rem'
        }
      })
    }, {
      threshold: 0.5
    })
    if (window.innerWidth >= 730) {
      Array.from(cards).forEach((card, index) => {
        const viewportWidth = window.innerWidth
        const baseValue = 11
        const maxValue = 14
      
        const dynamicValue = baseValue + (maxValue - baseValue) * ((viewportWidth - 730) / (1920 - 730))
        const clampedValue = Math.max(baseValue, Math.min(maxValue, dynamicValue))
        
        const offsetTop = 0 + index * clampedValue
        if (index < 3) {
          card.style.paddingTop = `${offsetTop}em`
        }

        if (index === cards.length - 1) {
          return
        }
        const windowHeight = window.innerHeight
        const cardHeight = (windowHeight / 10) - offsetTop
        const wrapper = card.querySelector('.prsn__wrapper')
        if (index < 3) {
          if (wrapper) {
            wrapper.style.height = `${cardHeight}em`
          }
        }

        const nextCard = cards[index + 1]
        const cardInner = card.querySelector('.prsn__wrapper-list')
        const cardInner2 = card.querySelector('.prsn__wrapper-info-info')
        const cardInner3 = card.querySelector('.prsn__wrapper-info-img-info')
        const cardInner4 = card.querySelector('.prsn__wrapper-info-img')
        ScrollObserver.Element(nextCard, {
          offsetTop,
          offsetBottom: window.innerHeight - card.clientHeight
        }).onScroll(({ percentageY }) => {
          cardInner.style.opacity = valueAtPercentage({
            from: 1,
            to: 0,
            percentage: percentageY
          })
          cardInner2.style.opacity = valueAtPercentage({
            from: 1,
            to: 0,
            percentage: percentageY
          })
          cardInner3.style.opacity = valueAtPercentage({
            from: 0,
            to: 1,
            percentage: percentageY
          })
          cardInner3.style.top = valueAtPercentage({
            from: 5,
            to: 0,
            percentage: percentageY
          })+ "rem"
          let newWidth
          if (window.innerWidth < 550) {
            newWidth = 16
          } else if (window.innerWidth >= 550 && window.innerWidth < 730) {
            newWidth = 20
          } else {
            newWidth = 14
          }
          cardInner4.style.width = valueAtPercentage({
            from: 100,
            to: newWidth,
            percentage: percentageY
          })+ "%"
        })
      })
    }
  }
})

document.addEventListener('DOMContentLoaded', function () {
  document.querySelectorAll('.mailing__wrapper-info-form').forEach(form => {
    const emailInput = form.querySelector('[name="email"]')
    const title = form.closest('.mailing__wrapper-info').querySelector('.mailing__wrapper-info-title')
    const successTitle = form.closest('.mailing__wrapper-info').querySelector('.mailing__wrapper-info-title.d-none')
    const text = form.closest('.mailing__wrapper-info').querySelector('.mailing__wrapper-info-text')
    const successText = form.closest('.mailing__wrapper-info').querySelector('.mailing__wrapper-info-text.d-none')
    const policyText = form.closest('.mailing__wrapper-info').querySelector('.mailing__wrapper-info-link')
    const retryButton = form.closest('.mailing__wrapper-info').querySelector('.btn-black.l')

    form.addEventListener('submit', function (event) {
      event.preventDefault()
      
      const email = emailInput.value.trim()
      if (!validateEmail(email)) {
        return
      }

      form.style.display = 'none'
      title?.classList.add('d-none')
      successTitle?.classList.remove('d-none')
      text?.classList.add('d-none')
      successText?.classList.remove('d-none')
      policyText?.classList.add('d-none')
      retryButton?.classList.remove('d-none')
    })
  })

  function validateEmail(email) {
    const re = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/
    return re.test(email)
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const sliderNavs = document.querySelectorAll('.preview__sliders-nav')
  const slider02Nav = document.querySelector('.preview__sliders-02 .preview__sliders-nav')

  if (slider02Nav) {
    slider02Nav.classList.add('active')

    function showNav(slider) {
      sliderNavs.forEach(nav => nav.classList.remove('active'))
      const nav = slider.querySelector('.preview__sliders-nav')
      if (nav) {
        nav.classList.add('active')
      }
    }

    document.querySelector('.preview__sliders-01').addEventListener('mouseenter', function () {
      showNav(this)
    })

    document.querySelector('.preview__sliders-03').addEventListener('mouseenter', function () {
      showNav(this)
    })

    document.querySelectorAll('.preview__sliders-01, .preview__sliders-03').forEach(slider => {
      slider.addEventListener('mouseleave', function () {
        showNav(document.querySelector('.preview__sliders-02'))
      })
    })
  }
})

document.addEventListener('DOMContentLoaded', function () {
  const form = document.querySelector('.case-l__wrapper-bottom')
  const nameInput = form.querySelector('#name')
  const emailInput = form.querySelector('#email')
  const wrapperText = document.querySelector('.case-l__wrapper-text')
  const resendButton = document.querySelector('.btn-black.hide')

  const titles = document.querySelectorAll('.case-l__wrapper-col-title')
  const texts = document.querySelectorAll('.case-l__wrapper-col-text')

  form.addEventListener('submit', function (e) {
    e.preventDefault()

    const nameValue = nameInput.value.trim()
    const emailValue = emailInput.value.trim()

    nameInput.classList.remove('input-error')
    emailInput.classList.remove('input-error')

    if (nameValue === '' || emailValue === '') {
      if (nameValue === '') nameInput.classList.add('input-error')
      if (emailValue === '') emailInput.classList.add('input-error')
      return
    }

    if (titles.length >= 2) {
      titles[0].classList.add('hide')
      titles[1].classList.remove('hide')
    }

    if (texts.length >= 2) {
      texts[0].classList.add('hide')
      texts[1].classList.remove('hide')
    }

    form.style.display = 'none'
    wrapperText.style.display = 'none'
    resendButton.classList.remove('hide')
  })

  resendButton.addEventListener('click', function () {
    if (titles.length >= 2) {
      titles[0].classList.remove('hide')
      titles[1].classList.add('hide')
    }

    if (texts.length >= 2) {
      texts[0].classList.remove('hide')
      texts[1].classList.add('hide')
    }

    form.style.display = ''
    wrapperText.style.display = ''

    nameInput.value = ''
    emailInput.value = ''
    nameInput.classList.remove('input-error')
    emailInput.classList.remove('input-error')

    resendButton.classList.add('hide')
  })
})