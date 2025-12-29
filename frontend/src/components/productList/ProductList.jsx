import { useState, useEffect } from "react";
import "./ProductList.css";
import { MdArrowBack, MdArrowForward } from "react-icons/md";
import Item from "../item/Item";
import { useLocation, useNavigate } from "react-router-dom";
import { getAllProductsReq } from "../../apiCalls/productsCalls";
import { getAllCategoriesReq } from "../../apiCalls/categoriesCalls";
import banner_all_categories from "../../assets/banner_all_categories.jpeg";

export default function ProductList({ category }) {
  const location = useLocation();
  const navigate = useNavigate();

  const [loading, setLoading] = useState(false);
  const [products, setProducts] = useState([]);
  const [totalDocs, setTotalDocs] = useState(0);
  const [totalPages, setTotalPages] = useState(1);
  const [page, setPage] = useState(1);
  const limit = 10;
  const [categorias, setCategorias] = useState([]);

  const [filters, setFilters] = useState({
    sort: "createdAt",
    order: "desc",
    category: "",
  });

  /* =========================
     Reset page when category changes
  ========================== */
  useEffect(() => {
    setPage(1);
  }, [category]);

  /* =========================
     Fetch categories
  ========================== */
  useEffect(() => {
    const fetchCategories = async () => {
      const res = await getAllCategoriesReq();

      if (res.ok) {
        setCategorias(res.payload);
      } else {
        console.error(res.status, res.message);
      }
    };

    fetchCategories();
  }, []);

  /* =========================
     Sync URL + Fetch products
  ========================== */
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);

    const sortFromUrl = urlParams.get("sort") || "createdAt";
    const orderFromUrl = urlParams.get("order") || "desc";
    const categoryFromUrl = urlParams.get("category") || "";

    setFilters({
      sort: sortFromUrl,
      order: orderFromUrl,
      category: categoryFromUrl,
    });

    const fetchProducts = async () => {
      setLoading(true);

      urlParams.set("page", page);
      urlParams.set("limit", limit);

      const res = await getAllProductsReq(urlParams.toString());

      if (!res.ok) {
        console.error(res.status, res.message);
        setProducts([]);
        setTotalDocs(0);
        setTotalPages(1);
        setLoading(false);
        return;
      }

      setProducts(res.payload.products);
      setTotalDocs(res.payload.totalDocs);
      setTotalPages(res.payload.totalPages);

      setLoading(false);
    };

    fetchProducts();
  }, [location.search, page]);

  /* =========================
     Handlers
  ========================== */
  const handleFilterChange = (type, value) => {
    const params = new URLSearchParams(location.search);

    if (type === "sort") {
      const [sort, order] = value.split("_");
      params.set("sort", sort);
      params.set("order", order);
    }

    if (type === "category") {
      params.set("category", value);
    }

    setPage(1);
    navigate(`?${params.toString()}`);
  };

  const handlePrevPage = () => setPage((prev) => Math.max(prev - 1, 1));
  const handleNextPage = () => setPage((prev) => prev + 1);

  const currentCategory = categorias.find(
    (cat) => cat.name === filters.category
  );

  const bannerUrl = currentCategory?.banner || banner_all_categories;

  /* =========================
     Render
  ========================== */
  return (
    <section className="productList-container">
      {/* Banner */}
      <div
        className="title-banner-category"
        style={{ backgroundImage: `url(${bannerUrl})` }}
      >
        <p className="productList-title">
          {filters.category || "Nuestros productos"}
        </p>
      </div>

      {/* Info + filters */}
      <div className="productList-info-filters">
        {products.length} de {totalDocs} productos

        <div className="productList-filter">
          {/* Categories */}
          <div>
            <label>Categoría:</label>
            <select
              className="productList-filter-select"
              value={filters.category}
              onChange={(e) =>
                handleFilterChange("category", e.target.value)
              }
            >
              <option value="">Todo</option>
              {categorias.map((cat) => (
                <option key={cat._id} value={cat.name}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          {/* Sort */}
          <div>
            <label>Filtrar por:</label>
            <select
              className="productList-filter-select"
              value={`${filters.sort}_${filters.order}`}
              onChange={(e) =>
                handleFilterChange("sort", e.target.value)
              }
            >
              <option value="regularPrice_desc">Precio mas alto</option>
              <option value="regularPrice_asc">Precio mas bajo</option>
              <option value="createdAt_desc">Recientes</option>
              <option value="createdAt_asc">Antiguos</option>
            </select>
          </div>
        </div>
      </div>

      {/* Pagination */}
      <div className="productList-pagination">
        <button
          className="productLists-pagination-buttons"
          onClick={handlePrevPage}
          disabled={page === 1}
        >
          <MdArrowBack size="0.5em" />
        </button>

        <span>
          Page {page} of {totalPages}
        </span>

        <button
          className="productLists-pagination-buttons"
          onClick={handleNextPage}
          disabled={page === totalPages}
        >
          <MdArrowForward size="0.5em" />
        </button>
      </div>

      {/* Products */}
      <div className="productList-products-container">
        {loading ? (
          <p className="loading-productList">Cargando...</p>
        ) : products.length > 0 ? (
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
          <p className="no-products">No hay productos.</p>
        )}
      </div>
    </section>
  );
}
