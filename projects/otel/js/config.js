(function () {
  'use strict'

  const defaults = {
    APP_NAMESPACE: 'StarterApp',
    FLAGS: {
      formClearOnSubmit: false,
      smoothScroll: false,
      debug: false
    }
  }

  const runtime = window.StarterConfig || {}

  window.StarterConfig = {
    APP_NAMESPACE: runtime.APP_NAMESPACE || defaults.APP_NAMESPACE,
    FLAGS: {
      ...defaults.FLAGS,
      ...(runtime.FLAGS || {})
    }
  }
})()