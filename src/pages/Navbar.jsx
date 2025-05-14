import React from 'react'
import { Link, Links } from 'react-router'
const Navbar = () => {
  return (
    <div>
      <div className="container mx-auto">
        <div className="flex justify-between py-3 border-b-2 mb-5 ">
          <div className="">
            <h1>Navbar</h1>
          </div>
          <nav>
            <ul className='flex gap-10 '>
              <Link to={"/"}>Home</Link>
              <Link to={"/about"}>About</Link>
              <Link to={"/contact"}>Contact</Link>
            </ul>
          </nav>
        </div>
      </div>
    </div>
  )
}

export default Navbar