<script lang="ts">
    export default {
        data: () => ({
            isPasswordVisible: false,
            form: false,
            email: null,
            password: null,
            loading: false,
            rules: {
                required: (value: string) => !!value || "Required",
                noLeadingOrTrailingWhitespace: (value: string) =>
                    /^(?! ).*[^ ]$/.test(value) ||
                    "Must not contain leading or trailing whitespace",
                isProperEmail: (value: string) =>
                    /@/.test(value) ||
                    "Must contain an '@' symbol separating local part and domain name",
                isProperlyFormatted: (value: string) =>
                    /[^\s@]+@[^\s@]+\.[^\s@]/.test(value) ||
                    "Must be properly formatted (e.g., user@example.com)",
                isEmailWithDomain: (value: string) =>
                    /[^\s@]+\.[^\s@]/.test(value) ||
                    "Must contain a domain name (e.g., example.com)",
                minEight: (value: string) => value.length >= 8 || "Min 8 characters",
                minOneDigit: (value: string) =>
                    /(?=.*[0-9])/.test(value) || "Must contain at least one digit from 1 to 9",
                minOneLowerCase: (value: string) =>
                    /(?=.*[a-z])/.test(value) || "Must contain at least one lowercase letter",
                minOneUpperCase: (value: string) =>
                    /(?=.*[A-Z])/.test(value) || "Must contain at least one UPPERCASE letter",
                minOneSpecialChar: (value: string) =>
                    /(?=.*\W)/.test(value) || "Must contain at least one special character",
                noLeadingTrailingWhitespace: (value: string) =>
                    /^(?! ).*[^ ]$/.test(value) || "Must not contain leading or trailing whitespace"
            }
        }),
        methods: {
            onSubmit() {
                if (!this.form) {
                    return;
                }

                this.loading = true;

                setTimeout(() => (this.loading = false), 3000);
            }
        }
    };
</script>

<template>
    <v-layout>
        <v-main id="login-container" class="d-sm-flex align-center justify-center ga-16">
            <h1 class="text-center">Welcome to our<br />eCommerce</h1>
            <v-card class="pa-12 pb-8" elevation="8" max-width="448" rounded="lg">
                <v-form v-model="form" @submit.prevent="onSubmit">
                    <div class="app-logo text-center d-sm-flex justify-center ga-5">
                        <h2 class="brand">eCommerce</h2>
                        <span class="app">app</span>
                    </div>

                    <div class="text-subtitle-1 text-medium-emphasis">Account</div>

                    <v-text-field
                        v-model="email"
                        :rules="[
                            rules.required,
                            rules.isProperEmail,
                            rules.isEmailWithDomain,
                            rules.noLeadingOrTrailingWhitespace,
                            rules.isProperlyFormatted
                        ]"
                        density="compact"
                        placeholder="Email address"
                        prepend-inner-icon="mdi-email-outline"
                        variant="outlined"
                        clearable
                    >
                    </v-text-field>

                    <div
                        class="text-subtitle-1 text-medium-emphasis d-flex align-center justify-space-between"
                    >
                        Password
                        <a
                            class="text-caption text-decoration-none text-blue"
                            href="#"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Forgot login password?
                        </a>
                    </div>

                    <v-text-field
                        v-model="password"
                        :readonly="loading"
                        :rules="[
                            rules.required,
                            rules.minEight,
                            rules.minOneDigit,
                            rules.minOneLowerCase,
                            rules.minOneUpperCase,
                            rules.minOneSpecialChar,
                            rules.noLeadingTrailingWhitespace
                        ]"
                        :append-inner-icon="isPasswordVisible ? 'mdi-eye-off' : 'mdi-eye'"
                        :type="isPasswordVisible ? 'text' : 'password'"
                        density="compact"
                        placeholder="Enter your password"
                        prepend-inner-icon="mdi-lock-outline"
                        variant="outlined"
                        @click:append-inner="isPasswordVisible = !isPasswordVisible"
                        clearable
                    >
                    </v-text-field>

                    <v-card class="mb-12" color="surface-variant" variant="tonal">
                        <v-card-text class="text-medium-emphasis text-caption">
                            Warning: After 3 consecutive failed login attempts, your account will be
                            temporarily locked for three hours. If you must login now, you can also
                            click "Forgot login password?" below to reset the login password.
                        </v-card-text>
                    </v-card>

                    <v-btn
                        :disabled="!form"
                        :loading="loading"
                        type="submit"
                        class="mb-8"
                        color="blue"
                        size="large"
                        variant="tonal"
                        block
                    >
                        Log In
                    </v-btn>

                    <v-card-text class="text-center">
                        <a
                            class="text-blue text-decoration-none"
                            href="#"
                            rel="noopener noreferrer"
                            target="_blank"
                        >
                            Sign up now <v-icon icon="mdi-chevron-right"></v-icon>
                        </a>
                    </v-card-text>
                </v-form>
            </v-card>
        </v-main>
    </v-layout>
</template>

<style scoped>
    #login-container {
        background:
            linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)),
            center / cover no-repeat url("../assets/img/eCommerce-store.png");
    }

    h1 {
        font-size: 96px;
        font-family: Poppins;
        font-weight: 300;
        line-height: 144px;
    }

    .app-logo .brand {
        font-family: Prata;
        font-size: 40px;
        font-weight: 400;
    }

    .app-logo .app {
        font-family: Poppins;
        transform: rotate(-90deg);
    }
</style>
