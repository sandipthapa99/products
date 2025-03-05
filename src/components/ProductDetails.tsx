'use client';

import type React from 'react';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

interface Review {
  id: number;
  username: string;
  rating: number;
  comment: string;
  date: string;
}

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
  minimumOrderQuantity?: number;
  availabilityStatus?: string;
  reviews?: Review[];
}

interface ProductDetailsProps {
  id: string;
}

const ProductDetails = () => {
  const { id } = useParams<{ id: string }>();

  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const response = await fetch(`https://dummyjson.com/products/${id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch product');
        }
        const data = await response.json();

        // Add some mock data that's not in the API
        const enhancedProduct = {
          ...data,
          minimumOrderQuantity: 1,
          availabilityStatus: data.stock > 0 ? 'In Stock' : 'Out of Stock',
          reviews: generateMockReviews(data.id, Math.round(data.rating)),
        };

        setProduct(enhancedProduct);
        setActiveImage(0); // Reset active image when product changes
      } catch (err) {
        setError('Failed to load product details. Please try again later.');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    if (id) {
      fetchProduct();
    }
  }, [id]);

  // Generate mock reviews based on product rating
  const generateMockReviews = (productId: number, rating: number): Review[] => {
    const reviewCount = 3 + Math.floor(Math.random() * 5); // 3-7 reviews
    const reviews: Review[] = [];

    const comments = [
      'Great product, exactly as described!',
      'Very satisfied with my purchase.',
      'Good quality for the price.',
      'Shipping was fast, product works well.',
      'Exceeded my expectations!',
      'Decent product, but could be better.',
      "Not bad, but I've seen better.",
      'Amazing value for money!',
      'Would definitely recommend to others.',
      'Perfect for my needs.',
    ];

    const names = [
      'John Smith',
      'Emma Wilson',
      'Michael Brown',
      'Sophia Davis',
      'James Miller',
      'Olivia Johnson',
      'William Taylor',
      'Ava Anderson',
      'Alexander Thomas',
      'Charlotte Jackson',
    ];

    for (let i = 0; i < reviewCount; i++) {
      // Generate a date within the last 3 months
      const date = new Date();
      date.setDate(date.getDate() - Math.floor(Math.random() * 90));

      // For most reviews, use the product rating +/- 1, but allow some outliers
      let reviewRating = rating;
      if (Math.random() > 0.7) {
        reviewRating = Math.max(
          1,
          Math.min(5, rating + (Math.random() > 0.5 ? 1 : -1))
        );
      }

      reviews.push({
        id: productId * 100 + i,
        username: names[Math.floor(Math.random() * names.length)],
        rating: reviewRating,
        comment: comments[Math.floor(Math.random() * comments.length)],
        date: date.toISOString().split('T')[0],
      });
    }

    return reviews;
  };

  // Calculate discounted price
  const calculateDiscountedPrice = (
    price: number,
    discountPercentage: number
  ) => {
    return (price - (price * discountPercentage) / 100).toFixed(2);
  };

  // Image navigation
  const nextImage = () => {
    if (product) {
      setActiveImage((activeImage + 1) % product.images.length);
    }
  };

  const prevImage = () => {
    if (product) {
      setActiveImage(
        (activeImage - 1 + product.images.length) % product.images.length
      );
    }
  };

  // Quantity handlers
  const incrementQuantity = () => {
    setQuantity((prev) => prev + 1);
  };

  const decrementQuantity = () => {
    if (quantity > 1) {
      setQuantity((prev) => prev - 1);
    }
  };

  if (loading) {
    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md animate-pulse'>
        <div className='h-64 bg-gray-300 dark:bg-gray-600 rounded-lg mb-4'></div>
        <div className='h-8 bg-gray-300 dark:bg-gray-600 rounded w-3/4 mb-4'></div>
        <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-1/2 mb-2'></div>
        <div className='h-4 bg-gray-300 dark:bg-gray-600 rounded w-2/3 mb-6'></div>
        <div className='h-10 bg-gray-300 dark:bg-gray-600 rounded w-1/3 mb-4'></div>
        <div className='h-24 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
        <div className='h-24 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
        <div className='h-24 bg-gray-300 dark:bg-gray-600 rounded mb-4'></div>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
        <div className='p-4 text-red-500 bg-red-100 dark:bg-red-900 dark:text-red-100 rounded-md'>
          {error || 'Product not found'}
        </div>
      </div>
    );
  }

  return (
    <div className='bg-white dark:bg-gray-800 p-6 rounded-lg shadow-md'>
      <div className='grid grid-cols-1 gap-8'>
        {/* Product Images */}
        <div className='relative'>
          <div className='relative h-64 sm:h-80 md:h-96 rounded-lg overflow-hidden'>
            <img
              src={product.images[activeImage] || '/placeholder.svg'}
              alt={product.title}
              className='w-full h-full object-contain'
              loading='lazy'
            />

            {product.images.length > 1 && (
              <>
                <button
                  onClick={prevImage}
                  className='absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 p-1 rounded-full shadow-md'
                  aria-label='Previous image'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-gray-800 dark:text-white'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
                <button
                  onClick={nextImage}
                  className='absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 dark:bg-black/50 p-1 rounded-full shadow-md'
                  aria-label='Next image'
                >
                  <svg
                    xmlns='http://www.w3.org/2000/svg'
                    className='h-5 w-5 text-gray-800 dark:text-white'
                    viewBox='0 0 20 20'
                    fill='currentColor'
                  >
                    <path
                      fillRule='evenodd'
                      d='M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z'
                      clipRule='evenodd'
                    />
                  </svg>
                </button>
              </>
            )}
          </div>

          {/* Thumbnail Navigation */}
          {product.images.length > 1 && (
            <div className='flex gap-2 mt-4 overflow-x-auto pb-2'>
              {product.images.map((image, index) => (
                <button
                  key={index}
                  onClick={() => setActiveImage(index)}
                  className={`relative w-16 h-16 rounded-md overflow-hidden border-2 ${
                    activeImage === index
                      ? 'border-blue-500 dark:border-blue-400'
                      : 'border-transparent'
                  }`}
                >
                  <img
                    src={image || '/placeholder.svg'}
                    alt={`${product.title} - Image ${index + 1}`}
                    className='w-full h-full object-cover'
                  />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div>
          <div className='flex flex-wrap items-start justify-between gap-2 mb-4'>
            <div>
              <h1 className='text-2xl font-bold text-gray-900 dark:text-white'>
                {product.title}
              </h1>
              <div className='flex items-center gap-2 mt-1'>
                <div className='flex items-center'>
                  {[...Array(5)].map((_, i) => (
                    <svg
                      key={i}
                      xmlns='http://www.w3.org/2000/svg'
                      className={`h-4 w-4 ${
                        i < Math.floor(product.rating)
                          ? 'text-yellow-400'
                          : i < product.rating
                          ? 'text-yellow-400 opacity-50'
                          : 'text-gray-300 dark:text-gray-600'
                      }`}
                      viewBox='0 0 20 20'
                      fill='currentColor'
                    >
                      <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                    </svg>
                  ))}
                </div>
                <span className='text-sm text-gray-600 dark:text-gray-400'>
                  {product.rating.toFixed(1)} ({product.reviews?.length || 0}{' '}
                  reviews)
                </span>
              </div>
            </div>

            <div className='text-right'>
              <div className='flex items-center gap-2'>
                <span className='text-2xl font-bold text-blue-600 dark:text-blue-400'>
                  $
                  {calculateDiscountedPrice(
                    product.price,
                    product.discountPercentage
                  )}
                </span>
                <span className='text-sm line-through text-gray-500 dark:text-gray-400'>
                  ${product.price}
                </span>
              </div>
              <div className='text-xs bg-green-100 text-green-800 px-2 py-0.5 rounded dark:bg-green-900 dark:text-green-200 inline-block mt-1'>
                {Math.round(product.discountPercentage)}% OFF
              </div>
            </div>
          </div>

          <div className='grid grid-cols-2 gap-4 mb-6'>
            <div className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Brand:</span>{' '}
              {product.brand}
            </div>
            <div className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>
                Category:
              </span>{' '}
              {product.category}
            </div>
            <div className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>
                Availability:
              </span>{' '}
              <span
                className={
                  product.stock > 0
                    ? 'text-green-600 dark:text-green-400'
                    : 'text-red-600 dark:text-red-400'
                }
              >
                {product.availabilityStatus}
              </span>
            </div>
            <div className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>Stock:</span>{' '}
              {product.stock} units
            </div>
            <div className='text-sm'>
              <span className='text-gray-600 dark:text-gray-400'>
                Min. Order:
              </span>{' '}
              {product.minimumOrderQuantity} unit
            </div>
          </div>

          <p className='text-sm text-gray-600 dark:text-gray-300 mb-6'>
            {product.description}
          </p>

          {/* Quantity and Add to Cart */}
          <div className='flex flex-wrap gap-4 mb-6'>
            <div className='flex items-center border rounded-md dark:border-gray-600'>
              <button
                onClick={decrementQuantity}
                disabled={quantity <= 1}
                className='px-3 py-2 disabled:opacity-50 text-gray-600 dark:text-gray-400'
                aria-label='Decrease quantity'
              >
                -
              </button>
              <span className='px-3 py-2 border-x dark:border-gray-600 text-gray-800 dark:text-gray-200'>
                {quantity}
              </span>
              <button
                onClick={incrementQuantity}
                disabled={quantity >= product.stock}
                className='px-3 py-2 disabled:opacity-50 text-gray-600 dark:text-gray-400'
                aria-label='Increase quantity'
              >
                +
              </button>
            </div>

            <button
              className='flex items-center gap-2 bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors dark:bg-blue-500 dark:hover:bg-blue-600'
              disabled={product.stock === 0}
            >
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M3 1a1 1 0 000 2h1.22l.305 1.222a.997.997 0 00.01.042l1.358 5.43-.893.892C3.74 11.846 4.632 14 6.414 14H15a1 1 0 000-2H6.414l1-1H14a1 1 0 00.894-.553l3-6A1 1 0 0017 3H6.28l-.31-1.243A1 1 0 005 1H3zM16 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM6.5 18a1.5 1.5 0 100-3 1.5 1.5 0 000 3z' />
              </svg>
              Add to Cart
            </button>
          </div>

          {/* Shipping Info */}
          <div className='flex flex-col gap-2 p-4 bg-gray-100 dark:bg-gray-700 rounded-md mb-6'>
            <div className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 text-gray-600 dark:text-gray-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path d='M8 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0zM15 16.5a1.5 1.5 0 11-3 0 1.5 1.5 0 013 0z' />
                <path d='M3 4a1 1 0 00-1 1v10a1 1 0 001 1h1.05a2.5 2.5 0 014.9 0H10a1 1 0 001-1V5a1 1 0 00-1-1H3zM14 7a1 1 0 00-1 1v6.05A2.5 2.5 0 0115.95 16H17a1 1 0 001-1v-5a1 1 0 00-.293-.707l-2-2A1 1 0 0015 7h-1z' />
              </svg>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                Free shipping on orders over $50
              </span>
            </div>
            <div className='flex items-center gap-2'>
              <svg
                xmlns='http://www.w3.org/2000/svg'
                className='h-4 w-4 text-gray-600 dark:text-gray-400'
                viewBox='0 0 20 20'
                fill='currentColor'
              >
                <path
                  fillRule='evenodd'
                  d='M10 2a4 4 0 00-4 4v1H5a1 1 0 00-.994.89l-1 9A1 1 0 004 18h12a1 1 0 00.994-1.11l-1-9A1 1 0 0015 7h-1V6a4 4 0 00-4-4zm2 5V6a2 2 0 10-4 0v1h4zm-6 3a1 1 0 112 0 1 1 0 01-2 0zm7-1a1 1 0 100 2 1 1 0 000-2z'
                  clipRule='evenodd'
                />
              </svg>
              <span className='text-sm text-gray-600 dark:text-gray-300'>
                30-day return policy
              </span>
            </div>
          </div>
        </div>

        {/* Reviews Section */}
        <div>
          <h2 className='text-xl font-semibold mb-4 text-gray-900 dark:text-white'>
            Customer Reviews
          </h2>

          {product.reviews && product.reviews.length > 0 ? (
            <div className='space-y-4'>
              {product.reviews.map((review) => (
                <div
                  key={review.id}
                  className='border-b pb-4 last:border-0 dark:border-gray-700'
                >
                  <div className='flex items-center justify-between mb-2'>
                    <div className='font-medium text-gray-900 dark:text-white'>
                      {review.username}
                    </div>
                    <div className='text-sm text-gray-500 dark:text-gray-400'>
                      {review.date}
                    </div>
                  </div>
                  <div className='flex items-center mb-2'>
                    {[...Array(5)].map((_, i) => (
                      <svg
                        key={i}
                        xmlns='http://www.w3.org/2000/svg'
                        className={`h-4 w-4 ${
                          i < review.rating
                            ? 'text-yellow-400'
                            : 'text-gray-300 dark:text-gray-600'
                        }`}
                        viewBox='0 0 20 20'
                        fill='currentColor'
                      >
                        <path d='M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z' />
                      </svg>
                    ))}
                  </div>
                  <p className='text-sm text-gray-600 dark:text-gray-300'>
                    {review.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className='text-gray-500 dark:text-gray-400 text-sm'>
              No reviews yet for this product.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
