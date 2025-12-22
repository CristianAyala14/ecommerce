import { useEffect, useState } from "react";
import "./Header.css";
import { Link, NavLink, useNavigate } from "react-router-dom";
import logo from "../../assets/logo.jpg";
import {
  MdMenu,
  MdShop2,
  MdContacts,
  MdInfo,
  MdClose,
  MdShoppingCart,
} from "react-icons/md";
import { getAllCategoriesReq } from "../../apiCalls/categoriesCalls";
import { useOrderContext } from "../../contexts/orderContext";


export default function Header() {
  const { orderCount} = useOrderContext();
  const [open, setOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [categorias, setCategorias] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchCategories = async () => {
      const result = await getAllCategoriesReq();
      if (result.ok) {
        setCategorias(result.payload);
      } else {
        console.error(res.status, res.message);
        setCategorias([])
      }
    };
    fetchCategories();
  }, []);

 
  // 🔴 helper para cerrar menú mobile
  const closeMenu = () => {
    setOpen(false);
    setDropdownOpen(false);
  };

  const handleCategoryClick = (categoria) => {
    navigate(`/products?category=${encodeURIComponent(categoria)}`);
    closeMenu();
  };

  return (
    <header className="header">
      <Link to={"/"}>
        <img className="logo" src={logo} alt=""  />
      </Link>

      {!open && (
        <button className="open-menu" onClick={() => setOpen(true)}>
          <MdMenu size="0.8em" />
        </button>
      )}

      <div className={`nav ${open ? "visible" : ""}`}>
        <ul className="nav-list">
          <li
            className="nav-options-wrapper"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <NavLink
              className="nav-options"
              to={"/products"}
              onClick={closeMenu}
            >
              <MdShop2 size="0.4em" />
              Productos
            </NavLink>

            {dropdownOpen && (
              <div className="header-dropdown">
                {categorias.map((cat) => (
                  <div
                    key={cat._id}
                    className="dropdown-item"
                    onClick={() => handleCategoryClick(cat.name)}
                  >
                    {cat.name}
                  </div>
                ))}
              </div>
            )}
          </li>

          <li>
            <NavLink
              className="nav-options"
              to={"/about"}
              onClick={closeMenu}
            >
              <MdInfo size="0.4em" />
              Sobre nosotros
            </NavLink>
          </li>

          <li>
            <NavLink
              className="nav-options"
              to={"/contact"}
              onClick={closeMenu}
            >
              <MdContacts size="0.4em" />
              Contactanos
            </NavLink>
          </li>
        </ul>

        <button className="close-menu" onClick={closeMenu}>
          <MdClose size="0.6em" />
        </button>
      </div>
      
      <NavLink className="header-order-icon" to={"/order"}>
        <MdShoppingCart size="0.8em" /><div className="counter-order">{orderCount}</div>
      </NavLink>
    </header>
  );
}
