package com.assignment.stock_portfolio_backend.dto;

import java.math.BigDecimal;

public class PortfolioDetailResponse {

    private String stockName;
    private String ticker;
    private BigDecimal purchasePrice;
    private BigDecimal currentPrice;
    private BigDecimal quantity;
    private BigDecimal totalPurchasedValue;
    private BigDecimal totalCurrentValue;
    private BigDecimal profitLossAmount;
    private BigDecimal profitLossPercentage;
    private BigDecimal priceChangeAmount;
    private BigDecimal priceChangePercentage;
    private String image;

    // Getters and Setter
    public PortfolioDetailResponse(String stockName, String ticker, BigDecimal purchasePrice, BigDecimal currentPrice,
                                   BigDecimal quantity, String image) {
        this.stockName = stockName;
        this.ticker = ticker;
        this.purchasePrice = purchasePrice;
        this.currentPrice = currentPrice;
        this.quantity = quantity;
        this.totalPurchasedValue = purchasePrice.multiply(quantity);
        this.totalCurrentValue = currentPrice.multiply(quantity);
        this.profitLossAmount = totalCurrentValue.subtract(totalPurchasedValue);
        this.profitLossPercentage = totalPurchasedValue.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
                profitLossAmount.divide(totalPurchasedValue, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100));
        this.priceChangeAmount = currentPrice.subtract(purchasePrice);
        this.priceChangePercentage = purchasePrice.compareTo(BigDecimal.ZERO) == 0 ? BigDecimal.ZERO :
                priceChangeAmount.divide(purchasePrice, 4, BigDecimal.ROUND_HALF_UP).multiply(BigDecimal.valueOf(100));
        this.image=image;
        System.out.println("Constructor called. Image: " + image);

    }


    public PortfolioDetailResponse() {
    }

    public String getStockName() {
        return stockName;
    }

    public void setStockName(String stockName) {
        this.stockName = stockName;
    }

    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public BigDecimal getPurchasePrice() {
        return purchasePrice;
    }

    public void setPurchasePrice(BigDecimal purchasePrice) {
        this.purchasePrice = purchasePrice;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getQuantity() {
        return quantity;
    }

    public void setQuantity(BigDecimal quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getTotalPurchasedValue() {
        return totalPurchasedValue;
    }

    public void setTotalPurchasedValue(BigDecimal totalPurchasedValue) {
        this.totalPurchasedValue = totalPurchasedValue;
    }

    public BigDecimal getTotalCurrentValue() {
        return totalCurrentValue;
    }

    public void setTotalCurrentValue(BigDecimal totalCurrentValue) {
        this.totalCurrentValue = totalCurrentValue;
    }

    public BigDecimal getProfitLossAmount() {
        return profitLossAmount;
    }

    public void setProfitLossAmount(BigDecimal profitLossAmount) {
        this.profitLossAmount = profitLossAmount;
    }

    public BigDecimal getProfitLossPercentage() {
        return profitLossPercentage;
    }

    public void setProfitLossPercentage(BigDecimal profitLossPercentage) {
        this.profitLossPercentage = profitLossPercentage;
    }

    public BigDecimal getPriceChangeAmount() {
        return priceChangeAmount;
    }

    public void setPriceChangeAmount(BigDecimal priceChangeAmount) {
        this.priceChangeAmount = priceChangeAmount;
    }

    public BigDecimal getPriceChangePercentage() {
        return priceChangePercentage;
    }

    public void setPriceChangePercentage(BigDecimal priceChangePercentage) {
        this.priceChangePercentage = priceChangePercentage;
    }
    public String getImage() {
        return image;
    }


    @Override
    public String toString() {
        return "PortfolioDetailResponse{" +
                "stockName='" + stockName + '\'' +
                ", ticker='" + ticker + '\'' +
                ", purchasePrice=" + purchasePrice +
                ", currentPrice=" + currentPrice +
                ", quantity=" + quantity +
                ", totalPurchasedValue=" + totalPurchasedValue +
                ", totalCurrentValue=" + totalCurrentValue +
                ", profitLossAmount=" + profitLossAmount +
                ", profitLossPercentage=" + profitLossPercentage +
                ", priceChangeAmount=" + priceChangeAmount +
                ", priceChangePercentage=" + priceChangePercentage +
                ", Image=" + image +
                '}';
    }
}