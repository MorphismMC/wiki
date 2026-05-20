import DefaultTheme from "vitepress/theme";
import CustomLayout from "./components/custom-layout.vue";
import "./style.css";
import 'virtual:group-icons.css'

export default {
  ...DefaultTheme,
  Layout: CustomLayout,
};
