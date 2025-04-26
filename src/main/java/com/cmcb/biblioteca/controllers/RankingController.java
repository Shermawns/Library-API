package com.cmcb.biblioteca.controllers;

import com.cmcb.biblioteca.dtos.AlunoRankingDTO;
import com.cmcb.biblioteca.services.AluguelService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/V1/ranking")
public class RankingController {

    private final AluguelService aluguelService;

    public RankingController(AluguelService aluguelService) {
        this.aluguelService = aluguelService;
    }

    @GetMapping("/alunos")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<AlunoRankingDTO>> listarRankingAlunos() {
        List<AlunoRankingDTO> ranking = aluguelService.rankingAlunosMaisAlugam();
        return ResponseEntity.ok(ranking);
    }
}
