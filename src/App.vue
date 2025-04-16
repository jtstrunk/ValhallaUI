<script setup>
import { RouterLink, RouterView } from 'vue-router'
import Header from './components/Header.vue'
import MobileHeader from './components/MobileHeader.vue'
import MobileFooter from './components/MobileFooter.vue'
</script>

<template>
  <div id="app">
    <component 
      :is="isMobile ? MobileHeader : Header" />
    <Toast />
    <div class="content-wrapper" ref="scrollContainer">
      <RouterView :scrolled-to-bottom="isScrolledToBottom"/>
    </div>
    <MobileFooter v-if="isMobile"/>
  </div>
</template>

<script>
import Toast from 'primevue/toast';

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
    handleResize() {
      this.isMobile = window.innerWidth < 420
    }
  },
  mounted() {
    console.log('moutned')
    this.$refs.scrollContainer.addEventListener("scroll", this.debounce(this.handleScroll, 10));
  },
  beforeDestroy() {
    this.$refs.scrollContainer.removeEventListener("scroll", this.debounce(this.handleScroll, 10));
    clearTimeout(this.scrollTimeout);
  },
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

/* Override the info toast background and text color */
.p-toast-message-info {
  background-color: #242526 !important; /* Bootstrap blue or your preferred blue */
  color: red !important;
  border: red !important;
  padding: 12px !important;
  border-radius: 2% !important;
  border: 1px solid red !important;
}

/* Optional: override icon color */
.p-toast-message-icon {
  color: red !important;
  margin-right: 8px !important;
}




@media (max-width: 	420px) {
  #app {
    width: 395px;
  }  

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
}
</style>