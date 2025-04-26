package com.cmcb.biblioteca.dtos;

import com.cmcb.biblioteca.enums.Role;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;

public record AuthRequest (
        @NotBlank
        @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@cm\\.cb\\.ce\\.gov\\.br$", message = "O e-mail deve ser do domínio @cm.cb.ce.gov.br")
        String username,

        @NotBlank(message = "Password cannot be blank")
        @Size(min = 6)
        String password,

        @NotBlank(message = "Confirm password cannot be blank")
        @Size(min = 6)
        String confirmPassword,
        String registrationCode) {
}
