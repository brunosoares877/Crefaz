import React, { useState, useEffect } from 'react'
import { leadsService } from '../services/leadsService'
import { proposalsService } from '../services/proposalsService'
import { clientsService } from '../services/clientsService'
import { documentsService } from '../services/documentsService'
import { crefazApi } from '../services/crefazApiClient'
import type { DashboardMetrics } from '../types/crefazApi'

interface CrefazDashboardProps {
  className?: string
}

interface MetricCard {
  title: string
  value: string | number
  subtitle?: string
  color: 'blue' | 'green' | 'yellow' | 'red' | 'purple' | 'gray'
  trend?: {
    value: number
    isPositive: boolean
  }
}

export const CrefazDashboard: React.FC<CrefazDashboardProps> = ({ className = '' }) => {
  // Estados
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [connectionStatus, setConnectionStatus] = useState<'checking' | 'connected' | 'error'>('checking')
  
  // Estados das métricas
  const [leadsMetrics, setLeadsMetrics] = useState<any>(null)
  const [proposalsMetrics, setProposalsMetrics] = useState<any>(null)
  const [clientsMetrics, setClientsMetrics] = useState<any>(null)
  const [documentsStats, setDocumentsStats] = useState<any>(null)
  
  // Estados dos dados em tempo real
  const [recentLeads, setRecentLeads] = useState<any[]>([])
  const [pendingProposals, setPendingProposals] = useState<any[]>([])
  const [pendingDocuments, setPendingDocuments] = useState<any[]>([])

  // Carregar dados ao montar o componente
  useEffect(() => {
    loadDashboardData()
  }, [])

  // Verificar conexão e carregar dados
  const loadDashboardData = async () => {
    try {
      setLoading(true)
      setError(null)
      setConnectionStatus('checking')
      
      // Verificar conexão
      const isHealthy = await crefazApi.healthCheck()
      if (!isHealthy) {
        setConnectionStatus('error')
        setError('Não foi possível conectar à API Crefaz On')
        return
      }
      
      setConnectionStatus('connected')
      
      // Carregar métricas em paralelo
      const today = new Date()
      const thirtyDaysAgo = new Date(today.getTime() - 30 * 24 * 60 * 60 * 1000)
      
      const dataInicio = thirtyDaysAgo.toISOString().split('T')[0]
      const dataFim = today.toISOString().split('T')[0]
      
      const [
        leadsMetricsData,
        proposalsMetricsData,
        clientsMetricsData,
        documentsStatsData,
        recentLeadsData,
        pendingProposalsData,
        pendingDocumentsData
      ] = await Promise.allSettled([
        leadsService.getLeadsMetrics(dataInicio, dataFim),
        proposalsService.getProposalsMetrics(dataInicio, dataFim),
        clientsService.getClientsMetrics(dataInicio, dataFim),
        documentsService.getDocumentsStats(dataInicio, dataFim),
        leadsService.getLeads({ limit: 5, sortBy: 'createdAt', sortOrder: 'desc' }),
        proposalsService.getPendingProposals(),
        documentsService.getPendingDocuments()
      ])
      
      // Processar resultados
      if (leadsMetricsData.status === 'fulfilled') {
        setLeadsMetrics(leadsMetricsData.value)
      }
      
      if (proposalsMetricsData.status === 'fulfilled') {
        setProposalsMetrics(proposalsMetricsData.value)
      }
      
      if (clientsMetricsData.status === 'fulfilled') {
        setClientsMetrics(clientsMetricsData.value)
      }
      
      if (documentsStatsData.status === 'fulfilled') {
        setDocumentsStats(documentsStatsData.value)
      }
      
      if (recentLeadsData.status === 'fulfilled') {
        setRecentLeads(recentLeadsData.value.data)
      }
      
      if (pendingProposalsData.status === 'fulfilled') {
        setPendingProposals(pendingProposalsData.value)
      }
      
      if (pendingDocumentsData.status === 'fulfilled') {
        setPendingDocuments(pendingDocumentsData.value)
      }
      
    } catch (error) {
      console.error('Erro ao carregar dashboard:', error)
      setError('Erro ao carregar dados do dashboard')
      setConnectionStatus('error')
    } finally {
      setLoading(false)
    }
  }

  // Renderizar card de métrica
  const renderMetricCard = (metric: MetricCard) => {
    const colorClasses = {
      blue: 'bg-blue-500',
      green: 'bg-green-500',
      yellow: 'bg-yellow-500',
      red: 'bg-red-500',
      purple: 'bg-purple-500',
      gray: 'bg-gray-500'
    }

    const bgColorClasses = {
      blue: 'bg-blue-50 border-blue-200',
      green: 'bg-green-50 border-green-200',
      yellow: 'bg-yellow-50 border-yellow-200',
      red: 'bg-red-50 border-red-200',
      purple: 'bg-purple-50 border-purple-200',
      gray: 'bg-gray-50 border-gray-200'
    }

    return (
      <div className={`p-4 rounded-lg border ${bgColorClasses[metric.color]} transition-all hover:shadow-md`}>
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-600 mb-1">{metric.title}</p>
            <p className="text-2xl font-bold text-gray-900">{metric.value}</p>
            {metric.subtitle && (
              <p className="text-xs text-gray-500 mt-1">{metric.subtitle}</p>
            )}
          </div>
          
          {metric.trend && (
            <div className={`flex items-center text-xs font-medium ${
              metric.trend.isPositive ? 'text-green-600' : 'text-red-600'
            }`}>
              <span className="mr-1">
                {metric.trend.isPositive ? '↗' : '↘'}
              </span>
              {Math.abs(metric.trend.value)}%
            </div>
          )}
        </div>
        
        <div className={`w-full h-1 ${colorClasses[metric.color]} rounded-full mt-3 opacity-20`}></div>
      </div>
    )
  }

  // Preparar dados das métricas
  const getMetricCards = (): MetricCard[] => {
    const cards: MetricCard[] = []

    // Métricas de Leads
    if (leadsMetrics) {
      cards.push({
        title: 'Total de Leads',
        value: leadsMetrics.total || 0,
        subtitle: `${leadsMetrics.novos || 0} novos este mês`,
        color: 'blue',
        trend: leadsMetrics.taxaCrescimento ? {
          value: leadsMetrics.taxaCrescimento,
          isPositive: leadsMetrics.taxaCrescimento > 0
        } : undefined
      })

      cards.push({
        title: 'Taxa de Conversão',
        value: `${(leadsMetrics.taxaConversao || 0).toFixed(1)}%`,
        subtitle: `${leadsMetrics.convertidos || 0} leads convertidos`,
        color: 'green',
        trend: leadsMetrics.tendenciaConversao ? {
          value: leadsMetrics.tendenciaConversao,
          isPositive: leadsMetrics.tendenciaConversao > 0
        } : undefined
      })
    }

    // Métricas de Propostas
    if (proposalsMetrics) {
      cards.push({
        title: 'Propostas Enviadas',
        value: proposalsMetrics.enviadas || 0,
        subtitle: `${proposalsMetrics.aprovadas || 0} aprovadas`,
        color: 'purple',
        trend: proposalsMetrics.tendenciaAprovacao ? {
          value: proposalsMetrics.tendenciaAprovacao,
          isPositive: proposalsMetrics.tendenciaAprovacao > 0
        } : undefined
      })

      cards.push({
        title: 'Taxa de Aprovação',
        value: `${(proposalsMetrics.taxaAprovacao || 0).toFixed(1)}%`,
        subtitle: `${proposalsMetrics.rejeitadas || 0} rejeitadas`,
        color: proposalsMetrics.taxaAprovacao > 70 ? 'green' : proposalsMetrics.taxaAprovacao > 50 ? 'yellow' : 'red'
      })

      cards.push({
        title: 'Valor Total Aprovado',
        value: `R$ ${(proposalsMetrics.valorTotalAprovado || 0).toLocaleString('pt-BR')}`,
        subtitle: `Média: R$ ${((proposalsMetrics.valorTotalAprovado || 0) / Math.max(proposalsMetrics.aprovadas || 1, 1)).toLocaleString('pt-BR')}`,
        color: 'green'
      })
    }

    // Métricas de Clientes
    if (clientsMetrics) {
      cards.push({
        title: 'Clientes Ativos',
        value: clientsMetrics.ativos || 0,
        subtitle: `${clientsMetrics.novosClientes || 0} novos este mês`,
        color: 'blue',
        trend: clientsMetrics.crescimentoClientes ? {
          value: clientsMetrics.crescimentoClientes,
          isPositive: clientsMetrics.crescimentoClientes > 0
        } : undefined
      })

      cards.push({
        title: 'Renda Média',
        value: `R$ ${(clientsMetrics.rendaMediaMensal || 0).toLocaleString('pt-BR')}`,
        subtitle: `Idade média: ${clientsMetrics.idadeMedia || 0} anos`,
        color: 'yellow'
      })
    }

    // Métricas de Documentos
    if (documentsStats) {
      cards.push({
        title: 'Documentos Pendentes',
        value: documentsStats.pendentes || 0,
        subtitle: `${documentsStats.aprovados || 0} aprovados hoje`,
        color: documentsStats.pendentes > 10 ? 'red' : documentsStats.pendentes > 5 ? 'yellow' : 'green'
      })
    }

    return cards
  }

  // Renderizar status de conexão
  const renderConnectionStatus = () => {
    const statusConfig = {
      checking: { color: 'text-yellow-600', bg: 'bg-yellow-100', text: 'Verificando conexão...', icon: '⏳' },
      connected: { color: 'text-green-600', bg: 'bg-green-100', text: 'Conectado à API Crefaz On', icon: '✅' },
      error: { color: 'text-red-600', bg: 'bg-red-100', text: 'Erro na conexão com API', icon: '❌' }
    }
    
    const config = statusConfig[connectionStatus]
    
    return (
      <div className={`p-3 rounded-lg ${config.bg} ${config.color} text-sm font-medium flex items-center gap-2`}>
        <span>{config.icon}</span>
        {config.text}
      </div>
    )
  }

  return (
    <div className={`p-6 bg-white rounded-lg shadow-lg ${className}`}>
      {/* Cabeçalho */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h2 className="text-2xl font-bold text-gray-800">
              Dashboard - API Crefaz On
            </h2>
            <p className="text-gray-600">
              Métricas e indicadores em tempo real
            </p>
          </div>
          
          <button
            onClick={loadDashboardData}
            disabled={loading}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 flex items-center gap-2"
          >
            <span>🔄</span>
            {loading ? 'Atualizando...' : 'Atualizar'}
          </button>
        </div>
        
        {/* Status da conexão */}
        {renderConnectionStatus()}
      </div>

      {/* Mensagens de erro */}
      {error && (
        <div className="mb-6 p-4 bg-red-100 text-red-700 rounded-lg">
          ❌ {error}
        </div>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex items-center justify-center py-12">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
          <span className="ml-3 text-gray-600">Carregando métricas...</span>
        </div>
      )}

      {/* Dashboard Content */}
      {!loading && connectionStatus === 'connected' && (
        <>
          {/* Cards de Métricas */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
            {getMetricCards().map((metric, index) => (
              <div key={index}>
                {renderMetricCard(metric)}
              </div>
            ))}
          </div>

          {/* Seções de Dados em Tempo Real */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            {/* Leads Recentes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>👥</span>
                Leads Recentes
              </h3>
              
              {recentLeads.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum lead recente</p>
              ) : (
                <div className="space-y-3">
                  {recentLeads.slice(0, 5).map((lead) => (
                    <div key={lead.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{lead.nome}</p>
                          <p className="text-sm text-gray-600">{lead.telefone || lead.email}</p>
                        </div>
                        <span className={`px-2 py-1 rounded text-xs font-medium ${
                          lead.status === 'novo' ? 'bg-blue-100 text-blue-800' :
                          lead.status === 'contatado' ? 'bg-yellow-100 text-yellow-800' :
                          lead.status === 'convertido' ? 'bg-green-100 text-green-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {lead.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(lead.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Propostas Pendentes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📋</span>
                Propostas Pendentes
              </h3>
              
              {pendingProposals.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhuma proposta pendente</p>
              ) : (
                <div className="space-y-3">
                  {pendingProposals.slice(0, 5).map((proposal) => (
                    <div key={proposal.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">
                            R$ {proposal.valorSolicitado?.toLocaleString('pt-BR')}
                          </p>
                          <p className="text-sm text-gray-600">
                            {proposal.prazoMeses} meses
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {proposal.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        Vence: {new Date(proposal.dataVencimento).toLocaleDateString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Documentos Pendentes */}
            <div className="bg-gray-50 rounded-lg p-4">
              <h3 className="text-lg font-semibold text-gray-800 mb-4 flex items-center gap-2">
                <span>📄</span>
                Documentos Pendentes
              </h3>
              
              {pendingDocuments.length === 0 ? (
                <p className="text-gray-500 text-center py-4">Nenhum documento pendente</p>
              ) : (
                <div className="space-y-3">
                  {pendingDocuments.slice(0, 5).map((document) => (
                    <div key={document.id} className="bg-white p-3 rounded border">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-gray-800">{document.nome}</p>
                          <p className="text-sm text-gray-600 capitalize">
                            {document.tipo.replace('_', ' ')}
                          </p>
                        </div>
                        <span className="px-2 py-1 rounded text-xs font-medium bg-yellow-100 text-yellow-800">
                          {document.status}
                        </span>
                      </div>
                      <p className="text-xs text-gray-400 mt-2">
                        {new Date(document.createdAt).toLocaleString()}
                      </p>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* Informações do Token */}
          <div className="mt-6 p-4 bg-gray-50 rounded-lg">
            <h3 className="text-sm font-semibold text-gray-700 mb-2">Informações da API</h3>
            <div className="text-xs text-gray-500 space-y-1">
              {(() => {
                const tokenInfo = crefazApi.getTokenInfo()
                return (
                  <>
                    <p>Token: {tokenInfo.hasToken ? '✅ Ativo' : '❌ Inativo'}</p>
                    <p>Válido: {tokenInfo.isValid ? '✅ Sim' : '❌ Não'}</p>
                    <p>Expira: {tokenInfo.expiresAt ? new Date(tokenInfo.expiresAt).toLocaleString() : 'N/A'}</p>
                    <p>Última atualização: {new Date().toLocaleString()}</p>
                  </>
                )
              })()}
            </div>
          </div>
        </>
      )}
    </div>
  )
}

export default CrefazDashboard
