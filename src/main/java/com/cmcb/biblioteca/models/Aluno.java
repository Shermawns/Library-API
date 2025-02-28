package com.cmcb.biblioteca.models;

import jakarta.persistence.*;
import org.springframework.cglib.core.Local;
import org.springframework.data.annotation.CreatedDate;
import org.springframework.data.annotation.LastModifiedDate;
import org.springframework.data.jpa.domain.support.AuditingEntityListener;

import java.time.LocalDate;

@Entity
@Table(name = "tb_aluno")
@EntityListeners(AuditingEntityListener.class)
public class Aluno {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String matricula;
    private String nome;
    @CreatedDate
    private LocalDate data_criacao;
    @LastModifiedDate
    private LocalDate data_atualizacao;

    public Aluno() {
    }

    public Aluno(Long id, String matricula, String nome, LocalDate data_criacao, LocalDate data_atualizacao) {
        this.id = id;
        this.matricula = matricula;
        this.nome = nome;
        this.data_criacao = data_criacao;
        this.data_atualizacao = data_atualizacao;
    }

    public Aluno(String name, String matricula) {
        this.nome = name;
        this.matricula = matricula;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getMatricula() {
        return matricula;
    }

    public void setMatricula(String matricula) {
        this.matricula = matricula;
    }

    public String getNome() {
        return nome;
    }

    public void setNome(String nome) {
        this.nome = nome;
    }

    public LocalDate getData_criacao() {
        return data_criacao;
    }

    public void setData_criacao(LocalDate data_criacao) {
        this.data_criacao = data_criacao;
    }

    public LocalDate getData_atualizacao() {
        return data_atualizacao;
    }

    public void setData_atualizacao(LocalDate data_atualizacao) {
        this.data_atualizacao = data_atualizacao;
    }
}
