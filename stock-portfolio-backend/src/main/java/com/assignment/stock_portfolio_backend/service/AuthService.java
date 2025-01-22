package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.JWTAuthResponse;
import com.assignment.stock_portfolio_backend.dto.LoginDto;
import com.assignment.stock_portfolio_backend.dto.RegisterDto;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.validation.Valid;

public interface AuthService {
    JWTAuthResponse login(@Valid LoginDto loginDto);

    String register(@Valid RegisterDto registerDto, String role);

    boolean validateUserToken(HttpServletRequest request, String role);

    RegisterDto getLoggedUser(HttpServletRequest request);
}
