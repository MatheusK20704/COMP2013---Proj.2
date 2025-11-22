import ProductCard from "./ProductCard";

export default function ProductsContainer({
  products,
  handleQuantityChange,
  handleAddToCart,
  cartShowing,
  handleOnEdit,
  handleDeleteProduct,
}) {
  return (
    <div
      className={
        cartShowing
          ? "product-container-full"
          : "product-container-seventy-five"
      }
    >
      {products.map((product) => {
        return (
          <ProductCard
            key={product._id}
            {...product}
            handleQuantityChange={handleQuantityChange}
            handleAddToCart={handleAddToCart}
            handleOnEdit={handleOnEdit}
            handleDeleteProduct={handleDeleteProduct}
          />
        );
      })}
    </div>
  );
}