// Tipos TypeScript para API Crefaz On baseados na documentação

// ============= TIPOS BASE =============

export interface ApiResponse<T = any> {
  data: T
  message?: string
  success: boolean
  timestamp?: string
  errors?: string[]
}

export interface ApiError {
  message: string
  error?: string
  statusCode?: number
  timestamp?: string
  path?: string
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface PaginatedResponse<T> {
  data: T[]
  pagination: {
    currentPage: number
    totalPages: number
    totalItems: number
    itemsPerPage: number
    hasNext: boolean
    hasPrevious: boolean
  }
}

// ============= LEADS =============

export interface Lead {
  id: string
  nome: string
  cpf: string
  email?: string
  telefone?: string
  whatsapp?: string
  dataNascimento?: string
  endereco?: Endereco
  rendaMensal?: number
  profissao?: string
  empresa?: string
  observacoes?: string
  status: LeadStatus
  origem: string
  dataContato?: string
  proximoContato?: string
  responsavel?: string
  tags?: string[]
  createdAt: string
  updatedAt: string
}

export type LeadStatus = 'novo' | 'contatado' | 'interessado' | 'proposta_enviada' | 'convertido' | 'perdido' | 'descartado'

export interface CreateLeadRequest {
  nome: string
  cpf: string
  email?: string
  telefone?: string
  whatsapp?: string
  dataNascimento?: string
  endereco?: Endereco
  rendaMensal?: number
  profissao?: string
  empresa?: string
  observacoes?: string
  origem: string
  responsavel?: string
  tags?: string[]
}

export interface UpdateLeadRequest extends Partial<CreateLeadRequest> {
  status?: LeadStatus
  dataContato?: string
  proximoContato?: string
}

// ============= ENDEREÇO =============

export interface Endereco {
  cep?: string
  logradouro?: string
  numero?: string
  complemento?: string
  bairro?: string
  cidade?: string
  estado?: string
  pais?: string
}

// ============= DOCUMENTOS =============

export interface Document {
  id: string
  nome: string
  tipo: DocumentType
  tamanho: number
  mimeType: string
  url?: string
  status: DocumentStatus
  clienteId?: string
  leadId?: string
  propostaId?: string
  contratoId?: string
  uploadedBy: string
  createdAt: string
  updatedAt: string
}

export type DocumentType = 'rg' | 'cpf' | 'comprovante_renda' | 'comprovante_residencia' | 'extrato_bancario' | 'contracheque' | 'imposto_renda' | 'outros'

export type DocumentStatus = 'pendente' | 'aprovado' | 'rejeitado' | 'processando'

export interface UploadDocumentRequest {
  nome: string
  tipo: DocumentType
  arquivo: string // Base64
  mimeType: string
  clienteId?: string
  leadId?: string
  propostaId?: string
  contratoId?: string
}

// ============= PROPOSTAS =============

export interface Proposta {
  id: string
  numero: string
  clienteId: string
  produtoId: string
  valorSolicitado: number
  valorAprovado?: number
  prazoMeses: number
  taxaJuros: number
  valorParcela: number
  valorTotal: number
  status: PropostaStatus
  observacoes?: string
  dataAnalise?: string
  dataAprovacao?: string
  dataVencimento: string
  responsavel: string
  documentos?: Document[]
  createdAt: string
  updatedAt: string
}

export type PropostaStatus = 'rascunho' | 'enviada' | 'em_analise' | 'aprovada' | 'rejeitada' | 'expirada' | 'cancelada'

export interface CreatePropostaRequest {
  clienteId: string
  produtoId: string
  valorSolicitado: number
  prazoMeses: number
  observacoes?: string
  dataVencimento: string
}

export interface UpdatePropostaRequest extends Partial<CreatePropostaRequest> {
  status?: PropostaStatus
  valorAprovado?: number
  taxaJuros?: number
  valorParcela?: number
  valorTotal?: number
  dataAnalise?: string
  dataAprovacao?: string
}

// ============= CLIENTES =============

export interface Cliente {
  id: string
  nome: string
  cpf: string
  rg?: string
  email?: string
  telefone?: string
  whatsapp?: string
  dataNascimento?: string
  endereco?: Endereco
  rendaMensal?: number
  profissao?: string
  empresa?: string
  estadoCivil?: EstadoCivil
  escolaridade?: string
  nomeMae?: string
  nomePai?: string
  status: ClienteStatus
  observacoes?: string
  leadId?: string
  responsavel?: string
  documentos?: Document[]
  propostas?: Proposta[]
  contratos?: Contrato[]
  createdAt: string
  updatedAt: string
}

export type EstadoCivil = 'solteiro' | 'casado' | 'divorciado' | 'viuvo' | 'uniao_estavel'

export type ClienteStatus = 'ativo' | 'inativo' | 'bloqueado' | 'suspenso'

export interface CreateClienteRequest {
  nome: string
  cpf: string
  rg?: string
  email?: string
  telefone?: string
  whatsapp?: string
  dataNascimento?: string
  endereco?: Endereco
  rendaMensal?: number
  profissao?: string
  empresa?: string
  estadoCivil?: EstadoCivil
  escolaridade?: string
  nomeMae?: string
  nomePai?: string
  observacoes?: string
  leadId?: string
  responsavel?: string
}

export interface UpdateClienteRequest extends Partial<CreateClienteRequest> {
  status?: ClienteStatus
}

// ============= CONTRATOS =============

export interface Contrato {
  id: string
  numero: string
  propostaId: string
  clienteId: string
  produtoId: string
  valorContrato: number
  prazoMeses: number
  taxaJuros: number
  valorParcela: number
  valorTotal: number
  dataAssinatura?: string
  dataVencimento: string
  status: ContratoStatus
  observacoes?: string
  responsavel: string
  parcelas?: Parcela[]
  documentos?: Document[]
  createdAt: string
  updatedAt: string
}

export type ContratoStatus = 'rascunho' | 'ativo' | 'suspenso' | 'cancelado' | 'finalizado' | 'inadimplente'

export interface Parcela {
  id: string
  numeroParcelar: number
  valor: number
  dataVencimento: string
  dataPagamento?: string
  valorPago?: number
  status: ParcelaStatus
  observacoes?: string
}

export type ParcelaStatus = 'pendente' | 'paga' | 'atrasada' | 'cancelada'

export interface CreateContratoRequest {
  propostaId: string
  dataVencimento: string
  observacoes?: string
}

export interface UpdateContratoRequest extends Partial<CreateContratoRequest> {
  status?: ContratoStatus
  dataAssinatura?: string
}

// ============= USUÁRIOS =============

export interface Usuario {
  id: string
  nome: string
  email: string
  telefone?: string
  cargo?: string
  departamento?: string
  role: UserRole
  status: UserStatus
  permissions?: string[]
  lastLogin?: string
  createdAt: string
  updatedAt: string
}

export type UserRole = 'admin' | 'manager' | 'agent' | 'viewer'

export type UserStatus = 'ativo' | 'inativo' | 'suspenso' | 'bloqueado'

export interface CreateUsuarioRequest {
  nome: string
  email: string
  password: string
  telefone?: string
  cargo?: string
  departamento?: string
  role: UserRole
  permissions?: string[]
}

export interface UpdateUsuarioRequest extends Partial<Omit<CreateUsuarioRequest, 'password'>> {
  status?: UserStatus
  password?: string
}

// ============= PRODUTOS =============

export interface Produto {
  id: string
  nome: string
  descricao?: string
  tipo: ProdutoType
  categoria?: string
  valorMinimo: number
  valorMaximo: number
  prazoMinimoMeses: number
  prazoMaximoMeses: number
  taxaJurosMinima: number
  taxaJurosMaxima: number
  status: ProdutoStatus
  requisitos?: string[]
  documentosNecessarios?: DocumentType[]
  carteiraId?: string
  instituicaoId?: string
  createdAt: string
  updatedAt: string
}

export type ProdutoType = 'credito_pessoal' | 'credito_consignado' | 'financiamento' | 'cartao_credito' | 'outros'

export type ProdutoStatus = 'ativo' | 'inativo' | 'suspenso' | 'descontinuado'

// ============= CARTEIRAS =============

export interface Carteira {
  id: string
  nome: string
  descricao?: string
  tipo: CarteiraType
  status: CarteiraStatus
  responsavel?: string
  instituicaoId?: string
  produtos?: Produto[]
  limiteCredito?: number
  saldoDisponivel?: number
  createdAt: string
  updatedAt: string
}

export type CarteiraType = 'propria' | 'terceiros' | 'correspondente' | 'parceiro'

export type CarteiraStatus = 'ativa' | 'inativa' | 'suspensa' | 'bloqueada'

// ============= INSTITUIÇÕES =============

export interface Instituicao {
  id: string
  nome: string
  razaoSocial?: string
  cnpj?: string
  tipo: InstituicaoType
  endereco?: Endereco
  telefone?: string
  email?: string
  website?: string
  status: InstituicaoStatus
  responsavel?: string
  carteiras?: Carteira[]
  produtos?: Produto[]
  createdAt: string
  updatedAt: string
}

export type InstituicaoType = 'banco' | 'financeira' | 'cooperativa' | 'correspondente' | 'fintech' | 'outros'

export type InstituicaoStatus = 'ativa' | 'inativa' | 'suspensa' | 'bloqueada'

// ============= FILTROS E BUSCAS =============

export interface LeadFilters extends PaginationParams {
  status?: LeadStatus[]
  origem?: string[]
  responsavel?: string[]
  dataInicio?: string
  dataFim?: string
  tags?: string[]
  busca?: string
}

export interface PropostaFilters extends PaginationParams {
  status?: PropostaStatus[]
  clienteId?: string
  produtoId?: string
  responsavel?: string[]
  dataInicio?: string
  dataFim?: string
  valorMinimo?: number
  valorMaximo?: number
  busca?: string
}

export interface ClienteFilters extends PaginationParams {
  status?: ClienteStatus[]
  responsavel?: string[]
  dataInicio?: string
  dataFim?: string
  rendaMinima?: number
  rendaMaxima?: number
  busca?: string
}

export interface ContratoFilters extends PaginationParams {
  status?: ContratoStatus[]
  clienteId?: string
  produtoId?: string
  responsavel?: string[]
  dataInicio?: string
  dataFim?: string
  valorMinimo?: number
  valorMaximo?: number
  busca?: string
}

// ============= DASHBOARD E MÉTRICAS =============

export interface DashboardMetrics {
  leads: {
    total: number
    novos: number
    convertidos: number
    taxaConversao: number
  }
  propostas: {
    total: number
    enviadas: number
    aprovadas: number
    rejeitadas: number
    taxaAprovacao: number
  }
  contratos: {
    total: number
    ativos: number
    finalizados: number
    inadimplentes: number
    valorTotal: number
  }
  clientes: {
    total: number
    ativos: number
    inativos: number
  }
}

export interface ChartData {
  labels: string[]
  datasets: {
    label: string
    data: number[]
    backgroundColor?: string[]
    borderColor?: string[]
  }[]
}

// ============= WEBHOOKS E EVENTOS =============

export interface WebhookEvent {
  id: string
  type: WebhookEventType
  data: any
  timestamp: string
  processed: boolean
}

export type WebhookEventType = 
  | 'lead.created' 
  | 'lead.updated' 
  | 'lead.converted'
  | 'proposta.created' 
  | 'proposta.approved' 
  | 'proposta.rejected'
  | 'contrato.signed' 
  | 'contrato.completed' 
  | 'contrato.defaulted'
  | 'document.uploaded' 
  | 'document.approved' 
  | 'document.rejected'
