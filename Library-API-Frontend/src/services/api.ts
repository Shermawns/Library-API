import axios from "axios";

// URL base da API do Spring Boot
const BASE_URL = "http://localhost:8080/api/V1";

// Criação da instância do axios com configurações padrão
const api = axios.create({
  baseURL: BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
  // Adicionando timeout para evitar esperas muito longas
  timeout: 10000,
});

// Adicionando tratamento de erro mais detalhado
api.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error.code === 'ECONNABORTED') {
      console.error('Timeout na conexão com a API');
    } else if (error.code === 'ERR_NETWORK') {
      console.error('Erro de conexão com a API. Verifique se o servidor está rodando em:', BASE_URL);
    } else {
      console.error('Erro na requisição:', error);
    }
    return Promise.reject(error);
  }
);

// Interceptor para incluir o token JWT em todas as requisições autenticadas
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("library_token");
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default api;
