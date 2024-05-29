<script lang="ts">
    import { getProductDetails } from "@/services/commercetoolsApi";
    import type { BreadcrumbItem, ProductSingle } from "@/types";

        export default {
            data: () => ({
                product: {} as ProductSingle,
                loading: true
            }),
            async mounted() {
                    const productID = this.$route.params.id as string;
                    try {
                        this.product = await getProductDetails(productID);
                        if (!this.product) {
                            this.$router.push('404');
                        }
                    }
                    catch(error) {
                        return console.error('Error fetching product:', error);
                    } finally {
                        this.loading = false;
                    }
            },
            methods: {
                getPrice(currencyCode: string): string {
                    const priceObj = this.product?.masterData?.current?.masterVariant?.prices?.find(
                        (elem) => elem.value.currencyCode === currencyCode
                    );
                    return priceObj ? (priceObj.value.centAmount / 100).toFixed(2) : 'N/A';
                }
            },
            computed: {
                breadcrumbItems(): BreadcrumbItem[] { 
                    return [
                        { title: 'Home', disabled: false, href: '/' },
                        { title: 'Products', disabled: false, href: '/products'},
                        { title: this.product.masterData?.current?.name['en-GB'] || 'Detailed product', disabled: true, href: ''}
                    ]
            }}
    }
</script>

<template>
    <v-container class="wrapper-container">
        <v-row>
            <v-breadcrumbs :items="breadcrumbItems"></v-breadcrumbs>
        </v-row>
        <v-row v-if="loading">
            <v-progress-circular indeterminate color="primary"></v-progress-circular>
        </v-row>
        <v-row v-else-if="product">
            <v-col cols="6">
                <v-carousel class="pa-5">
                    <v-carousel-item
                        v-for="(image, index) in product.masterData?.current?.masterVariant?.images"
                        :key="index"
                        :src="image.url"
                        cover
                    ></v-carousel-item>
                </v-carousel>
            </v-col>
            <v-col cols="6">
                <v-row class="justify-space-between pa-5">
                    <h2>{{ product.masterData?.current?.name['en-GB'] }}</h2>
                    <h2>
                        € {{ getPrice('EUR') }}
                    </h2>  
                </v-row>
                <v-row class="pa-5">
                    <p>{{ product.masterData?.current?.description['en-GB'] }}</p>
                </v-row>
            </v-col>
        </v-row>
    </v-container>
</template>

<style scoped>
.wrapper-container {
    overflow-x: hidden;
}
</style>