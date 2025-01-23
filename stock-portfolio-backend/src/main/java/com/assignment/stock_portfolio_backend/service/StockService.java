package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockRequestDto;
import com.assignment.stock_portfolio_backend.model.Stock;
import jakarta.validation.Valid;

import java.util.List;

public interface StockService {
    Stock addStock(StockRequestDto stock, String extractedToken);

    Stock updateStock(Long id, @Valid StockRequestDto stock);

    void deleteStock(String ticker, int quantity, String extractedToken);

    List<StockRequestDto> getAllStocks(String token);

    List<PortfolioDetailResponse> calculatePortfolioDetails();

    PortfolioDetailResponse getStockInfo(String ticker);
}
