package com.cmcb.biblioteca.models;

import com.cmcb.biblioteca.enums.Status;
import jakarta.persistence.*;

@Entity
@Table(name = "tb_livro")
public class Livro {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String titulo;
    private Long codigo;
    private Status status;

    public Livro() {
    }

    public Livro(Long id, String titulo, Long codigo, Status status) {
        this.id = id;
        this.titulo = titulo;
        this.codigo = codigo;
        this.status = status;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getTitulo() {
        return titulo;
    }

    public void setTitulo(String titulo) {
        this.titulo = titulo;
    }

    public Long getCodigo() {
        return codigo;
    }

    public void setCodigo(Long codigo) {
        this.codigo = codigo;
    }

    public Status getStatus() {
        return status;
    }

    public void setStatus(Status status) {
        this.status = status;
    }
}
