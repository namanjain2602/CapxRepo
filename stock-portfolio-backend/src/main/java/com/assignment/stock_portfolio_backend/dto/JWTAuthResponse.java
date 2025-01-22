package com.assignment.stock_portfolio_backend.dto;


import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@AllArgsConstructor
@NoArgsConstructor
public class JWTAuthResponse {
    private String name;
    private String role;
    private String accessToken;
    private String tokenType = "Bearer";
}
