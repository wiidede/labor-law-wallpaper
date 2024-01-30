<script setup lang="ts">
import { Expand, ExternalLink, Minimize, Pause, Play, Shuffle, SkipForward, SortDesc } from 'lucide-vue-next'

const laws = useLaws()

const lawRef = ref<HTMLDivElement>()

const intervalTime = useLocalStorage('law-interval-time', DEFAULT_CONF.intervalTime)
const intervalTimeMs = computed(() => intervalTime.value * 1000)
const intervalTimeModel = useElementToArray(intervalTimeMs)

const guohuiSize = useStorage('law-guohui-size', useCssVar('--law-guohui-size'))
if (!guohuiSize.value)
  guohuiSize.value = DEFAULT_CONF.guohuiSize
const guohuiSizeValue = useElementToArray(usePixelToNumber(guohuiSize))

const nameSize = useStorage('law-name-size', useCssVar('--law-name-size'))
if (!nameSize.value)
  nameSize.value = DEFAULT_CONF.nameSize
const nameSizeValue = useElementToArray(usePixelToNumber(nameSize))

const articleSize = useStorage('law-article-size', useCssVar('--law-article-size'))
if (!articleSize.value)
  articleSize.value = DEFAULT_CONF.articleSize
const articleSizeValue = useElementToArray(usePixelToNumber(articleSize))

function resetSize() {
  guohuiSize.value = DEFAULT_CONF.guohuiSize
  nameSize.value = DEFAULT_CONF.nameSize
  articleSize.value = DEFAULT_CONF.articleSize
}

const containerBg = useStorage('law-container-bg', useCssVar('--law-container-bg'))
if (!containerBg.value)
  containerBg.value = DEFAULT_CONF.containerBg

const containerColor = useStorage('law-container-color', useCssVar('--law-container-color'))
if (!containerColor.value)
  containerColor.value = DEFAULT_CONF.containerColor

function resetColor() {
  containerBg.value = DEFAULT_CONF.containerBg
  containerColor.value = DEFAULT_CONF.containerColor
}

const topMargin = useStorage('law-top-margin', useCssVar('--law-top-margin'))
if (!topMargin.value)
  topMargin.value = DEFAULT_CONF.topMargin
const topMarginValue = useElementToArray(usePixelToNumber(topMargin))

const centerTopMargin = useStorage('law-center-top-margin', useCssVar('--law-center-top-margin'))
if (!centerTopMargin.value)
  centerTopMargin.value = DEFAULT_CONF.centerTopMargin
const centerTopMarginValue = useElementToArray(usePixelToNumber(centerTopMargin))

const centerBottomMargin = useStorage('law-center-bottom-margin', useCssVar('--law-center-bottom-margin'))
if (!centerBottomMargin.value)
  centerBottomMargin.value = DEFAULT_CONF.centerBottomMargin
const centerBottomMarginValue = useElementToArray(usePixelToNumber(centerBottomMargin))

const bottomMargin = useStorage('law-bottom-margin', useCssVar('--law-bottom-margin'))
if (!bottomMargin.value)
  bottomMargin.value = DEFAULT_CONF.bottomMargin
const bottomMarginValue = useElementToArray(usePixelToNumber(bottomMargin))

const bottomDoubleWeight = useStorage('law-bottom-double-weight', DEFAULT_CONF.bottomDoubleWeight)

const nameWrap = useStorage('law-name-wrap', DEFAULT_CONF.nameWrap)

function resetMargin() {
  topMargin.value = DEFAULT_CONF.topMargin
  centerTopMargin.value = DEFAULT_CONF.centerTopMargin
  centerBottomMargin.value = DEFAULT_CONF.centerBottomMargin
  bottomMargin.value = DEFAULT_CONF.centerBottomMargin
  bottomDoubleWeight.value = DEFAULT_CONF.bottomDoubleWeight
}

const defaultLawStorage = Object.fromEntries(laws.map<[string, string]>(law => [law.name, DEFAULT_LAW[law.name] || '0'.repeat(law.articles.length)]))

