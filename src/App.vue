<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
</script>

<template>
  <div id="app">
    <Header/>
    <RouterView :scrolled-to-bottom="isScrolledToBottom"/>
  </div>
</template>

<script>
export default {
  data() {
    return {
      isScrolledToBottom: false,
    };
  },
  methods: {
    debounce(func, wait) {
      return (...args) => {
        clearTimeout(this.scrollTimeout);
        this.scrollTimeout = setTimeout(() => func.apply(this, args), wait);
      };
    },
    handleScroll() {
      const scrollTop = window.scrollY;
      const windowHeight = window.innerHeight;
      const documentHeight = document.documentElement.scrollHeight;

      // Check if user has scrolled to the bottom
      if (scrollTop + windowHeight >= documentHeight - 20) {
        if (!this.isScrolledToBottom) {
          this.isScrolledToBottom = true; // Update state
        }
      } else {
        this.isScrolledToBottom = false; // Reset state
      }
    },
  },
  mounted() {
    window.addEventListener("scroll", this.debounce(this.handleScroll, 200));
  },
  beforeDestroy() {
    window.removeEventListener("scroll", this.debounce(this.handleScroll, 200));
    clearTimeout(this.scrollTimeout);
  },
};
</script>

<style>
body, html {
  margin: 0;
  padding: 0;
  width: 100%;
  height: 100%;
}

#app {
  width: 100%;
  min-height: 100vh;
  display: flex;
  flex-direction: column;
  align-items: center;
}

.content {
  flex: 1;
  padding: 20px;
}
</style>