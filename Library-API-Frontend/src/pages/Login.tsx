import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Login = () => {
  const { login } = useAuth();

  const handleLogin = async (data: { email: string; password: string }) => {
    await login(data.email, data.password);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-4 auth-container">
      <div className="flex flex-col md:flex-row items-center justify-center gap-8 w-full max-w-4xl">
        <div className="text-center">
          <img
            src="https://www.cm.cb.ce.gov.br/wp-content/uploads/sites/62/2018/11/logo-CMCB.png"
            alt="Logo CMCB"
            className="h-32 w-auto mb-4"
          />
          <h1 className="text-2xl font-bold text-white">Biblioteca CMCB</h1>
        </div>
        <div className="w-full max-w-md">
          <AuthForm type="login" onSubmit={handleLogin} />
        </div>
      </div>
    </div>
  );
};

export default Login;