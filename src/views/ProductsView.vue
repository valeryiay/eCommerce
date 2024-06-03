<script lang="ts">
    import { defineComponent } from "vue";
    import { getProducts } from "@/services/commercetoolsApi";
    import type { ProductAllData, ProductApiResponse } from "@/types";

    export default defineComponent({
        name: "ProductsView",
        data() {
            return {
                products: [] as ProductAllData[],
                isLoading: false,
                errorMessage: null as string | null
            };
        },
        async mounted() {
            this.isLoading = true;
            try {
                const response: ProductApiResponse = await getProducts();
                this.products = response.results;
            } catch (err) {
                this.errorMessage = "Failed to fetch products";
            } finally {
                this.isLoading = false;
            }
        },
        methods: {
            formatPrice(amount: number): string {
                return (amount / 100).toFixed(2);
            }
        }
    });
</script>

<template>
    <v-container class="catalog-container" fluid>
        <v-row>
            <v-col cols="12">
                <h1 class="text-center">Product Catalog</h1>
            </v-col>
        </v-row>
        <v-row>
            <v-col cols="12" class="text-center">
                <v-col cols="12" v-if="isLoading">
                    <v-progress-circular indeterminate></v-progress-circular>
                </v-col>
                <v-alert v-if="errorMessage" type="error">{{ errorMessage }}</v-alert>
            </v-col>
        </v-row>
        <v-row v-if="products.length" class="products-grid" dense>
            <v-col v-for="product in products" :key="product.id" cols="12" sm="6" md="4" lg="3">
                <v-card class="product-card" elevation="2">
                    <v-img
                        v-if="product.masterVariant.images.length"
                        :src="product.masterVariant.images[0].url"
                        alt="Product Image"
                        class="product-image"
                        height="200px"
                    ></v-img>
                    <v-card-title class="product-name">
                        {{
                            product.name && product.name["en-GB"]
                                ? product.name["en-GB"]
                                : "Name Not Available"
                        }}
                    </v-card-title>
                    <v-card-text class="product-description">
                        {{
                            product.description && product.description["en-GB"]
                                ? product.description["en-GB"]
                                : "Description Not Available"
                        }}
                    </v-card-text>
                    <v-card-subtitle class="price">
                        <div v-if="product.masterVariant.prices.length">
                            <template v-if="product.masterVariant.prices[0].discounted">
                                <span class="original-price">
                                    €
                                    {{
                                        formatPrice(
                                            product.masterVariant.prices[0].value.centAmount
                                        )
                                    }}
                                </span>
                                <span class="discounted-price">
                                    €
                                    {{
                                        formatPrice(
                                            product.masterVariant.prices[0].discounted.value
                                                .centAmount
                                        )
                                    }}
                                </span>
                            </template>
                            <template v-else>
                                €
                                {{ formatPrice(product.masterVariant.prices[0].value.centAmount) }}
                            </template>
                        </div>
                        <span v-else class="no-price"> No Price Available </span>
                    </v-card-subtitle>
                </v-card>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
    .catalog-container {
        max-width: 1200px;
        margin: 0 auto;
        padding: 20px;
        font-family: Poppins, sans-serif;
    }

    .text-center {
        text-align: center;
    }

    .product-card {
        border: 1px solid #e0e0e0;
        border-radius: 8px;
        overflow: hidden;
        background-color: #fff;
        transition: transform 0.2s;
        padding: 20px;
        display: flex;
        flex-direction: column;
        justify-content: space-between;
        height: 100%;
    }

    .product-card:hover {
        transform: translateY(-10px);
    }

    .product-image {
        width: 100%;
        object-fit: cover;
    }

    .product-name {
        font-size: 20px;
        font-weight: bold;
        margin: 10px 0;
        text-align: center;
        color: #099a9a;
    }

    .product-description {
        font-size: 16px;
        color: #666666;
        text-align: left;
        margin-bottom: 10px;
        flex-grow: 1;
        height: 66px;
        overflow: hidden;
        text-overflow: ellipsis;
        display: -webkit-box;
        -webkit-line-clamp: 3;
        -webkit-box-orient: vertical;
    }

    .price {
        font-size: 20px;
        color: #099a9a;
        margin-left: auto;
        text-align: center;
    }

    .original-price {
        text-decoration: line-through;
        color: #999;
        margin-right: 10px;
    }

    .discounted-price {
        font-size: 24px;
        color: #e60000;
        font-weight: bold;
    }

    .no-price {
        font-size: 20px;
        color: #999;
        text-align: center;
        margin-bottom: 20px;
    }
</style>
