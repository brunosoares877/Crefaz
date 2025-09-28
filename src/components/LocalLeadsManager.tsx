import React, { useState, useEffect } from 'react'

interface Lead {
  id: string
  nome: string
  whatsapp: string
  cpf: string
  dataNascimento: string
  companhiaEnergia: string
  observacoes?: string
  createdAt: string
}

export const LocalLeadsManager: React.FC = () => {
  const [leads, setLeads] = useState<Lead[]>([])
  const [loading, setLoading] = useState(true)

  // Carregar leads do localStorage
  useEffect(() => {
    loadLeads()
  }, [])

  const loadLeads = () => {
    try {
      setLoading(true)
      const savedLeads = JSON.parse(localStorage.getItem('leads') || '[]')
      // Ordenar por data de criação (mais recente primeiro)
      const sortedLeads = savedLeads.sort((a: Lead, b: Lead) => 
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      )
      setLeads(sortedLeads)
    } catch (error) {
      console.error('Erro ao carregar leads:', error)
      setLeads([])
    } finally {
      setLoading(false)
    }
  }

  // Deletar lead
  const deleteLead = (id: string) => {
    const updatedLeads = leads.filter(lead => lead.id !== id)
    setLeads(updatedLeads)
    localStorage.setItem('leads', JSON.stringify(updatedLeads))
  }

  // Limpar todos os leads
  const clearAllLeads = () => {
    if (window.confirm('Tem certeza que deseja limpar todos os leads?')) {
      setLeads([])
      localStorage.removeItem('leads')
    }
  }

  // Exportar leads para JSON
  const exportLeads = () => {
    const dataStr = JSON.stringify(leads, null, 2)
    const dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr)
    
    const exportFileDefaultName = `leads-${new Date().toISOString().split('T')[0]}.json`
    
    const linkElement = document.createElement('a')
    linkElement.setAttribute('href', dataUri)
    linkElement.setAttribute('download', exportFileDefaultName)
    linkElement.click()
  }

  // Enviar lead para WhatsApp
  const sendToWhatsApp = (lead: Lead) => {
    const phoneNumber = '5584994616051' // Número da empresa
    const message = `🆕 *Novo Lead - Simulação de Crédito*

👤 *Nome:* ${lead.nome}
📱 *WhatsApp:* ${lead.whatsapp}
🆔 *CPF:* ${lead.cpf}
📅 *Nascimento:* ${lead.dataNascimento}
⚡ *Companhia:* ${lead.companhiaEnergia}
📅 *Cadastro:* ${new Date(lead.createdAt).toLocaleString()}

💰 Cliente interessado em simulação de crédito com débito na conta de luz.`

    const encodedMessage = encodeURIComponent(message)
    const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodedMessage}`
    window.open(whatsappUrl, '_blank')
  }

  return (
    <div style={{ backgroundColor: 'white', borderRadius: '0.5rem', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)', padding: '1.5rem' }}>
      {/* Cabeçalho */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937', marginBottom: '0.5rem' }}>
            Gestão de Leads
          </h2>
          <p style={{ color: '#6b7280' }}>
            Leads cadastrados através do formulário do site
          </p>
        </div>
        
        <div style={{ display: 'flex', gap: '0.5rem' }}>
          <button
            onClick={loadLeads}
            style={{
              padding: '0.5rem 1rem',
              backgroundColor: '#3b82f6',
              color: 'white',
              border: 'none',
              borderRadius: '0.375rem',
              cursor: 'pointer',
              fontSize: '0.875rem'
            }}
          >
            🔄 Atualizar
          </button>
          
          {leads.length > 0 && (
            <>
              <button
                onClick={exportLeads}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#10b981',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                📥 Exportar
              </button>
              
              <button
                onClick={clearAllLeads}
                style={{
                  padding: '0.5rem 1rem',
                  backgroundColor: '#ef4444',
                  color: 'white',
                  border: 'none',
                  borderRadius: '0.375rem',
                  cursor: 'pointer',
                  fontSize: '0.875rem'
                }}
              >
                🗑️ Limpar
              </button>
            </>
          )}
        </div>
      </div>

      {/* Estatísticas */}
      <div style={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', 
        gap: '1rem', 
        marginBottom: '1.5rem' 
      }}>
        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Total de Leads</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>{leads.length}</p>
        </div>
        
        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Hoje</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            {leads.filter(lead => {
              const today = new Date().toDateString()
              const leadDate = new Date(lead.createdAt).toDateString()
              return today === leadDate
            }).length}
          </p>
        </div>
        
        <div style={{ backgroundColor: '#f3f4f6', padding: '1rem', borderRadius: '0.5rem' }}>
          <p style={{ fontSize: '0.875rem', color: '#6b7280', marginBottom: '0.25rem' }}>Esta Semana</p>
          <p style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#1f2937' }}>
            {leads.filter(lead => {
              const weekAgo = new Date()
              weekAgo.setDate(weekAgo.getDate() - 7)
              return new Date(lead.createdAt) > weekAgo
            }).length}
          </p>
        </div>
      </div>

      {/* Lista de Leads */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>
          <div style={{
            width: '2rem',
            height: '2rem',
            border: '2px solid #f3f4f6',
            borderTop: '2px solid #3b82f6',
            borderRadius: '50%',
            animation: 'spin 1s linear infinite',
            margin: '0 auto 1rem'
          }}></div>
          <p style={{ color: '#6b7280' }}>Carregando leads...</p>
        </div>
      ) : leads.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6b7280' }}>
          <div style={{ fontSize: '3rem', marginBottom: '1rem' }}>👥</div>
          <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>
            Nenhum lead encontrado
          </h3>
          <p style={{ fontSize: '0.875rem' }}>
            Os leads cadastrados no formulário aparecerão aqui
          </p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
          {leads.map((lead) => (
            <div 
              key={lead.id} 
              style={{
                border: '1px solid #e5e7eb',
                borderRadius: '0.5rem',
                padding: '1rem',
                backgroundColor: '#f9fafb'
              }}
            >
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'start', marginBottom: '0.75rem' }}>
                <div style={{ flex: 1 }}>
                  <h4 style={{ fontSize: '1.125rem', fontWeight: '600', color: '#1f2937', marginBottom: '0.25rem' }}>
                    {lead.nome}
                  </h4>
                  <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '0.5rem' }}>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      📱 {lead.whatsapp}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      🆔 {lead.cpf}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      📅 {lead.dataNascimento}
                    </p>
                    <p style={{ fontSize: '0.875rem', color: '#6b7280' }}>
                      ⚡ {lead.companhiaEnergia}
                    </p>
                  </div>
                </div>
                
                <div style={{ display: 'flex', gap: '0.5rem', flexShrink: 0 }}>
                  <button
                    onClick={() => sendToWhatsApp(lead)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#10b981',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                    title="Enviar para WhatsApp"
                  >
                    💬
                  </button>
                  
                  <button
                    onClick={() => deleteLead(lead.id)}
                    style={{
                      padding: '0.5rem',
                      backgroundColor: '#ef4444',
                      color: 'white',
                      border: 'none',
                      borderRadius: '0.375rem',
                      cursor: 'pointer',
                      fontSize: '0.75rem'
                    }}
                    title="Deletar lead"
                  >
                    🗑️
                  </button>
                </div>
              </div>
              
              {lead.observacoes && (
                <p style={{ fontSize: '0.875rem', color: '#6b7280', fontStyle: 'italic', marginBottom: '0.5rem' }}>
                  "{lead.observacoes}"
                </p>
              )}
              
              <div style={{ fontSize: '0.75rem', color: '#9ca3af', borderTop: '1px solid #e5e7eb', paddingTop: '0.5rem' }}>
                Cadastrado em: {new Date(lead.createdAt).toLocaleString('pt-BR')}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* CSS para animação */}
      <style>
        {`
          @keyframes spin {
            0% { transform: rotate(0deg); }
            100% { transform: rotate(360deg); }
          }
        `}
      </style>
    </div>
  )
}

export default LocalLeadsManager
