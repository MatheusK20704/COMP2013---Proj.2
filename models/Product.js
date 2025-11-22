import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    productName: { type: String, required: true },
    brand: { type: String, required: true },
    image: { type: String },
    price: { type: String , required: true }, 
    quantity: { type: String, required: true }, 
  },
  { timestamps: true }
);

const Product = mongoose.model("Product", productSchema, "products");


export default Product;