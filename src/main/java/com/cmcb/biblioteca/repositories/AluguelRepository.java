package com.cmcb.biblioteca.repositories;

import com.cmcb.biblioteca.models.Aluguel;
import com.cmcb.biblioteca.models.Aluno;
import com.cmcb.biblioteca.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByAluno(Aluno aluno);
    List<Aluguel> findByLivro(Livro livro);
}
