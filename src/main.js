// import './assets/main.css'

import { createApp } from 'vue'
import PrimeVue from 'primevue/config';
import App from './App.vue'
import router from './router'
import Dialog from 'primevue/dialog'
import './assets/styles.css';
import { AutoComplete, InputText } from 'primevue';

const app = createApp(App)

app.use(router);
app.use(PrimeVue);
app.component('Dialog', Dialog);
app.component('AutoComplete', AutoComplete);
app.component('Input', InputText);
app.mount('#app');