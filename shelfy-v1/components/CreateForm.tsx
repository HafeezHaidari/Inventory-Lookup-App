'use client'
import React, {useCallback, useEffect, useState} from 'react';
import { useDropzone } from 'react-dropzone';
//import {getApiBase} from "@/app/api/_utils/base";


const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME!;
const cloudinaryUploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET!;
//const base = getApiBase();

// Component for creating a new product with a form, including image upload functionality
const CreateForm = () => {

    // State to manage the preview URL of the uploaded image
    const [previewUrl, setPreviewUrl] = useState<string | undefined>()

    // Cleanup the preview URL when the component unmounts or when a new file is selected
    useEffect(() => {
        return () => {
            if (previewUrl) URL.revokeObjectURL(previewUrl);
        };
    }, [previewUrl]);

    // Callback function to handle file drop events. It sets the file and generates a preview URL
    const onDrop = useCallback((accepted: File[]) => {
        const f = accepted[0];
        if (!f) return;
        setFile(f);
        setPreviewUrl(URL.createObjectURL(f));
    }, []);

    // Set up the dropzone for file uploads using react-dropzone
    const { getRootProps, getInputProps, isDragActive } = useDropzone({
        // Configure dropzone to accept only one image file
        onDrop,
        multiple: false,
        accept: { 'image/*': [] },
        maxFiles: 1
    });

    // State to manage the form submission state and the selected file
    const [state, setState] = useState('ready');
    const [file, setFile] = useState<File | undefined>();

    // Handle form submission, including image upload to Cloudinary and product creation in the backend
    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if ( typeof file === 'undefined') return;

        const form = e.target as HTMLFormElement;

        const formData = new FormData();
        formData.append('file', file);
        formData.append('upload_preset', cloudinaryUploadPreset);

        setState('sending');

        const results = await fetch(`https://api.cloudinary.com/v1_1/${cloudinaryCloudName}/image/upload`, {
            method: 'POST',
            body: formData
        }).then(res => res.json())

        const product = {
            "name": (form.elements.namedItem('productName') as HTMLInputElement).value.trim(),
            "brand": (form.elements.namedItem('productBrand') as HTMLInputElement).value.trim(),
            "unit": (form.elements.namedItem('productUnit') as HTMLInputElement).value.trim(),
            "defaultPrice": Number((form.elements.namedItem('defaultPrice') as HTMLInputElement).value),
            "recommended": (form.elements.namedItem('recommended') as HTMLSelectElement).value === 'yes',
            "active": (form.elements.namedItem('active') as HTMLSelectElement).value === 'yes',
            "imageUrl": results.url
        };

        const postResult = await fetch(`/api/proxy/products`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify([product])
        }).then()

        if (!postResult.ok) {
            setState('failed')
        } else {
            setState('sent')
        }
    }



    return (
        <>
            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-900 mb-2 text-center">
                Create New Product
            </h2>

            {/* Card */}
            <div className="max-w-xl mx-auto bg-white rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        <div>
                            <label
                                htmlFor="productName"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Product Name
                            </label>
                            <input
                                id="productName"
                                name="productName"
                                required
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="productBrand"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Brand
                            </label>
                            <input
                                id="productBrand"
                                name="productBrand"
                                required
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="productUnit"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Unit
                            </label>
                            <input
                                id="productUnit"
                                name="productUnit"
                                required
                                placeholder="e.g. kg, L, pcs"
                                className="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="defaultPrice"
                                className="block text-sm font-medium text-gray-700 mb-1"
                            >
                                Default Price
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 sm:text-sm">€</span>
                                </div>
                                <input
                                    id="defaultPrice"
                                    name="defaultPrice"
                                    required
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 pl-7 text-gray-900 focus:ring-blue-600 focus:border-blue-600"
                                />
                            </div>
                        </div>

                        <div className="grid grid-cols-2 gap-6">
                            <div>
                                <label
                                    htmlFor="recommended"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Mark as recommended?
                                </label>
                                <select
                                    id="recommended"
                                    name="recommended"
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-600 focus:border-blue-600"
                                    defaultValue="yes"
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                            <div>
                                <label
                                    htmlFor="active"
                                    className="block text-sm font-medium text-gray-700 mb-1"
                                >
                                    Mark as active?
                                </label>
                                <select
                                    id="active"
                                    name="active"
                                    className="block w-full rounded-lg border-gray-300 bg-gray-50 text-gray-900 focus:ring-blue-600 focus:border-blue-600"
                                    defaultValue="yes"
                                >
                                    <option value="yes">Yes</option>
                                    <option value="no">No</option>
                                </select>
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">
                                Item Image
                            </label>

                            <div
                                {...getRootProps()}
                                className={`relative mt-1 flex justify-center items-center px-6 pt-8 pb-8 border-2 border-dashed rounded-lg transition
            ${isDragActive ? 'border-blue-500 bg-blue-50/30' : 'border-gray-300 bg-gray-50/50 hover:bg-gray-100'}`}
                                style={{ minHeight: 180 }}
                            >
                                <input
                                    {...getInputProps()}
                                    name="productImage"
                                    className="sr-only"
                                />

                                {previewUrl ? (
                                    <div className="absolute inset-0 p-2">
                                        <img
                                            src={previewUrl}
                                            alt="Preview"
                                            className="h-full w-full object-contain rounded-md"
                                        />
                                        <div className="absolute bottom-2 right-2 text-xs bg-black/60 text-white px-2 py-1 rounded">
                                            Click or drop to replace
                                        </div>
                                    </div>
                                ) : (
                                    <div className="text-center pointer-events-auto">
                                        <svg
                                            aria-hidden="true"
                                            className="mx-auto h-12 w-12 text-gray-400"
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 48 48"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28"
                                            />
                                        </svg>
                                        <div className="mt-3 flex text-sm text-gray-600 justify-center">
                <span className="relative rounded-md font-medium text-blue-600">
                  Click to upload
                </span>
                                            <span className="pl-1">or drag & drop</span>
                                        </div>
                                        <p className="mt-1 text-xs text-gray-500">
                                            PNG, JPG, GIF up to 10MB
                                        </p>
                                    </div>
                                )}
                            </div>
                        </div>
                        <div className="grid grid-cols-2 items-center gap-4">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
                            >
                                Create product
                            </button>
                            {state === "sending" && (
                                <p className="text-center mt-4 text-gray-600 font-medium">
                                    Creating...
                                </p>
                            )}
                            {state === "sent" && (
                                <p className="text-center mt-4 text-green-600 font-medium">
                                    Product Created!
                                </p>
                            )}
                            {state === "failed" && (
                                <p className="text-center mt-4 text-red-600 font-medium">
                                    Product Creation Failed!
                                </p>
                            )}
                        </div>
                    </form>
                </div>
            </div>
        </>

    )
}
export default CreateForm
