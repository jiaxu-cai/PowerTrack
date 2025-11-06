import { createApp } from 'vue'
import App from './App.vue'
import router from './router'

// Import Bootstrap and Bootstrap Select
import 'bootstrap/dist/css/bootstrap.min.css'
import 'bootstrap/dist/js/bootstrap.bundle.min.js'
import 'bootstrap-select/dist/css/bootstrap-select.min.css'
import 'bootstrap-select/dist/js/bootstrap-select.min.js'

const app = createApp(App)

app.use(router)

app.mount('#app')
