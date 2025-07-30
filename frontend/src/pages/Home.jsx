import React from 'react'
import Header from '../components/Header'
import Carouselslider from '../components/Carouselslider'
import CategoryGrid from '../components/categoryGrid'
import FeaturedProducts from '../components/FeaturedProducts'
import HomeServices from '../components/HomeServices'

const Home = () => {
  return <>
    <Carouselslider/>
    <HomeServices/>
    <CategoryGrid/>
    <FeaturedProducts/>
  </>
}

export default Home