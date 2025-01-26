package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.PortfolioDetailResponse;
import com.assignment.stock_portfolio_backend.dto.StockRequestDto;
import com.assignment.stock_portfolio_backend.exception.StockException;
import com.assignment.stock_portfolio_backend.exception.UserRelatedException;
import com.assignment.stock_portfolio_backend.model.Stock;
import com.assignment.stock_portfolio_backend.model.Token;
import com.assignment.stock_portfolio_backend.model.User;
import com.assignment.stock_portfolio_backend.repository.StockRepository;
import com.assignment.stock_portfolio_backend.repository.TokenRepository;
import com.assignment.stock_portfolio_backend.repository.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.math.BigDecimal;
import java.math.RoundingMode;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class StockServiceImpl implements StockService {

    @Autowired
    private StockRepository stockRepository;
    @Autowired
    private TokenRepository tokenRepository;

    @Autowired
    private UserRepository userRepository;
    @Autowired
    private StockPriceServiceImpl stockPriceService;

    @Override
    public Stock addStock(StockRequestDto stockRequestDto, String token) {
        if(stockRequestDto.getTicker().contains(".")){
            throw new StockException("No Stock Exist");
        }
        Token tokenObject = tokenRepository.findByToken(token)
                .orElseThrow(() -> new UserRelatedException("Token cannot be found"));

        if (tokenObject.getExpired() || tokenObject.getRevoked()) {
            throw new UserRelatedException("Invalid Token");
        }

        User user = tokenObject.getUser();
        if (user == null) {
            throw new UserRelatedException("User not found");
        }

        Stock stock = new Stock();
        stock.setStockName(stockRequestDto.getStockName());
        stock.setTicker(stockRequestDto.getTicker());
        stock.setBuyPrice(stockRequestDto.getBuyPrice());
        stock.setQuantity(stockRequestDto.getQuantity());
        stock.setImage(stockRequestDto.getImage());
        stock.setUser(user);

        Optional<Stock> stk = stockRepository.findByTickerAndUser(stock.getTicker(), user);

        if (stk.isEmpty()) {
            return stockRepository.save(stock);
        }

        Stock existingStock = stk.get();
        existingStock.setImage(stockRequestDto.getImage());
        int existingQuantity = existingStock.getQuantity();
        BigDecimal existingPrice = existingStock.getBuyPrice();
        int newQuantity = stock.getQuantity();
        BigDecimal newPrice = stock.getBuyPrice();

        BigDecimal totalCost = existingPrice.multiply(BigDecimal.valueOf(existingQuantity))
                .add(newPrice.multiply(BigDecimal.valueOf(newQuantity)));
        BigDecimal totalQuantity = BigDecimal.valueOf(existingQuantity + newQuantity);
        BigDecimal updatedPrice = totalCost.divide(totalQuantity, 2, RoundingMode.HALF_UP);

        existingStock.setBuyPrice(updatedPrice);
        existingStock.setQuantity(existingQuantity + newQuantity);

        return stockRepository.save(existingStock);
    }



    @Override
    public Stock updateStock(Long id, StockRequestDto updatedStockDto) {
        Stock stock = stockRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Stock not found with id: " + id));

        if (updatedStockDto.getStockName() != null) {
            stock.setStockName(updatedStockDto.getStockName());
        }
        if (updatedStockDto.getTicker() != null) {
            stock.setTicker(updatedStockDto.getTicker());
        }
        if (updatedStockDto.getBuyPrice() != null) {
            stock.setBuyPrice(updatedStockDto.getBuyPrice());
        }
        if (updatedStockDto.getQuantity() != null) {
            stock.setQuantity(updatedStockDto.getQuantity());
        }
        if (updatedStockDto.getImage() != null) {
            stock.setImage(updatedStockDto.getImage());
        }

        return stockRepository.save(stock);
    }


    @Override
    public void deleteStock(String tricker, int quantity, String token) {
        Token tokenObject = tokenRepository.findByToken(token)
                .orElseThrow(() -> new UserRelatedException("Token cannot be found"));

        if (tokenObject.getExpired() || tokenObject.getRevoked()) {
            throw new UserRelatedException("Invalid Token");
        }

        User user = tokenObject.getUser();
        if (user == null) {
            throw new UserRelatedException("User not found");
        }

        List<Stock> lst=user.getStocks();
        Stock st = lst.stream()
                .filter(stock -> stock.getTicker().equals(tricker))
                .findFirst()
                .orElseThrow(() -> new EntityNotFoundException("No Stock Found with ticker: " + tricker));

        lst.remove(st);
        if(st.getQuantity()<quantity){
            throw new EntityNotFoundException("Not Enough Stocks to sell");
        }

        st.setQuantity(st.getQuantity() -quantity);
        lst.add(st);

        if(st.getQuantity()==0){
            lst.remove(st);
            user.setStocks(lst);
            userRepository.save(user);
            return;
        }
        userRepository.save(user);

        return ;
    }

    @Override
    public List<StockRequestDto> getAllStocks(String token) {
        //System.out.println(token);
        Token tokenObject = tokenRepository.findByToken(token.substring(7))
                .orElseThrow(() -> new UserRelatedException("Token cannot be found"));

        if (tokenObject.getExpired() || tokenObject.getRevoked()) {
            throw new UserRelatedException("Invalid Token");
        }

        User user = tokenObject.getUser();
        if (user == null) {
            throw new UserRelatedException("User not found");
        }
        List<StockRequestDto> stockRequestDtos = user.getStocks()
                .stream()
                .map(stock -> {
                    StockRequestDto dto = new StockRequestDto();
                    dto.setStockName(stock.getStockName());
                    dto.setQuantity(stock.getQuantity());
                    dto.setImage(stock.getImage());
                    dto.setBuyPrice(stock.getBuyPrice());
                    dto.setTicker(stock.getTicker());
                    dto.setCurrentPrice(stockPriceService
                            .fetchCurrentStockPrice(stock.getTicker()));
                    return dto;
                })
                .collect(Collectors.toList());
        return stockRequestDtos;
    }

    @Override
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
                    BigDecimal.valueOf(stock.getQuantity()),
                    stock.getImage()
            );
            portfolioDetails.add(response);
        }

        return portfolioDetails;
    }

    @Override
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
                BigDecimal.valueOf(stock.getQuantity()),
                stock.getImage()
        );

        //System.out.println(pt);
        return pt;
    }
}