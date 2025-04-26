package com.cmcb.biblioteca.services;

import com.cmcb.biblioteca.dtos.AlunoRankingDTO;
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
    private final EmailService emailService;

    public AluguelService(AluguelRepository aluguelRepository, LivroRepository livroRepository, AlunoRepository alunoRepository, EmailService emailService) {
        this.aluguelRepository = aluguelRepository;
        this.livroRepository = livroRepository;
        this.alunoRepository = alunoRepository;
        this.emailService = emailService;
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

        Aluguel aluguelSalvo = aluguelRepository.save(aluguel);

        String destinatario = aluno.getEmail();
        String assunto = "📚 Confirmação de Aluguel de Livro";

        String mensagem = "Olá " + aluno.getNome() + ",\n\n" +
                "Você alugou o livro \"" + livro.getTitulo() + "\".\n" +
                "A data prevista para devolução é: " + dataDevolucao + "\n\n" +
                "Observação: a data está no formato americano (MM/dd/yyyy), ou seja,\n" +
                "o mês vem antes do dia. Por exemplo, 04/15/2025 corresponde a 15 de abril de 2025.\n\n" +
                "Por favor, devolva o livro até a data indicada para que outros alunos também possam utilizá-lo.\n\n" +
                "Se tiver qualquer dúvida, estamos à disposição para ajudar.\n\n" +
                "Atenciosamente,\nEquipe da Biblioteca do CMCB";

        emailService.enviarEmail(destinatario, assunto, mensagem);

        return aluguelSalvo;
    }
    @Transactional
    public void devolverLivro(Long aluguelID){
        Aluguel aluguel = aluguelRepository.findById(aluguelID)
                .orElseThrow(() -> new RuntimeException("Aluguel não encontrado"));

        Livro livro = aluguel.getLivro();
        livro.setStatus(Status.DISPONIVEL);
        livroRepository.save(livro);

        aluguel.setDevolvido(true);
        aluguelRepository.save(aluguel);
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

    public List<Aluguel> listarAlugueisAlugados() {
        return aluguelRepository.findAll()
                .stream()
                .filter(aluguel -> aluguel.getLivro().getStatus() == Status.ALUGADO)
                .toList();
    }

    public List<Aluguel> listarAlugueisAtrasados() {
        return aluguelRepository.findAll()
                .stream()
                .filter(aluguel -> aluguel.getLivro().getStatus() == Status.ATRASADO)
                .toList();
    }

    public List<AlunoRankingDTO> rankingAlunosMaisAlugam() {
        return aluguelRepository.findRankingAlunos();
    }


}
