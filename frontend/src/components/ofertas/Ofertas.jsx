import { useEffect, useState } from "react";
import "./Ofertas.css";
import Item from "../item/Item";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import { getProductsByOfferReq } from "../../apiCalls/productsCalls";

export default function Ofertas() {
  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 4;

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        const params = new URLSearchParams({ page, limit });
        const res = await getProductsByOfferReq(params.toString());

        if (res.status === 200) {
          setProducts(res.payload.products);
          setTotalPages(res.payload.totalPages);
        } else {
          setProducts([]);
          setTotalPages(1);
        }
      } catch (error) {
        console.error(error);
        setProducts([]);
        setTotalPages(1);
      } finally {
        setLoading(false);
      }
    };

    fetchProducts();
  }, [page]);

  const handlePrevPage = () =>
    setPage((prev) => Math.max(prev - 1, 1));

  const handleNextPage = () =>
    setPage((prev) => Math.min(prev + 1, totalPages));

  const hasProducts = products.length > 0;

  return (
    <section className="ofertas-container">
      <h3 className="ofertas-title">Nuestros mejores productos</h3>
      <p className="ofertas-text">
        Hecha un vistazo a los productos mas valorados por nuestros clientes.
      </p>

      {/* PAGINACIÓN */}
      {!loading && hasProducts && (
        <div className="ofertas-pagination">
          <button
            onClick={handlePrevPage}
            disabled={page === 1}
          >
            <MdArrowBack size="0.6em" />
          </button>

          <span>
            Página {page} de {totalPages}
          </span>

          <button
            onClick={handleNextPage}
            disabled={page === totalPages}
          >
            <MdArrowForward size="0.6em" />
          </button>
        </div>
      )}

      {/* PRODUCTOS */}
      <div className="ofertas-grid">
        {loading ? (
          <p className="loading-offers">Cargando...</p>
        ) : hasProducts ? (
          products.map((item) => (
            <Item
              key={item._id}
              id={item._id}
              image={item.images?.[0]?.url}
              name={item.title}
              regularPrice={item.regularPrice}
              old_price={item.old_price}
              offer={item.offer}
              new_insert={item.new_insert}
            />
          ))
        ) : (
          <p className="no-offers">No hay ofertas.</p>
        )}
      </div>
    </section>
  );
}
