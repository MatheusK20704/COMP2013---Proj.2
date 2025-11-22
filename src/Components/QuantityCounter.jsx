export default function QuantityCounter({
  quantity,
  stringQuantity,
  handleQuantityChange,
  id,
  collection,
}) {
  return (
    <div className="ProductQuantityDiv">
      <button onClick={() => 
        handleQuantityChange(id, -1, collection)}>
        -
      </button>
      <span>
        {quantity} 
        {stringQuantity && stringQuantity.split(" ")[1]}
       
      </span>
      <button onClick={() => 
        handleQuantityChange(id, 1, collection)}>+</button>
    </div>
  );
}