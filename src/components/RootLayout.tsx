import type React from 'react';
import { Link, Outlet, useParams } from 'react-router-dom';
import ProductList from './ProductList';

const RootLayout: React.FC = () => {
  const { id } = useParams<{ id: string }>();

  return (
    <div className='min-h-screen flex flex-col bg-gray-100 dark:bg-gray-900'>
      <header className='border-b border-muted flex items-center'>
        <div className='container mx-auto px-4 flex justify-between items-center py-2'>
          <Link
            to={'/'}
            className='font-bold text-lg sm:text-2xl md:text-3xl bg-gradient-to-r from-blue-800 to-blue-600 bg-clip-text text-transparent'
          >
            Product listing
          </Link>
        </div>
      </header>
      <main className='flex-grow container mx-auto px-4 pb-5'>
        <div className='grid grid-cols-1 lg:grid-cols-12 gap-6 mt-6 relative h-full'>
          <div className='lg:col-span-7 order-2 lg:order-1'>
            <Outlet />
          </div>
          <div className='lg:col-span-5 order-1 lg:order-2 '>
            <ProductList selectedId={id} />
          </div>
        </div>
      </main>
      <footer className='bg-gray-200 text-gray-600 dark:bg-gray-800 dark:text-gray-400'>
        <div className='container mx-auto px-4 py-4 text-center'>
          <p>
            © {new Date().getFullYear()} Product Catalog. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
};

export default RootLayout;
