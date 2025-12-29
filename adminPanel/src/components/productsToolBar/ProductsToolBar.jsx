import "./ProductsToolBar.css";
import { useState, useEffect } from "react";
import { getAllCategoriesReq } from "../../apiCalls/categoriesCalls";
import { Link } from "react-router-dom";

export default function ProductsToolbar({ filters, onChange }) {
  const [categorias, setCategorias] = useState([]);
  const [loadingCategories, setLoadingCategories] = useState(true);

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getAllCategoriesReq();

      if (result.ok) {
        setCategorias(result.payload);
      } else {
        console.error(result.status, result.message);
        setCategorias([]);
      }

      setLoadingCategories(false);
    };

    fetchCategories();
  }, []);

  const noCategories = !loadingCategories && categorias.length === 0;

  return (
    <div className="products-toolbar">
      {/* SEARCH */}
      <input
        placeholder="Buscar..."
        value={filters.searchTerm}
        onChange={(e) =>
          onChange({ ...filters, searchTerm: e.target.value })
        }
      />

      {/* CATEGORY */}
      <select
        value={filters.category}
        disabled={noCategories || loadingCategories}
        onChange={(e) =>
          onChange({ ...filters, category: e.target.value })
        }
      >
        {loadingCategories && <option>Cargando categorías...</option>}

        {noCategories && <option>No existen categorías</option>}

        {!loadingCategories && categorias.length > 0 && (
          <>
            <option value="all">Todas las categorías</option>

            {/* ✅ FIX: SE ENVÍA cat.name (IGUAL AL FRONTEND QUE FUNCIONA) */}
            {categorias.map((cat) => (
              <option key={cat._id} value={cat.name}>
                {cat.name}
              </option>
            ))}
          </>
        )}
      </select>

      {/* FILTERS */}
      <div className="toolbar-filters">
        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.new_insert}
            onChange={(e) =>
              onChange({
                ...filters,
                new_insert: e.target.checked,
              })
            }
          />
          <span>Nuevo ingreso</span>
        </label>

        <label className="filter-checkbox">
          <input
            type="checkbox"
            checked={filters.offer}
            onChange={(e) =>
              onChange({
                ...filters,
                offer: e.target.checked,
              })
            }
          />
          <span>En oferta</span>
        </label>
      </div>
      <Link to="/products/create">
        <button className="add-product">+ Nuevo Producto</button>
      </Link>
    </div>
  );
}
