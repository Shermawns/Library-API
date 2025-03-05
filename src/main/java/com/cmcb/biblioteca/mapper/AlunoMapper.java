package com.cmcb.biblioteca.mapper;

import com.cmcb.biblioteca.dtos.AlunoRequest;
import com.cmcb.biblioteca.dtos.AuthRequest;
import com.cmcb.biblioteca.models.Aluno;
import com.cmcb.biblioteca.models.User;
import org.springframework.stereotype.Component;

@Component
public class AlunoMapper {

    public Aluno toAlunoRequest(AlunoRequest alunoRequest){
        return new Aluno(
                alunoRequest.name(),
                alunoRequest.matricula(),
                alunoRequest.email()
        );
    }
}
