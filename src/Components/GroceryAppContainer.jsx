/* eslint-disable react-hooks/set-state-in-effect */
//this line above is needed so that it won't botehr me about missing dependencies in useEffect.
//found out by messing with the console, by right clicking on the error.

import { useState, useEffect, useCallback } from "react";
/* Had to use a callback, or else the data wouldn't display. ref: https://developer.mozilla.org/en-US/docs/Glossary/Callback_function */ 
import axios from "axios";
import ProductsContainer from "./ProductContainer";
import CartContainer from "./CartContainer";
import ProductsForm from "./ProductForm";
import NavBar from "./Navbar";

const originalUrl = "http://localhost:3000/products";

// ----- Utility functions -----
function parseQuantity(qtyStr = "") {
  const qtyNumber = parseInt(qtyStr);
  return isNaN(qtyNumber) ? 0 : qtyNumber;
}

function parsePrice(priceStr = "") {
  const priceNumber = parseFloat(priceStr.replace("$", "").replace(",", ""));
  return isNaN(priceNumber) ? 0 : priceNumber;
}

function updateQuantity(quantity, change, min = 0, max) {
  const newQuantity = quantity + change;
  if (newQuantity < min) return min;
  if (max !== undefined && newQuantity > max) {
    alert("Cannot exceed available stock quantity.");
    return max;
  }
  return newQuantity;
}

