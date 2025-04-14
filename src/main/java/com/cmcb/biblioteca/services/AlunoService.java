package com.cmcb.biblioteca.services;

import com.cmcb.biblioteca.dtos.AlunoRequest;
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
        if (alunoRepository.findByEmail(aluno.getEmail()) != null){
            throw new DataIntegrityViolationException("O email '" + aluno.getEmail() + "' já está em uso por outro aluno.");
        }
        return alunoRepository.save(aluno);
    }

    public Aluno update(Long id, AlunoRequest alunoRequest) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        if (alunoRequest.name() != null) {
            aluno.setNome(alunoRequest.name());
        }
        if (alunoRequest.matricula() != null) {
            aluno.setMatricula(alunoRequest.matricula());
        }
        if (alunoRequest.email() != null) {
            aluno.setEmail(alunoRequest.email());
        }

        return alunoRepository.save(aluno);
    }

    public void delete(Long id) {
        Aluno aluno = alunoRepository.findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Aluno não encontrado"));

        alunoRepository.delete(aluno);
    }

}
