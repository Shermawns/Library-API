package com.cmcb.biblioteca.services;

import com.cmcb.biblioteca.models.Aluno;
import com.cmcb.biblioteca.models.User;
import com.cmcb.biblioteca.repositories.AlunoRepository;
import jakarta.persistence.EntityNotFoundException;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AlunoService {

    private final AlunoRepository alunoRepository;

    public AlunoService(AlunoRepository alunoRepository) {
        this.alunoRepository = alunoRepository;
    }

    public List<Aluno> findAll(){
        return alunoRepository.findAll();
    }

    public Aluno findById(Long id){
        return alunoRepository.findById(id).orElseThrow(
                () -> new EntityNotFoundException(String.format("Aluno %s não foi encontrado no sistema", id))
        );
    }

    public Aluno save(Aluno aluno) {
        if (alunoRepository.findByMatricula(aluno.getMatricula()) != null) {
            throw new DataIntegrityViolationException("O aluno '" + aluno.getMatricula() + "' já está registrado.");
        }
        return alunoRepository.save(aluno);
    }
}
