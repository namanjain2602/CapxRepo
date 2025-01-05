package com.assignment.stock_portfolio_backend.dto;

import com.fasterxml.jackson.annotation.JsonCreator;
import com.fasterxml.jackson.annotation.JsonProperty;

import java.math.BigDecimal;

public class StockPriceResponse {

    @JsonProperty("c")
    private double c;
    @JsonProperty("d")
    private double d;
    @JsonProperty("dp")
    private double dp;


    @JsonCreator
    public StockPriceResponse(
            @JsonProperty("c") double currentPrice,
            @JsonProperty("d") double change,
            @JsonProperty("dp") double percentageChange) {
        this.c = currentPrice;
        this.d = change;
        this.dp = percentageChange;
    }

    public BigDecimal getCurrentPrice() {
        return BigDecimal.valueOf(c);
    }

    public BigDecimal getChange() {
        return BigDecimal.valueOf(d);
    }

    public BigDecimal getPercentageChange() {
        return BigDecimal.valueOf(dp);
    }

    @Override
    public String toString() {
        return "StockPriceResponse{" +
                "currentPrice=" + c +
                ", change=" + d +
                ", percentageChange=" + dp +
                '}';
    }
    }

