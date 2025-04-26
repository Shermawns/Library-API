package com.cmcb.biblioteca.mapper;

import com.cmcb.biblioteca.dtos.AuthRequest;
import com.cmcb.biblioteca.dtos.AuthResponse;
import com.cmcb.biblioteca.models.User;
import org.springframework.stereotype.Component;

@Component
public class UserMapper {

    public User toUserRequest(AuthRequest userRequest){
        return new User(
                userRequest.username(),
                userRequest.password()
        );
    }

    public AuthResponse toUserResponse(User user){
        return new AuthResponse(
                user.getId(),
                user.getUsername()
        );
    }
}