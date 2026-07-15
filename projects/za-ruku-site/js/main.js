document.addEventListener('DOMContentLoaded', function() {
  document.querySelectorAll('[data-scroll]').forEach(e => {
    e.addEventListener('click', (event) => {
      event.preventDefault()

      const blockId = e.getAttribute('data-scroll')
      const blockOffset = document.querySelector(blockId).offsetTop - 200

      window.scrollTo({
        top: blockOffset,
        behavior: 'smooth'
      })
    })
  })

  new Swiper('.articles-slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    navigation: {
      nextEl: '.articles-slider .slider-nav-next',
      prevEl: '.articles-slider .slider-nav-prev',
    },
  })

  new Swiper('.main__wrapper-slider .swiper-container', {
    effect: 'fade',
    loop: true,
    navigation: {
      nextEl: '.main__wrapper-slider-bottom .slider-nav-next',
      prevEl: '.main__wrapper-slider-bottom .slider-nav-prev',
    },
  })

  new Swiper('.big-banner__slider .swiper-container', {
    effect: 'fade',
    loop: true,
    navigation: {
      nextEl: '.big-banner__slider .slider-nav-next',
      prevEl: '.big-banner__slider .slider-nav-prev',
    },
  })

  new Swiper('.main__wrapper-reviews .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 6,
    effect: 'slide',
    breakpoints: {
      961: {
        slidesPerView: 1,
        slidesPerGroup: 1,
        spaceBetween: 0,
        effect: 'fade',
        navigation: {
          nextEl: '.main__wrapper-reviews .main__wrapper-reviews-nav-next',
          prevEl: '.main__wrapper-reviews .main__wrapper-reviews-nav-prev',
        },
        scrollbar: {
          el: '.main__wrapper-reviews-nav-scrollbar',
          draggable: true
        },
      }
    }
  })

  new Swiper('.classes__wrapper-slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    loop: true,
    navigation: {
      nextEl: '.classes__wrapper-nav .slider-nav-next',
      prevEl: '.classes__wrapper-nav .slider-nav-prev',
    },
  })

  new Swiper('.media.nozologia .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    navigation: {
      nextEl: '.media.nozologia .slider-nav-next',
      prevEl: '.media.nozologia .slider-nav-prev',
    },
  })

  new Swiper('.reminder .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    spaceBetween: 10,
    navigation: {
      nextEl: '.reminder .slider-nav-next',
      prevEl: '.reminder .slider-nav-prev',
    },
  })

  new Swiper('.special-projects__slider .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    navigation: {
      nextEl: '.special-projects .slider-nav-next',
      prevEl: '.special-projects .slider-nav-prev',
    },
  })

  new Swiper('.events__search-calendar .swiper-container', {
    slidesPerView: 'auto',
    slidesPerGroup: 1,
    navigation: {
      nextEl: '.events .slider-nav-next',
      prevEl: '.events .slider-nav-prev',
    },
  })

  const filtersOr = document.querySelectorAll('.filters.filters-or'),
        filtersID = document.querySelectorAll('.filter-id'),
        likes = document.querySelectorAll('.card-like'),
        bigLikes = document.querySelectorAll('.podcast__wrapper-info-list-item-like'),
        searchSelectedContainers = document.querySelectorAll('.search-selected'),
        calendarItems = document.querySelectorAll('.events__search-calendar-item-block-date'),
        mobileLinks = document.querySelectorAll('.mobile__nav-wrapper-link'),
        mobileMenu = document.querySelector('.mobile__menu'),
        mainLink = document.querySelector('.header-bottom__nav-link-main'),
        dropdownMenu = document.querySelector('.header-bottom__nav-link-main-dropdown'),
        dropdownLinks = document.querySelectorAll('.header-bottom__nav-link-main-dropdown-list-block'),
        dropdownBanner = document.querySelector('.header-bottom__nav-link-main-dropdown-banner'),
        searchBtns = document.querySelectorAll('.header-bottom__btn'),
        search = document.querySelector('.header-search'),
        searchClose = document.querySelector('.header-search__close'),
        dropdownSearchItems = document.querySelectorAll('.header-search__wrapper-dropdown-item-link'),
        literatureHeader = document.querySelector('.article__content-literature-header'),
        literatureList = document.querySelector('.article__content-literature'),
        mediaFilter = document.querySelector('.media-page-dropdown'),
        podcastItems = document.querySelectorAll('.podcast__wrapper-info-list-item'),
        podcastPlayer = document.querySelector('.podcast__player'),
        closePodcastPlayer = document.querySelector('.podcast__player-wrapper-close')

  filtersID.forEach(filterID => {
    const filterItems = filterID.querySelectorAll('.filters-filter')
    const mediaItems = filterID.querySelectorAll('.filter-item')

    filterItems.forEach(filterItem => {
      filterItem.addEventListener('click', () => {
        filterItems.forEach(function(e) {
          e.classList.remove('active')
        })
        filterItem.classList.add('active')

        const filterId = filterItem.getAttribute('data-media-id')

        if (!filterId) {
          return
        }

        if (filterId === 'all') {
          mediaItems.forEach(item => {
            item.classList.remove('filter-hidden')
          })
        } else {
          mediaItems.forEach(item => {
            if (item.getAttribute('data-media-id') === filterId) {
              item.classList.remove('filter-hidden')
            } else {
              item.classList.add('filter-hidden')
            }
          })
        }
      })
    })
  })

  if(mediaFilter) {
    mediaFilter.querySelector('p').addEventListener('click', () => {
      mediaFilter.querySelector('.events__search-dropdowns-dropdown-item-list').classList.toggle('active')
    })
  }

  if (literatureHeader) {
    literatureHeader.addEventListener('click', () => {
      literatureList.classList.toggle('active')
    })
  }
  
  searchBtns.forEach(searchBtn => {
    searchBtn.addEventListener('click', () => {
      event.preventDefault()
      search.classList.add('active')
    })
  })

  searchClose.addEventListener('click', () => {
    search.classList.remove('active')
  })

  likes.forEach(like => {
    like.addEventListener('click', () => {
      like.classList.toggle('active')
    })
  })

  bigLikes.forEach(bigLike => {
    bigLike.addEventListener('click', () => {
      bigLike.classList.toggle('active')
    })
  })

  calendarItems.forEach(calendarItem => {
    calendarItem.addEventListener('click', () => {
      calendarItems.forEach(function(e) {
        e.classList.remove('active')
      })
      calendarItem.classList.add('active')
    })
  })

  mainLink.addEventListener('click', event => {
    event.preventDefault()
    mainLink.classList.toggle('active')
    dropdownMenu.classList.toggle('active')

    document.addEventListener('click', (event) => {
      const targetElement = event.target
      if (!dropdownMenu.contains(targetElement) && !mainLink.contains(targetElement)) {
        mainLink.classList.remove('active')
        dropdownMenu.classList.remove('active')
      }
    })
  })

  searchSelectedContainers.forEach(function(container) {
    const dropdowns = container.querySelectorAll('.events__search-dropdowns-dropdown'),
          searchSelectedContainer = container.querySelector('.events__search-selected'),
          filterItems = container.querySelectorAll('.filters-filter'),
          resetButton = container.querySelector('.filters-reset')
    let dropdownListItems
  
    dropdowns.forEach(function(dropdown) {
      const dropdownLink = dropdown.querySelector('.events__search-dropdowns-dropdown-item p')
      const dropdownList = dropdown.querySelector('.events__search-dropdowns-dropdown-item-list')
      dropdownListItems = dropdownList.querySelectorAll('.events__search-dropdowns-dropdown-item-list li p')
  
      dropdownLink.addEventListener('click', function() {
        dropdownLink.classList.toggle('active')
        dropdownList.classList.toggle('active')
      })
  
      dropdownListItems.forEach(dropdownListItem => {
        dropdownListItem.addEventListener('click', () => {
          const isActive = dropdownListItem.classList.contains('active')
  
          if (isActive) {
            const activeSpan = searchSelectedContainer.querySelector('span.active')
            if (activeSpan) {
              activeSpan.remove()
            }
          } else {
            const newSpan = document.createElement('span')
            newSpan.textContent = dropdownListItem.textContent
            searchSelectedContainer.appendChild(newSpan)
            newSpan.classList.add('active')
          }
  
          dropdownListItem.classList.toggle('active')
          checkAndAddActiveClassToReset()
        })
      })
    })
  
    filterItems.forEach(filterItem => {
      filterItem.addEventListener('click', () => {
        filterItem.classList.toggle('active')
        checkAndAddActiveClassToReset()
      })
    })
  
    function checkAndAddActiveClassToReset() {
      let isActive = false
  
      if (searchSelectedContainer.querySelector('span.active')) {
        isActive = true
      }
  
      filterItems.forEach(filterItem => {
        if (filterItem.classList.contains('active')) {
          isActive = true
        }
      })
  
      if (isActive) {
        resetButton.classList.add('is-visible')
      } else {
        resetButton.classList.remove('is-visible')
      }
    }

    if (resetButton){
      resetButton.addEventListener('click', () => {
        filterItems.forEach(filterItem => {
          filterItem.classList.remove('active')
        })
    
        dropdownListItems.forEach(dropdownListItem => {
          dropdownListItem.classList.remove('active')
        })
    
        searchSelectedContainer.querySelectorAll('span').forEach(span => {
          span.remove()
        })
    
        resetButton.classList.remove('is-visible')
      })
    }
  })

  dropdownSearchItems.forEach(item => {
    const dropdownBtn = item.querySelector('.header-search__wrapper-dropdown-item-link p'),
          dropdownList = item.querySelector('.header-search__wrapper-dropdown-item-list'),
          dropdownArrow = item.querySelector('.header-search__wrapper-dropdown-item-link p svg')

    dropdownBtn.addEventListener('click', () => {
      dropdownList.classList.toggle('active')
      dropdownArrow.classList.toggle('rotate')
    })
  })

  if (window.innerWidth > 1190) {
    dropdownLinks.forEach(dropdownLink => {
      dropdownLink.addEventListener('mouseover', () => {
        dropdownLinks.forEach(e => {
          e.classList.remove('active')
        })
        dropdownLink.classList.add('active')
        dropdownBanner.style.marginLeft = '400px'
      })
      dropdownLink.addEventListener('mouseout', () => {
        dropdownLink.classList.remove('active')
        dropdownBanner.style.marginLeft = '0'
      })
    })
  } else {
    dropdownLinks.forEach(dropdownLink => {
      dropdownLink.querySelector('.header-bottom__nav-link-main-dropdown-list-block-name').addEventListener('click', event => {
        dropdownLinks.forEach(e => {
          event.preventDefault()
          if (e !== dropdownLink) {
            e.classList.remove('active')
          }
        })
        dropdownLink.classList.toggle('active')
      })
    })
  }
  
  mobileLinks.forEach(mobileLink => {
    mobileLink.addEventListener('click', () => {
      mobileLinks.forEach(e => {
        if (e !== mobileLink) {
          e.classList.remove('active')
        }
      })
      mobileLink.classList.toggle('active')
  
      if (
        mobileLink.classList.contains('active') &&
        (mobileLink.classList.contains('menu') ||
          mobileLink.classList.contains('class'))
      ) {
        mobileMenu.classList.add('active')
        document.querySelector('body').classList.toggle('lock')
      } else {
        mobileMenu.classList.remove('active')
        document.querySelector('body').classList.remove('lock')
      }
  
      if (mobileLink.classList.contains('active') && mobileLink.classList.contains('menu')) {
        document.querySelector('.mobile__menu-wrapper.menu').classList.add('active')
        document.querySelector('.mobile__menu-wrapper.class').classList.remove('active')
      }
  
      if (mobileLink.classList.contains('active') && mobileLink.classList.contains('class')) {
        document.querySelector('.mobile__menu-wrapper.menu').classList.remove('active')
        document.querySelector('.mobile__menu-wrapper.class').classList.add('active')
      }
    })
  })

  ymaps.ready(init)		
  function init() {
    const myMap = new ymaps.Map("map", {
      center: [55.766491, 37.622334],
      zoom: 16
    }, {
      searchControlProvider: 'yandex#search'
    })

    const myPlacemark = new ymaps.Placemark([55.766491, 37.622334], null,{
      iconLayout: 'default#image',
      iconImageHref: "./img/ballon.svg",
      iconImageSize: [80, 90]
    })
    myMap.geoObjects.add(myPlacemark)
  }

  document.querySelectorAll('.audio-player').forEach(function(player) {
    const audio = player.querySelector('audio'),
          playPauseBtn = player.querySelector('.audio-player-play'),
          volumeSlider = player.querySelector('.audio-player-volume'),
          seekSlider = player.querySelector('.audio-player-slider'),
          currentTime = player.querySelector('.audio-player-time.current'),
          audioPlayerIcons = player.querySelector('.audio-player-play')

    playPauseBtn.addEventListener('click', () => {
      if (audio.paused) {
          audio.play()
          audioPlayerIcons.classList.add('active')
      } else {
          audio.pause()
          audioPlayerIcons.classList.remove('active')
      }
    })

    volumeSlider.addEventListener('input', () => {
      audio.volume = volumeSlider.value / 100
    })
  
    audio.addEventListener('timeupdate', () => {
        const current = audio.currentTime,
              total = audio.duration

        currentTime.textContent = formatTime(current)
        seekSlider.value = (current / total) * 100
    })
    
    seekSlider.addEventListener('input', () => {
        const seekTo = (seekSlider.value / 100) * audio.duration
        audio.currentTime = seekTo
    })
  })

  podcastItems.forEach(function(item) {
    const playBtn = item.querySelector('.podcast__wrapper-info-list-item-img span'),
          podcastName = item.querySelector('.podcast__wrapper-info-list-item-info-name'),
          podcastImg = item.querySelector('.podcast__wrapper-info-list-item-img img'),
          podcastAudio = item.querySelector('.podcast__wrapper-info-list-item audio')

    playBtn.addEventListener('click', function() {
      podcastPlayer.querySelector('.podcast__player-wrapper .audio-player .audio-player-time.total').textContent = formatTime(podcastAudio.duration)
      podcastPlayer.querySelector('.podcast__player-wrapper .audio-player audio').setAttribute('src', podcastAudio.getAttribute('src'))
      podcastPlayer.querySelector('.podcast__player-wrapper .audio-player audio').play()
      podcastPlayer.querySelector('.podcast__player-wrapper .audio-player-play').classList.add('active')
      podcastPlayer.querySelector('.podcast__player-wrapper-item-img img').setAttribute('src', podcastImg.getAttribute('src'))
      podcastPlayer.querySelector('.podcast__player-wrapper-item-name').textContent = podcastName.textContent
      podcastPlayer.classList.add('active')
    })
  })

  if (closePodcastPlayer) {
    closePodcastPlayer.addEventListener('click', function() {
      podcastPlayer.classList.remove('active')
      podcastPlayer.querySelector('.podcast__player-wrapper .audio-player audio').pause()
        podcastPlayer.querySelector('.podcast__player-wrapper .audio-player-play').classList.remove('active')
    })
  }

  function formatTime(seconds) {
    const minutes = Math.floor(seconds / 60)
    const remainingSeconds = Math.floor(seconds % 60)
    const remainingMinutes = Math.floor(minutes % 60)

    return (
      (remainingMinutes < 10 ? '0' : '') + remainingMinutes + ':' +
      (remainingSeconds < 10 ? '0' : '') + remainingSeconds
    )
  }
})