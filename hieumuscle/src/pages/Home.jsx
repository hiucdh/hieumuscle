import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'

const Home = () => {
    return (
        <div className='home w-full'>
            <div className='header'>
                <Header />
            </div>
            <div className='hero w-full'>
                <HeroSection />
            </div>
        </div>
    )
}

export default Home