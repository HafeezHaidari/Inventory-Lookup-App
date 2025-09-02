'use client';

import React, {useEffect, useState} from 'react';
import ProductCard from "@/components/ProductCard";

const ProductCardPresenter = () => {
    const [products, setProducts] = useState([]);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const response = await fetch('http://localhost:8080/api/products');
                const data = await response.json();
                setProducts(data);
            } catch (err) {
                console.error(err);
            }
        }
        fetchProducts();
    }, [])

    return (
        <div className="flex justify-center mt-30">
            <ul className="flex flex-wrap gap-5">
                {products.map((product, i) => (
                    <li key={i}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default ProductCardPresenter
