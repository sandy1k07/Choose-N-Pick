import React from 'react'
import ProductCard from './ProductCard'
import { useAppContext } from '../context/appContext'

const BestSellers = () => {
  const {products} = useAppContext();
  
  
  return (
    
    <div className='mt-16'>
          <p className='text-2xl md:text-3xl font-medium'>Best Sellers</p>
          <div className='grid grid-cols-2 sm:grid-cols-3 md:gird-cols-4 gap-3 md:gap-10
          lg:grid-cols-5 mt-6 '>
             {products.filter((product)=> product.inStock).slice(0, 5).map((product, index)=>
              <ProductCard key={index} product={product}/>
             )}
          </div>
    </div>
  )
}

export default BestSellers
