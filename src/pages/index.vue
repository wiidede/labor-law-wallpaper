<script setup lang="ts">
const laws = useLaws()
const currentLawIndex = ref(0)
const currentArticleIndex = ref(0)
const currentLaw = computed(() => laws[currentLawIndex.value])
const currentArticle = computed(() => currentLaw.value?.articles[currentArticleIndex.value])

async function randomNextLaw() {
  currentLawIndex.value = Math.floor(Math.random() * laws.length)
  await nextTick()
  currentArticleIndex.value = Math.floor(Math.random() * currentLaw.value.articles.length)
}

const { pause, resume, isActive } = useIntervalFn(() => randomNextLaw(), 6000)

function handleSkip() {
  resume()
  randomNextLaw()
}
</script>

<template>
  <div class="screen flex flex-col items-center justify-around bg-#DB3832 text-#FFFF54">
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

  <div class="p4">
    <div class="flex">
      <div class="icon-btn" :class="isActive ? 'i-carbon-pause' : 'i-carbon-play'" @click="isActive ? pause() : resume()" />
      <div class="i-carbon-skip-forward icon-btn" @click="handleSkip()" />
    </div>
    <div v-for="law, idx in laws" :key="idx">
      <h2 class="text-lg" :title="law.info">
        {{ law.name }}
        <a v-if="law.link" :href="law.link" target="_blank"><span class="ml-4 text-0.67em underline op-50">原文</span></a>
      </h2>
      <div class="flex flex-wrap gap2">
        <template v-for="article, subIdx in law.articles" :key="subIdx">
          <button class="btn" :title="article.content" @click="currentArticleIndex = subIdx; currentLawIndex = idx">
            {{ subIdx + 1 }}
          </button>
        </template>
      </div>
    </div>

    <TheFooter />
  </div>
</template>

<style scoped>
.screen {
  width: 100vw;
  height: 100vh;
  width: 100dvw;
  height: 100dvh;
  font-family: '宋体', 'SimSun', serif;
}
</style>
