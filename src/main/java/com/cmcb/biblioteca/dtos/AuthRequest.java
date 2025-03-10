package com.cmcb.biblioteca.dtos;

import com.cmcb.biblioteca.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Size;

public record AuthRequest (
        @NotBlank
        @Email(message = "Email must be a valid format")
        String username,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6)
        String password,

        @NotBlank(message = "Confirm password cannot be blank")
        @Size(min = 6)
        String confirmPassword,

        Role role,
        String registrationCode) {
}
