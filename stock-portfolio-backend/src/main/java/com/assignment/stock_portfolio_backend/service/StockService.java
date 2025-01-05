package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.model.Stock;
import com.assignment.stock_portfolio_backend.repository.StockRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.util.ArrayList;
import java.util.List;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockPriceService stockPriceService;

    public Stock addStock(Stock stock) {
        return stockRepository.save(stock);
    }

    public Stock updateStock(Long id, Stock updatedStock) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found with id: " + id));
        stock.setStockName(updatedStock.getStockName());
        stock.setTicker(updatedStock.getTicker());
        stock.setBuyPrice(updatedStock.getBuyPrice());
        return stockRepository.save(stock);
    }

    public void deleteStock(Long id) {
        stockRepository.deleteById(id);
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }
    public List<PortfolioDetailResponse> calculatePortfolioDetails() {
        List<Stock> stocks = stockRepository.findAll();
        List<PortfolioDetailResponse> portfolioDetails = new ArrayList<>();

        for (Stock stock : stocks) {
            BigDecimal currentPrice = stockPriceService.fetchCurrentStockPrice(stock.getTicker());
            PortfolioDetailResponse response = new PortfolioDetailResponse(
                    stock.getStockName(),
                    stock.getTicker(),
                    stock.getBuyPrice(),
                    currentPrice,
                    BigDecimal.valueOf(stock.getQuantity())
            );
            portfolioDetails.add(response);
        }

        return portfolioDetails;
    }
}