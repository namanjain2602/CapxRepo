package com.assignment.stock_portfolio_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.math.BigDecimal;

public class StockDetailResponse {

    @JsonProperty("ticker")
    private String ticker;

    @JsonProperty("name")
    private String name;

    @JsonProperty("exchange")
    private String exchange;

    @JsonProperty("ipo")
    private String ipoDate;

    @JsonProperty("marketCapitalization")
    private Double marketCapitalization;

    @JsonProperty("weburl")
    private String website;

    @JsonProperty("logo")
    private String logo;

    @JsonProperty("finnhubIndustry")
    private String industry;

    private BigDecimal currentPrice;
    private BigDecimal priceChange;
    private BigDecimal percentageChange;

    public StockDetailResponse() {
        this.ticker = "No Data Found";
        this.name = "No Data Found";
        this.exchange = "No Data Found";
        this.ipoDate = "No Date Found";
        this.marketCapitalization = 0.0;
        this.website = "No Data";
        this.logo = "No Image Found";
        this.industry = "No Industry Found";
        this.currentPrice = new BigDecimal(0);
        this.priceChange = new BigDecimal(0);
        this.percentageChange = new BigDecimal(0);
    }

    public StockDetailResponse(String ticker, String name, double currentPrice, double priceChange, double percentageChange, String logo) {
        this.ticker = ticker;
        this.name = name;
        this.currentPrice = BigDecimal.valueOf(currentPrice);
        this.priceChange = BigDecimal.valueOf(priceChange);
        this.percentageChange = BigDecimal.valueOf(percentageChange);
        this.logo = logo;
        this.exchange = "No Data Found";
        this.ipoDate = "No Date Found";
        this.marketCapitalization = 0.0;
        this.website = "No Data";
        this.industry = "No Industry Found";
    }


    public String getTicker() {
        return ticker;
    }

    public void setTicker(String ticker) {
        this.ticker = ticker;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getExchange() {
        return exchange;
    }

    public void setExchange(String exchange) {
        this.exchange = exchange;
    }

    public String getIpoDate() {
        return ipoDate;
    }

    public void setIpoDate(String ipoDate) {
        this.ipoDate = ipoDate;
    }

    public Double getMarketCapitalization() {
        return marketCapitalization;
    }

    public void setMarketCapitalization(Double marketCapitalization) {
        this.marketCapitalization = marketCapitalization;
    }

    public String getWebsite() {
        return website;
    }

    public void setWebsite(String website) {
        this.website = website;
    }

    public String getLogo() {
        return logo;
    }

    public void setLogo(String logo) {
        this.logo = logo;
    }

    public String getIndustry() {
        return industry;
    }

    public void setIndustry(String industry) {
        this.industry = industry;
    }

    public BigDecimal getCurrentPrice() {
        return currentPrice;
    }

    public void setCurrentPrice(BigDecimal currentPrice) {
        this.currentPrice = currentPrice;
    }

    public BigDecimal getPriceChange() {
        return priceChange;
    }

    public void setPriceChange(BigDecimal priceChange) {
        this.priceChange = priceChange;
    }

    public BigDecimal getPercentageChange() {
        return percentageChange;
    }

    public void setPercentageChange(BigDecimal percentageChange) {
        this.percentageChange = percentageChange;
    }
}