const lawSelectionStorage = useLocalStorage('law-selection', defaultLawStorage)
const storageKeys = Object.keys(lawSelectionStorage.value)
laws.forEach((law) => {
  if (!storageKeys.includes(law.name))
    lawSelectionStorage.value[law.name] = '0'.repeat(law.articles.length)
})
const lawSelection = computed({
  get: () => Object.fromEntries(Object.entries(lawSelectionStorage.value).map(([key, value]) => [key, value.split('').map(v => v === '1')])),
  set: (value) => { lawSelectionStorage.value = Object.fromEntries(Object.entries(value).map(([key, value]) => [key, value.map(v => v ? '1' : '0').join('')])) },
})

function setAllSelected(lawName: string, checked: boolean) {
  const selectionValue = lawSelection.value
  selectionValue[lawName] = Array.from({ length: selectionValue[lawName].length }, () => checked)
  lawSelection.value = selectionValue
}
function setSelected(lawName: string, articleIndex: number, checked: boolean) {
  const selectionValue = lawSelection.value
  selectionValue[lawName][articleIndex] = checked
  lawSelection.value = selectionValue
}

const lawFiltered = computed(() => {
  const lawsCopy = structuredClone(laws)
  return lawsCopy.filter((law) => {
    if (lawSelection.value[law.name].every(v => !v)) {
      return false
    }
    else {
      law.articles = law.articles.filter((_, index) => lawSelection.value[law.name][index])
      return true
    }
  })
})

const currentLawIndex = ref(0)
const currentArticleIndex = ref(0)
const currentLaw = computed(() => lawFiltered.value[currentLawIndex.value])
const currentArticle = computed(() => currentLaw.value?.articles[currentArticleIndex.value])

const isShuffle = useLocalStorage('law-shuffle', false)
const toggleShuffle = () => isShuffle.value = !isShuffle.value

async function nextLaw() {
  if (isShuffle.value) {
    currentLawIndex.value = Math.floor(Math.random() * lawFiltered.value.length)
    await nextTick()
    currentArticleIndex.value = Math.floor(Math.random() * currentLaw.value.articles.length)
  }
  else {
    const nextArticleIndex = currentArticleIndex.value + 1
    if (nextArticleIndex >= currentLaw.value.articles.length) {
      currentLawIndex.value = (currentLawIndex.value + 1) % lawFiltered.value.length
      currentArticleIndex.value = 0
    }
    else {
      currentArticleIndex.value = nextArticleIndex
    }
  }
}

const { pause, resume, isActive } = useIntervalFn(() => nextLaw(), intervalTimeMs)

function handleSkip() {
  isActive.value && resume()
  nextLaw()
}

const { isFullscreen, toggle } = useFullscreen()

function setIndex(lawIndex: number, articleIndex: number) {
  isActive.value && resume()
  currentLawIndex.value = lawIndex
  currentArticleIndex.value = articleIndex
}

function getSpan(length: number, size: number, base: number) {
  const span = Math.max(1 + base, Math.ceil(length / size) + base)
  return `span ${span} / span ${span}`
}

const { idle } = useIdle(3 * 1000)
</script>

