package com.cmcb.biblioteca.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;

public record AlunoRequest(@NotBlank
                           String name,
                           @NotBlank
                           String matricula,
                           @Email @NotBlank
                           String email) {
}
