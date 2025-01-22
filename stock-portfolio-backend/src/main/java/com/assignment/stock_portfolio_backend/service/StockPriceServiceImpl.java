package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockPriceResponse;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponse;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponseWrapper;
import com.assignment.stock_portfolio_backend.exception.StockException;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;
import org.springframework.web.util.UriUtils;

import java.io.UnsupportedEncodingException;
import java.math.BigDecimal;
import java.net.URLEncoder;
import java.nio.charset.StandardCharsets;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;

@Service
public class StockPriceServiceImpl implements StockPriceService {

    @Value("${stock.api.key}")
    private String apiKey;

    @Value("${stock.api.baseUrl}")
    private String apiBaseUrl;


    private RestTemplate restTemplate;

    private List<StockDetailResponse> cachedRecommendations = null;


    public StockPriceServiceImpl(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    @Override
    public BigDecimal fetchCurrentStockPrice(String ticker) {
        try {
            // URL encoding to handle special characters in ticker symbols
            String encodedTicker = UriUtils.encode(ticker, StandardCharsets.UTF_8);

            // Build the URL with the encoded ticker
            String url = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                    .path("/quote")
                    .queryParam("symbol", encodedTicker)
                    .queryParam("token", apiKey)
                    .toUriString();

            System.out.println("Request URL: " + url);

            // Fetching the stock price response
            StockPriceResponse response = restTemplate.getForObject(url, StockPriceResponse.class);

            System.out.println("Stock Price Response: " + response);

            // Check and return the current price
            if (response != null && response.getCurrentPrice() != null) {
                return response.getCurrentPrice();
            } else {
                throw new StockException("Stock price not found for ticker: " + ticker);
            }
        } catch (Exception e) {
            // Logging and handling errors
            System.err.println("Error fetching stock price for ticker: " + ticker + ". Error: " + e.getMessage());
            throw new StockException("Failed to fetch stock price for ticker: " + ticker);
        }
    }

    @Override
    public List<StockSearchResponse> searchStocks(String query) {
        String url = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                .path("/search")
                .queryParam("q", query)
                .queryParam("token", apiKey)
                .toUriString();

        StockSearchResponseWrapper response = restTemplate.getForObject(url, StockSearchResponseWrapper.class);

        if (response != null && response.getResult() != null) {
            return response.getResult();
        } else {
            throw new StockException("Failed to fetch search results for query: " + query);
        }
    }


    @Override
    public StockDetailResponse getStockDetails(String ticker) {

            String encodedTicker = ticker.replace(".","%2E");
            String profileUrl = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                    .path("/stock/profile2")
                    .queryParam("symbol", encodedTicker)
                    .queryParam("token", apiKey)
                    .toUriString();
            //System.out.println("Profile Url "+profileUrl);
            StockDetailResponse stockDetails = restTemplate.getForObject(profileUrl, StockDetailResponse.class);

            // Fetch real-time price data
            String priceUrl = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                    .path("/quote")
                    .queryParam("symbol", encodedTicker)
                    .queryParam("token", apiKey)
                    .toUriString();

            //System.out.println("Price Url "+priceUrl);

            StockPriceResponse priceResponse = restTemplate.getForObject(priceUrl, StockPriceResponse.class);
            if (stockDetails != null && priceResponse != null) {
                stockDetails.setCurrentPrice(priceResponse.getCurrentPrice());
                stockDetails.setPriceChange(priceResponse.getChange());
                stockDetails.setPercentageChange(priceResponse.getPercentageChange());
                stockDetails.setTicker(ticker);
                //check(stockDetails);
                return stockDetails;
            } else {
                throw new StockException("Failed to fetch details for ticker: " + ticker);
            }

    }

    @Override
    public List<String> getStockRecommendations() {
        String apiUrl = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                .path("/stock/symbol")
                .queryParam("exchange", "US")
                .queryParam("token", apiKey)
                .toUriString();

        RestTemplate restTemplate = new RestTemplate();
        try {
            // Fetch the response as an array of Maps
            Map<String, Object>[] response = restTemplate.getForObject(apiUrl, Map[].class);

            // Extract ticker symbols from the response
            List<String> tickerSymbols = new ArrayList<>();
            if (response != null) {
                for (Map<String, Object> stock : response) {
                    if (stock.containsKey("symbol")) {
                        String symbol = (String) stock.get("symbol");
                        // Exclude symbols containing "."
                        if (!symbol.contains(".")) {

                            tickerSymbols.add(symbol);
                        }
                    }
                }
            }

            // Limit the result to the first 9 ticker symbols
            //System.out.println(tickerSymbols);
            List<String >lst=tickerSymbols.subList(0, Math.min(tickerSymbols.size(), 25));
            //System.out.println(lst);
            return lst;
        } catch (Exception e) {
            e.printStackTrace();
            return null;
        }
    }


//    public class StockPriceResponse {
//
//        @JsonProperty("c")
//        private double c;
//        @JsonProperty("d")
//        private double d;
//        @JsonProperty("dp")
//        private double dp;
//
//
//        @JsonCreator
//        public StockPriceResponse(
//                @JsonProperty("c") double currentPrice,
//                @JsonProperty("d") double change,
//                @JsonProperty("dp") double percentageChange) {
//            this.c = currentPrice;
//            this.d = change;
//            this.dp = percentageChange;
//        }
//
//        public BigDecimal getCurrentPrice() {
//            return BigDecimal.valueOf(c);
//        }
//
//        public BigDecimal getChange() {
//            return BigDecimal.valueOf(d);
//        }
//
//        public BigDecimal getPercentageChange() {
//            return BigDecimal.valueOf(dp);
//        }
//
//        @Override
//        public String toString() {
//            return "StockPriceResponse{" +
//                    "currentPrice=" + c +
//                    ", change=" + d +
//                    ", percentageChange=" + dp +
//                    '}';
//        }
//    }


    }