<template>
  <div
    ref="lawRef"
    class="screen-size law-container flex flex-col items-center justify-around bg-[--law-container-bg] text-[--law-container-color]"
    :class="{ 'cursor-none': idle }"
  >
    <img class="mt-[--law-top-margin] aspect-square w-[--law-guohui-size]" src="https://wiidede.space/img/guohui.png" alt="国徽">
    <h1 class="mb-[--law-center-bottom-margin] mt-[--law-center-top-margin] text-center font-size-[--law-name-size] font-bold">
      <template v-if="currentLaw?.name.startsWith('中华人民共和国') && nameWrap">
        <span>中华人民共和国</span><div /><span>{{ currentLaw?.name.slice(7) }}</span>
      </template>
      <template v-else>
        <span>{{ currentLaw?.name }}</span>
      </template>
    </h1>
    <div class="mb-[--law-bottom-margin] flex flex-col px-2ch font-size-[--law-article-size] md:flex-row md:gap8 md:px-4ch xl:px-8ch">
      <span class="flex-[0_0_auto] font-bold">{{ currentArticle?.article }}</span>
      <p class="ws-pre-wrap">
        {{ currentArticle?.content }}
      </p>
    </div>
    <div v-if="bottomDoubleWeight" />
  </div>

  <div class="flex flex-col gap4 p4">
    <div class="flex justify-center gap4">
      <Button variant="default" size="icon" @click="toggleShuffle()">
        <Shuffle v-if="isShuffle" />
        <SortDesc v-else />
      </Button>
      <Button variant="default" size="icon" @click="isActive ? pause() : resume()">
        <Pause v-if="isActive" />
        <Play v-else />
      </Button>
      <Button variant="default" size="icon" @click="handleSkip()">
        <SkipForward />
      </Button>
      <Button variant="default" size="icon" @click="toggle()">
        <Minimize v-if="isFullscreen" />
        <Expand v-else />
      </Button>
    </div>

    <Accordion type="multiple">
      <AccordionItem value="page-config">
        <AccordionTrigger>
          <span class="text-2xl">页面配置</span>
        </AccordionTrigger>
        <AccordionContent>
          <div class="gap-6 grid-responsive">
            <Card>
              <CardHeader>
                <CardTitle>轮播</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div class="grid w-full items-center gap-6">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="interval">间隔时间</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ intervalTime }}s
                        </span>
                      </div>
                      <Slider id="interval" v-model="intervalTimeModel" class="my2" :min="1" :max="120" />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card class="grid-row-span-2">
              <CardHeader>
                <div class="flex items-center justify-between">
                  <CardTitle>大小</CardTitle>
                  <Button variant="ghost" size="sm" @click="resetSize">
                    <div class="i-carbon-reset" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form>
                  <div class="grid w-full items-center gap-6">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="guohui-size">国徽</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ guohuiSize }}
                        </span>
                      </div>
                      <Slider id="guohui-size" v-model="guohuiSizeValue" class="my2" :min="10" :max="1024" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="name-size">名称</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ nameSize }}
                        </span>
                      </div>
                      <Slider id="name-size" v-model="nameSizeValue" class="my2" :min="10" :max="128" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="article-size">条文</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ articleSize }}
                        </span>
                      </div>
                      <Slider id="article-size" v-model="articleSizeValue" class="my2" :min="10" :max="60" />
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card class="grid-row-span-3">
              <CardHeader>
                <div class="flex items-center justify-between">
                  <CardTitle>边距</CardTitle>
                  <Button variant="ghost" size="sm" @click="resetMargin">
                    <div class="i-carbon-reset" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form>
                  <div class="grid w-full items-center gap-6">
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="top-margin">顶部</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ topMargin }}
                        </span>
                      </div>
                      <Slider id="top-margin" v-model="topMarginValue" class="my2" :min="0" :max="120" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="center-top-margin">中部上</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ centerTopMargin }}
                        </span>
                      </div>
                      <Slider id="center-top-margin" v-model="centerTopMarginValue" class="my2" :min="0" :max="120" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="center-bottom-margin">中部下</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ centerBottomMargin }}
                        </span>
                      </div>
                      <Slider id="center-bottom-margin" v-model="centerBottomMarginValue" class="my2" :min="0" :max="120" />
                    </div>
                    <div class="flex flex-col gap-2">
                      <div class="flex items-center justify-between">
                        <Label for="bottom-margin">底部</Label>
                        <span class="text-right text-sm text-muted-foreground">
                          {{ bottomMargin }}
                        </span>
                      </div>
                      <Slider id="bottom-margin" v-model="bottomMarginValue" class="my2" :min="0" :max="120" />
                    </div>
                    <div class="border rounded-md p-4">
                      <div class="flex items-center justify-between">
                        <Label for="bottom-double-weight">底部边距自动布局两倍权重</Label>
                        <Switch id="bottom-double-weight" v-model:checked="bottomDoubleWeight" />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <div class="flex items-center justify-between">
                  <CardTitle>颜色</CardTitle>
                  <Button variant="ghost" size="sm" @click="resetColor">
                    <div class="i-carbon-reset" />
                  </Button>
                </div>
              </CardHeader>
              <CardContent>
                <form>
                  <div class="grid grid-cols-2 w-full items-center gap-4">
                    <div class="flex flex-col gap-2">
                      <Label for="container-bg">背景</Label>
                      <input id="container-bg" v-model="containerBg" type="color">
                    </div>
                    <div class="flex flex-col gap-2">
                      <Label for="container-color">文字</Label>
                      <input id="container-color" v-model="containerColor" type="color">
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
            <Card>
              <CardHeader>
                <CardTitle>布局</CardTitle>
              </CardHeader>
              <CardContent>
                <form>
                  <div class="grid w-full items-center gap-6">
                    <div class="border rounded-md p-4">
                      <div class="flex items-center justify-between">
                        <Label for="name-wrap">名称换行</Label>
                        <Switch id="name-wrap" v-model:checked="nameWrap" />
                      </div>
                    </div>
                  </div>
                </form>
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>

      <AccordionItem value="articlesFiltered">
        <AccordionTrigger>
          <span class="text-2xl">当前条文</span>
        </AccordionTrigger>
        <AccordionContent>
          <div class="gap-6 grid-responsive">
            <Card
              v-for="law, idx in lawFiltered" :key="idx"
              :style="{ 'grid-row': getSpan(law.articles.length, 10, 2) }"
            >
              <CardHeader>
                <CardTitle>
                  <div class="flex items-center">
                    <h2 class="text-lg" :title="law.info">
                      {{ law.name }}
                    </h2>
                    <Button variant="link" size="sm" class="op67 !h-fit">
                      <a v-if="law.link" :href="law.link" target="_blank" class="inline-block">
                        <ExternalLink class="size-1em" />
                      </a>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="flex flex-wrap">
                  <template v-for="article, subIdx in law.articles" :key="subIdx">
                    <Button
                      :variant="currentLawIndex === idx && currentArticleIndex === subIdx ? 'default' : 'ghost'"
                      size="sm"
                      :title="article.content"
                      :disabled="currentLawIndex === idx && currentArticleIndex === subIdx"
                      @click="setIndex(idx, subIdx)"
                    >
                      {{ article.index }}
                    </Button>
                  </template>
                </div>
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
      <AccordionItem value="articles">
        <AccordionTrigger>
          <span class="text-2xl">条文配置</span>
        </AccordionTrigger>
        <AccordionContent>
          <div class="gap-6 grid-responsive">
            <Card
              v-for="law, idx in laws" :key="idx"
              :style="{ 'grid-row': getSpan(law.articles.length, 16, 2) }"
            >
              <CardHeader>
                <CardTitle>
                  <div class="flex items-center">
                    <Checkbox
                      :id="`law-all-${idx}`"
                      :checked="lawSelection[law.name].every(Boolean) ? true : lawSelection[law.name].every((c) => !c) ? false : 'indeterminate'"
                      class="mr2"
                      @update:checked="setAllSelected(law.name, $event)"
                    />
                    <h2 class="text-lg" :title="law.info">
                      {{ law.name }}
                    </h2>
                    <Button variant="link" size="sm" class="op67 !h-fit">
                      <a v-if="law.link" :href="law.link" target="_blank" class="inline-block">
                        <div class="i-carbon-link" />
                      </a>
                    </Button>
                  </div>
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div class="grid grid-cols-[repeat(auto-fill,minmax(50px,1fr))] gap1">
                  <div
                    v-for="article, subIdx in law.articles"
                    :key="subIdx"
                    class="flex items-center gap-1"
                    :title="article.content"
                  >
                    <Checkbox
                      :id="`law-${idx}-${subIdx}`"
                      :checked="lawSelection[law.name][subIdx]"
                      @update:checked="setSelected(law.name, subIdx, $event)"
                    />
                    <label
                      :for="`law-${idx}-${subIdx}`"
                      class="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
                    >
                      {{ subIdx + 1 }}
                    </label>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </AccordionContent>
      </AccordionItem>
    </Accordion>
    <TheFooter />
  </div>
</template>

<style scoped>
.law-container {
  font-family: '宋体', 'SimSun', serif;
}
</style>
