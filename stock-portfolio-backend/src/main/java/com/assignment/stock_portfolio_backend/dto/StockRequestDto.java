package com.assignment.stock_portfolio_backend.dto;

import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

import java.math.BigDecimal;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class StockRequestDto {

    @NotBlank(message = "Stock name cannot be null or blank")
    private String stockName;

    @NotBlank(message = "Ticker cannot be null or blank")
    private String ticker;

    @NotNull(message = "Buy price cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Buy price must be at least 0.0")
    private BigDecimal buyPrice;

    @NotNull(message = "Quantity cannot be null")
    @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity;

    private String image;
}
