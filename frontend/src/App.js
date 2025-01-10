import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import './App.css';
import HomePage from './components/homePage/HomePage';
import StockDetailPage from './components/StockDetailPage';
import UserDashboard from './components/userComponents/UserDashboard';
import { ToastContainer } from 'react-toastify';
import MyStocks from './components/userComponents/MyStocks';
import BuyAndSellStock from './components/userComponents/BuyAndSellStock';

function App() {
  return (
    <><ToastContainer position="top-right" autoClose={3000} />
    <Router>
      <Routes>
        <Route path="/" element={<HomePage />} />
        <Route path="/stock/:ticker" element={<StockDetailPage />} />
        <Route path="/user-dashboard" element={<UserDashboard />} />
        <Route path='/user-dashboard/my-stocks' element={<MyStocks/>} />
        <Route path="/stocks/:id" element={<BuyAndSellStock />} />
      </Routes>
    </Router>
    </>
  );
}

export default App;
