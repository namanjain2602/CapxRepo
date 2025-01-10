package com.assignment.stock_portfolio_backend.dto;

import java.util.List;

public class TrendingStockResponse {
    private List<String> tickers;

    // Getter and Setter
    public List<String> getTickers() {
        return tickers;
    }

    public void setTickers(List<String> tickers) {
        this.tickers = tickers;
    }
}
