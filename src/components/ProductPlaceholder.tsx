import type React from 'react';

const ProductPlaceholder: React.FC = () => {
  return (
    <div className='sticky top-3 bg-primary-foreground p-6 rounded-lg shadow-md h-[calc(100vh-90px)] flex flex-col items-center justify-center text-center'>
      <svg
        xmlns='http://www.w3.org/2000/svg'
        className='h-16 w-16 text-primary mb-4'
        width='24'
        height='24'
        viewBox='0 0 24 24'
        fill='none'
        stroke='currentColor'
        strokeWidth='2'
        strokeLinecap='round'
        strokeLinejoin='round'
      >
        <path d='M6 2 3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4Z'></path>
        <path d='M3 6h18'></path>
        <path d='M16 10a4 4 0 0 1-8 0'></path>
      </svg>
      <h2 className='text-xl font-semibold mb-2'>No Product Selected</h2>
      <p className='text-primary'>
        Select a product from the list to view its details
      </p>
    </div>
  );
};

export default ProductPlaceholder;
