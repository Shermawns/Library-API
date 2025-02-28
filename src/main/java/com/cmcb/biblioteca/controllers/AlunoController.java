package com.cmcb.biblioteca.controllers;

import com.cmcb.biblioteca.dtos.AlunoRequest;
import com.cmcb.biblioteca.mapper.AlunoMapper;
import com.cmcb.biblioteca.models.Aluno;
import com.cmcb.biblioteca.services.AlunoService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping(value = "/api/V1/aluno")
public class AlunoController {

    private final AlunoService alunoService;
    private final AlunoMapper alunoMapper;

    public AlunoController(AlunoService alunoService, AlunoMapper alunoMapper) {
        this.alunoService = alunoService;
        this.alunoMapper = alunoMapper;
    }

    @PostMapping(value = "/create")
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<Aluno> create(@RequestBody AlunoRequest aluno){

        Aluno result = alunoService.save(alunoMapper.toAlunoRequest(aluno));

        return ResponseEntity.status(HttpStatus.CREATED).body(result);
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public ResponseEntity<List<Aluno>> findAll(){
        return ResponseEntity.ok().body(alunoService.findAll());
    }

}
