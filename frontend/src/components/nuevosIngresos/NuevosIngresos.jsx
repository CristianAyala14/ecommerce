import React, { useState, useEffect } from "react";
import "./NuevosIngresos.css";
import Item from "../item/Item";
import { getNewProductsReq } from "../../apiCalls/productsCalls";

export default function NuevosIngresos() {
  const [new_inserts, setNewInserts] = useState(null);
  const [index, setIndex] = useState(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchNewProducts = async () => {
      setLoading(true);

      const result = await getNewProductsReq();

      if (result.ok) {
        setNewInserts(result.payload);
      } else {
        console.error(result.status, result.message);
        setNewInserts(null);
      }

      setLoading(false);
    };

    fetchNewProducts();
  }, []);

  useEffect(() => {
    if (!new_inserts?.docs?.length) return;

    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % new_inserts.docs.length);
    }, 5000);

    return () => clearInterval(interval);
  }, [new_inserts]);

  /* ---------- ESTADOS ---------- */

  if (loading) {
    return (
      <section className="nuevos-ingresos-container">
        <p>Cargando nuevos ingresos...</p>
      </section>
    );
  }

  if (!new_inserts?.docs || new_inserts.docs.length === 0) {
    return (
      <section className="nuevos-ingresos-container">
        <p>No hay productos nuevos disponibles.</p>
      </section>
    );
  }

  /* ---------- RENDER ---------- */

  const currentProduct = new_inserts.docs[index];

  const mainImage = currentProduct.images?.[0]?.url;
  const bgImage = currentProduct.images?.[2]?.url || mainImage;

  return (
    <section className="nuevos-ingresos-container">
      <div
        className="nuevos-ingresos"
        style={{ backgroundImage: `url(${bgImage})` }}
      >
        <p className="nuevos-ingresos-title">NUEVOS INGRESOS</p>

        <div className="text-card-div">
          <p className="nuevos-ingresos-text">
            Nuestros productos mas recientes
          </p>

          <div className="producto-card-wrapper">
            <Item
              id={currentProduct._id}
              image={mainImage}
              name={currentProduct.title}
              regularPrice={currentProduct.regularPrice}
              old_price={currentProduct.old_price}
              offer={currentProduct.offer}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
