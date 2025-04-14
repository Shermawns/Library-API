package com.cmcb.biblioteca.controllers;
import com.cmcb.biblioteca.enums.Status;
import com.cmcb.biblioteca.models.Livro;
import com.cmcb.biblioteca.services.LivroService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/V1/livro")
public class LivroController {

    private final LivroService livroService;

    public LivroController(LivroService livroService) {
        this.livroService = livroService;
    }

    @PostMapping(value = "/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Livro> create(@RequestBody Livro livroRequest) {
        livroRequest.setStatus(Status.DISPONIVEL);
        Livro livro = livroService.save(livroRequest);
        return ResponseEntity.status(HttpStatus.CREATED).body(livro);
    }

    @PutMapping(value = "/atualizar/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Livro> update(@PathVariable Long id, @RequestBody Livro livroRequest) {
        Livro livroAtualizado = livroService.update(id, livroRequest);
        return ResponseEntity.ok(livroAtualizado);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Livro>> findAll() {
        return ResponseEntity.ok().body(livroService.findAll());
    }

    @GetMapping(value = "/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Livro> findById(@PathVariable Long id) {
        Livro livro = livroService.findById(id);
        return ResponseEntity.ok().body(livro);
    }

    @DeleteMapping(value = "/delete/{id}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> delete(@PathVariable Long id) {
        livroService.delete(id);
        return ResponseEntity.ok("Livro removido com sucesso!");
    }



}