import dotenv from "dotenv";
import mongoose from "mongoose";
import Category from "./models/Category.js";
import Product from "./models/Product.js";
import User from "./models/User.js";
import { connectDB } from "./config/db.js";

dotenv.config();
await connectDB();

await Category.deleteMany();
await Product.deleteMany();
await User.deleteMany();

const admin = await User.create({
  name: "Ariana Admin",
  email: "admin@kbeat.com",
  password: "123456",
  role: "admin"
});

const cliente = await User.create({
  name: "Cliente Demo",
  email: "cliente@kbeat.com",
  password: "123456",
  role: "cliente"
});

const album = await Category.create({
  name: "Álbum",
  description: "CDs oficiales de grupos y solistas de K-pop."
});

const miniAlbum = await Category.create({
  name: "Mini álbum",
  description: "Versiones compactas con varias canciones y photocards."
});

await Product.create([
  {
    name: "BTS - Proof",
    group: "BTS",
    description: "Álbum antológico de BTS con photobook y photocards.",
    price: 45000,
    stock: 10,
    image: "https://placehold.co/500x500/f9a8d4/111827?text=BTS+Proof",
    version: "Standard",
    category: album._id,
    rating: 4.9
  },
  {
    name: "BLACKPINK - Born Pink",
    group: "BLACKPINK",
    description: "Álbum oficial Born Pink con contenido coleccionable.",
    price: 52000,
    stock: 8,
    image: "https://placehold.co/500x500/f472b6/111827?text=Born+Pink",
    version: "Pink Version",
    category: album._id,
    rating: 4.8
  },
  {
    name: "Stray Kids - 5-Star",
    group: "Stray Kids",
    description: "Álbum de Stray Kids edición coleccionista.",
    price: 48000,
    stock: 7,
    image: "https://placehold.co/500x500/93c5fd/111827?text=5-Star",
    version: "Limited",
    category: miniAlbum._id,
    rating: 4.7
  }
]);

console.log("Datos de prueba cargados.");
console.log("Admin: admin@kbeat.com / 123456");
console.log("Cliente: cliente@kbeat.com / 123456");

await mongoose.connection.close();
