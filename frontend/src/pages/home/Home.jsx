import React from 'react'
import "./Home.css";
import Hero from '../../components/hero/Hero';
import Ofertas from '../../components/ofertas/Ofertas';
import NuevosIngresos from '../../components/nuevosIngresos/NuevosIngresos';
import Instructions from '../../components/instructions/Instructions';
export default function Home() {
  return (
    <div className='home'>
      <Hero/>
      <Ofertas/>
      <NuevosIngresos/>
      <Instructions/>
    </div>
  )
}
