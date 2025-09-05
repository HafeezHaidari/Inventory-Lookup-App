import ProductCard from "@/components/ProductCard";
import {Product} from "@/types/types";

const ProductCardPresenter = async () => {

    const response = await fetch('http://localhost:8080/api/products');
    const data = await response.json();

    return (
        <div className="flex justify-center mt-30">
            <ul className="flex flex-wrap gap-5">
                {data.map((product: Product, i: number) => (
                    <li key={i}>
                        <ProductCard product={product} />
                    </li>
                ))}
            </ul>
        </div>
    )
}
export default ProductCardPresenter
