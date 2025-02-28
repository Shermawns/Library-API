package com.cmcb.biblioteca.dtos;

import jakarta.validation.constraints.NotBlank;

public record AlunoRequest(@NotBlank
                           String name,
                           @NotBlank
                           String matricula) {
}
