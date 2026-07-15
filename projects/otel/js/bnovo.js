(function () {
  'use strict'

  const root = document.getElementById('_bn_widget_')
  if (!root) return

  const shell = root.closest('.bnovo-widget') || root

  let widgetOpened = false
  let initStarted = false
  let revealStarted = false

  const WIDGET_OPTIONS = {
    type: 'horizontal',
    uid: 'dc75066c-cc7a-4b77-9ffa-1ed4ba8a319a',
    lang: 'ru',
    width: '100%',
    width_mobile: '300',
    background: '#FFF7E4',
    background_mobile: '#ffffff',
    bg_alpha: '100',
    bg_alpha_mobile: '100',
    border: 'on',
    border_color: '#D2CBBC',
    border_color_mobile: '#C6CAD3',
    padding: '24',
    padding_mobile: '24',
    border_radius: '8',
    button_font_size: '14',
    button_height: '42',
    font_type: 'arial',
    without_title: 'on',
    title_color: '#242742',
    title_color_mobile: '#242742',
    title_size: '22',
    title_size_mobile: '22',
    inp_color: '#1C1B1B',
    inp_bordhover: '#8D8980',
    inp_bordcolor: '#D2CBBC',
    inp_alpha: '100',
    btn_background: '#B54733',
    btn_background_over: '#692323',
    btn_textcolor: '#FFF7E4',
    btn_textover: '#FFF7E4',
    btn_bordcolor: '#B54733',
    btn_bordhover: '#692323',
    min_age: '0',
    max_age: '17',
    adults_default: '1',
    btn_text: 'Подобрать номера',
    dates_preset: 'on',
    dfrom_today: 'on',
    dfrom_value: '2',
    dto_nextday: 'on',
    dto_value: '2',
    cancel_color: '#FFFFFF',
    switch_mobiles_width: '800'
  }

  const canUseBnovo = () => typeof Bnovo_Widget !== 'undefined'
    && typeof Bnovo_Widget.init === 'function'
    && typeof Bnovo_Widget.open === 'function'

  const getIframe = () => root.querySelector('iframe')

  const isIframeReady = () => {
    const iframe = getIframe()
    if (!iframe) return false
    const attrHeight = parseInt(iframe.getAttribute('height') || '0', 10)
    return iframe.offsetHeight > 20 || attrHeight > 20
  }

  const revealWidget = () => {
    shell.classList.add('is-ready')
  }

  const revealWhenReady = () => {
    if (revealStarted) return
    revealStarted = true

    const tryReveal = () => {
      if (!isIframeReady()) return false
      revealWidget()
      return true
    }

    if (tryReveal()) return

    const iframe = getIframe()
    if (!iframe) {
      revealStarted = false
      return
    }

    const onResize = () => {
      if (tryReveal()) observer.disconnect()
    }

    const observer = typeof ResizeObserver !== 'undefined'
      ? new ResizeObserver(onResize)
      : null

    if (observer) observer.observe(iframe)
    iframe.addEventListener('load', onResize)

    window.setTimeout(() => {
      revealWidget()
      observer?.disconnect()
    }, 4000)
  }

  const pinWidget = () => {
    if (shell.parentElement !== document.body) {
      document.body.appendChild(shell)
      return
    }
    if (shell !== document.body.lastElementChild) {
      document.body.appendChild(shell)
    }
  }

  const openWidget = () => {
    if (initStarted) return widgetOpened
    if (!canUseBnovo()) return false

    initStarted = true
    pinWidget()

    Bnovo_Widget.init(function () {
      const ok = Bnovo_Widget.open('_bn_widget_', WIDGET_OPTIONS)
      if (ok !== false) {
        widgetOpened = true
        revealWhenReady()
      }
    })

    return true
  }

  let mountAttempts = 0
  const MAX_MOUNT_ATTEMPTS = 40

  const mountWidget = () => {
    if (widgetOpened && shell.classList.contains('is-ready')) return

    pinWidget()

    if (!initStarted && canUseBnovo()) {
      openWidget()
    }

    if (widgetOpened && !shell.classList.contains('is-ready')) {
      revealWhenReady()
    }

    if (widgetOpened) return

    mountAttempts += 1
    if (mountAttempts >= MAX_MOUNT_ATTEMPTS) return
    window.setTimeout(mountWidget, 150)
  }

  const scrollToBooking = () => {
    window.HotelHero?.finishInfoScene?.()
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        mountWidget()
        shell.scrollIntoView({ behavior: 'smooth', block: 'end' })
      })
    })
  }

  document.querySelectorAll('.rooms__wrapper-info-actions-book').forEach((btn) => {
    btn.addEventListener('click', (e) => {
      e.preventDefault()
      scrollToBooking()
    })
  })

  const start = () => {
    mountWidget()
    window.addEventListener('load', mountWidget, { once: true })
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', start, { once: true })
  } else {
    start()
  }

  window.HotelBnovo = { mount: mountWidget, scrollTo: scrollToBooking }
})()
