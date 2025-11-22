import "./App.css";
import products from "./data/productData.js";
import GroceryAppContainer from "./Components/GroceryAppContainer.jsx";
import NavBar from "./Components/Navbar.jsx";

function App() {
  return <GroceryAppContainer products={products} />;
}

export default App;