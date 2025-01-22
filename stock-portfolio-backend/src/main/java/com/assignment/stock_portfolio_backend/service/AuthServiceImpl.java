package com.assignment.stock_portfolio_backend.service;

import com.assignment.stock_portfolio_backend.dto.JWTAuthResponse;
import com.assignment.stock_portfolio_backend.dto.LoginDto;
import com.assignment.stock_portfolio_backend.dto.RegisterDto;
import com.assignment.stock_portfolio_backend.enums.Gender;
import com.assignment.stock_portfolio_backend.enums.TokenType;
import com.assignment.stock_portfolio_backend.exception.UserRelatedException;
import com.assignment.stock_portfolio_backend.mappers.UserMapper;
import com.assignment.stock_portfolio_backend.model.Role;
import com.assignment.stock_portfolio_backend.model.Token;
import com.assignment.stock_portfolio_backend.model.User;
import com.assignment.stock_portfolio_backend.repository.RoleRepository;
import com.assignment.stock_portfolio_backend.repository.TokenRepository;
import com.assignment.stock_portfolio_backend.repository.UserRepository;
import com.assignment.stock_portfolio_backend.security.JwtTokenProvider;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.stereotype.Service;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.crypto.password.PasswordEncoder;

import java.util.ArrayList;
import java.util.HashSet;
import java.util.Set;


@Service
public class AuthServiceImpl implements AuthService {

    @Autowired
    private UserMapper userMapper;
    private AuthenticationManager authenticationManager;
    private PasswordEncoder passwordEncoder;
    private JwtTokenProvider jwtTokenProvider;
    private UserRepository userRepository;
    private TokenRepository tokenRepository;
    private RoleRepository roleRepository;

    public AuthServiceImpl(UserMapper userMapper, AuthenticationManager authenticationManager, PasswordEncoder passwordEncoder, JwtTokenProvider jwtTokenProvider, UserRepository userRepository, TokenRepository tokenRepository, RoleRepository roleRepository) {
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
        this.passwordEncoder = passwordEncoder;
        this.jwtTokenProvider = jwtTokenProvider;
        this.userRepository = userRepository;
        this.tokenRepository = tokenRepository;
        this.roleRepository = roleRepository;
    }

    @Override
    public JWTAuthResponse login(LoginDto loginDto) {
        User user = userRepository
                .findUserByUsernameOrEmail(loginDto.getUsernameOrEmail(), loginDto.getUsernameOrEmail())
                .orElseThrow(() -> new UserRelatedException(
                        "User with username or email " + loginDto.getUsernameOrEmail() + " cannot be found"));

        if (!user.getActive()) {
            throw new UserRelatedException("User is not active");
        }

        Authentication authentication = authenticationManager
                .authenticate(new UsernamePasswordAuthenticationToken(user.getUsername(), loginDto.getPassword()));

        SecurityContextHolder.getContext().setAuthentication(authentication);

        String token = jwtTokenProvider.generateToken(authentication);
        saveToken(user, token);
        JWTAuthResponse jwtAuthResponse = new JWTAuthResponse();
        jwtAuthResponse.setAccessToken(token);
        for (Role newRole : user.getRoles()) {
            jwtAuthResponse.setRole(newRole.getRoleName());
            break;
        }

        jwtAuthResponse.setName(user.getFirstName() +" "+user.getLastName());
        return jwtAuthResponse;
    }

    @Override
    public String register(RegisterDto registerDto, String role) {

        if (userRepository.existsUserByUsername(registerDto.getUsername()) && role.equals("ROLE_USER")) {

            throw new UserRelatedException(
                    "User with the Username : " + registerDto.getUsername() + " already exists");
        }



        User user = new User();
       // System.out.println(registerDto);
        user.setFirstName(registerDto.getFirstName());
        user.setLastName(registerDto.getLastName());
        user.setUsername(registerDto.getUsername());
        user.setPassword(passwordEncoder.encode(registerDto.getPassword()));
        user.setMobileNumber(registerDto.getMobileNumber());
        user.setEmail(registerDto.getEmail());
        user.setDateOfBirth(registerDto.getDateOfBirth());

        if (Gender.MALE.name().equalsIgnoreCase(registerDto.getGender())) {
            user.setGender(Gender.MALE.name());
        } else if (Gender.FEMALE.name().equalsIgnoreCase(registerDto.getGender())) {
            user.setGender(Gender.FEMALE.name());
        } else {
            user.setGender(Gender.OTHERS.name());
        }
        Set<Role> roles = new HashSet<>();
        Role newRole = roleRepository.findByRoleName(role).orElseThrow(() -> new RuntimeException("Role Not Found"));
        roles.add(newRole);
        user.setRoles(roles);
        user.setStocks(new ArrayList<>());

        System.out.println(user);
        User savedUser = userRepository.save(user);

        return "User Registered!";
    }

    @Override
    public boolean validateUserToken(HttpServletRequest request, String role) {
        return false;
    }

    private Token saveToken(User user, String jwtToken) {
        Token token = new Token();
        if (user.getToken() != null) {
            token.setId(user.getToken().getId());
        }
        token.setToken(jwtToken);
        token.setUser(user);
        token.setRevoked(false);
        token.setExpired(false);
        token.setTokenType(TokenType.BEARER);
        tokenRepository.save(token);

        return token;

    }

    @Override
    public RegisterDto getLoggedUser(HttpServletRequest request) {
        final String authHeader = request.getHeader("Authorization");
        final String token = authHeader.substring(7);

        Token tokenObject = tokenRepository.findByToken(token)
                .orElseThrow(() -> new UserRelatedException("Token cannot be found"));

        if (tokenObject.getExpired() || tokenObject.getRevoked()) {
            throw new UserRelatedException("Invalid Token");
        }

        String username = jwtTokenProvider.getUsername(token);
        User user = userRepository.findUserByUsernameOrEmail(username, username)
                .orElseThrow(() -> new UserRelatedException("User with username or email : " + username + " cannot be found"));

        return userMapper.entityToDto(user);
    }




}
