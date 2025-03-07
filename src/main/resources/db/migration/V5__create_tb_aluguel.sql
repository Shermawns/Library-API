CREATE TABLE tb_aluguel (
    id BIGSERIAL PRIMARY KEY,
    aluno_id BIGINT NOT NULL,
    livro_id BIGINT NOT NULL,
    entry_date DATE NOT NULL,
    extend_date DATE,
    exit_date DATE,
    CONSTRAINT fk_aluno FOREIGN KEY (aluno_id) REFERENCES tb_aluno(id) ON DELETE CASCADE,
    CONSTRAINT fk_livro FOREIGN KEY (livro_id) REFERENCES tb_livro(id) ON DELETE CASCADE
);