package com.assignment.stock_portfolio_backend.exception;

import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.time.LocalDateTime;

@AllArgsConstructor
@NoArgsConstructor
@Getter
@Setter
public class ErrorResponse {
    private int status;
    private String message;
    private LocalDateTime timestamp;

    public ErrorResponse(int value, String message, String currentTimestamp) {
        this.status=value;
        this.message=message;
        this.timestamp= LocalDateTime.parse(currentTimestamp);
    }
}
