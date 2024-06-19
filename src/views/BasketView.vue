<script lang="ts">
    import { useAuthStore } from "@/store";

    import {
        addProductToCart,
        getAnonymousUser,
        getMyCarts,
        removeProductFromCart,
        createCart,
        removeProductsFromCart
    } from "@/services/commercetoolsApi";

    import type { CustomerWithToken } from "@/types";

    export default {
        data: () => ({
            authStore: useAuthStore(),
            promoCodeModel: "",
            isPromoCodeApplied: false,
            notification: {
                isDisplay: false,
                message: ""
            }
        }),
        methods: {
            async addToCart(productId: string, quantity: number = 1): Promise<void> {
                this.notification.message = "";

                // If anonymous user, creating temporary session
                if (!this.authStore.user?.token) {
                    const anonymousUser = await getAnonymousUser();
                    this.authStore.updateUserData(anonymousUser as CustomerWithToken);
                }

                let userCart = this.authStore.user?.cart;

                if (!userCart) {
                    try {
                        const userCarts = await getMyCarts(this.authStore.user?.token?.access_token || "");

                        if (userCarts.count) {
                            userCart = userCarts.results[0];
                        } else {
                            throw new Error("CT_NO_CART_ERROR");
                        }
                    } catch (error) {
                        userCart = await createCart(this.authStore.user!.token.access_token);
                    }
                }

                try {
                    const cartResult = await addProductToCart(
                        this.authStore.user?.token?.access_token || "",
                        productId,
                        userCart!.id,
                        userCart!.version,
                        quantity
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            async removeFromCart(productId: string, quantity: number = 1): Promise<void> {
                const lineItem = this.authStore.user?.cart?.lineItems.find((item) => item.productId === productId);

                if (!lineItem) {
                    return;
                }

                this.notification.message = "";

                try {
                    const cartResult = await removeProductFromCart(
                        this.authStore.user?.token?.access_token || "",
                        lineItem.id,
                        this.authStore.user?.cart!.id || "",
                        this.authStore.user?.cart!.version,
                        quantity
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            async clearCart(): Promise<void> {
                if (!this.authStore.user?.cart?.lineItems || this.authStore.user?.cart?.lineItems.length === 0) {
                    return;
                }

                this.notification.message = "";

                const productsIds = this.authStore.user.cart.lineItems.map((item) => item.id);

                try {
                    const cartResult = await removeProductsFromCart(
                        this.authStore.user?.token?.access_token || "",
                        productsIds,
                        this.authStore.user?.cart!.id || "",
                        this.authStore.user?.cart!.version
                    );

                    if (cartResult instanceof Error) {
                        throw Error(cartResult.message);
                    }

                    this.authStore.updateUserData({
                        user: this.authStore.user?.user || null,
                        cart: cartResult,
                        token: this.authStore!.user!.token
                    });
                } catch (error) {
                    this.notification.message = String(error);
                    this.notification.isDisplay = true;
                }
            },
            async applyPromoCode() {
                const inputCode = this.promoCodeModel.trim().toLowerCase();

                this.isPromoCodeApplied = !(inputCode.length === 0) && inputCode === "ternion24";
            }
        },
        computed: {
            totalCost(): number {
                return this.authStore.user?.cart?.lineItems
                    .reduce((acc, item) => acc + (item.price.value.centAmount / 100) * item.quantity, 0) || 0;
            }
        }
    };
</script>

<template>
    <v-container v-if="(authStore.user?.cart?.lineItems?.length || 0) === 0" class="main-container">
        <h1 class="pt-5 pb-15">My Shopping Cart</h1>
        <v-row>
            <v-col class="empty-cart-message" cols="12">
                <v-alert type="info" prominent>
                    <v-icon>mdi-cart-outline</v-icon>
                    Your cart is empty! <RouterLink to="products" class="white-color">Start</RouterLink> adding items to your cart to see them here.
                </v-alert>
            </v-col>
        </v-row>
        <v-row>
            <v-card-text>
                <RouterLink class="text-info text-decoration-none text-h6" to="/products">
                    <v-icon icon="mdi-chevron-left"></v-icon>
                    <strong>Start Shopping</strong>
                </RouterLink>
            </v-card-text>
        </v-row>
    </v-container>
    <v-container v-else fluid>
        <v-row>
            <v-col>
                <v-row class="pa-5">
                    <v-card class="products-list-card">
                        <div class="d-flex align-center justify-space-between pt-5 pb-5 pl-5 pr-5">
                            <h1>My Shopping Cart</h1>
                            <p>{{ authStore.user?.cart?.lineItems.length }} Items</p>
                        </div>

                        <v-divider></v-divider>

                        <v-table>
                            <tbody>
                                <tr
                                    v-for="lineItem in authStore.user?.cart?.lineItems"
                                    :key="lineItem.id"
                                >
                                    <td>
                                        <v-avatar
                                            size="100"
                                            class="mt-3 mb-3"
                                        >
                                            <v-img :src="lineItem.variant.images[0].url"></v-img>
                                        </v-avatar>
                                        <v-list-item
                                            :title="lineItem.name['en-GB']"
                                            :subtitle="`€ ${lineItem.price.value.centAmount / 100}`"
                                            class="d-inline-flex"
                                        ></v-list-item>
                                    </td>
                                    <td>
                                        <v-text-field
                                            id="basket-quantity-field"
                                            type="number"
                                            class="mt-6"
                                            :min="1"
                                            :max="100"
                                            :value="lineItem.quantity"
                                            control-variant="split"
                                            variant="solo"
                                            max-width="140px"
                                            hide-spin-buttons
                                            readonly
                                        >
                                            <template v-slot:prepend>
                                                <v-icon class="cursor-pointer" :disabled="lineItem.quantity <= 1" @click="removeFromCart(lineItem.productId)">mdi-minus</v-icon>
                                            </template>
                                            <template v-slot:append>
                                                <v-icon class="cursor-pointer" :disabled="lineItem.quantity >= 15" @click="addToCart(lineItem.productId)">mdi-plus</v-icon>
                                            </template>
                                        </v-text-field>
                                    </td>
                                    <td>
                                        € {{ `${(lineItem.price.value.centAmount / 100) * lineItem.quantity}` }}
                                    </td>
                                    <td>
                                        <v-btn icon="mdi-delete-outline" @click="removeFromCart(lineItem.productId, lineItem.quantity)"></v-btn>
                                    </td>
                                </tr>
                            </tbody>
                        </v-table>
                    </v-card>
                </v-row>
            </v-col>
            <v-col>
                <v-row class="pa-5">
                    <v-card class="pa-5 w-50">
                        <h2 class="pt-2 pb-6">Order Summary</h2>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <div class="d-flex align-center justify-space-between pt-5 pb-5">
                                    <p>Items {{ authStore.user?.cart?.lineItems.length }}</p>
                                    <p>€ {{ totalCost.toFixed(2) }}</p>
                                </div>
                            </v-col>
                        </v-row>
                        <v-row>
                            <v-col class="mb-8">
                                <h3 class="mb-3">Promo Code</h3>
                                <v-text-field v-model="promoCodeModel" placeholder="Enter your code"></v-text-field>
                                <div class="d-flex align-center justify-space-between pt-5 pb-5">
                                    <v-btn @click="applyPromoCode()">Apply</v-btn>
                                    <p v-if="isPromoCodeApplied" class="color-accent">- € {{ (totalCost * 0.25).toFixed(2) }}</p>
                                </div>
                            </v-col>
                        </v-row>

                        <v-divider></v-divider>

                        <v-row>
                            <v-col>
                                <div class="d-flex align-center justify-space-between pt-5 pb-5">
                                    <h3>Total Cost</h3>
                                    <p v-if="!isPromoCodeApplied">€ {{ totalCost.toFixed(2) }}</p>
                                    <p v-else>€ {{ (totalCost * (isPromoCodeApplied ? 0.75 : 1)).toFixed(2) }}</p>
                                </div>
                            </v-col>
                        </v-row>
                        <v-btn width="100%" color="#099a9a">Checkout</v-btn>
                    </v-card>
                </v-row>
            </v-col>
        </v-row>
        <v-row class="pr-15">
            <v-card-text>
                <RouterLink class="text-blue-lighten-1 text-decoration-none" to="/products">
                    <v-icon icon="mdi-chevron-left"></v-icon>
                    <strong>Continue Shopping</strong>
                </RouterLink>
            </v-card-text>
            <v-card-text>
                <p class="text-red-lighten-1 text-decoration-none cursor-pointer pr-15">
                    <strong class="mr-1" @click="clearCart">Clear Cart</strong>
                    <v-icon icon="mdi-backspace"></v-icon>
                </p>
            </v-card-text>
        </v-row>
    </v-container>
</template>

<style scoped>
    .main-container {
        max-width: 1600px;
        margin: 0 auto;
        padding: 20px;
        font-family: Poppins, sans-serif;
        text-align: center;
    }

    .empty-cart-message {
        padding: 20px;
        font-size: 1.2em;
    }

    .products-list-card {
        width: 850px;
    }

    .white-color {
        color: white;
    }

    .color-accent {
        color: aquamarine;
    }
</style>
