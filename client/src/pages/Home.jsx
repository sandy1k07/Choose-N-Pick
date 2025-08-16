import React from 'react'
import Banner from '../components/Banner'
import Categories from '../components/Categories'
import BestSellers from '../components/BestSellers'
import BottomBanner from '../components/BottomBanner'
import Newsletter from '../components/Newsletter'

const Home = () => {
  return (
    <div className='mt-10'>
      <Banner />
      <Categories />
      <BestSellers />
      <BottomBanner />
      <Newsletter />
    </div>
  )
}

export default Home
