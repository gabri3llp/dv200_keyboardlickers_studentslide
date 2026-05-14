import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Navbar from "../Component/navbar";
import Card from "react-bootstrap/Card";
import Button from "react-bootstrap/Button";
import "bootstrap/dist/css/bootstrap.min.css";
import "./marketplace.css";

// ── Sample product data ── replace with your API/DB data
// const ALL_PRODUCTS = [
//   { id: 1,  title: "AirPods Max",         category: "Electronics", price: "R 450", description: "Premium over-ear headphones in excellent condition.", img: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=400&h=220&fit=crop" },
//   { id: 2,  title: "Calculus Textbook",   category: "Equipment",   price: "R 120", description: "Calculus 3rd edition, lightly used, no highlights.", img: "https://images.unsplash.com/photo-1497633762265-9d179a990aa6?w=400&h=220&fit=crop" },
//   { id: 3,  title: "Denim Jacket",        category: "Apparel",     price: "R 200", description: "Oversized denim jacket, size M. Barely worn.", img: "https://images.unsplash.com/photo-1543076447-215ad9ba6923?w=400&h=220&fit=crop" },
//   { id: 4,  title: "Study Desk Lamp",     category: "Dorm Life",   price: "R 85",  description: "USB-powered LED desk lamp with dimmer.", img: "https://images.unsplash.com/photo-1513506003901-1e6a35eb5d85?w=400&h=220&fit=crop" },
//   { id: 5,  title: "HP Laptop Charger",   category: "Electronics", price: "R 180", description: "65W HP charger, compatible with most HP models.", img: "https://images.unsplash.com/photo-1588872657578-7efd1f1555ed?w=400&h=220&fit=crop" },
//   { id: 6,  title: "Running Shoes",       category: "Clothing",    price: "R 350", description: "Nike Air Max size 10, great for campus runs.", img: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=400&h=220&fit=crop" },
//   { id: 7,  title: "Mini Fridge",         category: "Dorm Life",   price: "R 600", description: "Compact 40L fridge, perfect for dorm rooms.", img: "https://images.unsplash.com/photo-1584568694244-14fbdf83bd30?w=400&h=220&fit=crop" },
//   { id: 8,  title: "Scientific Calc",     category: "Equipment",   price: "R 95",  description: "Casio FX-991, works perfectly, minor scratches.", img: "https://images.unsplash.com/photo-1564473185935-58f7a1a0d8e4?w=400&h=220&fit=crop" },
//   { id: 9,  title: "Wireless Mouse",      category: "Electronics", price: "R 130", description: "Logitech M185, brand new in box.", img: "https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=220&fit=crop" },
//   { id: 10, title: "Hoodie – UCT",        category: "Clothing",    price: "R 220", description: "Official UCT hoodie, size L, washed once.", img: "https://images.unsplash.com/photo-1556821840-3a63f15732ce?w=400&h=220&fit=crop" },
// ];

const CATEGORIES = ["All Items", "Electronics", "Apparel", "Equipment", "Dorm Life", "Clothing"];
 
export default function Marketplace() {
  const navigate = useNavigate();
  const [activeCategory, setActiveCategory] = useState("All Items");
  const [search, setSearch]                 = useState("");
  const [favorites, setFavorites]           = useState(new Set());
  const [bursting, setBursting]             = useState(null); 
}

// Filter options pill
const filtered =ALL_PRODUCTS.filter((p) => {
    const matchCat  = activeCategory === "All Items" || p.category === activeCategory;
    const matchSearch = p.title.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
      });

      
<Navbar></Navbar>