import "./ProductCreateView.css";
import React, { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getAllCategoriesReq } from "../../apiCalls/categoriesCalls";
import { createProductReq } from "../../apiCalls/productsCalls";

export default function ProductCreateView() {
  const navigate = useNavigate();
  const fileRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [product, setProduct] = useState({
    title: "",
    description: "",
    regularPrice: 0,
    old_price: 0,
    quantity: 1,
    category: "",
    offer: false,
    new_insert: false,
    images: [],
  });

  const [previewImages, setPreviewImages] = useState([]);
  const [imageFiles, setImageFiles] = useState([]);
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* ================= FETCH CATEGORIES ================= */
  useEffect(() => {
    const fetchCategories = async () => {
      setLoadingCategories(true);
      const res = await getAllCategoriesReq();
      if (res.ok) setCategories(res.payload);
      else setCategories([]);
      setLoadingCategories(false);
    };
    fetchCategories();
  }, []);

  /* ================= IMAGE PREVIEW ONLY ================= */
  const handleImageChange = (file, index) => {
    if (!file) return;

    const tempURL = URL.createObjectURL(file);

    setPreviewImages((prev) => {
      const copy = [...prev];
      copy[index] = tempURL;
      return copy;
    });

    setImageFiles((prev) => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  /* ================= CANCEL ================= */
  const handleCancel = () => {
    const confirmCancel = window.confirm(
      "¿Querés interrumpir la creación del producto?"
    );
    if (confirmCancel) {
      navigate("/products");
    }
  };

  /* ================= SAVE PRODUCT ================= */
  const handleSave = async () => {
    if (!product.title || !product.description || !product.category) {
      alert("Debe completar todos los datos para poder crear el producto.");
      return;
    }

    setUploading(true);

    /* ===== CREAR FORM DATA ===== */
    const formData = new FormData();
    formData.append("title", product.title);
    formData.append("description", product.description);
    formData.append("regularPrice", product.regularPrice);
    formData.append("old_price", product.old_price);
    formData.append("quantity", product.quantity);
    formData.append("category", product.category);
    formData.append("offer", product.offer);
    formData.append("new_insert", product.new_insert);

    // Adjuntar imágenes al FormData
    imageFiles.forEach((file) => {
      if (file) formData.append("images", file);
    });

    /* ===== CREAR PRODUCTO ===== */
    const res = await createProductReq(formData);

    if (res.ok) {
      alert("Producto creado correctamente!");
      navigate("/products");
    } else {
      alert("Error creando producto: " + res.message);
    }

    setUploading(false);
  };

  const noCategories = !loadingCategories && categories.length === 0;

  /* ================= RENDER ================= */
  return (
    <div className="product-wrapper">
      <div className="product-container edit-mode">
        {/* HEADER */}
        <div className="product-header">
          <button
            className="header-icon left"
            onClick={handleCancel}
            disabled={uploading}
          >
            ✖
          </button>

          <h2>Crear producto</h2>

          <button
            className="header-icon right"
            onClick={handleSave}
            disabled={uploading || noCategories}
          >
            💾
          </button>
        </div>

        {/* IMAGES */}
        <div className="product-images">
          {[0, 1, 2, 3].map((i) => (
            <div
              key={i}
              className="image-slot"
              onClick={() => !uploading && fileRefs[i].current.click()}
            >
              <input
                type="file"
                hidden
                ref={fileRefs[i]}
                accept="image/*"
                disabled={uploading}
                onChange={(e) => handleImageChange(e.target.files[0], i)}
              />
              <div className="product-image editable">
                {previewImages[i] ? (
                  <img src={previewImages[i]} alt="product" />
                ) : (
                  <span className="placeholder">📷</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* FORM */}
        <form className="product-form">
          <div className="form-group">
            <label>Título:</label>
            <input
              disabled={uploading}
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              disabled={uploading}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select
              disabled={loadingCategories || uploading || noCategories}
              value={product.category}
              onChange={(e) =>
                setProduct({ ...product, category: e.target.value })
              }
            >
              {noCategories ? (
                <option value="">
                  Primero debes crear una categoría
                </option>
              ) : (
                <>
                  <option value="">Seleccionar categoría</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat._id}>
                      {cat.name}
                    </option>
                  ))}
                </>
              )}
            </select>
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                disabled={uploading}
                value={product.regularPrice}
                onChange={(e) =>
                  setProduct({ ...product, regularPrice: e.target.value })
                }
              />
            </div>

            {product.offer && (
              <div className="form-group">
                <label>Precio anterior:</label>
                <input
                  type="number"
                  disabled={uploading}
                  value={product.old_price || ""}
                  onChange={(e) =>
                    setProduct({ ...product, old_price: e.target.value })
                  }
                />
              </div>
            )}

            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                disabled={uploading}
                value={product.quantity}
                onChange={(e) =>
                  setProduct({ ...product, quantity: e.target.value })
                }
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                disabled={uploading}
                checked={product.offer}
                onChange={(e) =>
                  setProduct({ ...product, offer: e.target.checked })
                }
              />
              En oferta
            </label>

            <label>
              <input
                type="checkbox"
                disabled={uploading}
                checked={product.new_insert}
                onChange={(e) =>
                  setProduct({ ...product, new_insert: e.target.checked })
                }
              />
              Nuevo ingreso
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
