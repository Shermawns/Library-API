package com.cmcb.biblioteca.controllers;

import com.cmcb.biblioteca.dtos.AluguelRequest;
import com.cmcb.biblioteca.models.Aluguel;
import com.cmcb.biblioteca.services.AluguelService;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping(value = "/api/V1/aluguel")
public class AluguelController {

    private final AluguelService aluguelService;

    public AluguelController(AluguelService aluguelService) {
        this.aluguelService = aluguelService;
    }

    @PostMapping(value = "/alugar")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Aluguel> alugarLivro(@RequestBody AluguelRequest aluguelRequest){

        Aluguel aluguel = aluguelService.alugarLivro(aluguelRequest.alunoId(), aluguelRequest.livroId(), aluguelRequest.dataDevolucao());

        return ResponseEntity.status(HttpStatus.CREATED).body(aluguel);
    }

    @PostMapping("/devolver/{aluguelId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<String> devolverLivro(@PathVariable Long aluguelId) {
            aluguelService.devolverLivro(aluguelId);
            return ResponseEntity.status(HttpStatus.OK).body("Livro devolvido com sucesso");
    }

    @GetMapping("/usuario/{usuarioId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Aluguel>> listarAlugueisPorUsuario(@PathVariable Long usuarioId) {

            List<Aluguel> alugueis = aluguelService.listarAlugueisPorUsuario(usuarioId);
            return ResponseEntity.ok(alugueis);

    }

    @GetMapping("/livro/{livroId}")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Aluguel>> listarAlugueisPorLivro(@PathVariable Long livroId) {

            List<Aluguel> alugueis = aluguelService.listarAlugueisPorLivro(livroId);
            return ResponseEntity.ok(alugueis);
    }

    @GetMapping("/filtrar/alugados")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Aluguel>> listarAlugueisAlugados() {
        List<Aluguel> alugueis = aluguelService.listarAlugueisAlugados();
        return ResponseEntity.ok(alugueis);
    }

    @GetMapping("/filtrar/atrasados")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Aluguel>> listarAlugueisAtrasados() {
        List<Aluguel> alugueis = aluguelService.listarAlugueisAtrasados();
        return ResponseEntity.ok(alugueis);
    }


}

