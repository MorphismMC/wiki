<script setup lang="ts">
import { ref, computed, onMounted, onUnmounted } from 'vue'
import { useData, useRouter } from 'vitepress'

const { localeIndex, lang } = useData()
const router = useRouter()

const query = ref('')
const results = ref<SearchItem[]>([])
const showResults = ref(false)
const selectedIndex = ref(-1)
const searchRef = ref<HTMLElement | null>(null)

interface SearchItem {
  path: string
  title: string
  content: string
  snippet: string
}

const enModules = import.meta.glob('../../../en/**/*.md', { eager: true, query: '?raw', import: 'default' })
const zhModules = import.meta.glob('../../../zh/**/*.md', { eager: true, query: '?raw', import: 'default' })

function stripFrontmatter(content: string): string {
  return content.replace(/^---[\s\S]*?---\n*/, '')
}

function extractTitle(content: string, path: string): string {
  const h1 = content.match(/^#\s+(.+)$/m)
  if (h1) return h1[1].trim()
  const parts = path.replace(/\\/g, '/').split('/')
  const filename = parts[parts.length - 1].replace(/\.md$/, '')
  return filename.replace(/^chap\d+-/, '').replace(/-/g, ' ')
}

function extractSnippet(content: string, keyword: string, maxLen = 80): string {
  const lower = content.toLowerCase()
  const idx = lower.indexOf(keyword.toLowerCase())
  if (idx === -1) return content.slice(0, maxLen) + (content.length > maxLen ? '...' : '')

  const start = Math.max(0, idx - Math.floor((maxLen - keyword.length) / 2))
  const end = Math.min(content.length, start + maxLen)
  let snip = content.slice(start, end)
  if (start > 0) snip = '...' + snip
  if (end < content.length) snip = snip + '...'
  return snip
}

function normalizePath(rawPath: string, locale: string): string {
  // Normalize slashes (Vite should use /, but guard against backslashes on Windows)
  let p = rawPath.replace(/\\/g, '/')
  // Strip the relative prefix from the glob result
  p = p.replace(/^\.\.\/\.\.\/\.\.\//, '')
  // Remove .md extension
  p = p.replace(/\.md$/, '')
  // Ensure it starts with the locale prefix
  if (!p.startsWith(`/${locale}/`)) {
    p = `/${locale}/` + p.replace(new RegExp(`^${locale}/`), '')
  }
  // Convert /index to / (VitePress treats index.md as the directory root)
  p = p.replace(/\/index$/, '/')
  return p
}

function buildIndex(): Record<string, SearchItem[]> {
  const map: Record<string, SearchItem[]> = {}

  const enItems: SearchItem[] = []
  for (const [rawPath, raw] of Object.entries(enModules)) {
    const content = stripFrontmatter(raw as string)
    const path = normalizePath(rawPath, 'en')
    enItems.push({
      path,
      title: extractTitle(content, rawPath),
      content,
      snippet: ''
    })
  }
  map['en'] = enItems

  const zhItems: SearchItem[] = []
  for (const [rawPath, raw] of Object.entries(zhModules)) {
    const content = stripFrontmatter(raw as string)
    const path = normalizePath(rawPath, 'zh')
    zhItems.push({
      path,
      title: extractTitle(content, rawPath),
      content,
      snippet: ''
    })
  }
  map['zh'] = zhItems

  return map
}

const searchIndex = buildIndex()

const currentItems = computed(() => {
  const locale = localeIndex.value || 'zh'
  return searchIndex[locale] || searchIndex['zh']
})

let debounceTimer: ReturnType<typeof setTimeout> | null = null

function doSearch() {
  const q = query.value.trim().toLowerCase()
  if (!q || q.length < 1) {
    results.value = []
    showResults.value = false
    selectedIndex.value = -1
    return
  }

  const matches = currentItems.value
    .filter(item => item.content.toLowerCase().includes(q))
    .map(item => ({
      ...item,
      snippet: extractSnippet(item.content, q)
    }))
    .slice(0, 10)

  results.value = matches
  showResults.value = matches.length > 0
  selectedIndex.value = -1
}

function onInput() {
  if (debounceTimer) clearTimeout(debounceTimer)
  debounceTimer = setTimeout(doSearch, 200)
}

function navigateTo(path: string) {
  showResults.value = false
  query.value = ''
  results.value = []
  selectedIndex.value = -1
  router.go(path)
}

function highlightText(text: string, keyword: string): string {
  if (!keyword) return text
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')
  const regex = new RegExp(`(${escaped})`, 'gi')
  return text.replace(regex, '<mark>$1</mark>')
}

function onKeydown(e: KeyboardEvent) {
  if (!showResults.value || results.value.length === 0) return

  if (e.key === 'ArrowDown') {
    e.preventDefault()
    selectedIndex.value = Math.min(selectedIndex.value + 1, results.value.length - 1)
  } else if (e.key === 'ArrowUp') {
    e.preventDefault()
    selectedIndex.value = Math.max(selectedIndex.value - 1, 0)
  } else if (e.key === 'Enter') {
    e.preventDefault()
    if (selectedIndex.value >= 0 && selectedIndex.value < results.value.length) {
      navigateTo(results.value[selectedIndex.value].path)
    }
  } else if (e.key === 'Escape') {
    showResults.value = false
    selectedIndex.value = -1
    query.value = ''
    results.value = []
  }
}

function onFocus() {
  if (query.value.trim().length > 0 && results.value.length > 0) {
    showResults.value = true
  }
}

function onClickOutside(e: MouseEvent) {
  if (searchRef.value && !searchRef.value.contains(e.target as Node)) {
    showResults.value = false
  }
}

onMounted(() => {
  document.addEventListener('click', onClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', onClickOutside)
})
</script>

<template>
  <div ref="searchRef" class="oreui-search">
    <div class="oreui-search-input-wrapper">
      <svg class="oreui-search-icon" viewBox="0 0 24 24" width="16" height="16" fill="none" stroke="currentColor" stroke-width="2.5">
        <circle cx="11" cy="11" r="8" />
        <path d="m21 21-4.35-4.35" />
      </svg>
      <input
        v-model="query"
        type="text"
        class="oreui-search-input"
        :placeholder="localeIndex === 'zh' ? '搜索文档...' : 'Search docs...'"
        @input="onInput"
        @keydown="onKeydown"
        @focus="onFocus"
        autocomplete="off"
      />
      <button
        v-if="query.length > 0"
        class="oreui-search-clear"
        @click="query = ''; results = []; showResults = false"
        type="button"
      >
        <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor">
          <path d="M18 6L6 18M6 6l12 12" stroke="currentColor" stroke-width="2" fill="none" />
        </svg>
      </button>
    </div>

    <div v-if="showResults" class="oreui-search-results">
      <div
        v-for="(item, idx) in results"
        :key="item.path"
        class="oreui-search-result-item"
        :class="{ 'oreui-selected': idx === selectedIndex }"
        @click="navigateTo(item.path)"
        @mouseenter="selectedIndex = idx"
      >
        <div class="oreui-search-result-title" v-html="highlightText(item.title, query.trim())" />
        <div class="oreui-search-result-path">{{ item.path }}</div>
        <div class="oreui-search-result-snippet" v-html="highlightText(item.snippet, query.trim())" />
      </div>
      <div v-if="results.length === 0" class="oreui-search-no-results">
        {{ localeIndex === 'zh' ? '没有找到相关结果' : 'No results found' }}
      </div>
    </div>
  </div>
</template>

<style scoped>
/* Container */
.oreui-search {
  position: relative;
  width: 260px;
  margin: 0 8px;
}

/* Input wrapper — OreUI beveled border style, mirrors .DocSearch-Button */
.oreui-search-input-wrapper {
  display: flex;
  align-items: center;
  background-color: var(--vp-c-bg);
  border: 2px solid var(--vp-c-border);
  border-top-color: #5A5B5C;
  box-shadow:
    inset 0 -3px var(--vp-c-divider),
    inset 2px 2px rgba(255, 255, 255, 0.08),
    inset -2px -5px rgba(255, 255, 255, 0.05);
  height: 32px;
  padding: 0 6px;
  transition: border-color 0.15s;
}

.oreui-search-input-wrapper:focus-within {
  border-color: #6CC349;
}

/* Search icon */
.oreui-search-icon {
  flex-shrink: 0;
  color: var(--vp-c-text-3);
  margin: 0 6px 0 4px;
}

.oreui-search-input-wrapper:focus-within .oreui-search-icon {
  color: #6CC349;
}

/* Input */
.oreui-search-input {
  flex: 1;
  background: none;
  border: none;
  outline: none;
  color: var(--vp-c-text-1);
  font-family: var(--vp-font-family-base);
  font-size: 13px;
  line-height: 1;
  min-width: 0;
}

.oreui-search-input::placeholder {
  color: rgba(255, 255, 255, 0.4);
}

/* Clear button */
.oreui-search-clear {
  flex-shrink: 0;
  display: flex;
  align-items: center;
  justify-content: center;
  background: none;
  border: none;
  color: var(--vp-c-text-3);
  cursor: pointer;
  padding: 2px;
  margin: 0 2px;
}

.oreui-search-clear:hover {
  color: var(--vp-c-text-1);
}

/* Results dropdown */
.oreui-search-results {
  position: absolute;
  top: calc(100% + 4px);
  left: 0;
  right: 0;
  background-color: var(--vp-c-bg-alt);
  border: 2px solid var(--vp-c-border);
  border-top: 2px solid #5A5B5C;
  box-shadow:
    inset 0 -2px var(--vp-c-divider),
    0 4px 12px rgba(0, 0, 0, 0.4);
  z-index: 1000;
  max-height: 360px;
  overflow-y: auto;
}

/* Result items */
.oreui-search-result-item {
  padding: 8px 12px;
  cursor: pointer;
  border-left: 2px solid transparent;
  border-bottom: 1px solid var(--vp-c-divider);
  transition: background-color 0.1s, border-left-color 0.1s;
}

.oreui-search-result-item:last-child {
  border-bottom: none;
}

.oreui-search-result-item:hover,
.oreui-search-result-item.oreui-selected {
  background-color: var(--vp-c-bg);
  border-left: 2px solid var(--vp-c-text-1);
}

.oreui-search-result-item.oreui-selected {
  background-color: var(--vp-c-brand-soft);
  border-left: 2px solid var(--vp-c-brand-1);
}

/* Result title */
.oreui-search-result-title {
  font-family: var(--vp-font-family-base);
  font-size: 13px;
  color: var(--vp-c-text-1);
  line-height: 1.4;
}

.oreui-search-result-title :deep(mark) {
  background-color: rgba(108, 195, 73, 0.3);
  color: #6CC349;
}

/* Result path */
.oreui-search-result-path {
  font-family: var(--vp-font-family-base);
  font-size: 10px;
  color: var(--vp-c-text-3);
  margin-top: 1px;
  line-height: 1.3;
}

/* Result snippet */
.oreui-search-result-snippet {
  font-family: var(--vp-font-family-base);
  font-size: 11px;
  color: var(--vp-c-text-2);
  margin-top: 2px;
  line-height: 1.4;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

.oreui-search-result-snippet :deep(mark) {
  background-color: rgba(108, 195, 73, 0.3);
  color: #6CC349;
}

/* No results */
.oreui-search-no-results {
  padding: 12px;
  text-align: center;
  font-family: var(--vp-font-family-base);
  font-size: 13px;
  color: var(--vp-c-text-3);
}

/* Mobile: hide search or make smaller */
@media (max-width: 768px) {
  .oreui-search {
    width: 180px;
  }
  .oreui-search-input {
    font-size: 12px;
  }
}

@media (max-width: 480px) {
  .oreui-search {
    display: none;
  }
}
</style>
