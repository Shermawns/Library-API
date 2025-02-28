package com.cmcb.biblioteca.repositories;

import com.cmcb.biblioteca.models.Aluno;
import org.springframework.data.jpa.repository.JpaRepository;

public interface AlunoRepository extends JpaRepository<Aluno, Long> {
    Aluno findByMatricula(String matricula);
}
