package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockDetailResponse;
import com.assignment.stock_portfolio_backend.model.Stock;
import com.assignment.stock_portfolio_backend.repository.StockRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;

@Service
public class StockService {

    @Autowired
    private StockRepository stockRepository;

    @Autowired
    private StockPriceService stockPriceService;

    public Stock addStock(Stock stock) {
        Optional<Stock> stk = stockRepository.findStockByTicker(stock.getTicker());

         if(stk.isEmpty()){
             return stockRepository.save(stock);
         }

         Stock st=stk.get();
        int existingQuantity = st.getQuantity();
        BigDecimal existingPrice = st.getBuyPrice();
        int newQuantity = stock.getQuantity();
        BigDecimal newPrice = stock.getBuyPrice();

        // Calculate the weighted average price
        BigDecimal totalCost = existingPrice.multiply(BigDecimal.valueOf(existingQuantity))
                .add(newPrice.multiply(BigDecimal.valueOf(newQuantity)));
        BigDecimal totalQuantity = BigDecimal.valueOf(existingQuantity + newQuantity);
        BigDecimal updatedPrice = totalCost.divide(totalQuantity, 2, RoundingMode.HALF_UP); // Adjust scale and rounding

        // Update stock details
        st.setBuyPrice(updatedPrice);
        st.setQuantity(existingQuantity + newQuantity);

        return stockRepository.save(st);
    }


    public Stock updateStock(Long id, Stock updatedStock) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found with id: " + id));
        stock.setStockName(updatedStock.getStockName());
        stock.setTicker(updatedStock.getTicker());
        stock.setBuyPrice(updatedStock.getBuyPrice());
        return stockRepository.save(stock);
    }

    public void deleteStock(String tricker,int quantity) {
        Stock st = stockRepository.findStockByTicker(tricker)
                .orElseThrow(()-> new EntityNotFoundException("No Stock Found"));

        if(st.getQuantity()<quantity){
            throw new EntityNotFoundException("Not Enough Stocks to sell");
        }

        st.setQuantity(st.getQuantity() -quantity);
        if(st.getQuantity()==0){
            stockRepository.delete(st);
            return;
        }
        stockRepository.save(st);

        return ;
    }

    public List<Stock> getAllStocks() {
        return stockRepository.findAll();
    }
    public List<PortfolioDetailResponse> calculatePortfolioDetails() {
        List<Stock> stocks = stockRepository.findAll();
        List<PortfolioDetailResponse> portfolioDetails = new ArrayList<>();

        for (Stock stock : stocks) {
            BigDecimal currentPrice = stockPriceService.fetchCurrentStockPrice(stock.getTicker());
            PortfolioDetailResponse response = new PortfolioDetailResponse(
                    stock .getStockName(),
                    stock.getTicker(),
                    stock.getBuyPrice(),
                    currentPrice,
                    BigDecimal.valueOf(stock.getQuantity())
            );
            portfolioDetails.add(response);
        }

        return portfolioDetails;
    }

    public PortfolioDetailResponse getStockInfo(String ticker) {
        Stock stock = stockRepository.findStockByTicker(ticker)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found with Ticker: " + ticker));


        BigDecimal currentPrice = BigDecimal.valueOf(0);

        try {
            currentPrice = stockPriceService.fetchCurrentStockPrice(stock.getTicker());
        } finally {

        }


        PortfolioDetailResponse pt=new PortfolioDetailResponse(
                stock .getStockName(),
                stock.getTicker(),
                stock.getBuyPrice(),
                currentPrice,
                BigDecimal.valueOf(stock.getQuantity())
        );

        //System.out.println(pt);
        return pt;
    }
}