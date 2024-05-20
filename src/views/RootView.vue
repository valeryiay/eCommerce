<script lang="ts">
    export default {
        data: () => ({
            isDrawerOpen: false
        })
    }
</script>

<template>
    <v-layout>
        <v-app-bar>
            <v-app-bar-nav-icon @click="isDrawerOpen = !isDrawerOpen"></v-app-bar-nav-icon>
            <v-app-bar-title>eCommerce Application</v-app-bar-title>
        </v-app-bar>

        <v-navigation-drawer v-model="isDrawerOpen">
            <v-list>
                <v-list-item><RouterLink to="/">Home</RouterLink></v-list-item>
                <v-list-item><RouterLink to="/about">About</RouterLink></v-list-item>
                <v-list-item><RouterLink to="/login">Login</RouterLink></v-list-item>
                <v-list-item><RouterLink to="/not-found">Not Found</RouterLink></v-list-item>
                <v-list-item><RouterLink to="/registration">Registration</RouterLink></v-list-item>
            </v-list>
        </v-navigation-drawer>

        <v-main class="main d-flex">
            <RouterView />
        </v-main>

        <v-footer app>@Copyright {{ new Date().getFullYear() }}</v-footer>
    </v-layout>
</template>

<style scoped>
    .main {
        min-height: 300px;
    }
</style>
