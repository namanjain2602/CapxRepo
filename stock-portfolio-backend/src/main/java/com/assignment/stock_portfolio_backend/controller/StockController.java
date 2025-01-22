package com.assignment.stock_portfolio_backend.controller;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockRequestDto;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponse;
import com.assignment.stock_portfolio_backend.model.Stock;
import com.assignment.stock_portfolio_backend.service.*;
import com.fasterxml.jackson.core.JsonProcessingException;
import com.fasterxml.jackson.databind.ObjectMapper;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stocks")
@CrossOrigin(origins = "http://localhost:3000")
public class StockController {

    @Autowired
    private StockService stockService;

    @Autowired
    private StockPriceService stockPriceService;

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<Stock> addStock(
            @RequestHeader("Authorization") String token,
            @RequestBody StockRequestDto stock) {
        String extractedToken = token.startsWith("Bearer ") ? token.substring(7) : token;
        return ResponseEntity.status(201).body(stockService.addStock(stock, extractedToken));
    }


    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id, @RequestBody @Valid StockRequestDto stock) {
        return ResponseEntity.ok(stockService.updateStock(id, stock));
    }

    @DeleteMapping("/{ticker}/{quantity}")
    public ResponseEntity<Void> deleteStock(@RequestHeader("Authorization") String token, @PathVariable String ticker, @PathVariable int quantity) {
        String extractedToken = token.startsWith("Bearer ") ? token.substring(7) : token;

        stockService.deleteStock(ticker,quantity,extractedToken);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks(@RequestHeader("Authorization") String token) {
        return ResponseEntity.ok(stockService.getAllStocks(token));
    }

    @GetMapping("/portfolio-details")
    public ResponseEntity<List<PortfolioDetailResponse>> getPortfolioDetails() {
        List<PortfolioDetailResponse> portfolioDetails = stockService.calculatePortfolioDetails();
        return ResponseEntity.ok(portfolioDetails);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<StockDetailResponse>> getRecommendations() {
        return ResponseEntity.ok(recommendationService.getRecommendedStocks());
    }

    @GetMapping("/search")
    public ResponseEntity<List<StockSearchResponse>> searchStocks(@RequestParam String query) {
        List<StockSearchResponse> searchResults = stockPriceService.searchStocks(query);
        return ResponseEntity.ok(searchResults);
    }

    @GetMapping("/details/{ticker}")
    public ResponseEntity<StockDetailResponse> getStockDetails(@PathVariable String ticker) {
        StockDetailResponse stockDetails = stockPriceService.getStockDetails(ticker);
        return ResponseEntity.ok(stockDetails);
    }

    @GetMapping("/info")
    public ResponseEntity<PortfolioDetailResponse> getStockInfo(@RequestParam String ticker) throws JsonProcessingException {
             PortfolioDetailResponse stockDetails = stockService.getStockInfo(ticker);
        System.out.println("Serialized JSON: " + new ObjectMapper().writeValueAsString(stockDetails));
             return ResponseEntity.ok(stockDetails);
    }
}



