package com.cmcb.biblioteca.services;

import com.cmcb.biblioteca.enums.Status;
import com.cmcb.biblioteca.models.Aluguel;
import com.cmcb.biblioteca.models.Aluno;
import com.cmcb.biblioteca.models.Livro;
import com.cmcb.biblioteca.repositories.AluguelRepository;
import com.cmcb.biblioteca.repositories.AlunoRepository;
import com.cmcb.biblioteca.repositories.LivroRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
public class AluguelService {
    private final AluguelRepository aluguelRepository;
    private final LivroRepository livroRepository;
    private final AlunoRepository alunoRepository;

    public AluguelService(AluguelRepository aluguelRepository, LivroRepository livroRepository, AlunoRepository alunoRepository) {
        this.aluguelRepository = aluguelRepository;
        this.livroRepository = livroRepository;
        this.alunoRepository = alunoRepository;
    }

    @Transactional
    public Aluguel alugarLivro(Long alunoId, Long livroID, LocalDate dataDevolucao){
        Aluno aluno = alunoRepository.findById(alunoId)
                .orElseThrow(() -> new RuntimeException("Aluno não encontrado"));

        Livro livro = livroRepository.findById(livroID)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));


        if (!livro.getStatus().equals(Status.DISPONIVEL)) {
            throw new RuntimeException("O livro não está disponível para aluguel");
        }

        Aluguel aluguel = new Aluguel();

        livro.setStatus(Status.ALUGADO);
        livroRepository.save(livro);

        aluguel.setAluno(aluno);
        aluguel.setLivro(livro);
        aluguel.setEntryDate(LocalDate.now());
        aluguel.setExitDate(dataDevolucao);

        return aluguelRepository.save(aluguel);

    }
    @Transactional
    public void devolverLivro(Long aluguelID){
        Aluguel aluguel = aluguelRepository.findById(aluguelID)
                .orElseThrow(() -> new RuntimeException("Aluguel não encontrado"));

        Livro livro = aluguel.getLivro();
        livro.setStatus(Status.DISPONIVEL);

        livroRepository.save(livro);
        aluguelRepository.delete(aluguel);
    }

    public List<Aluguel> listarAlugueisPorUsuario(Long usuarioId) {
        Aluno usuario = alunoRepository.findById(usuarioId)
                .orElseThrow(() -> new RuntimeException("Usuário não encontrado"));
        return aluguelRepository.findByAluno(usuario);
    }

    public List<Aluguel> listarAlugueisPorLivro(Long livroId) {
        Livro livro = livroRepository.findById(livroId)
                .orElseThrow(() -> new RuntimeException("Livro não encontrado"));
        return aluguelRepository.findByLivro(livro);
    }
}
