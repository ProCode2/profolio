import { StyleManager } from "./styleManager";


const manager = new StyleManager();

document.addEventListener("DOMContentLoaded", (_) => {
  manager.loadELements();
})
