package com.assignment.stock_portfolio_backend.controller;


import com.assignment.stock_portfolio_backend.dto.JWTAuthResponse;
import com.assignment.stock_portfolio_backend.dto.LoginDto;
import com.assignment.stock_portfolio_backend.dto.RegisterDto;
import com.assignment.stock_portfolio_backend.exception.UserRelatedException;
import com.assignment.stock_portfolio_backend.service.AuthService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import org.springframework.security.web.authentication.logout.LogoutHandler;
import org.springframework.security.core.Authentication;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = "http://localhost:3000")
public class AuthController {

    private static final Logger logger = LoggerFactory.getLogger(AuthController.class);

    private AuthService authService;
    private final LogoutHandler logoutHandler;


    public AuthController(AuthService authService, LogoutHandler logoutHandler) {
        super();

        this.authService = authService;
        this.logoutHandler = logoutHandler;
    }


    @PostMapping(value = {"/login"})
    public ResponseEntity<JWTAuthResponse> login(@Valid @RequestBody LoginDto loginDto) {

        String role = loginDto.getRole().toUpperCase();
        logger.info("User login with role : {} and username or email : {}",role, loginDto.getUsernameOrEmail());

        if (role.equals("ADMIN") || role.equals("USER") ) {
            JWTAuthResponse jwtAuthResponse = authService.login(loginDto);
            return new ResponseEntity<>(jwtAuthResponse, HttpStatus.OK);
        } else throw new UserRelatedException("Invalid Role!. Login With Proper Role.");
    }




    @PostMapping(value = {"/register"})
    public ResponseEntity<String> register(@Valid @RequestBody RegisterDto registerDto,
                                            @RequestParam(name = "tempRole") String tempRole) {
        String role = "ROLE_" + tempRole.toUpperCase();

        //System.out.println(registerDto);
        logger.info("Registering new user for role : {}", role);
        String message = authService.register(registerDto, role);

        return ResponseEntity.ok(message);
    }


    @PostMapping("/logout")
    public ResponseEntity<String> logout(HttpServletRequest request, HttpServletResponse response, Authentication authentication) {

        logger.info("Logging out user by token");
        logoutHandler.logout(request, response, authentication);
        return new ResponseEntity<>("Successfully logged out", HttpStatus.OK);

    }

    @GetMapping("/user")
    public boolean validateUserToken(@RequestParam String role,HttpServletRequest request) {
        role = "ROLE_" + role.toUpperCase();
        logger.info("User token validation");
        return authService.validateUserToken(request,role);
    }




    @GetMapping("/loggedUser")
    public ResponseEntity<RegisterDto> getLoggedUser(HttpServletRequest request){

        logger.info("Fetching logged user by token");
        RegisterDto registerDto = authService.getLoggedUser(request);

        return new ResponseEntity<>(registerDto,HttpStatus.OK);
    }

}
