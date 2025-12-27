import ProductViewer from "../../components/productViewer/ProductViewer";
import ProductsToolBar from "../../components/productsToolbar/ProductsToolBar";
import { useState } from "react";
import "./Products.css";

export default function Products() {
  const [filters, setFilters] = useState({
    searchTerm: "",
    category: "all",
    new_insert: false,
    offer: false,
  });
  
  return (
    <div className="products-page">
      <div className="page-header">
        <h1>Productos</h1>
      </div>

      <ProductsToolBar
        filters={filters}
        onChange={setFilters}
      />

      <ProductViewer filters={filters} />
    </div>
  );
}
