package com.cmcb.biblioteca.services;

import com.cmcb.biblioteca.enums.Status;
import com.cmcb.biblioteca.models.Aluguel;
import com.cmcb.biblioteca.models.Livro;
import com.cmcb.biblioteca.repositories.AluguelRepository;
import com.cmcb.biblioteca.repositories.LivroRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

@Service
public class LivroService {

    private final LivroRepository livroRepository;
    private final AluguelRepository aluguelRepository;

    public LivroService(LivroRepository livroRepository, AluguelRepository aluguelRepository) {
        this.livroRepository = livroRepository;
        this.aluguelRepository = aluguelRepository;
    }

    @Transactional
    public void atualizarStatusAtrasados() {
        List<Aluguel> alugueis = aluguelRepository.findAll();

        for (Aluguel aluguel : alugueis) {
            if (aluguel.getExitDate().isBefore(LocalDate.now()) &&
                    aluguel.getLivro().getStatus() == Status.ALUGADO) {

                Livro livro = aluguel.getLivro();
                livro.setStatus(Status.ATRASADO);
                livroRepository.save(livro);
            }
        }
    }

    @Scheduled(cron = "0 0 0 * * ?") //atualizaTodoDiaMeiaNoite
    public void atualizarStatusAtrasadosAutomaticamente() {
        atualizarStatusAtrasados();
    }

    public List<Livro> findAll() {
        return livroRepository.findAll();
    }

    public Livro findById(Long id) {
        return livroRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Livro %s não foi encontrado no sistema", id))
        );
    }

    public Livro save(Livro livro) {
        Optional<Livro> existingLivro = livroRepository.findByISBN(livro.getISBN());
        if (existingLivro.isPresent()) {
            throw new DataIntegrityViolationException("O livro com ISBN '" + livro.getISBN() + "' já está registrado.");
        }

        livro.setStatus(Status.DISPONIVEL);

        return livroRepository.save(livro);
    }

    public Livro update(Long id, Livro livroRequest) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));

        if (livroRequest.getTitulo() != null) {
            livro.setTitulo(livroRequest.getTitulo());
        }
        if (livroRequest.getISBN() != null) {
            livro.setISBN(livroRequest.getISBN());
        }
        if (livroRequest.getStatus() != null) {
            livro.setStatus(livroRequest.getStatus());
        }

        return livroRepository.save(livro);
    }

    public void delete(Long id) {
        Livro livro = livroRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Livro não encontrado"));

        livroRepository.delete(livro);
    }

}
