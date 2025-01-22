package com.assignment.stock_portfolio_backend.config;

import com.assignment.stock_portfolio_backend.model.Role;
import com.assignment.stock_portfolio_backend.repository.RoleRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

@Component
public class DataLoader implements CommandLineRunner {

    @Autowired
    private RoleRepository roleRepository;



    @Override
    public void run(String... args) {
        // Add data to the database
        if (roleRepository.count() <2) { // Ensure data is added only once
            Role role1=new Role();
            role1.setRoleName("ROLE_ADMIN");

            Role role2=new Role();
            role2.setRoleName("ROLE_USER");
            roleRepository.save(role1);
            roleRepository.save(role2);



        }
    }
}