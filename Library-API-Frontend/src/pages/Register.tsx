import { useAuth } from "../contexts/AuthContext";
import AuthForm from "../components/AuthForm";

const Register = () => {
  const { register } = useAuth();

  const handleRegister = async (data: { 
    name: string; 
    email: string; 
    password: string;
    accessCode: string;
  }) => {
    await register(data.name, data.email, data.password, data.accessCode);
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
          <AuthForm type="register" onSubmit={handleRegister} />
        </div>
      </div>
    </div>
  );
};

export default Register;