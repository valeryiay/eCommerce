import type { Category } from "../types";

const CATEGORIES: Category[] = [
    {
        id: 1,
        name: { en: "Catalog" },
        url: "",
        parentId: null,
        ctId: null
    },
    {
        id: 2,
        name: { en: "Home Appliances" },
        url: "home-appliances",
        parentId: 1,
        ctId: "cab55354-b11a-48e0-8545-cc37fa17f3ca"
    }
];

export { CATEGORIES };
