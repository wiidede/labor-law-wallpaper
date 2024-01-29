<script setup lang="ts">
const laws = useLaws()
const currentLawIndex = ref(0)
const currentArticleIndex = ref(0)
const currentLaw = computed(() => laws[currentLawIndex.value])
const currentArticle = computed(() => currentLaw.value?.articles[currentArticleIndex.value])

const isShuffle = ref(false)
const toggleShuffle = () => isShuffle.value = !isShuffle.value

async function nextLaw() {
  if (isShuffle.value) {
    currentLawIndex.value = Math.floor(Math.random() * laws.length)
    await nextTick()
    currentArticleIndex.value = Math.floor(Math.random() * currentLaw.value.articles.length)
  }
  else {
    const nextArticleIndex = currentArticleIndex.value + 1
    if (nextArticleIndex >= currentLaw.value.articles.length) {
      currentLawIndex.value = (currentLawIndex.value + 1) % laws.length
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

const lawVisible = ref(false)
const lawsVisible = ref<string[]>([])
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
    <div class="flex gap4">
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
          <template v-for="law, idx in laws" :key="idx">
            <AccordionItem :value="String(idx)">
              <AccordionTrigger>
                <h2 class="text-lg" :title="law.info">
                  {{ law.name }}
                </h2>
              </AccordionTrigger>
              <AccordionContent>
                <a v-if="law.link" :href="law.link" target="_blank" class="mb2 block"><span class="underline op-50">原文</span></a>
                <div class="flex flex-wrap gap1">
                  <template v-for="article, subIdx in law.articles" :key="subIdx">
                    <Button
                      :variant="currentLawIndex === idx && currentArticleIndex === subIdx ? 'default' : 'outline'"
                      size="sm"
                      :title="article.content"
                      :disabled="currentLawIndex === idx && currentArticleIndex === subIdx"
                      @click="setIndex(idx, subIdx)"
                    >
                      {{ subIdx + 1 }}
                    </Button>
                  </template>
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
  visibility: hidden;
}
</style>
