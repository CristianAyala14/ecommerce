import "./Categories.css";
import React, { useEffect, useState } from "react";
import {
  getAllCategoriesReq,
  createCategoryReq,
} from "../../apiCalls/categoriesCalls";

export default function Categories() {
  const [categories, setCategories] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);
  const [creating, setCreating] = useState(false);
  const [buttonText, setButtonText] = useState("Crear categoría");

  const [form, setForm] = useState({
    name: "",
    description: "",
    banner: null,
    bannerPreview: null,
  });

  /* ================= LOAD ================= */
  const loadCategories = async () => {
    try {
      setLoadingCategories(true);
      const res = await getAllCategoriesReq();
      if (res.ok) setCategories(res.payload);
    } catch (error) {
      console.error(error);
    } finally {
      setLoadingCategories(false);
    }
  };

  useEffect(() => {
    loadCategories();
  }, []);

  /* ================= INPUTS ================= */
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBannerChange = (e) => {
    const file = e.target.files[0];
    if (!file) return;

    setForm((prev) => ({
      ...prev,
      banner: file,
      bannerPreview: URL.createObjectURL(file),
    }));
  };

  /* ================= CREATE ================= */
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!form.name || !form.description || !form.banner) {
      alert("Debe completar nombre, descripción y banner.");
      return;
    }

    setCreating(true);
    setButtonText("Creando...");

    try {
      const formData = new FormData();
      formData.append("name", form.name);
      formData.append("description", form.description);
      formData.append("file", form.banner); // 👈 clave

      const res = await createCategoryReq(formData);

      if (res.ok) {
        setForm({
          name: "",
          description: "",
          banner: null,
          bannerPreview: null,
        });

        loadCategories();

        setButtonText("Categoría creada");

        setTimeout(() => {
          setButtonText("Crear categoría");
        }, 2000);
      } else {
        setButtonText("Error al crear categoría");
      }
    } catch (error) {
      console.error(error);
      setButtonText("Error inesperado");
    } finally {
      setCreating(false);
    }
  };

  /* ================= RENDER ================= */
  return (
    <div className="categories-page">
      <div className="categories-page-header">
        <h1>Categorías</h1>
      </div>

      <form className="categories-form" onSubmit={handleSubmit}>
        <input
          type="text"
          name="name"
          placeholder="Nombre de la categoría"
          value={form.name}
          onChange={handleChange}
          required
        />

        <input
          type="text"
          name="description"
          placeholder="Descripción"
          value={form.description}
          onChange={handleChange}
          required
        />

        <label className="categories-upload">
          <input
            type="file"
            accept="image/*"
            onChange={handleBannerChange}
            hidden
            disabled={creating}
          />
          {form.bannerPreview ? "Cambiar banner" : "Subir banner"}
        </label>

        {form.bannerPreview && (
          <div className="categories-banner-preview">
            <img src={form.bannerPreview} alt="Banner preview" />
          </div>
        )}

        <button
          type="submit"
          className="categories-submit"
          disabled={creating}
        >
          {buttonText}
        </button>
      </form>
    </div>
  );
}
