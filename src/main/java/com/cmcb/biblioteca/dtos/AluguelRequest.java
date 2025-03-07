package com.cmcb.biblioteca.dtos;

import java.time.LocalDate;

public record AluguelRequest(Long alunoId, Long livroId, LocalDate dataDevolucao) {
}
