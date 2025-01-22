package com.assignment.stock_portfolio_backend.mappers;

import com.assignment.stock_portfolio_backend.dto.RegisterDto;
import com.assignment.stock_portfolio_backend.enums.Gender;
import com.assignment.stock_portfolio_backend.model.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {


    public User dtoToEntity(RegisterDto userDto) {
        User user = new User();

        user.setFirstName(userDto.getFirstName());
        user.setLastName(userDto.getLastName());
        user.setDateOfBirth(userDto.getDateOfBirth());
        user.setEmail(userDto.getEmail());
        user.setMobileNumber(userDto.getMobileNumber());
        user.setUsername(userDto.getUsername());
        if (userDto.getGender().equalsIgnoreCase("male")) {
            user.setGender(Gender.MALE.name());
        } else if (userDto.getGender().equalsIgnoreCase("female")) {
            user.setGender(Gender.FEMALE.name());
        } else {
            user.setGender(Gender.OTHERS.name());
        }

        return user;
    }

    public RegisterDto entityToDto(User user) {
        RegisterDto userDto = new RegisterDto();

        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setDateOfBirth(user.getDateOfBirth());
        userDto.setGender(user.getGender());
        userDto.setEmail(user.getEmail());
        userDto.setMobileNumber(user.getMobileNumber());
        userDto.setUsername(user.getUsername());
        userDto.setPassword("TestPassword@1234");

        return userDto;
    }
}