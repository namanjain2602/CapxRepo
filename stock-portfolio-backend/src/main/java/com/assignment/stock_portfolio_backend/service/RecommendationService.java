package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.RecommendedStock;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.Arrays;
import java.util.List;



@Service
public class RecommendationService {
    @Autowired
    private StockPriceService stockPriceService;

    public List<RecommendedStock> getRecommendedStocks() {
        List<String> popularTickers = Arrays.asList("NVDA", "AMD", "AVGO","META"); // Example
        List<RecommendedStock> recommendations = new ArrayList<>();

        for (String ticker : popularTickers) {
            BigDecimal currentPrice = stockPriceService.fetchCurrentStockPrice(ticker);
            recommendations.add(new RecommendedStock(ticker, currentPrice));
        }
        return recommendations;
    }

}
