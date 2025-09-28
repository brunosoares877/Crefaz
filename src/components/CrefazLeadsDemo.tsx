import React, { useState, useEffect } from 'react'
import { leadsService } from '../services/leadsService'
import { crefazApi } from '../services/crefazApiClient'
import type { Lead, CreateLeadRequest, LeadFilters } from '../types/crefazApi'

interface CrefazLeadsDemoProps {
  className?: string
}

export const CrefazLeadsDemo: React.FC<CrefazLeadsDemoProps> = ({ className = '' }) => {
  // Estados
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  
  // Estados do formulário
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [formData, setFormData] = useState<CreateLeadRequest>({
    nome: '',
    cpf: '',
    email: '',
    telefone: '',
    whatsapp: '',
    origem: 'SITE_WEB',
    observacoes: ''
  })

  // Verificar conexão ao montar o componente
  useEffect(() => {
    checkConnection()
  }, [])

  // Verificar conexão com a API
  const checkConnection = async () => {
    try {
      setConnectionStatus('checking')
      const isHealthy = await crefazApi.healthCheck()
      setConnectionStatus(isHealthy ? 'connected' : 'error')
      
      if (isHealthy) {
        loadLeads()
      }
    } catch (error) {
      console.error('Erro ao verificar conexão:', error)
      setConnectionStatus('error')
    }
  }

  // Carregar leads
  const loadLeads = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const filters: LeadFilters = {
        limit: 10,
        sortBy: 'createdAt',
        sortOrder: 'desc'
      }
      
      const response = await leadsService.getLeads(filters)
      setLeads(response.data)
      
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      setError('Erro ao carregar leads: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Criar novo lead
  const createLead = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      setLoading(true)
      setError(null)
      setSuccess(null)
      
      const newLead = await leadsService.createLead(formData)
      
      setSuccess(`Lead "${newLead.nome}" criado com sucesso!`)
      setShowCreateForm(false)
      setFormData({
        nome: '',
        cpf: '',
        email: '',
        telefone: '',
        whatsapp: '',
        origem: 'SITE_WEB',
        observacoes: ''
      })
      
      // Recarregar lista
      await loadLeads()
      
    } catch (error) {
      console.error('Erro ao criar lead:', error)
      setError('Erro ao criar lead: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Atualizar status do lead
  const updateLeadStatus = async (leadId: string, newStatus: Lead['status']) => {
    try {
      setLoading(true)
      setError(null)
      
      await leadsService.updateLeadStatus(leadId, newStatus)
      setSuccess('Status do lead atualizado com sucesso!')
      
      // Recarregar lista
      await loadLeads()
      
    } catch (error) {
      console.error('Erro ao atualizar status:', error)
      setError('Erro ao atualizar status: ' + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  // Limpar mensagens após 5 segundos
  useEffect(() => {
    if (error || success) {
      const timer = setTimeout(() => {
        setError(null)
        setSuccess(null)
      }, 5000)
      
      return () => clearTimeout(timer)
    }
  }, [error, success])

  // Renderizar status de conexão
  const renderConnectionStatus = () => {
    const statusConfig = {
      checking: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Verificando conexão...' },
      connected: { color: 'text-green-600', bg: 'bg-green-100', text: 'Conectado à API Crefaz On' },
      error: { color: 'text-red-600', bg: 'bg-red-100', text: 'Erro na conexão com API' }
    }
    
    const config = statusConfig[connectionStatus]
    
    return (
      <div className={`p-3 rounded-lg ${config.bg} ${config.color} text-sm font-medium`}>
        {config.text}
      </div>
    )
  }

  // Renderizar informações do token
  const renderTokenInfo = () => {
    const tokenInfo = crefazApi.getTokenInfo()
    
    return (
      <div className="text-xs text-gray-500 mt-2">
        Token: {tokenInfo.hasToken ? '✅' : '❌'} | 
        Válido: {tokenInfo.isValid ? '✅' : '❌'} |
        Expira: {tokenInfo.expiresAt ? new Date(tokenInfo.expiresAt).toLocaleString() : 'N/A'}
      </div>
    )
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
      {/* Cabeçalho */}
      <div className="mb-6">
        <h2 className="text-2xl font-bold text-gray-800 mb-2">
          Demo - Integração API Crefaz On
        </h2>
        <p className="text-gray-600">
          Demonstração da integração com a API de Leads do Crefaz On
        </p>
        
        {/* Status da conexão */}
        <div className="mt-4">
          {renderConnectionStatus()}
          {connectionStatus === 'connected' && renderTokenInfo()}
        </div>
      </div>

      {/* Mensagens */}
      {error && (
        <div className="mb-4 p-3 bg-red-100 text-red-700 rounded-lg">
          ❌ {error}
        </div>
      )}
      
      {success && (
        <div className="mb-4 p-3 bg-green-100 text-green-700 rounded-lg">
          ✅ {success}
        </div>
      )}

      {/* Ações */}
      <div className="mb-6 flex gap-3 flex-wrap">
        <button
          onClick={checkConnection}
          disabled={loading}
          className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50"
        >
          {loading ? 'Verificando...' : 'Testar Conexão'}
        </button>
        
        <button
          onClick={loadLeads}
          disabled={loading || connectionStatus !== 'connected'}
          className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
        >
          {loading ? 'Carregando...' : 'Carregar Leads'}
        </button>
        
        <button
          onClick={() => setShowCreateForm(!showCreateForm)}
          disabled={connectionStatus !== 'connected'}
          className="px-4 py-2 bg-purple-500 text-white rounded hover:bg-purple-600 disabled:opacity-50"
        >
          {showCreateForm ? 'Cancelar' : 'Novo Lead'}
        </button>
      </div>

      {/* Formulário de criação */}
      {showCreateForm && (
        <div className="mb-6 p-4 border rounded-lg bg-gray-50">
          <h3 className="text-lg font-semibold mb-4">Criar Novo Lead</h3>
          
          <form onSubmit={createLead} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Nome *
                </label>
                <input
                  type="text"
                  value={formData.nome}
                  onChange={(e) => setFormData({ ...formData, nome: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  CPF *
                </label>
                <input
                  type="text"
                  value={formData.cpf}
                  onChange={(e) => setFormData({ ...formData, cpf: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="12345678901"
                  required
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Email
                </label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Telefone
                </label>
                <input
                  type="text"
                  value={formData.telefone}
                  onChange={(e) => setFormData({ ...formData, telefone: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  WhatsApp
                </label>
                <input
                  type="text"
                  value={formData.whatsapp}
                  onChange={(e) => setFormData({ ...formData, whatsapp: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="(11) 99999-9999"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Origem *
                </label>
                <select
                  value={formData.origem}
                  onChange={(e) => setFormData({ ...formData, origem: e.target.value })}
                  className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="SITE_WEB">Site Web</option>
                  <option value="FACEBOOK">Facebook</option>
                  <option value="GOOGLE">Google</option>
                  <option value="WHATSAPP">WhatsApp</option>
                  <option value="TELEFONE">Telefone</option>
                  <option value="INDICACAO">Indicação</option>
                </select>
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Observações
              </label>
              <textarea
                value={formData.observacoes}
                onChange={(e) => setFormData({ ...formData, observacoes: e.target.value })}
                className="w-full p-2 border rounded focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
            </div>
            
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={loading}
                className="px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 disabled:opacity-50"
              >
                {loading ? 'Criando...' : 'Criar Lead'}
              </button>
              
              <button
                type="button"
                onClick={() => setShowCreateForm(false)}
                className="px-6 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
              >
                Cancelar
              </button>
            </div>
          </form>
        </div>
      )}

      {/* Lista de leads */}
      <div>
        <h3 className="text-lg font-semibold mb-4">
          Leads Recentes ({leads.length})
        </h3>
        
        {loading && (
          <div className="text-center py-8">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto"></div>
            <p className="mt-2 text-gray-600">Carregando...</p>
          </div>
        )}
        
        {!loading && leads.length === 0 && (
          <div className="text-center py-8 text-gray-500">
            Nenhum lead encontrado
          </div>
        )}
        
        {!loading && leads.length > 0 && (
          <div className="space-y-3">
            {leads.map((lead) => (
              <div key={lead.id} className="border rounded-lg p-4 bg-gray-50">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <h4 className="font-semibold text-gray-800">{lead.nome}</h4>
                    <p className="text-sm text-gray-600">CPF: {lead.cpf}</p>
                    {lead.email && <p className="text-sm text-gray-600">Email: {lead.email}</p>}
                    {lead.telefone && <p className="text-sm text-gray-600">Tel: {lead.telefone}</p>}
                  </div>
                  
                  <div className="text-right">
                    <span className={`px-2 py-1 rounded text-xs font-medium ${
                      lead.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                      lead.status === 'contatado' ? 'bg-yellow-100 text-yellow-800' :
                      lead.status === 'convertido' ? 'bg-green-100 text-green-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {lead.status}
                    </span>
                  </div>
                </div>
                
                <div className="flex gap-2 mt-3">
                  {lead.status === 'novo' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'contatado')}
                      disabled={loading}
                      className="px-3 py-1 bg-yellow-500 text-white text-sm rounded hover:bg-yellow-600 disabled:opacity-50"
                    >
                      Marcar como Contatado
                    </button>
                  )}
                  
                  {lead.status === 'contatado' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'interessado')}
                      disabled={loading}
                      className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600 disabled:opacity-50"
                    >
                      Marcar como Interessado
                    </button>
                  )}
                  
                  {lead.status === 'interessado' && (
                    <button
                      onClick={() => updateLeadStatus(lead.id, 'convertido')}
                      disabled={loading}
                      className="px-3 py-1 bg-green-500 text-white text-sm rounded hover:bg-green-600 disabled:opacity-50"
                    >
                      Converter
                    </button>
                  )}
                </div>
                
                {lead.observacoes && (
                  <p className="text-sm text-gray-600 mt-2 italic">
                    "{lead.observacoes}"
                  </p>
                )}
                
                <div className="text-xs text-gray-400 mt-2">
                  Criado: {new Date(lead.createdAt).toLocaleString()} | 
                  Origem: {lead.origem} |
                  {lead.tags && ` Tags: ${lead.tags.join(', ')}`}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default CrefazLeadsDemo
