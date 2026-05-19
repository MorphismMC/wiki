import type MarkdownIt from "markdown-it"

const localeTitles: Record<string, Record<string, string>> = {
  zh: {
    tip: "提示",
    warning: "警告",
    danger: "危险",
    info: "信息",
    details: "详细信息",
  },
  en: {
    tip: "TIP",
    warning: "WARNING",
    danger: "DANGER",
    info: "INFO",
    details: "Details",
  },
}

function getLocale(env: any): string {
  // localeIndex is set by VitePress to the locale key ("en", "zh", etc.)
  if (env.localeIndex) return env.localeIndex
  // Fallback: derive from relativePath
  const path: string = env.relativePath || env.path || ""
  if (path.startsWith("zh/") || path.startsWith("/zh/") || path.includes("/zh/")) return "zh"
  return "en"
}

export function localeContainersPlugin(md: MarkdownIt): void {
  const containerTypes = ["tip", "warning", "danger", "info", "details"] as const

  for (const type of containerTypes) {
    const ruleName = `container_${type}_open`
    const defaultRender = md.renderer.rules[ruleName]
    if (!defaultRender) continue

    md.renderer.rules[ruleName] = (tokens, idx, options, env, self) => {
      const token = tokens[idx]

      if (token.nesting === 1) {
        // info after stripping the container keyword ("tip", "warning", etc.)
        const info = token.info.trim().slice(type.length).trim()
        const locale = getLocale(env)
        const defaultTitle = localeTitles[locale]?.[type] ?? localeTitles.en[type]

        if (!info) {
          // No custom title — temporarily swap in the locale-aware default.
          const saved = token.info
          token.info = `${type} ${defaultTitle}`
          const result = defaultRender(tokens, idx, options, env, self)
          token.info = saved
          return result
        }
      }

      return defaultRender(tokens, idx, options, env, self)
    }
  }
}
