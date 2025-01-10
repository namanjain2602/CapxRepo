package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.RecommendedStock;
import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
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

    public List<StockDetailResponse> getRecommendedStocks() {
        List<String> popularTickers = Arrays.asList(
                "NVDA", "AMD", "AVGO", "META",
                "AAPL", "MSFT", "GOOG", "AMZN",
                "TSLA"
        );

        List<StockDetailResponse> recommendations = new ArrayList<>();

        for (String ticker : popularTickers) {
            StockDetailResponse stockDetails = stockPriceService.getStockDetails(ticker);
            recommendations.add(stockDetails);
        }
        return recommendations;
    }

}
