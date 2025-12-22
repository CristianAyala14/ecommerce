import React from 'react'
import "./Hero.css"
import {NavLink } from 'react-router-dom'
import { MdStar , MdOutlineLocalOffer, MdArrowForward  } from "react-icons/md";
import heroImage from "../../assets/hero.png"

export default function Hero() {
  return (
    <section className='hero'>
      <div className='above'>
        <div className='hero-middle-1'>
          <h1 className='hero-title'>ECOMMERCE <span className='title-span'>prueba</span> Shopping Online</h1>
          <p className='hero-text'>Lorem, ipsum dolor sit amet codis, labore eos ducimus corrupti blanditiis repellat excepturi cumque, ratione inventore.
          Recusandexplic ci dodantium.
          Autem ipsam soluta labol dolor delectus! Numquam?</p>
          <div className='hero-info'>
            <div className='hero-info-1'>
              <div className='hero-starts'>
                <MdStar size="1.2rem"/>
                <MdStar size="1.2rem"/>
                <MdStar size="1.2rem"/>
                <MdStar size="1.2rem"/>
              </div>
              
              <div className='hero-number'>176K <span className='title-span'></span>Excellent reviews</div>
            </div>

            <div className='hero-buttons'>
              <NavLink to={"/"}>Shop Now</NavLink>
              <NavLink to={"/"}><MdOutlineLocalOffer size="0.8em"/>Offers</NavLink>
            </div>
          </div>
        </div>

        <div className='hero-image-container'>
          <div className='hero-glow'></div> {/* este será el círculo de luz */}
          <img src={heroImage} alt="Hero" />
        </div>
      </div>

      <div className='bellow'>
        <button className='bellow-button'><MdArrowForward  /></button>
        <div className='bellow-text'>
          <p>Lorem ipsa esse ot.fficia explicabo dolore numquam facere alias earum repellendus tempore.
          s excepturiatis it odio repellat. Inven. Inven. Inven. Inven. Inven. Inven. Inven. Inven. Inven. Inven. Inven. Inventore?</p>
        </div>
      </div>
      

      
      

    </section>
  )
}
