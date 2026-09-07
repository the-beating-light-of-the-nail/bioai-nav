<script setup lang="ts">
import { CATEGORIES, catText } from '~/data/categories'
import { usePageSeo, useBreadcrumbJsonLd } from '~/composables/seo'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const loc = computed(() => locale.value as 'en' | 'zh')
const isZh = loc.value === 'zh'

usePageSeo({
  title: isZh ? '提交 BioAI 资源 | BioAI Nav' : 'Submit a BioAI Resource | BioAI Nav',
  description: isZh
    ? '推荐收录进 BioAI Nav 目录的工具、智能体、技能库、Awesome 清单、模型、平台、数据集或学习资源。每份投稿都由人工审核，通常一周内处理。'
    : 'Suggest a tool, agent, skill library, awesome list, model, platform, dataset or learning resource for the BioAI Nav catalog. Every submission is human-reviewed, usually within a week.',
})
useBreadcrumbJsonLd([
  { name: t('common.home'), path: localePath('/') },
  { name: isZh ? '投稿' : 'Submit', path: localePath('/submit') },
])

// 表单直连 Worker /api/submit（Upstash 暂存 + 每 IP 限频），无需账号；
// 埋蜜罐字段 company 拦截机器人，人工后台经 Bearer token 拉队列终审
const form = reactive({
  name: '',
  url: '',
  github: '',
  category: '',
  description: '',
  submitter: '',
  email: '',
  company: '', // honeypot
})
const sending = ref(false)
const done = ref(false)
const error = ref('')

const submittableCats = CATEGORIES.filter((c) => c.slug !== 'github')

async function submit() {
  error.value = ''
  if (!form.name.trim() || !form.url.trim() || !form.category || form.description.trim().length < 10) {
    error.value = t('submit.errorForm')
    return
  }
  sending.value = true
  try {
    const res = await fetch('/api/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(form),
    })
    const data = (await res.json()) as { ok?: boolean; error?: string }
    if (!res.ok || !data.ok) throw new Error(data.error || `Request failed (${res.status})`)
    done.value = true
  } catch (e) {
    error.value = e instanceof Error ? e.message : 'Something went wrong — please try again later.'
  } finally {
    sending.value = false
  }
}

function resetForm() {
  done.value = false
  form.name = ''
  form.url = ''
  form.github = ''
  form.category = ''
  form.description = ''
  form.submitter = ''
  form.email = ''
}
</script>

<template>
  <div class="container page page-narrow">
    <nav class="breadcrumb" aria-label="Breadcrumb">
      <NuxtLink :to="localePath('/')">{{ t('common.home') }}</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">{{ isZh ? '投稿' : 'Submit' }}</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">{{ t('submit.title') }}</h1>
      <p class="page-tagline">{{ t('submit.sub') }}</p>
    </header>

    <div v-if="done" class="submit-done">
      <h2>{{ t('submit.doneTitle') }}</h2>
      <p>{{ t('submit.doneText') }}</p>
      <div class="cta-actions">
        <NuxtLink class="btn btn-primary" :to="localePath('/')">{{ t('submit.backHome') }}</NuxtLink>
        <button class="btn btn-ghost" type="button" @click="resetForm">{{ t('submit.another') }}</button>
      </div>
    </div>

    <form v-else class="submit-form" novalidate @submit.prevent="submit">
      <div class="form-row form-row-2">
        <label class="form-field">
          <span>{{ t('submit.name') }} <b>*</b></span>
          <input v-model="form.name" type="text" maxlength="100" placeholder="e.g. ClawBio" required />
        </label>
        <label class="form-field">
          <span>{{ t('submit.url') }} <b>*</b></span>
          <input v-model="form.url" type="url" maxlength="300" placeholder="https://…" required />
        </label>
      </div>

      <div class="form-row form-row-2">
        <label class="form-field">
          <span>{{ t('submit.github') }}</span>
          <input v-model="form.github" type="url" maxlength="300" placeholder="https://github.com/owner/repo" />
        </label>
        <label class="form-field">
          <span>{{ t('submit.category') }} <b>*</b></span>
          <select v-model="form.category" required>
            <option value="" disabled>{{ t('submit.categoryPlaceholder') }}</option>
            <option v-for="c in submittableCats" :key="c.slug" :value="c.slug">{{ catText(c, loc).title }}</option>
            <option value="other">{{ t('submit.other') }}</option>
          </select>
        </label>
      </div>

      <div class="form-row">
        <label class="form-field">
          <span>{{ t('submit.description') }} <b>*</b></span>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="600"
            :placeholder="t('submit.descPlaceholder')"
            required
          />
        </label>
      </div>

      <div class="form-row form-row-2">
        <label class="form-field">
          <span>{{ t('submit.submitter') }}</span>
          <input v-model="form.submitter" type="text" maxlength="60" :placeholder="t('submit.submitterPlaceholder')" />
        </label>
        <label class="form-field">
          <span>{{ t('submit.email') }}</span>
          <input v-model="form.email" type="email" maxlength="120" :placeholder="t('submit.emailPlaceholder')" />
        </label>
      </div>

      <input v-model="form.company" type="text" name="company" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true" />

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="form-actions">
        <button class="btn btn-primary" type="submit" :disabled="sending">
          {{ sending ? t('submit.sending') : t('submit.send') }}
        </button>
        <span class="form-hint">{{ t('submit.hint') }}</span>
      </div>
    </form>
  </div>
</template>
