// Vuetify
import "vuetify/styles";
import { createVuetify } from "vuetify";
import * as components from "vuetify/components";
import * as directives from "vuetify/directives";

// Material design
import "@mdi/font/css/materialdesignicons.css";

// Main App css
import "./assets/css/main.css";

// Components
import { createApp } from "vue";
import App from "./App.vue";
import router from "./router";

// Set up
const app = createApp(App);
const vuetify = createVuetify({
    components,
    directives,
    theme: {
        defaultTheme: "dark"
    }
});

// Bootstrap
app
    .use(router)
    .use(vuetify);

app.mount("#app");
