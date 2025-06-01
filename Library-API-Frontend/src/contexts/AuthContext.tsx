import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import { useToast } from "@/hooks/use-toast";
import { authService } from "../services/authService";

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string, accessCode: string) => Promise<void>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const { toast } = useToast();

  // Verificar autenticação ao carregar a página
  useEffect(() => {
    const checkAuth = async () => {
      try {
        const token = localStorage.getItem("library_token");
        if (token) {
          const { user } = await authService.validateToken();
          setUser(user);
        }
      } catch (error) {
        // Token inválido, então removemos
        localStorage.removeItem("library_token");
        localStorage.removeItem("library_user");
        setUser(null);
        console.error("Erro ao validar token:", error);
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setLoading(true);

      // Informar usuário sobre tentativa de login
      toast({
        title: "Conectando ao servidor",
        description: "Tentando fazer login...",
      });

      const { user, token } = await authService.login({ email, password });

      localStorage.setItem("library_token", token);
      localStorage.setItem("library_user", JSON.stringify(user));

      setUser(user);
      toast({
        title: "Login realizado com sucesso",
        description: "Bem-vindo ao sistema da biblioteca",
      });
    } catch (error: any) {
      console.error("Erro de login:", error);

      let errorMessage = "Credenciais inválidas";

      if (error?.code === 'ERR_NETWORK') {
        errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando em http://localhost:8080.";
      } else if (error?.response?.status === 401) {
        errorMessage = "Email ou senha incorretos.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Acesso negado. Verifique suas credenciais.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao realizar login",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const register = async (name: string, email: string, password: string, accessCode: string) => {
    try {
      setLoading(true);

      const { user, token } = await authService.register({
        name,
        email,
        password,
        accessCode
      });

      localStorage.setItem("library_token", token);
      localStorage.setItem("library_user", JSON.stringify(user));

      setUser(user);
      toast({
        title: "Cadastro realizado com sucesso",
        description: "Sua conta foi criada com sucesso",
      });
    } catch (error: any) {
      console.error("Erro de registro:", error);

      let errorMessage = "Não foi possível criar a conta";

      if (error?.code === 'ERR_NETWORK') {
        errorMessage = "Não foi possível conectar ao servidor. Verifique se o backend está rodando.";
      } else if (error?.response?.status === 400) {
        errorMessage = "Dados inválidos. Verifique se o email está no formato correto (@cm.cb.ce.gov.br) e se o código de acesso está correto.";
      } else if (error?.response?.status === 403) {
        errorMessage = "Código de registro inválido.";
      } else if (error?.response?.data?.message) {
        errorMessage = error.response.data.message;
      } else if (error instanceof Error) {
        errorMessage = error.message;
      }

      toast({
        title: "Erro ao realizar cadastro",
        description: errorMessage,
        variant: "destructive",
      });
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem("library_token");
    localStorage.removeItem("library_user");
    setUser(null);
    toast({
      title: "Logout realizado com sucesso",
      description: "Você saiu do sistema com sucesso",
    });
  };

  return (
    <AuthContext.Provider value={{
      user,
      loading,
      login,
      register,
      logout,
      isAuthenticated: !!user
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
