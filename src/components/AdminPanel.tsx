import React, { useState } from 'react'
import CrefazDashboard from './CrefazDashboard'
import CrefazLeadsDemo from './CrefazLeadsDemo'
import LocalLeadsManager from './LocalLeadsManager'
import { useNavigation } from '../contexts/NavigationContext'

interface AdminPanelProps {
  className?: string
}

type AdminSection = 'dashboard' | 'leads' | 'clients' | 'proposals' | 'contracts' | 'documents' | 'users' | 'products'

export const AdminPanel: React.FC<AdminPanelProps> = ({ className = '' }) => {
  const [activeSection, setActiveSection] = useState<AdminSection>('dashboard')
  const { navigateTo } = useNavigation()

  const adminSections = [
    { id: 'dashboard' as AdminSection, name: 'Dashboard', icon: '📊', description: 'Métricas e indicadores' },
    { id: 'leads' as AdminSection, name: 'Leads', icon: '👥', description: 'Gestão de leads' },
    { id: 'clients' as AdminSection, name: 'Clientes', icon: '🏢', description: 'Gestão de clientes' },
    { id: 'proposals' as AdminSection, name: 'Propostas', icon: '📋', description: 'Propostas de crédito' },
    { id: 'contracts' as AdminSection, name: 'Contratos', icon: '📄', description: 'Contratos ativos' },
    { id: 'documents' as AdminSection, name: 'Documentos', icon: '📁', description: 'Documentos e aprovações' },
    { id: 'users' as AdminSection, name: 'Usuários', icon: '👤', description: 'Gestão de usuários' },
    { id: 'products' as AdminSection, name: 'Produtos', icon: '💳', description: 'Produtos financeiros' }
  ]

  const renderSectionContent = () => {
    switch (activeSection) {
      case 'dashboard':
        return <CrefazDashboard />
      case 'leads':
        return <LocalLeadsManager />
      case 'clients':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Clientes</h2>
            <p className="text-gray-600 mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <h3 className="font-semibold text-blue-800 mb-2">Funcionalidades Planejadas:</h3>
              <ul className="text-blue-700 space-y-1">
                <li>• Listagem completa de clientes</li>
                <li>• Análise de score de crédito</li>
                <li>• Histórico de relacionamento</li>
                <li>• Comunicação (SMS/Email)</li>
              </ul>
            </div>
          </div>
        )
      case 'proposals':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Propostas</h2>
            <p className="text-gray-600 mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="bg-green-50 border border-green-200 rounded-lg p-4">
              <h3 className="font-semibold text-green-800 mb-2">Funcionalidades Planejadas:</h3>
              <ul className="text-green-700 space-y-1">
                <li>• Criação e edição de propostas</li>
                <li>• Simulações financeiras</li>
                <li>• Aprovação/rejeição</li>
                <li>• Geração de contratos</li>
              </ul>
            </div>
          </div>
        )
      case 'contracts':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Contratos</h2>
            <p className="text-gray-600 mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="bg-purple-50 border border-purple-200 rounded-lg p-4">
              <h3 className="font-semibold text-purple-800 mb-2">Funcionalidades Planejadas:</h3>
              <ul className="text-purple-700 space-y-1">
                <li>• Controle de parcelas</li>
                <li>• Registro de pagamentos</li>
                <li>• Geração de boletos</li>
                <li>• Gestão de inadimplência</li>
              </ul>
            </div>
          </div>
        )
      case 'documents':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Documentos</h2>
            <p className="text-gray-600 mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
              <h3 className="font-semibold text-yellow-800 mb-2">Funcionalidades Planejadas:</h3>
              <ul className="text-yellow-700 space-y-1">
                <li>• Upload de documentos</li>
                <li>• Aprovação/rejeição</li>
                <li>• Download e visualização</li>
                <li>• Organização por cliente</li>
              </ul>
            </div>
          </div>
        )
      case 'users':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Usuários</h2>
            <p className="text-gray-600 mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="bg-red-50 border border-red-200 rounded-lg p-4">
              <h3 className="font-semibold text-red-800 mb-2">Funcionalidades Planejadas:</h3>
              <ul className="text-red-700 space-y-1">
                <li>• Criação de usuários</li>
                <li>• Controle de permissões</li>
                <li>• Roles e departamentos</li>
                <li>• Ativação/desativação</li>
              </ul>
            </div>
          </div>
        )
      case 'products':
        return (
          <div className="bg-white rounded-lg shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-800 mb-4">Gestão de Produtos</h2>
            <p className="text-gray-600 mb-4">Funcionalidade em desenvolvimento...</p>
            <div className="bg-indigo-50 border border-indigo-200 rounded-lg p-4">
              <h3 className="font-semibold text-indigo-800 mb-2">Funcionalidades Planejadas:</h3>
              <ul className="text-indigo-700 space-y-1">
                <li>• Catálogo de produtos</li>
                <li>• Simulações financeiras</li>
                <li>• Configuração de taxas</li>
                <li>• Ativação/desativação</li>
              </ul>
            </div>
          </div>
        )
      default:
        return <CrefazDashboard />
    }
  }

  return (
    <div className={`min-h-screen bg-gray-100 ${className}`}>
      {/* Header do Painel Admin */}
      <div className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-2">
                <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                  <span className="text-white font-bold text-sm">A</span>
                </div>
                <div>
                  <h1 className="text-xl font-bold text-gray-900">Admin Panel</h1>
                  <p className="text-xs text-gray-500">Crefaz On Integration</p>
                </div>
              </div>
            </div>
            
            <div className="flex items-center space-x-4">
              <button
                onClick={() => navigateTo('home')}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                ← Voltar ao Site
              </button>
              
              <div className="flex items-center space-x-2 text-sm text-gray-500">
                <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                <span>Sistema Online</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex gap-8">
          {/* Sidebar de Navegação */}
          <div className="w-64 flex-shrink-0">
            <div className="bg-white rounded-lg shadow-sm p-4">
              <h2 className="text-lg font-semibold text-gray-800 mb-4">Seções</h2>
              <nav className="space-y-2">
                {adminSections.map((section) => (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center space-x-3 px-3 py-2 rounded-lg text-left transition-colors ${
                      activeSection === section.id
                        ? 'bg-blue-100 text-blue-700 border border-blue-200'
                        : 'text-gray-600 hover:bg-gray-100'
                    }`}
                  >
                    <span className="text-lg">{section.icon}</span>
                    <div className="flex-1 min-w-0">
                      <p className="font-medium truncate">{section.name}</p>
                      <p className="text-xs text-gray-500 truncate">{section.description}</p>
                    </div>
                  </button>
                ))}
              </nav>
            </div>

            {/* Estatísticas Rápidas */}
            <div className="mt-6 bg-white rounded-lg shadow-sm p-4">
              <h3 className="text-sm font-semibold text-gray-800 mb-3">Resumo</h3>
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Leads Hoje</span>
                  <span className="text-sm font-semibold text-blue-600">12</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Propostas</span>
                  <span className="text-sm font-semibold text-green-600">8</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Contratos</span>
                  <span className="text-sm font-semibold text-purple-600">5</span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-xs text-gray-600">Pendências</span>
                  <span className="text-sm font-semibold text-red-600">3</span>
                </div>
              </div>
            </div>
          </div>

          {/* Conteúdo Principal */}
          <div className="flex-1 min-w-0">
            {renderSectionContent()}
          </div>
        </div>
      </div>
    </div>
  )
}

export default AdminPanel
