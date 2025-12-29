import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByIdReq } from "../../apiCalls/productsCalls";
import "./Product.css";
import { useOrderContext } from "../../contexts/orderContext";

export default function Product() {
  const { addItem, refreshOrder } = useOrderContext();
  const { productId } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [showNotification, setShowNotification] = useState(false);

  /* =========================
     FETCH PRODUCT
  ========================= */
  useEffect(() => {
    const fetchProduct = async () => {
      const result = await getProductByIdReq(productId);

      if (result.ok) {
        setProduct(result.payload);
        setSelectedImage(result.payload.images?.[0]?.url || "");
      } else {
        console.log(result.status, result.message);
      }
    };

    fetchProduct();
  }, [productId]);

  /* =========================
     ADD TO ORDER
  ========================= */
  const handleAddToOrder = async () => {
    const result = await addItem(product._id, quantity);

    if (result.ok) {
      setShowNotification(true);
      setTimeout(() => setShowNotification(false), 2000);
    } else {
      console.log(result.status, result.message);
    }

    const sync = await refreshOrder();
    if (!sync.ok) {
      console.log(sync.status, sync.message);
    }
  };

  /* =========================
     BUY NOW
  ========================= */
  const buyNow = async () => {
    const result = await addItem(product._id, quantity);

    if (result.ok) {
      navigate("/order");
    } else {
      console.log(result.status, result.message);
    }

    const sync = await refreshOrder();
    if (!sync.ok) {
      console.log(sync.status, sync.message);
    }
  };

  if (!product) {
    return <p className="loading-product-productView">Cargando...</p>;
  }

  return (
    <section className="product-page">
      {/* Breadcrumb */}
      <div className="breadcrumb">
        <p>
          {product.category?.name} / {product.title}
        </p>
      </div>

      <div className="product-content">
        {/* Gallery */}
        <div className="product-gallery">
          <img
            src={selectedImage}
            alt={product.title}
            className="main-image"
          />

          <div className="thumbnails">
            {product.images?.map((img, index) => (
              <img
                key={index}
                src={img.url}
                alt=""
                className={
                  selectedImage === img.url ? "active" : ""
                }
                onClick={() => setSelectedImage(img.url)}
              />
            ))}
          </div>
        </div>

        {/* Info */}
        <div className="product-info">
          <h1>{product.title}</h1>

          <div className="price">
            <span className="regular">
              ${product.regularPrice}
            </span>

            {product.old_price && (
              <span className="old">
                ${product.old_price}
              </span>
            )}
          </div>

          {/* Quantity */}
          <div className="card-quantity">
            <button onClick={() => setQuantity(q => Math.max(1, q - 1))}>
              -
            </button>

            <span>{quantity}</span>

            <button onClick={() => setQuantity(q => q + 1)}>
              +
            </button>
          </div>

          <div className="actions">
            <button className="add" onClick={handleAddToOrder}>
              Agregar a la orden
            </button>

            <button className="buy" onClick={buyNow}>
              Comprar
            </button>
          </div>

          <p className="extra">
            Envío gratis en compras superiores a $80.000
          </p>
        </div>
      </div>

      {/* Description */}
      <div className="product-description">
        <p>{product.description}</p>
      </div>

      <div className={`toast-notification ${showNotification ? "show" : ""}`}>
        Agregado
      </div>
    </section>
  );
}
