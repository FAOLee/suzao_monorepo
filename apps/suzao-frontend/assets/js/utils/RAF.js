function RAF() {
  this.init()
}

RAF.prototype.init = function () {
  this._timerIdMap = {
    timeout: {},
    interval: {}
  }
}

RAF.prototype.run = function (type, cb, interval) {
  var now = Date.now
  var stime = now()
  var etime = stime

  // 创建Symbol类型作为key值，保证返回值的唯一性，用于清除定时器使用
  var timerSymbol = Symbol()

  var loop = function () {
    this.setIdMap(timerSymbol, type, loop)
    etime = now()

    if (etime - stime >= interval) {
      if (type === 'interval') {
        stime = now()
        etime = stime
      }
      cb()
      type === 'timeout' && this.clearTimeout(timerSymbol)
    }
  }.bind(this)

  this.setIdMap(timerSymbol, type, loop)
  return timerSymbol // 返回Symbol保证每次调用setTimeout/setInterval返回值的唯一性
}

RAF.prototype.setIdMap = function (timerSymbol, type, loop) {
  var id = requestAnimationFrame(loop)
  this._timerIdMap[type][timerSymbol] = id
}

RAF.prototype.setTimeout = function (cb, interval) {
  return this.run('timeout', cb, interval)
}

RAF.prototype.clearTimeout = function (timer) {
  cancelAnimationFrame(this._timerIdMap.timeout[timer])
}

RAF.prototype.setInterval = function (cb, interval) {
  return this.run('interval', cb, interval)
}

RAF.prototype.clearInterval = function (timer) {
  cancelAnimationFrame(this._timerIdMap.interval[timer])
}