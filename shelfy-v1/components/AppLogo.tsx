import Image from 'next/image';
import React from 'react';

const AppLogo = () => {
    return (
        <div className='flex justify-center items-center gap-4'>
            <div className="relative w-20 h-20">
                <Image
                    src="/chat-logo.svg"
                    alt="Inventory Search"
                    fill
                    priority
                    className="object-contain"
                />
            </div>
            <div>
                <p className='text-4xl font-sans font-medium'>
                    Product Inventory Index
                </p>
            </div>
        </div>
    );
};

export default AppLogo;