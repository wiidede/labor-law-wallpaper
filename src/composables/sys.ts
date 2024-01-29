import { isClient } from '@vueuse/core'

export const isWindows = (function () {
  if (isClient)
    return /windows|win32/i.test(navigator.userAgent)
  return false
}())
