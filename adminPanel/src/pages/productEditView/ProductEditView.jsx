import "./ProductEditView.css";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getProductByIdReq, updateProductReq } from "../../apiCalls/productsCalls";
import { getAllCategoriesReq } from "../../apiCalls/categoriesCalls";

export default function ProductEditView() {
  const { id } = useParams();
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
    images: [], // estas son las imágenes existentes del producto
  });

  const [previewImages, setPreviewImages] = useState([]); // URLs para preview
  const [imageFiles, setImageFiles] = useState([]);       // Archivos nuevos
  const [uploading, setUploading] = useState(false);

  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductByIdReq(id);
      if (res.ok) {
        setProduct({
          ...res.payload,
          category: res.payload.category?._id || res.payload.category || ""
        });
        setPreviewImages((res.payload.images || []).map(img => img.url));
        setImageFiles([]);
      }
    };
    if (id) fetchProduct();
  }, [id]);

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

  /* ================= IMAGE CHANGE ================= */
  const handleImageChange = (file, index) => {
    if (!file) return;

    const tempURL = URL.createObjectURL(file);

    setPreviewImages(prev => {
      const copy = [...prev];
      copy[index] = tempURL;
      return copy;
    });

    setImageFiles(prev => {
      const copy = [...prev];
      copy[index] = file;
      return copy;
    });
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!product.category || !product.title || !product.description) {
      alert("Debe completar todos los datos.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("title", product.title);
      formData.append("description", product.description);
      formData.append("regularPrice", product.regularPrice);
      formData.append("old_price", product.old_price);
      formData.append("quantity", product.quantity);
      formData.append("category", product.category); // enviamos solo el _id
      formData.append("offer", product.offer);
      formData.append("new_insert", product.new_insert);

      // Adjuntar solo las imágenes nuevas
      imageFiles.forEach(file => {
        if (file) formData.append("images", file);
      });

      const res = await updateProductReq(id, formData);

      if (res.ok) {
        setProduct({
          ...res.payload,
          category: res.payload.category?._id || res.payload.category || ""
        });
        setPreviewImages(res.payload.images.map(img => img.url));
        setImageFiles([]);
        alert("Producto actualizado correctamente!");
      } else {
        alert("Error al guardar: " + res.message);
      }
    } catch (err) {
      alert("Error al guardar: " + err.message);
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
            onClick={() => navigate("/products")}
            disabled={uploading}
          >
            ✖
          </button>

          <h2>Editar producto</h2>

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
          {[0, 1, 2, 3].map(i => (
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
              onChange={(e) => setProduct({ ...product, title: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              disabled={uploading}
              value={product.description}
              onChange={(e) => setProduct({ ...product, description: e.target.value })}
            />
          </div>

          <div className="form-group">
            <label>Categoría:</label>
            <select
              disabled={uploading || noCategories}
              value={product.category}
              onChange={(e) => setProduct({ ...product, category: e.target.value })}
            >
              {noCategories ? (
                <option value="">Primero debes crear una categoría</option>
              ) : (
                <>
                  <option value="">Seleccionar categoría</option>
                  {categories.map(cat => (
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
                onChange={(e) => setProduct({ ...product, regularPrice: e.target.value })}
              />
            </div>

            {product.offer && (
              <div className="form-group">
                <label>Precio anterior:</label>
                <input
                  type="number"
                  disabled={uploading}
                  value={product.old_price || ""}
                  onChange={(e) => setProduct({ ...product, old_price: e.target.value })}
                />
              </div>
            )}

            <div className="form-group">
              <label>Cantidad:</label>
              <input
                type="number"
                disabled={uploading}
                value={product.quantity}
                onChange={(e) => setProduct({ ...product, quantity: e.target.value })}
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                disabled={uploading}
                checked={product.offer}
                onChange={(e) => setProduct({ ...product, offer: e.target.checked })}
              />
              En oferta
            </label>

            <label>
              <input
                type="checkbox"
                disabled={uploading}
                checked={product.new_insert}
                onChange={(e) => setProduct({ ...product, new_insert: e.target.checked })}
              />
              Nuevo ingreso
            </label>
          </div>
        </form>
      </div>
    </div>
  );
}
