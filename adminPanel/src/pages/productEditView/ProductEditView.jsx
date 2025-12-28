import "./ProductEditView.css";
import React, { useEffect, useRef, useState } from "react";
import { useParams } from "react-router-dom";
import { getProductByIdReq, updateProductReq } from "../../apiCalls/productsCalls";
import { uploadProductImgReq } from "../../apiCalls/uploadCalls";

export default function ProductEditView() {
  const { id } = useParams();
  const fileRefs = [useRef(null), useRef(null), useRef(null), useRef(null)];

  const [editEnabled, setEditEnabled] = useState(false);
  const [product, setProduct] = useState(null);
  const [originalProduct, setOriginalProduct] = useState(null);
  const [previewImages, setPreviewImages] = useState([]);
  const [uploading, setUploading] = useState(false);

  /* ================= FETCH PRODUCT ================= */
  useEffect(() => {
    const fetchProduct = async () => {
      const res = await getProductByIdReq(id);
      if (res.ok) {
        setProduct(res.payload);
        setOriginalProduct(res.payload);
        setPreviewImages(res.payload.images || []);
      }
    };
    if (id) fetchProduct();
  }, [id]);

  if (!product) return <p>Cargando producto...</p>;

  /* ================= HELPERS ================= */
  const hasChanges =
    JSON.stringify(product) !== JSON.stringify(originalProduct) ||
    JSON.stringify(previewImages) !== JSON.stringify(originalProduct.images);

  const enterEditMode = () => {
    setEditEnabled(true);
    setOriginalProduct(product);
  };

  const exitEditMode = () => {
    if (hasChanges) {
      const confirmExit = window.confirm(
        "Tenés cambios sin guardar. ¿Descartarlos?"
      );
      if (!confirmExit) return;
      setProduct(originalProduct);
      setPreviewImages(originalProduct.images);
    }
    setEditEnabled(false);
  };

  /* ================= IMAGE UPLOAD ================= */
  const handleImageChange = async (file, index) => {
    if (!file) return;

    // Preview temporal
    const tempURL = URL.createObjectURL(file);
    setPreviewImages((prev) => {
      const copy = [...prev];
      copy[index] = tempURL;
      return copy;
    });

    // Subida a Cloudinary
    setUploading(true);
    const formData = new FormData();
    formData.append("file", file);

    const res = await uploadProductImgReq(formData);
    if (res.ok) {
      setPreviewImages((prev) => {
        const copy = [...prev];
        copy[index] = res.url;
        return copy;
      });
    } else {
      alert("Error subiendo imagen: " + res.message);
      setPreviewImages((prev) => {
        const copy = [...prev];
        copy[index] = "";
        return copy;
      });
    }
    setUploading(false);
  };

  /* ================= SAVE PRODUCT ================= */
  const handleSave = async () => {
    const updatedProduct = {
      ...product,
      images: previewImages.filter(Boolean),
    };

    setUploading(true);
    const res = await updateProductReq(id, updatedProduct);

    if (res.ok) {
      setProduct(res.payload);
      setOriginalProduct(res.payload);
      setEditEnabled(false);
      alert("Producto actualizado correctamente!");
    } else {
      alert("Error al guardar: " + res.message);
    }
    setUploading(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className="product-wrapper">
      <div className={`product-container ${editEnabled ? "edit-mode" : ""}`}>
        {/* HEADER */}
        <div className="product-header">
          <button
            className="header-icon left"
            onClick={editEnabled ? exitEditMode : enterEditMode}
          >
            {editEnabled ? "✖" : "✏️"}
          </button>

          <h2>Editar producto</h2>

          {editEnabled && (
            <button
              className="header-icon right"
              onClick={handleSave}
              disabled={uploading}
            >
              💾
            </button>
          )}
        </div>

        {/* IMAGES */}
        <div className="product-images">
          {[0, 1, 2, 3].map((i) => (
            <div key={i} className="image-slot">
              <input
                type="file"
                hidden
                ref={fileRefs[i]}
                accept="image/*"
                disabled={!editEnabled || uploading}
                onChange={(e) => handleImageChange(e.target.files[0], i)}
              />
              <img
                src={previewImages[i] || ""}
                alt="product"
                className={`product-image ${editEnabled ? "editable" : ""}`}
                onClick={() =>
                  editEnabled && !uploading && fileRefs[i].current.click()
                }
              />
            </div>
          ))}
        </div>

        {/* FORM */}
        <form className="product-form">
          <div className="form-group">
            <label>Título: </label>
            <input
              disabled={!editEnabled || uploading}
              value={product.title}
              onChange={(e) =>
                setProduct({ ...product, title: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Descripción: </label>
            <textarea
              disabled={!editEnabled || uploading}
              value={product.description}
              onChange={(e) =>
                setProduct({ ...product, description: e.target.value })
              }
            />
          </div>

          <div className="form-grid">
            <div className="form-group">
              <label>Precio:</label>
              <input
                type="number"
                disabled={!editEnabled || uploading}
                value={product.regularPrice}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    regularPrice: e.target.value,
                  })
                }
              />
            </div>

            {/* MOSTRAR PRECIO ANTERIOR SOLO SI ESTA EN OFERTA */}
            {product.offer && (
              <div className="form-group">
                <label>Precio anterior</label>
                <input
                  type="number"
                  disabled={!editEnabled || uploading}
                  value={product.old_price || ""}
                  onChange={(e) =>
                    setProduct({
                      ...product,
                      old_price: e.target.value,
                    })
                  }
                />
              </div>
            )}

            <div className="form-group">
              <label>Cantidad</label>
              <input
                type="number"
                disabled={!editEnabled || uploading}
                value={product.quantity}
                onChange={(e) =>
                  setProduct({
                    ...product,
                    quantity: e.target.value,
                  })
                }
              />
            </div>
          </div>

          <div className="checkbox-group">
            <label>
              <input
                type="checkbox"
                disabled={!editEnabled || uploading}
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
                disabled={!editEnabled || uploading}
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
