//import { ShoppingCart } from "lucide-react";

export default function Navbar({ cartCount, CartAppearance }) {
  return (
    <nav className="NavBar">
      <div className="NavUser">Hello Matheus</div>
      <div className="NavTitle">Groceries App! </div>
      <div className="nav-cart" 
      onClick={CartAppearance}>
        <span className="navSymbol">{cartCount}</span>
      </div>
    </nav>
  );
}