package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockPriceResponse;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponse;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponseWrapper;
import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;
import org.springframework.web.util.UriComponentsBuilder;

import java.math.BigDecimal;
import java.util.Arrays;
import java.util.List;

@Service
public class StockPriceService {

    @Value("${stock.api.key}")
    private String apiKey;

    @Value("${stock.api.baseUrl}")
    private String apiBaseUrl;


    private  RestTemplate restTemplate;

    public StockPriceService(RestTemplate restTemplate) {
        this.restTemplate = restTemplate;
    }

    public BigDecimal fetchCurrentStockPrice(String ticker) {
        String url = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                .path("/quote")
                .queryParam("symbol", ticker)
                .queryParam("token", apiKey)
                .toUriString();
        System.out.println("Printing url "+url);
        StockPriceResponse response = restTemplate.getForObject(url, StockPriceResponse.class);
        System.out.println("Printing Stock price Object "+response.toString());

        if (response != null) {
            return response.getCurrentPrice();
        }

        throw new RuntimeException("Failed to fetch stock price for ticker: " + ticker);
    }
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
            throw new RuntimeException("Failed to fetch search results for query: " + query);
        }
    }


    public StockDetailResponse getStockDetails(String ticker) {
        String profileUrl = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                .path("/stock/profile2")
                .queryParam("symbol", ticker)
                .queryParam("token", apiKey)
                .toUriString();
        StockDetailResponse stockDetails = restTemplate.getForObject(profileUrl, StockDetailResponse.class);

        // Fetch real-time price data
        String priceUrl = UriComponentsBuilder.fromHttpUrl(apiBaseUrl)
                .path("/quote")
                .queryParam("symbol", ticker)
                .queryParam("token", apiKey)
                .toUriString();
//        ResponseEntity<StockPriceResponse> responseEntity = restTemplate.getForEntity(priceUrl, StockPriceResponse.class);

        StockPriceResponse priceResponse = restTemplate.getForObject(priceUrl, StockPriceResponse.class);
        if (stockDetails != null && priceResponse != null) {
            stockDetails.setCurrentPrice(priceResponse.getCurrentPrice());
            stockDetails.setPriceChange(priceResponse.getChange());
            stockDetails.setPercentageChange(priceResponse.getPercentageChange());
            return stockDetails;
        } else {
            throw new RuntimeException("Failed to fetch details for ticker: " + ticker);
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