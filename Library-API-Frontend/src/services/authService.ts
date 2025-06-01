import api from "./api";

interface LoginRequest {
  username: string;
  password: string;
}

interface RegisterRequest {
  username: string;
  password: string;
  confirmPassword: string;
  registrationCode: string;
}

interface LoginResponse {
  token: string;
}

interface RegisterResponse {
  id: number;
  username: string;
}

interface AuthResponse {
  token: string;
  user: {
    id: string;
    name: string;
    email: string;
    role: string;
  };
}

const login = async (credentials: { email: string; password: string }): Promise<AuthResponse> => {
    const loginData: LoginRequest = {
      username: credentials.email,
      password: credentials.password
    };

    const response = await api.post("/auth/login", loginData);
    const loginResponse: LoginResponse = response.data;
    
    const user = {
      id: "1",
      name: credentials.email.split('@')[0],
      email: credentials.email,
      role: "ADMIN"
    };

    return {
      token: loginResponse.token,
      user
    };
};

export const authService = {
  login,

  register: async (userData: { name: string; email: string; password: string; accessCode: string }): Promise<AuthResponse> => {
    const registerData: RegisterRequest = {
      username: userData.email,
      password: userData.password,
      confirmPassword: userData.password,
      registrationCode: userData.accessCode
    };

    try {
    const response = await api.post("/auth/register", registerData);
    const registerResponse: RegisterResponse = response.data;
    
      return login({ email: userData.email, password: userData.password });
    } catch (error) {
      console.error('Erro durante o registro:', error);
      throw error;
    }
  },

  validateToken: async (): Promise<AuthResponse> => {
    const token = localStorage.getItem("library_token");
    const userStr = localStorage.getItem("library_user");
    
    if (!token || !userStr) {
      throw new Error("Token ou usuário não encontrado");
    }

    try {
      const user = JSON.parse(userStr);
      
      return {
        token,
        user
      };
    } catch (error) {
      throw new Error("Dados do usuário inválidos");
    }
  }
};