export default function GroceriesAppContainer() {
  // ----- State -----
  const [productList, setProductList] = useState([]);
  const [cart, setCart] = useState([]);
  const [isCartVisible, setIsCartVisible] = useState(false);
  const [isProductsFormVisible, setIsProductsFormVisible] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [formData, setFormData] = useState({
    productName: "",
    brand: "",
    price: "",
    image: "",
    quantity: "",
    unit: "", // used only in the form; not stored in the backend
    _id: "",
  });

  // ----- Data fetching -----
  const handleProducts = useCallback(async () => {
    try {
      const response = await axios.get(originalUrl);
      const products = response.data;

      const updatedProducts = products.map((product) => {
        const quantity = product.quantity || "10 g";
        const inventoryQuantity = parseQuantity(quantity);
        const priceNumber = parsePrice(product.price);

        return {
          ...product,
          quantity,
          inventoryQuantity,
          priceNumber,
          salesQuantity: 0,
        };
      });

      setProductList(updatedProducts);
    } catch (error) {
      console.error("Error fetching products:", error);
    }
  }, []);

  useEffect(() => {
    handleProducts();
  }, [handleProducts]);

  // ----- Cart & inventory handlers -----
  const handleRemoveFromCart = (productId, isBulkRemove = false) => {
    const cartItemToRemove = cart.find((item) => item.id === productId);
    if (!cartItemToRemove) return true;

    if (!isBulkRemove) {
      const confirmRemoval = window.confirm("Confirm delete?");
      if (!confirmRemoval) {
        return false;
      }
    }

    const updatedCart = cart.filter((item) => item.id !== productId);
    setCart(updatedCart);

    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product._id === cartItemToRemove.id
          ? {
              ...product,
              inventoryQuantity:
                product.inventoryQuantity + cartItemToRemove.quantity,
            }
          : product
      )
    );

    return true;
  };

  const handleEmptyCart = () => {
    const confirmEmpty = window.confirm("Confirm empty cart?");
    if (!confirmEmpty) return;

    const updatedProducts = [...productList];

    productList.forEach((product) => {
      const cartItem = cart.find((item) => item.id === product._id);
      if (cartItem) {
        updatedProducts[productList.indexOf(product)] = {
          ...product,
          inventoryQuantity: product.inventoryQuantity + cartItem.quantity,
        };
      }
    });

    setProductList(updatedProducts);
    setCart([]);
  };

  const handleAddToCart = (productId) => {
    const productToAdd = productList.find(
      (product) => product._id === productId
    );
    if (!productToAdd) return;

    if (productToAdd.salesQuantity < 1) {
      alert("Quantity must be at least 1 to add to cart.");
      return;
    }

    setCart((prevCart) => {
      const existingCartItem = prevCart.find((item) => item.id === productId);

      if (existingCartItem) {
        return prevCart.map((item) =>
          item.id === productId
            ? {
                ...item,
                quantity: item.quantity + productToAdd.salesQuantity,
              }
            : item
        );
      }

      return [
        ...prevCart,
        {
          id: productToAdd._id,
          productName: productToAdd.productName,
          brand: productToAdd.brand,
          quantity: productToAdd.salesQuantity,
          image: productToAdd.image,
          price: productToAdd.priceNumber,
          maxQuantity: productToAdd.inventoryQuantity,
        },
      ];
    });

    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId ? { ...product, salesQuantity: 0 } : product
      )
    );

    setProductList((prevProducts) =>
      prevProducts.map((product) =>
        product._id === productId
          ? {
              ...product,
              inventoryQuantity:
                product.inventoryQuantity - productToAdd.salesQuantity,
            }
          : product
      )
    );
  };

  const handleQuantityChange = (productId, value, collection) => {
    if (collection === "products") {
      const updatedProducts = productList.map((product) => {
        if (product._id === productId) {
          return {
            ...product,
            salesQuantity: updateQuantity(
              product.salesQuantity,
              value,
              0,
              product.inventoryQuantity
            ),
          };
        }
        return product;
      });
      setProductList(updatedProducts);
    } else if (collection === "cart") {
      const updatedCart = cart.map((item) => {
        if (item.id === productId) {
          return {
            ...item,
            quantity: updateQuantity(item.quantity, value, 0, item.maxQuantity),
          };
        }
        return item;
      });
      setCart(updatedCart);

      const quantityZeroItem = updatedCart.find(
        (item) => item.id === productId
      );

      if (quantityZeroItem && quantityZeroItem.quantity === 0) {
        const confirmRemoval = handleRemoveFromCart(productId);
        if (!confirmRemoval) {
          setCart((prevCart) =>
            prevCart.map((item) =>
              item.id === productId ? { ...item, quantity: 1 } : item
            )
          );
        }
        return;
      }

      setProductList((prevProducts) =>
        prevProducts.map((product) =>
          product._id === productId
            ? {
                ...product,
                inventoryQuantity:
                  product.inventoryQuantity >= 0
                    ? product.inventoryQuantity - value
                    : product.inventoryQuantity,
              }
            : product
        )
      );
    }
  };

  const handleCheckout = () => {
    setCart([]);
    alert("Purhcased!!");
  };

  // ----- Form handlers -----
  const handleOnChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };

  const resetForm = () => {
    setFormData({
      productName: "",
      brand: "",
      price: "",
      image: "",
      quantity: "",
      unit: "",
      _id: "",
    });
    setIsEditMode(false);
  };

  const handleAddNewProduct = async () => {
    if (
      !formData.productName ||
      !formData.brand ||
      !formData.price ||
      !formData.quantity
    ) {
      alert("Fill all required fields.");
      return;
    }

    if (formData.quantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    if (formData.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    const fullQuantity = `${formData.quantity} ${formData.unit}`;
    const priceString = `$${parseFloat(formData.price).toFixed(2)}`;

    const productData = {
      ...formData,
      quantity: fullQuantity,
      price: priceString,
    };

    try {
      const response = await axios.post(originalUrl, productData);
      if (response.status === 201) {
        alert("Product added successfully!");
        setIsProductsFormVisible(false);
        handleProducts();
      } else {
        alert("Failed to add product. Please try again.");
      }
    } catch (error) {
      console.error("Error adding product:", error);
      alert("An error occurred while adding the product.");
    }
  };

  const handleUpdateProduct = async () => {
    if (
      !formData.productName ||
      !formData.brand ||
      !formData.price ||
      !formData.quantity
    ) {
      alert("Please fill all required fields.");
      return;
    }

    if (formData.quantity < 0) {
      alert("Quantity cannot be negative.");
      return;
    }

    if (formData.price < 0) {
      alert("Price cannot be negative.");
      return;
    }

    const fullQuantity = `${formData.quantity} ${formData.unit}`;
    const priceString = `$${parseFloat(formData.price).toFixed(2)}`;

    const productData = {
      ...formData,
      quantity: fullQuantity,
      price: priceString,
    };

    try {
      const response = await axios.patch(
        `${originalUrl}/${formData._id}`,
        productData
      );
      if (response.status === 200) {
        alert(`Product ${formData.productName} updated successfully!`);
        setIsProductsFormVisible(false);
        handleProducts();
      } else {
        alert(
          `Failed to update product ${formData.productName}. Please try again.`
        );
      }
    } catch (error) {
      console.error("Error updating product:", error);
      alert(
        `An error occurred while updating the product ${formData.productName}.`
      );
    }
  };

   const handleDeleteProduct = async (productId) => {
    const confirmDelete = window.confirm("Confirm delete product?");
    if (!confirmDelete) return;

    try {
      const response = await axios.delete(`${originalUrl}/${productId}`);
      if (response.status === 200) {
        alert("Product deleted successfully!");
        handleProducts();
      } else {
        alert("Failed to delete product. Please try again.");
      }
    } catch (error) {
      console.error("Error deleting product:", error);
      alert("An error occurred while deleting the product.");
    }
  };

  const handleOnSubmit = (e) => {
    e.preventDefault();
    if (isEditMode) {
      handleUpdateProduct();
    } else {
      handleAddNewProduct();
    }
    resetForm();
  };

  const handleOnEdit = (product) => {
    setIsEditMode(true);
    setIsProductsFormVisible(true);

    setFormData({
      productName: product.productName,
      brand: product.brand,
      price: parsePrice(product.price).toString(),
      image: product.image,
      quantity: product.inventoryQuantity,
      unit:
        productList.find((p) => p._id === product.id)?.quantity.split(" ")[1] ||
        "",
      _id: product.id,
    });
  };

  // ----- UI handlers -----
  const handleToggleCartAppearance = () => {
    setIsCartVisible((prev) => !prev);

    const cartContainer = document.getElementById("cart");
    if (cartContainer) {
      if (isCartVisible) {
        cartContainer.style.display = "block";
        cartContainer.scrollIntoView({ behavior: "smooth" });
      } else {
        cartContainer.style.display = "none";
      }
    }
  };

  return (
    <>
      <NavBar
        cartCount={cart.length}
        handleToggleCartAppearance={handleToggleCartAppearance}
      />

      <button
        onClick={() => setIsProductsFormVisible((prev) => !prev)}
        style={{
          marginTop: "10px",
          backgroundColor: isProductsFormVisible ? "#ff6666" : "#4CAF50",
          padding: "10px 20px",
        }}
      >
        {isProductsFormVisible
          ? isEditMode
            ? "Close Edit Product Form"
            : "Close Add Product Form"
          : "Add New Product"}
      </button>

      <div className="GroceriesApp-Container">
        {isProductsFormVisible && <div className="overlay"></div>}

        {isProductsFormVisible && (
          <ProductsForm
            {...formData}
            isEditMode={isEditMode}
            handleCancel={() => {
              setIsProductsFormVisible(false);
              resetForm();
            }}
            handleOnChange={handleOnChange}
            handleOnSubmit={handleOnSubmit}
          />
        )}

        <ProductsContainer
          products={productList}
          handleQuantityChange={handleQuantityChange}
          handleAddToCart={handleAddToCart}
          isCartVisible={isCartVisible}
          handleOnEdit={handleOnEdit}
          handleDeleteProduct={handleDeleteProduct}
        />

        <CartContainer
          cart={cart}
          handleQuantityChange={handleQuantityChange}
          handleRemoveFromCart={handleRemoveFromCart}
          handleEmptyCart={handleEmptyCart}
          handleCheckout={handleCheckout}
        />
      </div>
    </>
  );
}
