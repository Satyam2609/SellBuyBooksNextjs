"use client"

import Footer from "../components/Footer"
import Navbar from "../components/Navbar"
import UserProfile from "./UserProfile"

export default function Profile() {
  return (
    <div className="bg-white text-black">
      <Navbar/>
        <UserProfile/>
        <Footer/>
      
    </div>
  )
}
