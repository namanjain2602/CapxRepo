package com.assignment.stock_portfolio_backend.controller;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.dto.RecommendedStock;
import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockSearchResponse;
import com.assignment.stock_portfolio_backend.model.Stock;
import com.assignment.stock_portfolio_backend.service.RecommendationService;
import com.assignment.stock_portfolio_backend.service.StockPriceService;
import com.assignment.stock_portfolio_backend.service.StockService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.math.BigDecimal;
import java.util.List;

@RestController
@RequestMapping("/api/stocks")
public class StockController {

    @Autowired
    private StockService stockService;

    @Autowired
    private StockPriceService stockPriceService;

    @Autowired
    private RecommendationService recommendationService;

    @PostMapping
    public ResponseEntity<Stock> addStock(@RequestBody @Valid Stock stock) {
        return ResponseEntity.status(201).body(stockService.addStock(stock));
    }

    @PutMapping("/{id}")
    public ResponseEntity<Stock> updateStock(@PathVariable Long id, @RequestBody @Valid Stock stock) {
        return ResponseEntity.ok(stockService.updateStock(id, stock));
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteStock(@PathVariable Long id) {
        stockService.deleteStock(id);
        return ResponseEntity.noContent().build();
    }

    @GetMapping
    public ResponseEntity<List<Stock>> getAllStocks() {
        return ResponseEntity.ok(stockService.getAllStocks());
    }

    @GetMapping("/portfolio-details")
    public ResponseEntity<List<PortfolioDetailResponse>> getPortfolioDetails() {
        List<PortfolioDetailResponse> portfolioDetails = stockService.calculatePortfolioDetails();
        return ResponseEntity.ok(portfolioDetails);
    }

    @GetMapping("/recommendations")
    public ResponseEntity<List<RecommendedStock>> getRecommendations() {
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



}
