'use client';
import Image from "next/image";
import React, {useEffect, useState} from "react";
import EditProductClient from "@/components/masterdetail/EditProductClient";
import { useSession } from "@/app/lib/SessionProvider";
import { Product } from "@/types/Product";
import { Pencil } from "lucide-react";
import DeleteConfirmation from "@/components/DeleteConfirmation";
import {getApiBase} from "@/app/api/_utils/base";

// Props for the ProductDetailPane component, including an optional selected product ID
type Props = { selected?: number };

const base = getApiBase();

// Component to display detailed information about a selected product
export default function ProductDetailPane({ selected }: Props) {

    // State to manage authentication status, product data, loading state, error messages, and edit mode
    const {isAuthenticated} = useSession();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null);
    const [isEditing, setIsEditing] = useState(false)

    // Effect to fetch product details when a new product is selected
    useEffect(() => {
        if (selected == null) return;
        setLoading(true);
        setIsEditing(false);
        // Fetch product details from the API based on the selected product ID
        fetch(`${base}/products/${selected}`, { cache: 'no-store' }).then(res => {
            if (!res.ok) throw new Error("Product not found :(");
            return res.json();
            })
            // Update state with fetched product data or error message
            .then(setProduct)
            .catch(err => setError(err.message))
            .finally(() => setLoading(false)
        );
    }, [selected]);

    if (selected == null) {
        return (
            <div className="h-full grid place-items-center p-6 text-muted-foreground">
                Select a product from the list.
            </div>
        );
    }

    if (loading) return <div className="p-6">Loading...</div>;

    if (error) return <div className="p-6">{error}</div>;

    if (!product) return null;

    // Render the edit form if in editing mode
    if (isEditing && product) {
        return (
            <EditProductClient
                product={product}
                onCancelAction={() => setIsEditing(false)}
                // Update product state and exit edit mode on save
                onSavedAction={(updated) => {
                    setProduct(prev => prev ? { ...prev, ...updated, id: prev.id } : updated);
                    setIsEditing(false);
                }}
            />
        );
    }

    return (
        // Detailed view of the selected product with options to edit or delete if authenticated
        <section className="flex flex-col overflow-y-auto bg-gray-50 p-6 lg:p-8">
            <div className="mb-6 flex flex-row gap-4">
                <h1 className="text-4xl font-bold tracking-tight text-gray-900">{product.name}</h1>
                <p className="mt-2 text-lg text-gray-600">{product.brand}</p>
            </div>
            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="relative aspect-square">
                            <Image
                                src={product.imageUrl}
                                alt={product.name}
                                fill
                                sizes="(max-width: 1024px) 90vw, 90vw"
                                priority
                            />
                        </div>
                    </div>
                </div>
                <div className="space-y-6 lg:col-span-2">
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="flex items-center justify-between">
                            <h3 className="mb-4 text-xl font-semibold text-gray-900">Product Information</h3>
                            { isAuthenticated && (
                                <div className="flex flex-row gap-3">
                                    <div className="pt-2 pr-4">
                                        <DeleteConfirmation id={product.id} />
                                    </div>
                                    <div className="pt-2" onClick={() => setIsEditing(true)}>
                                        <button>
                                            <Pencil />
                                        </button>
                                    </div>
                                </div>
                            )}
                        </div>

                        <dl className="space-y-4">
                            <div>
                                <dt className="text-sm font-medium text-gray-500">Price</dt>
                                <dd className="mt-1 text-2xl font-bold text-green-600">
                                    {Intl.NumberFormat('de-DE', { style: 'currency', currency: 'EUR' }).format(product.defaultPrice)}{" "}
                                    <span className="text-base font-medium text-gray-500">/ {product.unit}</span>
                                </dd>
                            </div>

                            <div className="flex items-center justify-between">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Availability</dt>
                                    <dd
                                        className={`mt-1 inline-flex items-center gap-2 rounded-full px-2.5 py-1 text-sm font-medium ${
                                            product.active
                                                ? "bg-green-50 text-green-700 ring-1 ring-inset ring-green-200"
                                                : "bg-red-50 text-red-700 ring-1 ring-inset ring-red-200"
                                        }`}
                                    >
                                        <span className="h-2 w-2 rounded-full bg-current"></span>
                                        {product.active ? "Active" : "Inactive"}
                                    </dd>
                                </div>
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Brand</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.brand}</dd>
                                </div>
                                <div>
                                    <dt className="text-sm font-medium text-gray-500">Unit</dt>
                                    <dd className="mt-1 text-sm text-gray-900">{product.unit}</dd>
                                </div>
                            </div>
                        </dl>
                    </div>

                </div>
            </div>
        </section>
    );
}
