<script setup lang="ts">
// 全局 SEO 头：useLocaleHead 生成 canonical + hreflang（en x-default / zh-CN）+ og:locale
const i18nHead = useLocaleHead({ addSeoAttributes: true })
useHead(() => ({
  htmlAttrs: { lang: i18nHead.value.htmlAttrs?.lang || 'en' },
  link: [...(i18nHead.value.link || [])],
  meta: [...(i18nHead.value.meta || [])],
}))
</script>

<template>
  <div class="site">
    <a class="skip-link" href="#main">{{ $t('nav.skip') }}</a>
    <SiteHeader />
    <main id="main" class="site-main">
      <NuxtPage />
    </main>
    <SiteFooter />
  </div>
</template>
