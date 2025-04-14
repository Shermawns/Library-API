package com.cmcb.biblioteca.dtos;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record AlunoRequest(@NotBlank
                           String name,
                           @NotBlank
                           String matricula,
                           @NotBlank  @Pattern(regexp = "^[a-zA-Z0-9._%+-]+@cm\\.cb\\.ce\\.gov\\.br$", message = "O e-mail deve ser do domínio @cm.cb.ce.gov.br")
                           String email) {
}
