export function usePixelToNumber(pixel: Ref<string | undefined>) {
  return computed({
    get: () => (pixel.value && Number.parseInt(pixel.value)) || 0,
    set: (v: number) => (pixel.value = `${v.toString()}px`),
  })
}

export function useElementToArray<T = any>(element: Ref<T>) {
  return computed({
    get: () => [element.value],
    set: (value) => { element.value = value[0] },
  })
}
