import { defineConfig } from 'vitepress'
import { groupIconMdPlugin, groupIconVitePlugin } from 'vitepress-plugin-group-icons'
import { MermaidMarkdown, MermaidPlugin } from "vitepress-plugin-mermaid"
import { localeContainersPlugin } from "../plugin/locale-containers"

export const style = defineConfig({

  markdown: {
    lineNumbers: true,

    config(md) {
      md.use(groupIconMdPlugin)
      md.use(MermaidMarkdown)
      localeContainersPlugin(md)
    }

  },

  vite: {
    plugins: [
      MermaidPlugin(),
      groupIconVitePlugin()
    ],
    optimizeDeps: {
      include: ["mermaid"],
    },
    ssr: {
      noExternal: ["mermaid"],
    }
  }

})