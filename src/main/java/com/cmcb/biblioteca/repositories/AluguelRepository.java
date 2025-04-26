package com.cmcb.biblioteca.repositories;

import com.cmcb.biblioteca.dtos.AlunoRankingDTO;
import com.cmcb.biblioteca.models.Aluguel;
import com.cmcb.biblioteca.models.Aluno;
import com.cmcb.biblioteca.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.util.List;

public interface AluguelRepository extends JpaRepository<Aluguel, Long> {
    List<Aluguel> findByAluno(Aluno aluno);
    List<Aluguel> findByLivro(Livro livro);

    @Query("SELECT a.aluno.nome AS nome, COUNT(a) AS totalAlugueis " +
            "FROM Aluguel a " +
            "GROUP BY a.aluno.nome " +
            "ORDER BY totalAlugueis DESC")
    List<AlunoRankingDTO> findRankingAlunos();
}
