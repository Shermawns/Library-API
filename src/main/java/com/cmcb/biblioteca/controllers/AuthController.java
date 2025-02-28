package com.cmcb.biblioteca.controllers;

import com.cmcb.biblioteca.config.TokenService;
import com.cmcb.biblioteca.dtos.AuthRequest;
import com.cmcb.biblioteca.dtos.AuthResponse;
import com.cmcb.biblioteca.dtos.LoginRequest;
import com.cmcb.biblioteca.dtos.LoginResponse;
import com.cmcb.biblioteca.mapper.UserMapper;
import com.cmcb.biblioteca.models.User;
import com.cmcb.biblioteca.repositories.UserRepository;
import com.cmcb.biblioteca.services.UserService;
import io.github.cdimascio.dotenv.Dotenv;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.validation.annotation.Validated;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping(value = "/api/V1/auth")
public class AuthController {

    private static final Dotenv dotenv = Dotenv.load();
    private static final String REGISTRATION_CODE = dotenv.get("REGISTRATION_CODE");


    private final TokenService tokenService;
    private final UserMapper userMapper;
    private final AuthenticationManager authenticationManager;
    private final UserRepository userRepository;

    public AuthController(TokenService tokenService, UserMapper userMapper, AuthenticationManager authenticationManager, UserRepository userRepository) {
        this.tokenService = tokenService;
        this.userMapper = userMapper;
        this.authenticationManager = authenticationManager;
        this.userRepository = userRepository;
    }

    @PostMapping(value = "/register")
    public ResponseEntity<?> create(@Validated @RequestBody AuthRequest userRequest) {

        if (!REGISTRATION_CODE.equals(userRequest.registrationCode())) {
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body("Código de registro inválido!");
        }

        if (this.userRepository.findByUsername(userRequest.username()) != null)
            return ResponseEntity.badRequest().build();

        String encryptedPassword = new BCryptPasswordEncoder().encode(userRequest.password());
        User newUser = new User(userRequest.username(), encryptedPassword, userRequest.role());
        User saveUser = this.userRepository.save(newUser);
        return ResponseEntity.status(HttpStatus.CREATED).body(userMapper.toUserResponse(saveUser));
    }

    @PostMapping("/login")
    public ResponseEntity login(@RequestBody @Validated LoginRequest data) {
        var usernamePassword = new UsernamePasswordAuthenticationToken(data.username(), data.password());
        var auth = this.authenticationManager.authenticate(usernamePassword);
        var token = tokenService.generateToken((User)auth.getPrincipal());
        return ResponseEntity.ok(new LoginResponse(token));
    }
}
