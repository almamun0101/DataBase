import React from 'react'
import Navbar from './pages/Navbar'
import { Outlet } from 'react-router'
import Home from './pages/Home'
import About from './pages/About'

const RootLayout = () => {
  return (
    <div>
      <Navbar/>
      <Outlet></Outlet>
    </div>
  )
}

export default RootLayout