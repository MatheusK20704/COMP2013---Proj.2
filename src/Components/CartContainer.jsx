import CartCard from "./CartCard";

export default function CartContainer({
  cart,
  handleQuantityChange,
  handleRemoveFromCart,
  handleEmptyCart,
  handleCheckout,
}) {
  const totalPrice = cart.reduce(
    (total, item) => total + item.quantity * item.price,
    0
  );
  return (
    <div className="CartContainer" id="cart">
      {cart.length === 0 ? (
        <p className="">Your cart is empty</p>
      ) : (
        <>
          <h2 className="">Cart Items: {cart.length}</h2>
          <div>
            {cart.map((item) => {
              return (
                <CartCard
                  key={item.id}
                  item={item}
                  handleQuantityChange={handleQuantityChange}
                  handleRemoveFromCart={handleRemoveFromCart}
                />
              );
            })}
          </div>
          <div className="cart-buttons">
            <button
              style={{ backgroundColor: "red" }}
              onClick={handleEmptyCart}
            >
              Empty Cart
            </button>
            <button
              style={{ backgroundColor: "green" }}
              onClick={handleCheckout}
            >
              Checkout: ${totalPrice.toFixed(2)}
            </button>
          </div>
        </>
      )}
    </div>
  );
}