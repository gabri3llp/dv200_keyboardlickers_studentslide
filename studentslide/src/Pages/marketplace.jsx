import { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";
import ProductCard from "../components/ProductCard";

const mockProducts = [
  { id: 1, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "electronics" },
  { id: 2, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "apparel" },
  { id: 3, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "electronics" },
  { id: 4, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "equipment" },
  { id: 5, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "dorm life" },
  { id: 6, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "clothing" },
  { id: 7, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "electronics" },
  { id: 8, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "apparel" },
  { id: 9, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "equipment" },
  { id: 10, title: "CARD 1", description: "Lorem ipsum dolor sit amet, consectetur adipiscing elit.", image: "https://via.placeholder.com/200", category: "clothing" },
];

const filters = ["ALL ITEMS", "ELECTRONICS", "APPAREL", "EQUIPMENT", "DORM LIFE", "CLOTHING"];

export default function Marketplace() {
  const [activeFilter, setActiveFilter] = useState("ALL ITEMS");

  const filteredProducts = mockProducts.filter(product =>
    activeFilter === "ALL ITEMS" || product.category === activeFilter.toLowerCase()
  );

  return (
    <div style={{ background: "#111", minHeight: "100vh", color: "white", fontFamily: "sans-serif" }}>
      <Navbar />

      <div style={{ padding: "20px" }}>

        {/* Filter buttons */}
        <div style={{ display: "flex", gap: "10px", marginBottom: "20px", flexWrap: "wrap" }}>
          {filters.map(f => (
            <button key={f} onClick={() => setActiveFilter(f)} style={{
              padding: "6px 16px",
              borderRadius: "20px",
              border: "none",
              cursor: "pointer",
              fontWeight: "bold",
              fontSize: "12px",
              background: activeFilter === f ? "#a78bfa" : "#222",
              color: activeFilter === f ? "white" : "#aaa",
            }}>
              {f}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div style={{ display: "grid", gridTemplateColumns: "repeat(5, 1fr)", gap: "16px" }}>
          {filteredProducts.map(product => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>

        {/* Showing count */}
        <p style={{ textAlign: "center", color: "#888", marginTop: "30px", fontSize: "14px" }}>
          showing {filteredProducts.length} out of 500 listed products
        </p>

      </div>

      <Footer />
    </div>
  );
}