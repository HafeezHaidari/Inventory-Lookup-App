'use client'
import React, {useCallback, useState} from 'react';
import { useDropzone } from 'react-dropzone';

const backendBase = process.env.NEXT_PUBLIC_API_BASE;
const cloudinaryApiKey = process.env.NEXT_PUBLIC_CLOUDINARY_API_KEY
const cloudinaryCloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME;

const CreateForm = () => {

    const onDrop = useCallback((acceptedFiles: Array<File>) => {
        const file = new FileReader;

        file.onload = () => {
            setPreview(file.result);
        }

        file.readAsDataURL(acceptedFiles[0]);
    }, [])

    const { acceptedFiles, getRootProps, getInputProps, isDragActive } = useDropzone({
        onDrop
    });

    const [preview, setPreview] = useState<string | ArrayBuffer | null>(null);
    const [state, setState] = useState('ready');
    const [file, setFile] = useState<File | undefined>();

    const handleSubmit = async (e: React.SyntheticEvent) => {
        e.preventDefault();

        if ( typeof file === 'undefined') return;

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
            "name": e.target.productName.value.trim(),
            "brand": e.target.productBrand.value.trim(),
            "unit": e.target.productUnit.value.trim(),
            "defaultPrice": Number(e.target.defaultPrice.value),
            "recommended": e.target.recommended.value === 'yes',
            "imageUrl": results.url
        }

        const sendResults = await fetch(`${backendBase}/products`, {
            method: 'POST',
            credentials: 'include',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify([product])
        }).then(res => {console.log(res); setState('sent')})
    }

    const handleOnChange = (e: React.FormEvent<HTMLInputElement>) => {

        const target = e.target as HTMLInputElement & {
            files: FileList;
        }
        setFile(target.files[0]);
    }

    return (
        <>
            <h4>Create a new item</h4>
            <form className="max-w-md border border-gray-200 rounded p-6 mx-auto" onSubmit={handleSubmit}>

                <div className="mb-5">
                    <label htmlFor="productName">
                    Product Name:
                    </label>
                    <input placeholder="Product Name" name="productName" required={true} />
                </div>

                <div className="mb-5">
                    <label htmlFor="productBrand">
                        Product Brand:
                    </label>
                    <input placeholder="Product Brand" name="productBrand" required={true} />
                </div>

                <div className="mb-5">
                    <label htmlFor="productUnit">
                        Product Unit:
                    </label>
                    <input placeholder="Product Unit" name="productUnit" required={true} />
                </div>

                <div className="mb-5">
                    <label htmlFor="unitAmount">
                        Unit amount:
                    </label>
                    <input placeholder="Unit amount" name="unitAmount" required={true} type="number" step="any"/>
                </div>

                <div className="mb-5">
                    <label htmlFor="defaultPrice">
                        Default Price:
                    </label>
                    <input placeholder="Default Price" name="defaultPrice" required={true} type="number" step="0.01"/>
                </div>

                <div className="mb-5">
                    <label htmlFor="recommended">
                        Mark as recommended?
                    </label>
                    <select name="recommended">
                        <option value="yes">Yes</option>
                        <option value="no">No</option>
                    </select>
                </div>

                <div className="mb-5">
                    <label htmlFor="image">
                        Upload an image:
                    </label>
                    <input type="file" name="productImage" onChange={handleOnChange} />
                </div>

                <div>
                    {preview && (
                        <p className="mb-5">
                            <img src={preview as string} alt="Upload preview" />
                        </p>
                    )}
                </div>

                <button type="submit">Submit</button>
            </form>

            {state === 'sent' && (
                <p className="text-center"> Product Created! </p>
            )}
            {state === 'sending' && (
                <p className="text-center"> Product Created! </p>
            )}
        </>
    )
}
export default CreateForm
