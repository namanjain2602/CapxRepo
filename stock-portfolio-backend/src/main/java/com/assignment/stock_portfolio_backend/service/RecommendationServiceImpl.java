package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;


@Service
public class RecommendationServiceImpl  implements RecommendationService{
    @Autowired
    private StockPriceServiceImpl stockPriceService;

    private List<StockDetailResponse> cachedRecommendations = null;


    @Override
    public List<StockDetailResponse> getRecommendedStocks() {
        if (cachedRecommendations != null) {
            //System.out.println(cachedRecommendations);
            return cachedRecommendations;
        }

        List<StockDetailResponse> hardcodedData = getHardcodedStockData();

        new Thread(() -> {
            List<StockDetailResponse> fetchedData = fetchRecommendedStocks();
            cachedRecommendations = fetchedData;
        }).start();

        return hardcodedData;
    }

    @Override
    public List<StockDetailResponse> fetchRecommendedStocks() {
        List<String> popularTickers = stockPriceService.getStockRecommendations();
        List<StockDetailResponse> recommendations = new ArrayList<>();

        for (String ticker : popularTickers) {
            StockDetailResponse stockDetails = stockPriceService.getStockDetails(ticker);
            if(isValidStock(stockDetails))
                recommendations.add(stockDetails);
        }
        return recommendations;
    }

    @Override
    public List<StockDetailResponse> getHardcodedStockData() {
        return List.of(
                new StockDetailResponse("NVDA", "NVIDIA Corp", 137.71, 4.14, 3.0995, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/NVDA.png"),
                new StockDetailResponse("AMD", "Advanced Micro Devices Inc", 121.46, 3.02, 2.5498, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMD.png"),
                new StockDetailResponse("AVGO", "Broadcom Inc", 237.44, 8.03, 3.5003, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AVGO.png"),
                new StockDetailResponse("META", "Meta Platforms Inc", 612.77, 1.47, 0.2405, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/FB.png"),
                new StockDetailResponse("AAPL", "Apple Inc", 229.98, 1.72, 0.7535, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AAPL.png"),
                new StockDetailResponse("MSFT", "Microsoft Corp", 429.03, 4.45, 1.0481, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/MSFT.png"),
                new StockDetailResponse("GOOGL", "Alphabet Inc", 197.55, 3.14, 1.6151, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/GOOG.png"),
                new StockDetailResponse("AMZN", "Amazon.com Inc", 225.94, 5.28, 2.3928, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/AMZN.png"),
                new StockDetailResponse("TSLA", "Tesla Inc", 426.5, 12.68, 3.0641, "https://static2.finnhub.io/file/publicdatany/finnhubimage/stock_logo/TSLA.png")
        );
    }

    private static boolean isValidStock(StockDetailResponse stock) {
        return stock.getTicker() != null && !stock.getTicker().isEmpty()
                && stock.getName() != null && !stock.getName().isEmpty()
                && stock.getExchange() != null && !stock.getExchange().isEmpty()
                && stock.getIpoDate() != null && !stock.getIpoDate().isEmpty()
                && stock.getMarketCapitalization() != null && stock.getMarketCapitalization() > 0
                && stock.getWebsite() != null && !stock.getWebsite().isEmpty()
                && stock.getLogo() != null && !stock.getLogo().isEmpty()
                && stock.getIndustry() != null && !stock.getIndustry().isEmpty()
                && stock.getCurrentPrice() != null && stock.getCurrentPrice().compareTo(BigDecimal.ZERO) > 0
                && stock.getPriceChange() != null
                && stock.getPercentageChange() != null;
    }

}
