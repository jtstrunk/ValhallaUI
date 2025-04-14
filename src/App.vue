<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import MobileHeader from './components/MobileHeader.vue'
import MobileFooter from './components/MobileFooter.vue'
</script>

<template>
  <div id="app">
    <component 
      :is="isMobile ? MobileHeader : Header" 
      v-if="$route.path === '/'" />
    <div class="content-wrapper" ref="scrollContainer">
      <RouterView :scrolled-to-bottom="isScrolledToBottom"/>
    </div>
    <MobileFooter v-if="isMobile"/>
  </div>
</template>


<script>
export default {
  data() {
    return {
      isMobile: window.innerWidth < 420,
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
      const container = this.$refs.scrollContainer;
      const scrollTop = container.scrollTop;
      const clientHeight = container.clientHeight;
      const scrollHeight = container.scrollHeight;

      if (scrollTop + clientHeight >= scrollHeight - 20) {
        if (!this.isScrolledToBottom) {
          this.isScrolledToBottom = true;
        }
      } else {
        this.isScrolledToBottom = false;
      }
    },
    // handleScroll() {
    //   console.log("handleScroll")
    //   const scrollTop = window.scrollY;
    //   const windowHeight = window.innerHeight;
    //   const documentHeight = document.documentElement.scrollHeight;

    //   // Check if user has scrolled to the bottom
    //   if (scrollTop + windowHeight >= documentHeight - 20) {
    //     if (!this.isScrolledToBottom) {
    //       this.isScrolledToBottom = true; // Update state
    //     }
    //   } else {
    //     this.isScrolledToBottom = false; // Reset state
    //   }
    // },
    handleResize() {
      this.isMobile = window.innerWidth < 420
    }
  },
  mounted() {
    this.$refs.scrollContainer.addEventListener("scroll", this.debounce(this.handleScroll, 200));
  },
  beforeDestroy() {
    this.$refs.scrollContainer.removeEventListener("scroll", this.debounce(this.handleScroll, 200));
    clearTimeout(this.scrollTimeout);
  },
  // mounted() {
  //   window.addEventListener("scroll", this.debounce(this.handleScroll, 200));
  // },
  // beforeDestroy() {
  //   window.removeEventListener("scroll", this.debounce(this.handleScroll, 200));
  //   clearTimeout(this.scrollTimeout);
  // },
  beforeUnmount() {
    window.removeEventListener('resize', this.handleResize)
  },
  created() {
    window.addEventListener('resize', this.handleResize)
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

/* #app {
  position: relative;
  min-height: 100vh;
} */

.content-wrapper {
  flex: 1;
  width: 100%;
  height: calc(100vh - [header-height] - [footer-height]);
  overflow-y: auto;
  position: relative;
  /* display: flex;
  flex-direction: column;
  justify-content: center; */
}

.mobile-footer {
  position: fixed;
  bottom: 0;
  left: 0;
  right: 0;
  height: 60px;
  background: white;
  z-index: 100;
  box-shadow: 0 -2px 5px rgba(0,0,0,0.1);
}

@media (max-width: 	420px) {
  #app {
    width: 420px;
  }  
}
</style>