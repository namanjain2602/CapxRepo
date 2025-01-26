package com.assignment.stock_portfolio_backend.model;

import com.fasterxml.jackson.annotation.JsonBackReference;
import jakarta.persistence.*;
import jakarta.validation.constraints.DecimalMin;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.math.BigDecimal;

@Entity
@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class Stock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    //@NotBlank(message = "Stock name cannot be null")
    private String stockName;

    //@NotBlank(message = "Ticker cannot be blank")
    private String ticker;

  //  @NotNull(message = "Buy price cannot be null")
    @DecimalMin(value = "0.0", inclusive = true, message = "Buy price must be at least 0.0")
    private BigDecimal buyPrice;

    //@NotBlank(message = "Quantity cannot be null")
   // @Min(value = 1, message = "Quantity must be at least 1")
    private Integer quantity = 1;

    private String image;
    @ManyToOne
    @JoinColumn(name = "user_id", nullable = false)
    @JsonBackReference
    private User user;

}

