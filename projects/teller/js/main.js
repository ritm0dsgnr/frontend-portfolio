document.addEventListener('DOMContentLoaded', function () {

  if (window.innerWidth > 450) {
    new Swiper('.projects__slider.i .swiper-container', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      spaceBetween: 33,
      pagination: {
        el: '.projects__slider-pagination',
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 3,
        },
      },
    })
  
    new Swiper('.blog__slider .swiper-container', {
      slidesPerView: 'auto',
      slidesPerGroup: 1,
      spaceBetween: 33,
      pagination: {
        el: '.blog__slider-pagination',
        clickable: true,
      },
      breakpoints: {
        1024: {
          slidesPerView: 3,
        },
        450: {
          slidesPerView: 1,
        },
      },
    })
  }

  new Swiper('.projects__slider.cus .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 33,
    pagination: {
      el: '.projects__slider-pagination',
      clickable: true,
    },
    breakpoints: {
      1024: {
        slidesPerView: 3,
      },
      450: {
        slidesPerView: 1,
      },
    },
  })

  new Swiper('.location__gallery .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 33,
    breakpoints: {
      450: {
        slidesPerView: 3,
      },
    },
  })

  new Swiper('.slider .swiper-container', {
    slidesPerView: 1,
    slidesPerGroup: 1,
    pagination: {
      el: '.slider__pagination',
      clickable: true,
    },
  })

  document.querySelectorAll('[data-scroll]').forEach(e => {
    e.addEventListener('click', (event) => {
        event.preventDefault()

        const blockId = e.getAttribute('data-scroll')
        const blockOffset = document.querySelector(blockId).offsetTop - 150

        window.scrollTo({
            top: blockOffset,
            behavior: 'smooth'
        })
    })
  })

  const searcBtn = document.querySelector('.header__wrapper-search')
  const search = document.querySelector('.search')
  const searchClose = document.querySelector('.search__form-close')

  function showSearch() {
    search.style.display = 'block'
    search.style.opacity = 0
    searcBtn.classList.add('active')

    let opacity = 0
    const fadeIn = () => {
      opacity += 0.1
      search.style.opacity = opacity

      if (opacity < 1) {
        requestAnimationFrame(fadeIn)
      }
    }
    requestAnimationFrame(fadeIn)
  }
 
  function hideSearch() {
    let opacity = 1
    searcBtn.classList.remove('active')
    
    const fadeOut = () => {
      opacity -= 0.1
      search.style.opacity = opacity

      if (opacity > 0) {
        requestAnimationFrame(fadeOut)
      } else {
        search.style.display = 'none'
      }
    }
    requestAnimationFrame(fadeOut)
  }
 
  searcBtn.addEventListener('click', showSearch)
  searchClose.addEventListener('click', hideSearch)

  const burger = document.querySelector('.header__wrapper-burger')
  const nav = document.querySelector('.nav')
  const navClose = document.querySelector('.nav__close')
  const body = document.querySelector('body')

  if (burger) {
    burger.addEventListener('click', (event) => {
      burger.classList.toggle('active')
      nav.classList.toggle('active')
      body.classList.toggle('lock')
    })
  }

  if (navClose) {
    navClose.addEventListener('click', (event) => {
      burger.classList.remove('active')
      nav.classList.remove('active')
      body.classList.remove('lock')
    })
  }

  const filters = document.querySelector('.prjcts__wrapper-item-filters')

  if (filters) {
    const filtersHeader = filters.querySelector('.prjcts__wrapper-item-filters-header')
    const filtersDropdown = filters.querySelector('.prjcts__wrapper-item-filters-dropdown')
    const filterItems = filtersDropdown.querySelectorAll('.prjcts__wrapper-item-filters-dropdown-item')

    filtersHeader.addEventListener('click', (event) => {
      event.stopPropagation()
      filters.classList.toggle('active')
    })

    filterItems.forEach(item => {
      item.addEventListener('click', (event) => {
        event.stopPropagation()
        filterItems.forEach(el => el.classList.remove('active'))
        item.classList.add('active')
      })
    })
  
    document.addEventListener('click', (event) => {
      if (!filters.contains(event.target)) {
        filters.classList.remove('active')
      }
    })
  }

 
  function handleCustomCheckboxes() {
    document.querySelectorAll('.form__policy').forEach((label) => {
      label.addEventListener('click', (e) => {
        e.preventDefault()
        label.classList.toggle('active')

        const checkbox = label.querySelector('input[type="checkbox"]')
        if (checkbox) {
          checkbox.checked = label.classList.contains('active')
        }
      })
    })
  }

  function validateForm(form) {
    let isValid = true

    form.querySelectorAll('input, textarea').forEach((field) => {
      field.classList.remove('er')
    })

    form.querySelectorAll('input, textarea').forEach((field) => {
      if (field.type !== 'checkbox' && field.value.trim() === '') {
        field.classList.add('er')
        isValid = false
      }
    })

    const customCheckboxLabel = form.querySelector('.form__policy')
    if (customCheckboxLabel && !customCheckboxLabel.classList.contains('active')) {
      customCheckboxLabel.classList.add('er')
      isValid = false
    } else if (customCheckboxLabel) {
      customCheckboxLabel.classList.remove('er')
    }

    return isValid
  }

  function attachValidation(formSelector, successClassSelector) {
    const form = document.querySelector(formSelector)
    if (!form) return

    form.addEventListener('submit', (event) => {
      event.preventDefault()

      const isValid = validateForm(form)

      if (isValid) {
        const successBlock = document.querySelector(successClassSelector)
        if (successBlock) {
          successBlock.classList.add('active')
        }
      }
    })
  }

  handleCustomCheckboxes()
  attachValidation('#order-form', '.done_send')
  attachValidation('.writh__wrapper-info-form', '.writh__wrapper')
})