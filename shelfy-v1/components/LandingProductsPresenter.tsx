// The landing page products presenter component
// Fetches and displays recommended products in a grid layout
// Each product links to the search page with specific query parameters

import ProductCard from "@/components/ProductCard";
import {Product} from "@/types/Product";
import Link from "next/link";
import React from "react";

// Fetch recommended products for the landing page
const getLandingPageProducts = async () => {
    // Revalidate every second
    const response = await fetch(`${process.env.API_BASEURL}/products/search?recommended=true&sort=name,asc`, {
        next: { revalidate: 1 }
    });
    const data = await response.json();
    if (!response.ok) {
        throw new Error("Fetch failed");
    }
    // If data is an array, use it directly; otherwise, use data.content or an empty array
    const products = Array.isArray(data) ? data : (data?.content ?? []);
    return products as any[];
}


const LandingProductsPresenter: React.FC = async () => {
    // Use the predefined function to fetch products
    const products = await getLandingPageProducts();

    // Display products as Product Card components in a responsive grid layout
    return (
        <section className="h-full min-h-0 overflow-y-auto">
            <div className="pt-8 px-4 pb-6">
                <ul className="grid grid-cols-[repeat(auto-fill,minmax(240px,1fr))] gap-5">
                    {/* Map over the products and create a card component inside a Link component for each of them */}
                    {products.map((product: Product) => (
                        <li key={product.id}>
                            {/* Link points to the search path with the recommended items as results */}
                            <Link href={{ pathname: '/search', query: { tab: 'recommended', sort: 'name,asc', selected: product.id, pin: '1' } }} prefetch>
                                <ProductCard product={product} />
                            </Link>
                        </li>
                    ))}
                </ul>
            </div>
        </section>
    )
}
export default LandingProductsPresenter;
