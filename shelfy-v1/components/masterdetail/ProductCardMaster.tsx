import React from 'react';

import {Product} from "@/types/Product";
import Image from "next/image";

interface ProductCardMasterProps {
    product: Product;
}

const ProductCardMaster: React.FC<ProductCardMasterProps> = ({ product }) => {
    return (
        <div className="w-[350px] max-w-2xl bg-white shadow-xs p-4
            flex items-center justify-between
            hover:bg-green-100 hover:border-gray-400">
            <Image src={product.imageUrl} alt={product.name} width={100}
                   height={100} className="w-28 h-28 object-contain rounded-md border border-gray-200 " />
            <div className="flex-1 px-6">
                <h2 className="text-xl font-semibold text-gray-900">{product.name}</h2>
                <p className="text-gray-500">{product.brand}</p>
            </div>
            <div>
                <p className="text-lg font-bold text-gray-900">{product.defaultPrice} € <br /> per {product.unit}</p>
            </div>
        </div>
    )
}

export default ProductCardMaster;