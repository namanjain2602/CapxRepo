package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponse;
import com.assignment.stock_portfolio_backend.model.Stock;

import java.math.BigDecimal;
import java.util.List;

public interface StockPriceService {
    BigDecimal fetchCurrentStockPrice(String ticker);

    List<StockSearchResponse> searchStocks(String query);

    StockDetailResponse getStockDetails(String ticker);

    List<String> getStockRecommendations();
}
