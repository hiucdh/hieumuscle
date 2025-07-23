import React from 'react'
import Header from '../components/Header'
import HeroSection from '../components/HeroSection'
import Footer from '../components/Footer'

const Home = () => {
    return (
        <div className='home'>
            <div className='header'>
                <Header />
            </div>
            <div className='hero'>
                <HeroSection />
            </div>
            <div className='foot'>
                <Footer />
            </div>
        </div>
    )
}

export default Home