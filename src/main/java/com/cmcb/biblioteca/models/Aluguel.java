package com.cmcb.biblioteca.models;

import jakarta.persistence.*;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Table(name = "tb_aluguel")
@EntityListeners(AuditingEntityListener.class)
public class Aluguel {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    @ManyToOne
    @JoinColumn(name = "aluno_id")
    private Aluno aluno;
    @ManyToOne
    @JoinColumn(name = "livro_id")
    private Livro livro;
    @CreatedDate
    private LocalDate entryDate;
    private LocalDate extendDate;
    private LocalDate exitDate;

    public Aluguel() {
    }

    public Aluguel(Long id, Aluno aluno, Livro livro, LocalDate entryDate, LocalDate extendDate, LocalDate exitDate) {
        this.id = id;
        this.aluno = aluno;
        this.livro = livro;
        this.entryDate = entryDate;
        this.extendDate = extendDate;
        this.exitDate = exitDate;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Aluno getAluno() {
        return aluno;
    }

    public void setAluno(Aluno aluno) {
        this.aluno = aluno;
    }

    public Livro getLivro() {
        return livro;
    }

    public void setLivro(Livro livro) {
        this.livro = livro;
    }

    public LocalDate getEntryDate() {
        return entryDate;
    }

    public void setEntryDate(LocalDate entryDate) {
        this.entryDate = entryDate;
    }

    public LocalDate getExtendDate() {
        return extendDate;
    }

    public void setExtendDate(LocalDate extendDate) {
        this.extendDate = extendDate;
    }

    public LocalDate getExitDate() {
        return exitDate;
    }

    public void setExitDate(LocalDate exitDate) {
        this.exitDate = exitDate;
    }
}
