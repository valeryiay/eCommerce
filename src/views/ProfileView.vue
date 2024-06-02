<script lang="ts">
    import { mergeProps } from "vue";
    import { useAuthStore } from "@/store";
    import type { FullCustomerAddress } from "@/types";
    import { COUNTRIES } from "@/constants";

    export default {
        data: () => ({
            authStore: useAuthStore(),
            customerTabs: null
        }),
        methods: {
            mergeProps,
            formatDate(date: string): string {
                if (!date) {
                    return "";
                }

                return new Date(date)
                    .toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
            },
            getColorForAddressType(addressType: string): string {
                if (addressType.includes("Default")) {
                    return "blue";
                }

                return "";
            }
        },
        computed: {
            customerAddressesTableHeaders(): Object[] {
                return [
                    {
                        title: "Contact Name",
                        key: "contactName",
                        value: (item: FullCustomerAddress) => `${item.firstName} ${item.lastName}`
                    },
                    {
                        title: "Country",
                        key: "country",
                        value: (item: FullCustomerAddress) => {
                            const country = COUNTRIES.find((c) => c.code == item.country);

                            if (!country) {
                                return item.country;
                            }

                            return country.title;
                        }
                    },
                    {
                        title: "City",
                        key: "city",
                        value: (item: FullCustomerAddress) =>
                            `${item.city || ""}${item.state ? "," : ""} ${item.state || ""}`
                    },
                    {
                        title: "Address",
                        key: "address",
                        value: (item: FullCustomerAddress) =>
                            `${item.streetName} ${item.streetNumber}`
                    },
                    { title: "Postal Code", value: "postalCode" },
                    {
                        title: "Address Type",
                        key: "addressType",
                        value: (item: FullCustomerAddress) => {
                            const isShippingAddress = this.authStore?.user?.user?.shippingAddressIds.includes(item.id);
                            const isShippingAddressDefault = this.authStore?.user?.user?.defaultShippingAddressId === item.id;

                            if (isShippingAddress) {
                                return `Shipping ${ isShippingAddressDefault ? "(Default)" : "" }`;
                            }

                            const isBillingAddress = this.authStore?.user?.user?.billingAddressIds.includes(item.id);
                            const isBillingAddressDefault = this.authStore?.user?.user?.defaultBillingAddressId === item.id;

                            if (isBillingAddress) {
                                return `Billing ${ isBillingAddressDefault ? "(Default)" : "" }`;
                            }

                            return "";
                        }
                    }
                ];
            }
        }
    };
</script>

<template>
    <v-container fluid>
        <v-row>
            <v-col>
                <v-sheet rounded="lg" class="">
                    <v-row>
                        <v-col cols="2" class="customer-avatar-column">
                            <v-card
                                min-width="200"
                                min-height="200"
                                flat
                            >
                                <v-avatar
                                    class="mx-auto customer-avatar"
                                    color="grey-darken-3"
                                    size="200"
                                    rounded="0"
                                >
                                    <img
                                        height="100%"
                                        min-width="200"
                                        alt="Default profile image"
                                        src="@/assets/img/default-avatar.svg"
                                    >
                                </v-avatar>
                            </v-card>
                        </v-col>
                        <v-col>
                            <h2 class="text-h4 font-weight-black">{{ authStore?.user?.user?.firstName }} {{ authStore?.user?.user?.lastName }}</h2>
                            <p
                                v-if="authStore?.user?.user?.dateOfBirth"
                                class="text-h6"
                            >
                                <v-icon icon="mdi-cake-layered"></v-icon>
                                <span class="birthday-text ml-2">Cake Day: {{ formatDate(authStore?.user?.user?.dateOfBirth || "") || "N/A" }}</span>
                            </p>
                        </v-col>
                    </v-row>
                </v-sheet>
            </v-col>
        </v-row>
        <v-row>
            <v-col>
                <v-sheet
                    min-height="50vh"
                    rounded="lg"
                >
                    <v-tabs
                        v-model="customerTabs"
                        color="white"
                        slider-color="#f78166"
                        align-tabs="center"
                    >
                        <v-tab value="general">General</v-tab>
                        <v-tab value="addresses">Addresses</v-tab>
                        <v-tab value="orders">Orders</v-tab>
                    </v-tabs>
                    <v-tabs-window
                        v-model="customerTabs"
                    >
                        <v-tabs-window-item value="general">
                            <v-card>
                                <v-card-text>General info and edit</v-card-text>
                            </v-card>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="addresses">
                            <v-card>
                                <v-data-table
                                    :headers="customerAddressesTableHeaders"
                                    :items="authStore?.user?.user?.addresses"
                                    hide-default-footer
                                >
                                    <template v-slot:[`item.addressType`]="{ value }">
                                        <v-chip :color="getColorForAddressType(value)">{{ value  }}</v-chip>
                                    </template>
                                </v-data-table>
                            </v-card>
                        </v-tabs-window-item>
                        <v-tabs-window-item value="orders">
                            <v-card>
                                <v-card-text>This feature is coming in the next release</v-card-text>
                            </v-card>
                        </v-tabs-window-item>
                    </v-tabs-window>
                </v-sheet>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .v-row {
        margin: 0;
    }

    .customer-avatar-column {
        display: inline-table;
    }

    .customer-avatar {
        border-radius: 5% !important;
    }

    .birthday-text {
        position: relative;
        bottom: -8px;
    }
</style>
