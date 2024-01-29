<script setup lang="ts">
const laws = useLaws()

const lawVisible = ref(false)
const lawsVisible = ref<string[]>([])

const defaultLaw: Record<string, string | undefined> = {
  中华人民共和国劳动法: '00010000000000000000000000000000000100000001000000000000000000000000000000000000000000000000000000000000000',
  中华人民共和国劳动合同法: '00010010000000000000000001000010001001000000000000000000000000000000000000000000000000000000000000',
  中华人民共和国劳动争议调解仲裁法: '000001000000000000000000000000000000000000000000000000',
}
const defaultLawStorage = Object.fromEntries(laws.map<[string, string]>(law => [law.name, defaultLaw[law.name] || '0'.repeat(law.articles.length)]))

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

const lawSelectionVisible = ref(false)
const lawsSelectionVisible = ref<string[]>([])

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

const { pause, resume, isActive } = useIntervalFn(() => nextLaw(), 6000)

function handleSkip() {
  isActive.value && resume()
  nextLaw()
}

function setIndex(lawIndex: number, articleIndex: number) {
  isActive.value && resume()
  currentLawIndex.value = lawIndex
  currentArticleIndex.value = articleIndex
}
</script>

<template>
  <div class="screen-size law-container flex flex-col items-center justify-around bg-#DB3832 text-#FFFF54">
    <img class="aspect-square w-67" src="/assets/images/guohui.png" alt="国徽">
    <h1 class="text-center text-5xl font-bold md:text-7xl">
      <template v-if="currentLaw?.name.startsWith('中华人民共和国')">
        <span>中华人民共和国</span><div class="h-4 md:hidden" /><span>{{ currentLaw?.name.slice(7) }}</span>
      </template>
      <template v-else>
        <span>{{ currentLaw?.name }}</span>
      </template>
    </h1>
    <div class="flex flex-col px-2ch text-5 md:flex-row md:gap8 md:px-4ch xl:px-8ch">
      <span class="flex-[0_0_auto] font-bold">{{ currentArticle?.article }}</span>
      <p class="ws-pre-wrap">
        {{ currentArticle?.content }}
      </p>
    </div>
    <div />
  </div>

  <div class="flex flex-col gap4 p4">
    <div class="flex justify-center gap4">
      <Button variant="outline" size="icon" @click="toggleShuffle()">
        <div :class="isShuffle ? 'i-carbon-shuffle' : 'i-carbon-sort-ascending'" />
      </Button>
      <Button variant="outline" size="icon" @click="isActive ? pause() : resume()">
        <div :class="isActive ? 'i-carbon-pause' : 'i-carbon-play'" />
      </Button>
      <Button variant="outline" size="icon" @click="handleSkip()">
        <div class="i-carbon-skip-forward" />
      </Button>
    </div>

    <Collapsible v-model:open="lawVisible">
      <CollapsibleTrigger>
        <div class="flex items-center gap2 text-xl">
          当前所有条文
          <div class="i-carbon-chevron-right inline-block transition-transform duration-200" :class="{ 'rotate-90': lawVisible }" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Accordion v-model="lawsVisible" type="multiple" collapsible>
          <template v-for="law, idx in lawFiltered" :key="idx">
            <AccordionItem :value="String(idx)">
              <AccordionTrigger>
                <div class="flex items-center">
                  <h2 class="text-lg" :title="law.info">
                    {{ law.name }}
                  </h2>
                  <Button variant="link" size="sm" class="!h-fit">
                    <a v-if="law.link" :href="law.link" target="_blank" class="ml4 inline-block" @click.stop>
                      <div>原文</div>
                    </a>
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div class="flex flex-wrap gap1">
                  <template v-for="article, subIdx in law.articles" :key="subIdx">
                    <Button
                      :variant="currentLawIndex === idx && currentArticleIndex === subIdx ? 'default' : 'outline'"
                      size="sm"
                      :title="article.content"
                      :disabled="currentLawIndex === idx && currentArticleIndex === subIdx"
                      @click="setIndex(idx, subIdx)"
                    >
                      {{ article.article }}
                    </Button>
                  </template>
                </div>
              </AccordionContent>
            </AccordionItem>
          </template>
        </Accordion>
      </CollapsibleContent>
    </Collapsible>

    <Collapsible v-model:open="lawSelectionVisible">
      <CollapsibleTrigger>
        <div class="flex items-center gap2 text-xl">
          条文配置
          <div class="i-carbon-chevron-right inline-block transition-transform duration-200" :class="{ 'rotate-90': lawSelectionVisible }" />
        </div>
      </CollapsibleTrigger>
      <CollapsibleContent>
        <Accordion v-model="lawsSelectionVisible" type="multiple">
          <template v-for="law, idx in laws" :key="idx">
            <AccordionItem :value="String(idx)">
              <AccordionTrigger>
                <div class="flex items-center">
                  <Checkbox
                    :id="`law-all-${idx}`"
                    :checked="lawSelection[law.name].every(Boolean) ? true : lawSelection[law.name].every((c) => !c) ? false : 'indeterminate'"
                    class="mr2"
                    @update:checked="setAllSelected(law.name, $event)"
                    @click.stop
                  />
                  <h2 class="text-lg" :title="law.info">
                    {{ law.name }}
                  </h2>
                  <Button variant="link" size="sm" class="!h-fit">
                    <a v-if="law.link" :href="law.link" target="_blank" class="ml4 inline-block" @click.stop>
                      <div>原文</div>
                    </a>
                  </Button>
                </div>
              </AccordionTrigger>
              <AccordionContent>
                <div class="flex flex-wrap gap1">
                  <div
                    v-for="article, subIdx in law.articles"
                    :key="subIdx"
                    class="flex items-center gap-1px"
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
              </AccordionContent>
            </AccordionItem>
          </template>
        </Accordion>
      </CollapsibleContent>
    </Collapsible>

    <TheFooter />
  </div>
</template>

<style scoped>
.law-container {
  font-family: '宋体', 'SimSun', serif;
}
</style>
