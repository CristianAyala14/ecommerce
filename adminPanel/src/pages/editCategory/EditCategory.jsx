import "./EditCategory.css";
import React, { useEffect, useRef, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  getCategoryByIdReq,
  updateCategoryReq
} from "../../apiCalls/categoriesCalls";

export default function EditCategory() {
  const { id } = useParams();
  const navigate = useNavigate();
  const fileRef = useRef(null);

  const [category, setCategory] = useState({
    name: "",
    description: "",
    banner: { url: "", public_id: "" }
  });

  const [preview, setPreview] = useState("");
  const [file, setFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  // 👇 MODO EDICIÓN (OFF por defecto)
  const [isEditing, setIsEditing] = useState(false);

  /* ================= FETCH ================= */
  useEffect(() => {
    const fetchCategory = async () => {
      const res = await getCategoryByIdReq(id);
      if (res.ok) {
        setCategory(res.payload);
        setPreview(res.payload.banner.url);
      }
    };
    if (id) fetchCategory();
  }, [id]);

  /* ================= IMAGE ================= */
  const handleImageChange = (file) => {
    if (!file) return;
    setFile(file);
    setPreview(URL.createObjectURL(file));
  };

  /* ================= SAVE ================= */
  const handleSave = async () => {
    if (!category.name || !category.description) {
      alert("Debe completar nombre y descripción.");
      return;
    }

    setUploading(true);

    try {
      const formData = new FormData();
      formData.append("name", category.name);
      formData.append("description", category.description);
      if (file) formData.append("file", file);

      const res = await updateCategoryReq(id, formData);

      if (res.ok) {
        setCategory(res.payload);
        setPreview(res.payload.banner.url);
        setFile(null);
        setIsEditing(false); // 👈 vuelve a modo lectura
        alert("Categoría actualizada correctamente!");
      } else {
        alert(res.message || "Error al actualizar");
      }
    } catch (error) {
      alert("Error inesperado");
    }

    setUploading(false);
  };

  /* ================= RENDER ================= */
  return (
    <div className="category-wrapper">
      <div className="category-container edit-mode">

        {/* HEADER */}
        <div className="category-header">

          {/* ✏️ solo en modo lectura */}
          {!isEditing && (
            <button
              className="header-icon right"
              onClick={() => setIsEditing(true)}
            >
              ✏️
            </button>
          )}

          <h2>Detalle de categoría</h2>

          {/* ✖ y 💾 solo en modo edición */}
          {isEditing && (
            <>
              <button
                className="header-icon left"
                onClick={() => {
                  setIsEditing(false);
                  setFile(null);
                  setPreview(category.banner.url);
                }}
                disabled={uploading}
              >
                ✖
              </button>

              <button
                className="header-icon right"
                onClick={handleSave}
                disabled={uploading}
              >
                💾
              </button>
            </>
          )}

        </div>

        {/* IMAGE */}
        <div className="category-image-wrapper">
          <div
            className={`category-image ${isEditing ? "editable" : ""}`}
            onClick={() =>
              isEditing && !uploading && fileRef.current.click()
            }
          >
            <input
              type="file"
              hidden
              ref={fileRef}
              accept="image/*"
              disabled={!isEditing || uploading}
              onChange={(e) => handleImageChange(e.target.files[0])}
            />

            {preview ? (
              <img src={preview} alt="banner" />
            ) : (
              <span className="placeholder">📷</span>
            )}
          </div>
        </div>

        {/* FORM */}
        <form className="category-form">
          <div className="form-group">
            <label>Nombre:</label>
            <input
              disabled={!isEditing || uploading}
              value={category.name}
              onChange={(e) =>
                setCategory({ ...category, name: e.target.value })
              }
            />
          </div>

          <div className="form-group">
            <label>Descripción:</label>
            <textarea
              disabled={!isEditing || uploading}
              value={category.description}
              onChange={(e) =>
                setCategory({ ...category, description: e.target.value })
              }
            />
          </div>
        </form>

      </div>
    </div>
  );
}
