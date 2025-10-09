'use client'
import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';

const backendBase = process.env.NEXT_PUBLIC_API_BASE;
const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CreateForm = () => {

    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        const file = new FileReader;

        file.readAsDataURL(acceptedFiles[0]);
    }, [])

    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    const [state, setState] = useState('ready');
    const [file, setFile] = useState<File | undefined>();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if ( typeof file === 'undefined') return;

        const form = e.target as HTMLFormElement;

        const formData = new FormData();
        formData.append('file', file)
        formData.append('upload_preset', 'inventory_app_preset');
        // @ts-ignore
        formData.append('api_key', cloudinaryApiKey);

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
            "imageUrl": results.url
        };

        const sendResults = await fetch(`${backendBase}/products`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify([product])
        }).then(res => {setState('sent')})
    }

    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {

        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        setFile(target.files[0]);
    }

    return (
        <>
            {/* Header */}
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-6 text-center">
                Create New Item
            </h2>

            {/* Card */}
            <div className="max-w-xl mx-auto bg-white dark:bg-neutral-900 rounded-lg shadow-xl overflow-hidden">
                <div className="p-6 sm:p-8">
                    <form className="space-y-6" onSubmit={handleSubmit}>
                        {/* Product Name */}
                        <div>
                            <label
                                htmlFor="productName"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Product Name
                            </label>
                            <input
                                id="productName"
                                name="productName"
                                required
                                placeholder="e.g. Banana"
                                className="block w-full rounded-lg border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>

                        {/* Brand */}
                        <div>
                            <label
                                htmlFor="productBrand"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Brand
                            </label>
                            <input
                                id="productBrand"
                                name="productBrand"
                                required
                                placeholder="e.g. Acme"
                                className="block w-full rounded-lg border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>

                        <div>
                            <label
                                htmlFor="productUnit"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Unit
                            </label>
                            <input
                                id="productUnit"
                                name="productUnit"
                                required
                                placeholder="e.g. kg, L, pcs"
                                className="block w-full rounded-lg border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600"
                            />
                        </div>

                        {/* Default Price with prefix */}
                        <div>
                            <label
                                htmlFor="defaultPrice"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Default Price
                            </label>
                            <div className="relative">
                                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                                    <span className="text-gray-500 dark:text-gray-400 sm:text-sm">€</span>
                                </div>
                                <input
                                    id="defaultPrice"
                                    name="defaultPrice"
                                    required
                                    type="number"
                                    step="0.01"
                                    placeholder="0.00"
                                    className="block w-full rounded-lg border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 pl-7 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600"
                                />
                            </div>
                        </div>

                        <div>
                            <label
                                htmlFor="recommended"
                                className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1"
                            >
                                Mark as recommended?
                            </label>
                            <select
                                id="recommended"
                                name="recommended"
                                className="block w-full rounded-lg border-gray-300 dark:border-neutral-700 bg-gray-50 dark:bg-neutral-800 text-gray-900 dark:text-white focus:ring-blue-600 focus:border-blue-600"
                                defaultValue="yes"
                            >
                                <option value="yes">Yes</option>
                                <option value="no">No</option>
                            </select>
                        </div>

                        {/* Image uploader (drag & drop) */}
                        <div>
                            <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                Item Image
                            </label>

                            <div
                                {...getRootProps()}
                                className="mt-1 flex justify-center px-6 pt-8 pb-8 border-2 border-dashed rounded-lg border-gray-300 dark:border-neutral-700 bg-gray-50/50 dark:bg-neutral-800/70 hover:border-blue-500 transition"
                            >
                                <input
                                    {...getInputProps()}
                                    type="file"
                                    name="productImage"
                                    onChange={handleOnChange}
                                    className="sr-only"
                                />
                                <div className="text-center">
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

                                    <div className="mt-3 flex text-sm text-gray-600 dark:text-gray-400 justify-center">
                <span className="relative cursor-pointer rounded-md font-medium text-blue-600 hover:text-blue-500 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:ring-blue-600">
                  Click to upload
                </span>
                                        <span className="pl-1">or drag & drop</span>
                                    </div>
                                    <p className="mt-1 text-xs text-gray-500 dark:text-gray-400">
                                        PNG, JPG, GIF up to 10MB
                                    </p>
                                </div>
                            </div>

                            {/* Preview */}
                            {file && (
                                <div className="mt-2 text-sm text-gray-700 dark:text-gray-300 text-center">
                                    File: {file.name}
                                </div>
                            )}
                        </div>

                        {/* Actions */}
                        <div className="flex justify-end pt-2">
                            <button
                                type="submit"
                                className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2.5 px-5 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-600 transition-colors"
                            >
                                Submit
                            </button>
                        </div>
                    </form>
                </div>
            </div>

            {/* Success note */}
            {state === "sent" && (
                <p className="text-center mt-4 text-green-600 dark:text-green-400 font-medium">
                    Product Created!
                </p>
            )}
        </>

    )
}
export default CreateForm
