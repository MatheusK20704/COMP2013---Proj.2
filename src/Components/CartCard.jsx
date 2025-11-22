import QuantityCounter from "./QuantityCounter";

export default function CartCard({
  item,
  handleQuantityChange,
  handleRemoveFromCart,
}) {
  return (
    <div className="CartCard">
      <div className="CartCardInfo">
        <img src={item.image} alt={item.productName} />
        <p>{item.productName}</p>
        <p> ${item.price}</p>
        <QuantityCounter
          quantity={item.quantity}
          handleQuantityChange={handleQuantityChange}
          id={item.id}
          collection="cart"
        />
      </div>
      <div className="">
        <h4>Total: ${(item.price * item.quantity).toFixed(2)}</h4>
        <button
          onClick={() => handleRemoveFromCart(item.id)}
          style={{ backgroundColor: "red" }}
        >
          Remove
        </button>
      </div>
    </div>
  );
}