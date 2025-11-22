import QuantityCounter from "./QuantityCounter";

export default function ProductCard({
  productName,
  brand,
  image,
  salesQuantity,
  quantity,
  price,
  handleQuantityChange,
  _id: id,
  handleAddToCart,
  inventoryQuantity,
  handleOnEdit,
  handleDeleteProduct,
  
}) {
  return (
    <div className="product-card">
      <h3>{productName}</h3>
      <img src={image} alt={productName} />
      <p>{brand}</p>
      <QuantityCounter
        stringQuantity={quantity}
        quantity={salesQuantity}
        handleQuantityChange={handleQuantityChange}
        id={id}
        collection="products"
      />
      <p>{price}</p>
      {/* <p>Total: ${(salesQuantity * priceNumber).toFixed(2)}</p> */}
      <button onClick={() => handleAddToCart(id)}>Add to Cart</button>

      <p style={{ color: inventoryQuantity < 1 ? "red" : "yellow" }}>
        Available Stock : {inventoryQuantity}
      </p>

      <div className="cart-buttons">
        <button
          className="button-md"
          style={{
            backgroundColor: "#8A2BE2",
            color: "white",
          }}
          onClick={() =>
            handleOnEdit({
              id,
              productName,
              brand,
              image,
              price,
              inventoryQuantity,
            })
          }
        >
          Update
        </button>
        <button
          className="button-md"
          style={{ backgroundColor: "red", color: "white" }}
          onClick={() => handleDeleteProduct(id)}
        >
          Delete
        </button>
      </div>
    </div>
  );
}