package com.cmcb.biblioteca.repositories;

import com.cmcb.biblioteca.models.Livro;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface LivroRepository extends JpaRepository<Livro, Long>{
    Optional<Livro> findByISBN(String isbn);
}
