import React, { useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  BarChart3,
  Wallet,
  CreditCard,
  PiggyBank,
  Target,
  Settings,
  Menu,
  X,
  LogOut,
  User,
  TrendingUp,
  Receipt
} from 'lucide-react';

const Layout: React.FC = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const { user, logout } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '/dashboard', icon: BarChart3 },
    { name: 'Transações', href: '/transactions', icon: Receipt },
    { name: 'Contas', href: '/accounts', icon: Wallet },
    { name: 'Categorias', href: '/categories', icon: CreditCard },
    { name: 'Orçamentos', href: '/budgets', icon: PiggyBank },
    { name: 'Metas', href: '/goals', icon: Target },
    { name: 'Configurações', href: '/settings', icon: Settings },
  ];

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isActiveRoute = (href: string) => {
    return location.pathname === href;
  };

  return (
    <div className="min-h-screen bg-dark-bg">
      {/* Sidebar para desktop */}
      <div className="hidden lg:fixed lg:inset-y-0 lg:z-50 lg:flex lg:w-64 lg:flex-col">
        <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-dark-card px-6 pb-4 border-r border-dark-border">
          {/* Logo */}
          <div className="flex h-16 shrink-0 items-center">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-light to-navy-medium rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FinançasCRM</span>
            </div>
          </div>

          {/* Navegação */}
          <nav className="flex flex-1 flex-col">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => navigate(item.href)}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-colors
                            ${isActiveRoute(item.href)
                              ? 'bg-navy-light text-white'
                              : 'text-gray-300 hover:text-white hover:bg-dark-hover'
                            }
                          `}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Usuário */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white">
                  <div className="w-8 h-8 bg-navy-light rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Sidebar mobile */}
      <div className={`lg:hidden fixed inset-0 z-50 ${sidebarOpen ? 'block' : 'hidden'}`}>
        <div className="fixed inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
        <div className="fixed inset-y-0 left-0 z-50 w-64 bg-dark-card border-r border-dark-border">
          <div className="flex h-16 shrink-0 items-center px-6">
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 bg-gradient-to-br from-navy-light to-navy-medium rounded-lg flex items-center justify-center">
                <TrendingUp className="w-6 h-6 text-white" />
              </div>
              <span className="text-xl font-bold text-white">FinançasCRM</span>
            </div>
          </div>

          <nav className="flex flex-1 flex-col px-6 pb-4">
            <ul role="list" className="flex flex-1 flex-col gap-y-7">
              <li>
                <ul role="list" className="-mx-2 space-y-1">
                  {navigation.map((item) => {
                    const Icon = item.icon;
                    return (
                      <li key={item.name}>
                        <button
                          onClick={() => {
                            navigate(item.href);
                            setSidebarOpen(false);
                          }}
                          className={`
                            group flex gap-x-3 rounded-md p-2 text-sm leading-6 font-semibold w-full text-left transition-colors
                            ${isActiveRoute(item.href)
                              ? 'bg-navy-light text-white'
                              : 'text-gray-300 hover:text-white hover:bg-dark-hover'
                            }
                          `}
                        >
                          <Icon className="h-6 w-6 shrink-0" />
                          {item.name}
                        </button>
                      </li>
                    );
                  })}
                </ul>
              </li>

              {/* Usuário mobile */}
              <li className="mt-auto">
                <div className="flex items-center gap-x-4 px-2 py-3 text-sm font-semibold leading-6 text-white">
                  <div className="w-8 h-8 bg-navy-light rounded-full flex items-center justify-center">
                    <User className="w-4 h-4" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate">{user?.name}</p>
                    <p className="text-xs text-gray-400 truncate">{user?.email}</p>
                  </div>
                  <button
                    onClick={handleLogout}
                    className="text-gray-400 hover:text-white transition-colors"
                    title="Sair"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              </li>
            </ul>
          </nav>
        </div>
      </div>

      {/* Conteúdo principal */}
      <div className="lg:pl-64">
        {/* Header mobile */}
        <div className="sticky top-0 z-40 flex items-center gap-x-6 bg-dark-card px-4 py-4 shadow-sm border-b border-dark-border lg:hidden">
          <button
            type="button"
            className="-m-2.5 p-2.5 text-gray-300 lg:hidden"
            onClick={() => setSidebarOpen(true)}
          >
            <span className="sr-only">Abrir sidebar</span>
            <Menu className="h-6 w-6" />
          </button>
          <div className="flex-1 text-sm font-semibold leading-6 text-white">
            {navigation.find(item => isActiveRoute(item.href))?.name || 'FinançasCRM'}
          </div>
        </div>

        {/* Conteúdo da página */}
        <main className="py-6">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

export default Layout;
