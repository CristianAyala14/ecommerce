import React from 'react'
import "./Instructions.css"
import comprarImg from "../../assets/comprar.png"
import pagarImg from "../../assets/pagar.png"
import entregaImg from "../../assets/entrega.png"

export default function Instructions() {
  return (
    <section className='instructions-section'>
      

      <div className='instructions-card'>
        <div className='instructions-img-container'>
          <div className='instructions-glow'></div>
          <img src={comprarImg} alt="comprar" className='instruction-img1 instructions-img' />
        </div>

        <p className='instructions-text'>
          Elegí lo que querés.
        </p>
      </div>

			<div className='instructions-card'>
        <div className='instructions-img-container'>
          <div className='instructions-glow'></div>
          <img src={pagarImg} alt="comprar" className='instruction-img2 instructions-img' />
        </div>

        <p className='instructions-text'>
          Paga como quieras.
        </p>
      </div>

			<div className='instructions-card'>
        <div className='instructions-img-container'>
          <div className='instructions-glow'></div>
          <img src={entregaImg} alt="comprar" className='instruction-img3 instructions-img' />
        </div>

        <p className='instructions-text'>
          Recibis al instante.
        </p>
      </div>

    </section>
  )
}