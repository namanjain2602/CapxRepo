package com.assignment.stock_portfolio_backend.repository;
import com.assignment.stock_portfolio_backend.model.Stock;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

@Repository
public interface StockRepository extends JpaRepository<Stock, Long> {
}
