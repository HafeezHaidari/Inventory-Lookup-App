'use client';

import Image from "next/image";
import React, { useState } from "react";
import { Product } from "@/types/Product";
import {getApiBase} from "@/app/api/_utils/base";

const base = getApiBase();

// Props for the EditProductClient component, including the product to edit and action callbacks
type Props = {
    product: Product;
    onCancelAction: () => void;
    onSavedAction: (updated: Product) => void;
};

// Component to edit product details in a form
export default function EditProductClient({ product, onCancelAction, onSavedAction }: Props) {

    // State to manage form data, saving state, and error messages. Initial form state is populated from the product prop.
    const [form, setForm] = useState<Product>(() => ({
        ...product,
        name: product.name ?? "",
        brand: product.brand ?? "",
        unit: product.unit ?? "",
        defaultPrice: product.defaultPrice ?? 0,
        imageUrl: product.imageUrl ?? "",
        active: !!product.active,
        recommended: !!product.recommended,
    }));

    // useState hooks for managing saving state and error messages
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState<string | null>(null);

    // Handler for form input changes, updating the corresponding field in the form state
    const handleChange = (
        e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>
    ) => {
        // Destructure name, value, type, and checked from the event target
        const { name, value, type, checked } = e.target as HTMLInputElement;

        // Update the form state based on the input type and name
        if (name === "defaultPrice") {
            // setForm with number conversion and fallback to 0
            setForm((f) => ({ ...f, defaultPrice: Number(value) || 0 }));
        } else if (name === "active") {
            // Checkbox handling for boolean fields
            setForm((f) => ({ ...f, active: type === "checkbox" ? checked : value === "true" }));
        } else if (name === "recommended") {
            // Checkbox handling for boolean fields
            setForm((f) => ({ ...f, recommended: type === "checkbox" ? checked : value === "true" }));
        } else {
            // General case for text inputs
            setForm((f) => ({ ...f, [name]: value }));
        }
    };

    // Handler for form submission, sending updated product data to the API
    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        setError(null);
        // Validate required fields. If validation fails, set an error message and return early.
        try {
            const id = product.id ?? form.id;
            if (id == null) {
                throw new Error("Missing product id for update.");
            }

            const productToSend = {
                "name": form.name,
                "brand": form.brand,
                "unit": form.unit,
                "defaultPrice": form.defaultPrice,
                "imageUrl": form.imageUrl,
                "active": form.active,
                "recommended": form.recommended,
            };

            const res = await fetch(`/api/proxy/products/${id}`, {
                method: "PUT",
                credentials: "include",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(productToSend),
            });

            if (!res.ok) {
                throw new Error(`Failed to update product: ${res.status} ${res.statusText}`);
            }
            const updated: Product = await res.json();
            // Call the onSavedAction callback with the updated product data to notify the parent component
            onSavedAction(updated);
        } catch (err: any) {
            setError(err.message ?? "Unknown error");
        } finally {
            setSaving(false);
        }
    };

    // Handler for cancel action, resetting form state and calling the onCancelAction callback
    const handleCancel = () => {
        setForm({
            ...product,
            id: product.id,
            name: product.name ?? "",
            brand: product.brand ?? "",
            unit: product.unit ?? "",
            defaultPrice: product.defaultPrice ?? 0,
            imageUrl: product.imageUrl ?? "",
            active: !!product.active,
            recommended: !!product.recommended,
        }); // reset changes
        onCancelAction();
    };

    return (
        <section className="flex flex-col overflow-y-auto bg-gray-50 p-6 lg:p-8">
            {/* Header with product name and brand fields */}
            <div className="mb-6 flex flex-row gap-4">
                <div className="flex w-full max-w-3xl flex-col">
                    <input
                        className="w-full bg-transparent text-4xl font-bold tracking-tight text-gray-900 outline-none focus:ring-0"
                        name="name"
                        value={form.name ?? ""}
                        onChange={handleChange}
                        placeholder="Product name"
                        aria-label="Product name"
                    />
                    <input
                        className="mt-2 w-full bg-transparent text-lg text-gray-600 outline-none focus:ring-0"
                        name="brand"
                        value={form.brand ?? ""}
                        onChange={handleChange}
                        placeholder="Brand"
                        aria-label="Brand"
                    />
                </div>
            </div>

            <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
                <div className="lg:col-span-1">
                    {/* Product image preview */}
                    <div className="relative mx-auto w-full max-w-sm overflow-hidden rounded-xl bg-white shadow-md">
                        <div className="relative aspect-square">
                            <Image
                                src={form.imageUrl || "/placeholder.png"}
                                alt={form.name || "Product image"}
                                fill
                                sizes="(max-width: 1024px) 90vw, 90vw"
                                className="object-cover"
                                priority
                            />
                        </div>
                    </div>

                    {/* Image URL field */}
                    <div className="mt-4">
                        <label className="mb-1 block text-sm font-medium text-gray-700">
                            Image URL
                        </label>
                        <input
                            type="url"
                            name="imageUrl"
                            value={form.imageUrl ?? ""}
                            onChange={handleChange}
                            placeholder="https://…"
                            className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                        />
                    </div>
                </div>

                {/* Form card */}
                <form onSubmit={handleSubmit} className="space-y-6 lg:col-span-2" noValidate>
                    <div className="rounded-xl border border-gray-200 bg-white p-6 shadow-sm">
                        <div className="mb-4 flex items-center justify-between">
                            <h3 className="text-xl font-semibold text-gray-900">Edit Product Information</h3>
                        </div>

                        {error && (
                            <div className="mb-4 rounded-lg border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700">
                                {error}
                            </div>
                        )}

                        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2">
                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Price (EUR)
                                </label>
                                <input
                                    type="number"
                                    name="defaultPrice"
                                    inputMode="decimal"
                                    step="0.01"
                                    min="0"
                                    value={form.defaultPrice ?? 0}
                                    onChange={handleChange}
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                                />
                                <p className="mt-1 text-xs text-gray-500">
                                    Store as a number; format as currency when displaying.
                                </p>
                            </div>

                            <div>
                                <label className="mb-1 block text-sm font-medium text-gray-700">
                                    Unit
                                </label>
                                <input
                                    type="text"
                                    name="unit"
                                    value={form.unit ?? ""}
                                    onChange={handleChange}
                                    placeholder="e.g., kg, piece, L"
                                    className="w-full rounded-lg border border-gray-300 bg-white px-3 py-2 text-base shadow-sm outline-none focus:border-gray-400 focus:ring-2 focus:ring-gray-200"
                                />
                            </div>

                            <div className="flex flex-row sm:gap-4 lg:gap-16">
                                <div className="col-span-1 flex items-center gap-3">
                                    <input
                                        id="active"
                                        type="checkbox"
                                        name="active"
                                        checked={!!form.active}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor="active" className="text-sm text-gray-700">
                                        Active
                                    </label>
                                </div>
                                <div className="col-span-1 flex items-center gap-3">
                                    <input
                                        id="recommended"
                                        type="checkbox"
                                        name="recommended"
                                        checked={!!form.recommended}
                                        onChange={handleChange}
                                        className="h-4 w-4 rounded border-gray-300 text-green-600 focus:ring-green-500"
                                    />
                                    <label htmlFor="recommended" className="text-sm text-gray-700">
                                        Recommended
                                    </label>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Action buttons */}
                    <div className="flex flex-wrap items-center justify-end gap-3">
                        <button
                            type="button"
                            onClick={handleCancel}
                            className="inline-flex items-center rounded-lg border border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-700 shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-gray-200"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={saving}
                            className="inline-flex items-center rounded-lg bg-gray-900 px-4 py-2 text-sm font-semibold text-white shadow-sm hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-gray-300 disabled:cursor-not-allowed disabled:opacity-70"
                        >
                            {saving ? "Saving…" : "Save"}
                        </button>
                    </div>
                </form>
            </div>
        </section>
    );
}
