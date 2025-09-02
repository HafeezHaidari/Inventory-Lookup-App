import React from 'react'
import Image from "next/image";
import {Product} from "@/types";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div>
            <p>{product.name}</p>
            <p>{product.brand}</p>
            <p>{product.unit}</p>
            <p>{product.defaultPrice}</p>
            <Image src={product.imageUrl} alt={product.name} width={100} height={100} />
        </div>
    )
}
export default ProductCard;
