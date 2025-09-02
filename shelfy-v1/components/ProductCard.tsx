import React from 'react'
import Image from "next/image";
import {Product} from "@/types/types";

interface ProductCardProps {
    product: Product;
}

const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
    return (
        <div className="max-w-xs bg-white rounded-2xl shadow-md p-4 hover:shadow-lg hover:scale-105 transition-transform duration-300 text-center">
            <Image
                src={product.imageUrl}
                alt={product.name}
                width={100}
                height={100}
                className="w-full h-48 object-contain rounded-md mx-auto" />
            <div className="mt-4">
                <h2 className="text-lg font-semibold text-gray-900">{product.name}</h2>
                <p className="text-sm text-gray-500">{product.brand}</p>
                <p>{product.unit}</p>
                <p className="mt-2 text-xl font-bold text-gray-900">{product.defaultPrice}</p>
            </div>
        </div>
    )
}
export default ProductCard;
