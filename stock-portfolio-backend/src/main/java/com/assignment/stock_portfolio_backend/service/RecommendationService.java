package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;

import java.util.List;

public interface RecommendationService {
    List<StockDetailResponse> getRecommendedStocks();

    List<StockDetailResponse> fetchRecommendedStocks();

    List<StockDetailResponse> getHardcodedStockData();
}
