package com.assignment.stock_portfolio_backend.dto;

import java.math.BigDecimal;

public class RecommendedStock {
    private String ticker;
    private BigDecimal currentPrice;

    public RecommendedStock(String ticker, BigDecimal currentPrice) {
        this.ticker = ticker;
        this.currentPrice = currentPrice;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }
}
