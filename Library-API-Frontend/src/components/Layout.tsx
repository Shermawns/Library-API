import { useState, ReactNode } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { 
  BookOpen, 
  BookPlus, 
  Home, 
  LogOut, 
  Menu, 
  X 
} from "lucide-react";

interface LayoutProps {
  children: ReactNode;
}

const Layout = ({ children }: LayoutProps) => {
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const navItems = [
    { path: "/dashboard", icon: <Home size={18} />, label: "Dashboard" },
    { path: "/add-book", icon: <BookPlus size={18} />, label: "Adicionar Livro" },
    { path: "/book-loans", icon: <BookOpen size={18} />, label: "Empréstimos" },
  ];

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      {/* header */}
      <header className="cmcb-header-gradient shadow-md">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="relative flex justify-between items-center h-16">
            {/* logo e botao menu mobile */}
            <div className="flex items-center">
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="md:hidden p-2 rounded-md text-white hover:bg-cmcbDarkGreen focus:outline-none"
              >
                {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
              </button>
              <div className="flex-shrink-0 flex items-center">
                <img
                  className="h-12 w-auto"
                  src="https://www.cm.cb.ce.gov.br/wp-content/uploads/sites/62/2018/11/logo-CMCB.png"
                  alt="Logo Biblioteca CMCB"
                />
                <span className="ml-2 text-xl font-semibold text-white">
                  Biblioteca CMCB
                </span>
              </div>
            </div>

            {/* navegação do desktop */}
            <nav className="hidden md:flex md:space-x-4">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium transition-colors duration-150 ${
                    location.pathname === item.path
                      ? "bg-white text-cmcbGreen"
                      : "text-white hover:bg-white/10"
                  }`}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* menu do user e logout */}
            <div className="flex items-center">
              <span className="hidden md:block text-sm font-medium text-white mr-4">
                Olá, {user?.name}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={handleLogout}
                className="flex items-center bg-white text-cmcbGreen hover:bg-gray-100 hover:text-cmcbDarkGreen"
              >
                <LogOut size={16} className="mr-2" />
                Sair
              </Button>
            </div>
          </div>
        </div>

        {/* menu de navegação mobile */}
        {mobileMenuOpen && (
          <div className="md:hidden">
            <div className="px-2 pt-2 pb-3 space-y-1 bg-white/10">
              {navItems.map((item) => (
                <Link
                  key={item.path}
                  to={item.path}
                  className={`flex items-center px-3 py-2 rounded-md text-sm font-medium ${
                    location.pathname === item.path
                      ? "bg-white text-cmcbGreen"
                      : "text-white hover:bg-white/10"
                  }`}
                  onClick={() => setMobileMenuOpen(false)}
                >
                  <span className="mr-2">{item.icon}</span>
                  {item.label}
                </Link>
              ))}
            </div>
          </div>
        )}
      </header>

      {/* conteudo principal */}
      <main className="flex-1 relative z-0 overflow-y-auto focus:outline-none py-6 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto animate-fade-in">
          {children}
        </div>
      </main>
      
      {/* footer gradient */}
      <div className="cmcb-footer-gradient w-full"></div>
    </div>
  );
};

export default Layout;