import React from 'react';
import "./Products.css"
import { useLocation } from 'react-router-dom';
import ProductList from '../../components/productList/ProductList';


export default function Products() {
  const location = useLocation();
  const queryParams = new URLSearchParams(location.search);
  const category = queryParams.get('category') || null;

  return (
    <div className='products-container'>      
      <ProductList category={category}/>
    </div>
  );
}
