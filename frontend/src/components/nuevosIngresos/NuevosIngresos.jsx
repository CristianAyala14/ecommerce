import React from 'react'
import { useState, useEffect } from 'react'
import "./NuevosIngresos.css"
import Item from '../item/Item'
import { getNewProductsReq } from '../../apiCalls/productsCalls'

export default function NuevosIngresos() {
  const [new_inserts, setNewInserts] = useState([]);
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const fetchNewProducts = async () => {
      const result = await getNewProductsReq();

      if (result.ok) {
        setNewInserts(result.payload);
      } else {
        console.error(result.status, result.message);
        setNewInserts([]);
      }
    };

    fetchNewProducts();
  }, []);

  useEffect(() => {
    if (!new_inserts.docs || new_inserts.docs.length === 0) return;

    const interval = setInterval(() => {
      setIndex(prev => (prev + 1) % new_inserts.docs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [new_inserts]);

  if (!new_inserts.docs || new_inserts.docs.length === 0) {
    return (
      <section className="nuevos-ingresos-container">
        <p>Cargando nuevos ingresos...</p>
      </section>
    );
  }

  const currentProduct = new_inserts.docs[index];

  return (
    <section className="nuevos-ingresos-container">
      <div
        className="nuevos-ingresos"
        style={{ backgroundImage: `url(${currentProduct.images?.[1]})` }}
      >
        <p className="nuevos-ingresos-title">NUEVOS INGRESOS</p>
        <div className='text-card-div'>
          <p className='nuevos-ingresos-text'>Chekea nuestros productos mas recientes para mantenerte actualizado.</p>
          <div className="producto-card-wrapper">
            <Item
              id={currentProduct._id}
              image={currentProduct.images?.[0]}
              name={currentProduct.title}
              new_price={currentProduct.regularPrice}
              old_price={currentProduct.old_price}
            />
          </div>
        </div>
        
      </div>
    </section>
  );
}
