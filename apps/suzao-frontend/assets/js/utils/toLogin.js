if (!_SZ_HAS_LOGIN) {
  if (window.openLoginDialog) {
    window.openLoginDialog()
  } else {
    location.href = '/login?refer=' + location.pathname + encodeURIComponent(location.search)
  }
}
