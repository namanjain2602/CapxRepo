package com.assignment.stock_portfolio_backend.repository;
import com.assignment.stock_portfolio_backend.model.Stock;
import com.assignment.stock_portfolio_backend.model.User;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
    Optional<Stock> findStockByTicker(String ticker);
    Optional<Stock> findByTickerAndUser(String ticker, User user);
}
