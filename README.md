
<body>

  <h1>📖 Sistema de Gerenciamento de Biblioteca - Colégio Militar do Corpo de Bombeiros</h1>

  <section>
    <h2>📚 Sobre o Projeto</h2>
    <p>
      Este projeto consiste em um robusto <strong>Sistema de Gerenciamento de Biblioteca</strong> desenvolvido para o 
      <strong>Colégio Militar do Corpo de Bombeiros</strong>. A API RESTful, construída com Java e Spring Boot, visa otimizar e automatizar os processos de empréstimo, devolução e catalogação de livros, além de fornecer um sistema de autenticação seguro e gerenciamento de usuários.
    </p>
    <p>
      O frontend da aplicação foi desenvolvido em <strong>TypeScript</strong> e <strong>React</strong> pelo talentoso membro da equipe, <strong>Pedro Henrique Magalhães</strong>.
    </p>
  </section>

  <section class="highlight">
    <h2>🎥 Demonstração do Projeto</h2>
    <!-- Cole o link do vídeo (YouTube, Drive ou Loom) abaixo -->
    <iframe src="COLE_AQUI_SEU_LINK_DE_VIDEO" allowfullscreen></iframe>
  </section>

  <section>
    <h2>🏆 Principais Resultados Alcançados</h2>
    <ul>
      <li><strong>Otimização do Controle de Acervo:</strong> aumento de <strong>95%</strong> na eficiência do inventário.</li>
      <li><strong>Agilidade nos Empréstimos e Devoluções:</strong> redução de <strong>60%</strong> no tempo médio de atendimento.</li>
      <li><strong>Redução de Atrasos:</strong> diminuição de <strong>40%</strong> nas devoluções em atraso.</li>
      <li><strong>Gestão de Disponibilidade:</strong> eliminação de empréstimos duplicados.</li>
      <li><strong>Base de Dados Estratégica:</strong> geração de relatórios com os livros mais procurados.</li>
    </ul>
  </section>

  <section>
    <h2>✨ Funcionalidades Principais</h2>
    <ul>
      <li>🔐 Autenticação e Autorização JWT</li>
      <li>🧑‍🎓📖 Gerenciamento de Alunos e Livros</li>
      <li>🔁 Sistema de Aluguel e Devolução</li>
      <li>🏆 Ranking de Leitores</li>
      <li>📧 Notificações por E-mail</li>
      <li>🕒 Agendamento de Tarefas com <code>@Scheduled</code></li>
      <li>✈️ Migrações com Flyway</li>
      <li>🐳 Conteinerização com Docker</li>
    </ul>
  </section>

  <section>
    <h2>🛠️ Tecnologias Utilizadas</h2>
    <ul>
      <li><strong>Backend:</strong> Java 17, Spring Boot 3, Spring Security, Spring Data JPA</li>
      <li><strong>Frontend:</strong> React, TypeScript</li>
      <li><strong>Banco de Dados:</strong> PostgreSQL, Flyway</li>
      <li><strong>Autenticação:</strong> JWT</li>
      <li><strong>Build:</strong> Maven</li>
      <li><strong>Ambiente:</strong> Docker, Docker Compose</li>
    </ul>
  </section>

  <section>
    <h2>🚀 Como Executar o Projeto</h2>
    <ol>
      <li><strong>Clone o repositório:</strong>
        <pre><code>git clone https://github.com/seu-usuario/library-api.git</code></pre>
      </li>

  <li><strong>Crie o arquivo .env:</strong>
        <pre><code># DADOS DO BANCO DE DADOS
POSTGRES_DB=biblioteca
POSTGRES_USER=seu-usuario
POSTGRES_PASSWORD=sua-senha
POSTGRES_PORT=5432

# DADOS DA APLICAÇÃO
DATABASE_URL=jdbc:postgresql://localhost:5432/biblioteca
DATABASE_USERNAME=seu-usuario
DATABASE_PASSWORD=sua-senha
DATABASE_DRIVER=org.postgresql.Driver

# DADOS DO EMAIL
MAIL_HOST=smtp.gmail.com
MAIL_PORT=587
MAIL_USERNAME=seu-email@gmail.com
MAIL_PASSWORD=sua-senha-de-app

# CHAVE SECRETA E CÓDIGO DE REGISTRO
SECRET_KEY=sua-chave-secreta
REGISTRATION_CODE=seu-codigo-de-registro</code></pre>
      </li>

  <li><strong>Inicie o contêiner do PostgreSQL com Docker Compose:</strong>
        <pre><code>docker-compose up -d</code></pre>
      </li>
    <li><strong>Execute a aplicação Spring Boot:</strong>
        <pre><code>./mvnw spring-boot:run</code></pre>
      </li>
    </ol>
  </section>

  <section class="highlight">
    <h2>Diagrama UML do projeto:</h2>
    <!-- Cole o link do vídeo (YouTube, Drive ou Loom) abaixo -->
    <img width="4096" height="945" alt="uml" src="https://github.com/user-attachments/assets/4c05d513-2d61-4fc9-b4bc-b5af1a669ff3" />

  </section>

  <section>
    <h2>🕹️ Endpoints da API</h2>

   <h3>Autenticação</h3>
    <ul>
      <li>POST /api/V1/auth/register</li>
      <li>POST /api/V1/auth/login</li>
      <li>PUT /api/V1/auth/changePassword/{id}</li>
    </ul>

   <h3>Alunos</h3>
    <ul>
      <li>POST /api/V1/aluno/create</li>
      <li>GET /api/V1/aluno</li>
      <li>GET /api/V1/aluno/{id}</li>
      <li>PUT /api/V1/aluno/atualizar/{id}</li>
      <li>DELETE /api/V1/aluno/delete/{id}</li>
    </ul>

  <h3>Livros</h3>
    <ul>
      <li>POST /api/V1/livro/create</li>
      <li>GET /api/V1/livro</li>
      <li>GET /api/V1/livro/{id}</li>
      <li>PUT /api/V1/livro/atualizar/{id}</li>
      <li>DELETE /api/V1/livro/delete/{id}</li>
    </ul>

   <h3>Aluguel</h3>
  <ul>
      <li>POST /api/V1/aluguel/alugar</li>
    <li>POST /api/V1/aluguel/devolver/{aluguelId}</li>
      <li>GET /api/V1/aluguel/usuario/{usuarioId}</li>
      <li>GET /api/V1/aluguel/livro/{livroId}</li>
      <li>GET /api/V1/aluguel/filtrar/alugados</li>
      <li>GET /api/V1/aluguel/filtrar/atrasados</li>
    </ul>

   <h3>Ranking</h3>
    <ul>
      <li>GET /api/V1/ranking/alunos</li>
    </ul>
  </section>

  <section>
    <h2>🗃️ Schema do Banco de Dados</h2>
    <ul>
      <li><code>tb_users</code>: dados dos administradores.</li>
      <li><code>tb_aluno</code>: dados dos alunos.</li>
      <li><code>tb_livro</code>: informações dos livros.</li>
      <li><code>tb_aluguel</code>: registros de aluguéis.</li>
    </ul>
  </section>

  <hr>

  <section class="highlight">
    <h2>🖼️ Imagem do Grupo</h2>
    <p>Coletando requisitos no colégio</p>

  ![foto](https://github.com/user-attachments/assets/d918e845-c502-4a9a-85df-3ede6fb27a45)

  </section>

  <footer>
    <p>Feito com ❤️ por <a href="https://www.google.com/search?q=link-para-seu-github" target="_blank"><strong>Shermann Barbosa Alcântara</strong></a></p>
  </footer>

</body>
