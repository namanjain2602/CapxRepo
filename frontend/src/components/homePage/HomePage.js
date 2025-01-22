import React, { useState, useEffect } from "react";
import { fetchTopProfitableStocks } from "../../services/StockService";
import StockCard from "../stockComponents/StockCard";
import StockDetail from "../stockComponents/StockDetail";
import Loader from "../../sharedComponents/Loader";
import Error from "../../sharedComponents/Error";
import Navbar from "../../sharedComponents/Navbar";
import Footer from "../../sharedComponents/Footer";

const HomePage = () => {
  const [stocks, setStocks] = useState([]);
  const [selectedStock, setSelectedStock] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);



  useEffect(() => {
    const loadStocks = async () => {
      try {
        setLoading(true);
        setError(null);

        const data = await fetchTopProfitableStocks();

        setStocks(data);
      } catch (err) {
        setError("Failed to fetch stock data.");
      } finally {
        setLoading(false);
      }
    };

    loadStocks();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />

      <main className="flex-grow pt-20 px-6">
        <h1 className="text-3xl font-bold text-center my-6 text-gray-700">
          Explore Top Profitable Stocks
        </h1>
        {loading && <Loader message="Please wait, loading stocks..." />}
        {error && <Error message={error} />}
        {!loading && !error && (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {stocks.map((stock, index) => (
              <StockCard
                key={index}
                stock={{
                  ...stock,
                  image: stock.image || `https://ui-avatars.com/api/?name=${encodeURIComponent(
                    stock.name || "Stock"
                  )}&background=random`, // Dynamic fallback image
                }}
                onClick={setSelectedStock}
              />
            ))}
          </div>
        )}
        {selectedStock && (
          <StockDetail stock={selectedStock} onClose={() => setSelectedStock(null)} />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default HomePage;
