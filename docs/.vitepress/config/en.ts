import { type DefaultTheme, defineConfig } from "vitepress"

export const en = defineConfig({
  lang: "en-US",
  themeConfig: {
    nav: [
      { text: "Home", link: "./" },
    ],
    sidebar: {
      "/en/gtceu/": gtceuSidebar(),
    },
    returnToTopLabel: "Back to Top",
    sidebarMenuLabel: "Menu",
    outline: {
      label: "Page Outline",
    },
    editLink: {
      pattern:
        "https://github.com/MorphismMC/Wiki/edit/main/docs/",
      text: "Edit this page on GitHub",
    },
    lastUpdated: {
      text: "Last Updated",
    },
    search: {
      provider: "local",
      options: {
        locales: {
          root: {
            translations: {
              button: {
                buttonText: "Search Docs",
                buttonAriaLabel: "Search Docs",
              },
              modal: {
                noResultsText: "No results found",
                resetButtonTitle: "Reset search",
                footer: {
                  selectText: "Select",
                  navigateText: "Navigate",
                },
              },
            },
          },
        },
      },
    },
    docFooter: {
      prev: "Previous",
      next: "Next",
    }
  }
});

function gtceuSidebar(): DefaultTheme.SidebarItem[] {
  return [
    {
      items: [
        { text: "Introduction", link: "./intro" },
        { text: "Meta Items", link: "./chap1-metaitem" },
        { text: "Materials I", link: "./chap2-material" },
        { text: "Materials II", link: "./chap3-material-2" },
        { text: "Variant Blocks", link: "./chap4-variant-block" },
        { text: "Recipes I", link: "./chap5-recipemap" },
        { text: "Recipes II", link: "./chap6-recipemap-2" }
      ]
    }
  ]
};
