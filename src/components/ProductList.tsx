import type React from 'react';
import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { getAllProducts } from '../api/product.api';

interface Product {
  id: number;
  title: string;
  description: string;
  price: number;
  discountPercentage: number;
  rating: number;
  stock: number;
  brand: string;
  category: string;
  thumbnail: string;
  images: string[];
}

interface ProductListProps {
  selectedId?: string;
}

const ProductList: React.FC<ProductListProps> = ({ selectedId }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [filteredProducts, setFilteredProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterCategory, setFilterCategory] = useState('');
  const [filterBrand, setFilterBrand] = useState('');
  const productsPerPage = 5;

  const location = useLocation();

  // Get unique categories and brands for filtering
  const categories = Array.from(
    new Set(products.map((product) => product.category))
  ).sort();
  const brands = Array.from(
    new Set(products.map((product) => product.brand))
  ).sort();

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const data = await getAllProducts();
        setProducts(data.products);
        setFilteredProducts(data.products);
      } catch (err) {
        setError('Failed to load products. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, []);

  useEffect(() => {
    // Apply filters
    let result = products;

    if (searchTerm) {
      result = result.filter(
        (product) =>
          product?.title?.toLowerCase()?.includes(searchTerm?.toLowerCase()) ||
          product?.description
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          product?.category
            ?.toLowerCase()
            ?.includes(searchTerm?.toLowerCase()) ||
          product?.brand?.toLowerCase()?.includes(searchTerm?.toLowerCase())
      );
    }

    if (filterCategory) {
      result = result.filter((product) => product.category === filterCategory);
    }

    if (filterBrand) {
      result = result.filter((product) => product.brand === filterBrand);
    }

    setFilteredProducts(result);
    setCurrentPage(1); // Reset to first page when filters change
  }, [searchTerm, filterCategory, filterBrand, products]);

  // Pagination logic
  const indexOfLastProduct = currentPage * productsPerPage;
  const indexOfFirstProduct = indexOfLastProduct - productsPerPage;
  const currentProducts = filteredProducts.slice(
    indexOfFirstProduct,
    indexOfLastProduct
  );
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);

  const paginate = (pageNumber: number) => {
    if (pageNumber > 0 && pageNumber <= totalPages) {
      setCurrentPage(pageNumber);
    }
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number
  ) => {
    return (price - (price * discountPercentage) / 100).toFixed(2);
  };

  // Reset filters
  const resetFilters = () => {
    setSearchTerm('');
    setFilterCategory('');
    setFilterBrand('');
  };

  if (loading) {
    return (
      <div className=' bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-white'>
          Products
        </h2>
        <div className='animate-pulse space-y-4'>
          {[...Array(10)].map((_, index) => (
            <div
              key={index}
              className='bg-gray-200 dark:bg-gray-700 h-20 rounded-md'
            ></div>
          ))}
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
        <h2 className='text-xl font-bold mb-4 text-gray-900 dark:text-white'>
          Products
        </h2>
        <div className='p-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-100 rounded-md'>
          {error}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
      <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
        Products List
      </h2>

      {/* Search and Filters */}
      <div className='mb-6 space-y-4'>
        <div className='relative'>
          <input
            type='text'
            placeholder='Search products...'
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className='w-full pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
          />
          <svg
            className='absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 dark:text-gray-300'
            width='20'
            height='20'
            fill='none'
            stroke='currentColor'
            viewBox='0 0 24 24'
            xmlns='http://www.w3.org/2000/svg'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              strokeWidth='2'
              d='M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z'
            ></path>
          </svg>
        </div>

        <div className='grid grid-cols-2 gap-4'>
          <div>
            <label
              htmlFor='category'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Category
            </label>
            <select
              id='category'
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            >
              <option value=''>All Categories</option>
              {categories.map((category) => (
                <option key={category} value={category}>
                  {category}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label
              htmlFor='brand'
              className='block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1'
            >
              Brand
            </label>
            <select
              id='brand'
              value={filterBrand}
              onChange={(e) => setFilterBrand(e.target.value)}
              className='w-full p-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:text-white'
            >
              <option value=''>All Brands</option>
              {brands.map((brand) => (
                <option key={brand} value={brand}>
                  {brand}
                </option>
              ))}
            </select>
          </div>
        </div>

        {(searchTerm || filterCategory || filterBrand) && (
          <button
            onClick={resetFilters}
            className='text-sm text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300'
          >
            Clear all filters
          </button>
        )}
      </div>

      {/* Product List */}
      <div className='space-y-4'>
        {currentProducts.length === 0 ? (
          <div className='text-center py-8 text-gray-500 dark:text-gray-400'>
            <p>No products found matching your criteria.</p>
          </div>
        ) : (
          currentProducts.map((product) => (
            <Link
              to={`/products/${product.id}`}
              key={product.id}
              className={`block p-4 border rounded-lg transition-all hover:shadow-md ${
                selectedId && product.id.toString() === selectedId
                  ? 'border-blue-500 bg-blue-50 dark:border-blue-400 dark:bg-blue-900'
                  : 'border-gray-200 dark:border-gray-700'
              }`}
            >
              <div className='flex gap-4'>
                <div className='w-20 h-20 relative flex-shrink-0'>
                  <img
                    src={product.thumbnail || '/placeholder.svg'}
                    alt={product.title}
                    className='object-cover rounded-md w-full h-full'
                  />
                </div>
                <div className='flex-1 min-w-0'>
                  <h3 className='font-medium text-lg text-gray-900 dark:text-white truncate'>
                    {product.title}
                  </h3>
                  <p className='text-sm text-gray-500 dark:text-gray-400 mb-1'>
                    {product.brand} • {product.category}
                  </p>
                  <div className='flex items-center gap-1 mb-1'>
                    <svg
                      className='w-4 h-4 text-yellow-400'
                      fill='currentColor'
                      viewBox='0 0 20 20'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z'></path>
                    </svg>
                    <span className='text-sm text-gray-600 dark:text-gray-300'>
                      {product.rating.toFixed(1)}
                    </span>
                    <span className='text-sm text-gray-500 dark:text-gray-400 ml-2'>
                      Stock: {product.stock}
                    </span>
                  </div>
                  <div className='flex items-center gap-2'>
                    <span className='font-semibold text-gray-900 dark:text-white'>
                      $
                      {calculateDiscountedPrice(
                        product.price,
                        product.discountPercentage
                      )}
                    </span>
                    <span className='text-sm line-through text-gray-500 dark:text-gray-400'>
                      ${product.price}
                    </span>
                    <span className='text-xs bg-green-100 text-green-800 px-1.5 py-0.5 rounded dark:bg-green-900 dark:text-green-200'>
                      {Math.round(product.discountPercentage)}% OFF
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))
        )}
      </div>

      {/* Pagination */}
      {filteredProducts.length > 0 && (
        <div className='flex items-center justify-between mt-6'>
          <div className='text-sm text-gray-500 dark:text-gray-400'>
            Showing {indexOfFirstProduct + 1}-
            {Math.min(indexOfLastProduct, filteredProducts.length)} of{' '}
            {filteredProducts.length} products
          </div>
          <div className='flex items-center gap-2'>
            <button
              onClick={() => paginate(currentPage - 1)}
              disabled={currentPage === 1}
              className='p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600'
              aria-label='Previous page'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M15 19l-7-7 7-7'
                ></path>
              </svg>
            </button>
            <span className='text-sm text-gray-700 dark:text-gray-300'>
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => paginate(currentPage + 1)}
              disabled={currentPage === totalPages}
              className='p-1 rounded-md border disabled:opacity-50 disabled:cursor-not-allowed dark:border-gray-600'
              aria-label='Next page'
            >
              <svg
                className='w-5 h-5'
                fill='none'
                stroke='currentColor'
                viewBox='0 0 24 24'
                xmlns='http://www.w3.org/2000/svg'
              >
                <path
                  strokeLinecap='round'
                  strokeLinejoin='round'
                  strokeWidth='2'
                  d='M9 5l7 7-7 7'
                ></path>
              </svg>
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ProductList;
