"use client"
import Footer from '../components/Footer'
import Navbar from '../components/Navbar'
import ShoppingCart from './ShoppingCart'

export default function Cart() {
  return (
    <div className='bg-white text-black'>
      <Navbar/>
        <ShoppingCart/>
        <Footer/>
      
    </div>
  )
}
