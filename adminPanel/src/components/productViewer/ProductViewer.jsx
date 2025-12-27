import "./ProductViewer.css";
import { useEffect, useState } from "react";
import { getAllProductsReq } from "../../apiCalls/productsCalls";

export default function ProductViewer({ filters }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(false);

  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const limit = 10;

  /* Reset page on filter change */
  useEffect(() => {
    setPage(1);
  }, [filters]);

  /* Fetch products */
  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);

      const params = new URLSearchParams();
      params.set("page", page);
      params.set("limit", limit);

      if (filters.searchTerm) {
        params.set("searchTerm", filters.searchTerm);
      }

      if (filters.category && filters.category !== "all") {
        params.set("category", filters.category);
      }

      if (filters.offer === true) {
        params.set("offer", "true");
      }

      if (filters.new_insert === true) {
        params.set("new_insert", "true");
      }

      const res = await getAllProductsReq(params.toString());

      if (!res.ok) {
        setProducts([]);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      setProducts(res.payload.products);
      setTotalPages(res.payload.totalPages);
      setLoading(false);
    };

    fetchProducts();
  }, [filters, page]);

  if (loading) {
    return <p className="loading">Cargando productos...</p>;
  }

  if (products.length === 0) {
    return <p className="empty">No hay productos para mostrar</p>;
  }

  return (
    <div className="product-viewer">
      {/* HEADER */}
      <div className="product-viewer-header">
        <span>Producto</span>
        <span>Precio</span>
        <span>Cantidad</span>
        <span>Estado</span>
        <span></span>
      </div>

      {/* LIST */}
      <div className="product-viewer-list">
        {products.map((product) => (
          <div key={product._id} className="product-row">
            {/* PRODUCT */}
            <div className="product-info">
              <img
                src={product.images?.[0]}
                alt={product.title}
                className="product-image"
              />
              <p className="product-title">{product.title}</p>
            </div>

            {/* PRICE */}
            <div className="product-price">
              ${product.regularPrice}
            </div>

            {/* QUANTITY */}
            <div className="product-quantity">
              {product.quantity}
            </div>

            {/* STATUS */}
            <div className="product-status">
              {product.new_insert && (
                <span className="status-badge new">Nuevo</span>
              )}

              {product.offer && (
                <span className="status-badge offer">En oferta</span>
              )}

              {!product.new_insert && !product.offer && (
                <span className="status-badge standard">
                  Estándar
                </span>
              )}
            </div>

            {/* ACTIONS */}
            <div className="product-actions">
              <button className="edit">✏️</button>
              <button className="delete">🗑️</button>
            </div>
          </div>
        ))}
      </div>

      {/* PAGINATION */}
      <div className="pagination">
      <button
        className="page-btn"
        onClick={() => setPage((p) => Math.max(p - 1, 1))}
        disabled={page === 1}
      >
        ←
      </button>

      <span className="page-info">
        Página <strong>{page}</strong> de {totalPages}
      </span>

      <button
        className="page-btn"
        onClick={() => setPage((p) => Math.min(p + 1, totalPages))}
        disabled={page === totalPages}
      >
        →
      </button>
    </div>

    </div>
  );
}
