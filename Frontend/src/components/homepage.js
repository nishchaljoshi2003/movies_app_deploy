import React from 'react'
import Navbar from './navbar'
import Banners from './banners'
const Cards=React.lazy(()=>import('./cards'))

function Homepage() {
  return (
    <div className='wrapper2'>
        <Navbar />
        <Banners/>
        <React.Suspense fallback='Loading...'>
          <Cards/>
        </React.Suspense>
        
    </div>
  )
}

export default Homepage