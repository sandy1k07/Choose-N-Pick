import React, { useEffect, useState } from 'react'
import { useAppContext } from '../context/appContext'
import ProductCard from '../components/ProductCard';

const AllProducts = () => {
  const {products, search}  = useAppContext();
  const [filteredProducts, setFilteredProducts] = useState([]);

  useEffect(()=>{
    // setFilteredProducts(products.filter(product => product.inStock));
    if(search.length>0){
        setFilteredProducts(products.filter((product) => {
            return product.name.toLowerCase().includes(search.toLowerCase());
        }))
    }else{
        setFilteredProducts(products);
    }
    // console.log(search);
    console.log(filteredProducts);
    
  }, [products, search])
  
    return (
    <div className='mt-16 flex flex-col'>
      <div className='flex flex-col items-end w-max'>
        <p className='text-2xl font-medium'>ALL PRODCUTS</p>
        <div className='w-16 h-0.5 bg-primary rounded-full'></div>
      </div>
      <div className='grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3 md:gap-6 lg:grid-cols-5 mt-6'>
        {filteredProducts.filter((product) => product.inStock).map((product, index)=> (
            <ProductCard key={index} product={product}/>
        ))}
      </div>
    </div>
  )
}

export default AllProducts;

