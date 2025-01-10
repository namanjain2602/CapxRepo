package com.assignment.stock_portfolio_backend.model;

import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.math.BigDecimal;

@Entity
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@NotBlank(message = "Stock name cannot be null")
    private String stockName;


    //@NotBlank(message = "Ticker cannot be blank")
    @Column(unique = true)
    private String ticker;

  //  @NotNull(message = "Buy price cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Buy price must be at least 0.0")
    private BigDecimal buyPrice;

    //@NotBlank(message = "Quantity cannot be null")
   // @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
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

    public BigDecimal getBuyPrice() {
        return buyPrice;
    }

    public void setBuyPrice(BigDecimal buyPrice) {
        this.buyPrice = buyPrice;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }
}

