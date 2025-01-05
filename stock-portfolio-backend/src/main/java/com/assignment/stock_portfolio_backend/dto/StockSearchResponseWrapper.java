package com.assignment.stock_portfolio_backend.dto;

import com.fasterxml.jackson.annotation.JsonProperty;
import java.util.List;

public class StockSearchResponseWrapper {
    @JsonProperty("result")
    private List<StockSearchResponse> result;

    public List<StockSearchResponse> getResult() {
        return result;
    }

    public void setResult(List<StockSearchResponse> result) {
        this.result = result;
    }
}

