<script setup lang="ts">
import { CATEGORIES } from '~/data/categories'
import { usePageSeo, useBreadcrumbJsonLd } from '~/composables/seo'

usePageSeo({
  title: 'Submit a BioAI Resource | BioAI Nav',
  description:
    'Suggest a tool, agent, skill library, awesome list, model, platform, dataset or learning resource for the BioAI Nav catalog. Every submission is human-reviewed, usually within a week.',
  path: '/submit',
})
useBreadcrumbJsonLd([
  { name: 'Home', path: '/' },
  { name: 'Submit', path: '/submit' },
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
    error.value = 'Please fill in the resource name, URL, category and a description of at least 10 characters.'
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
      <NuxtLink to="/">Home</NuxtLink>
      <span aria-hidden="true">›</span>
      <span aria-current="page">Submit</span>
    </nav>

    <header class="page-head">
      <h1 class="page-title">Submit a resource</h1>
      <p class="page-tagline">
        Suggest a BioAI tool, agent, skill library, awesome list, model, platform, dataset or learning resource.
        Every submission is reviewed by a human — usually within a week.
      </p>
    </header>

    <div v-if="done" class="submit-done">
      <h2>Thank you — submission received</h2>
      <p>
        Your suggestion is in the review queue. If it is accepted, it will appear in the catalog with credit to no one
        but the resource itself (we list projects, not people).
      </p>
      <div class="cta-actions">
        <NuxtLink class="btn btn-primary" to="/">Back to home</NuxtLink>
        <button class="btn btn-ghost" type="button" @click="resetForm">Submit another</button>
      </div>
    </div>

    <form v-else class="submit-form" novalidate @submit.prevent="submit">
      <div class="form-row form-row-2">
        <label class="form-field">
          <span>Resource name <b>*</b></span>
          <input v-model="form.name" type="text" maxlength="100" placeholder="e.g. ClawBio" required />
        </label>
        <label class="form-field">
          <span>Official URL <b>*</b></span>
          <input v-model="form.url" type="url" maxlength="300" placeholder="https://…" required />
        </label>
      </div>

      <div class="form-row form-row-2">
        <label class="form-field">
          <span>GitHub repository (optional)</span>
          <input v-model="form.github" type="url" maxlength="300" placeholder="https://github.com/owner/repo" />
        </label>
        <label class="form-field">
          <span>Category <b>*</b></span>
          <select v-model="form.category" required>
            <option value="" disabled>Select the best fit…</option>
            <option v-for="c in submittableCats" :key="c.slug" :value="c.slug">{{ c.title }}</option>
            <option value="other">Not sure / other</option>
          </select>
        </label>
      </div>

      <div class="form-row">
        <label class="form-field">
          <span>Description <b>*</b></span>
          <textarea
            v-model="form.description"
            rows="4"
            maxlength="600"
            placeholder="One or two sentences: what it is and why it matters to the BioAI ecosystem."
            required
          />
        </label>
      </div>

      <div class="form-row form-row-2">
        <label class="form-field">
          <span>Your name (optional)</span>
          <input v-model="form.submitter" type="text" maxlength="60" placeholder="For our records only" />
        </label>
        <label class="form-field">
          <span>Email (optional)</span>
          <input v-model="form.email" type="email" maxlength="120" placeholder="Only used to notify you about the listing" />
        </label>
      </div>

      <input v-model="form.company" type="text" name="company" tabindex="-1" autocomplete="off" class="honeypot" aria-hidden="true" />

      <p v-if="error" class="form-error" role="alert">{{ error }}</p>

      <div class="form-actions">
        <button class="btn btn-primary" type="submit" :disabled="sending">
          {{ sending ? 'Submitting…' : 'Submit for review' }}
        </button>
        <span class="form-hint">No account needed. No tracking beyond rate limits.</span>
      </div>
    </form>
  </div>
</template>
