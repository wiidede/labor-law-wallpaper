import { isClient } from '@vueuse/core'

export const isWindows = (function () {
  if (isClient)
    return /windows|win32/i.test(navigator.userAgent)
  return false
}())

export const isMobile = (function () {
  if (isClient)
    return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
  return false
}())

const { idle } = useIdle(3 * 1000)

export { idle as isIdle }
