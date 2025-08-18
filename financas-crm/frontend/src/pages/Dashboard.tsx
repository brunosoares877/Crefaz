import React, { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';
import {
  TrendingUp,
  TrendingDown,
  DollarSign,
  Wallet,
  Calendar,
  AlertTriangle
} from 'lucide-react';
import { PieChart, Pie, Cell, ResponsiveContainer, LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, BarChart, Bar } from 'recharts';
import { api } from '../services/api';
import toast from 'react-hot-toast';

interface KPIData {
  totalIncome: number;
  totalExpenses: number;
  netBalance: number;
  totalBalance: number;
  transactionCount: number;
}

interface CategoryData {
  id: string;
  name: string;
  value: number;
  color: string;
  icon: string;
  count: number;
}

interface BalanceEvolution {
  month: string;
  income: number;
  expenses: number;
  balance: number;
  runningBalance: number;
}

interface BudgetSummary {
  month: number;
  year: number;
  budgets: Array<{
    id: string;
    amount: number;
    spent: number;
    percentage: number;
    alert: string | null;
    category: {
      name: string;
      color: string;
    };
  }>;
}

const Dashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [categoryData, setCategoryData] = useState<CategoryData[]>([]);
  const [balanceEvolution, setBalanceEvolution] = useState<BalanceEvolution[]>([]);
  const [budgetSummary, setBudgetSummary] = useState<BudgetSummary | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPeriod, setSelectedPeriod] = useState('current');

  useEffect(() => {
    loadDashboardData();
  }, [selectedPeriod]);

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      
      // Carregar KPIs
      const kpisResponse = await api.get('/dashboard/kpis', {
        params: getPeriodParams()
      });
      setKpis(kpisResponse.data.kpis);

      // Carregar dados de categorias (despesas)
      const categoriesResponse = await api.get('/dashboard/chart/categories', {
        params: { ...getPeriodParams(), type: 'EXPENSE' }
      });
      setCategoryData(categoriesResponse.data.data);

      // Carregar evolução do saldo
      const balanceResponse = await api.get('/dashboard/chart/balance-evolution', {
        params: { months: 12 }
      });
      setBalanceEvolution(balanceResponse.data.data);

      // Carregar resumo de orçamentos
      const budgetResponse = await api.get('/dashboard/budgets-summary');
      setBudgetSummary(budgetResponse.data);

    } catch (error) {
      console.error('Erro ao carregar dados do dashboard:', error);
      toast.error('Erro ao carregar dados do dashboard');
    } finally {
      setLoading(false);
    }
  };

  const getPeriodParams = () => {
    const now = new Date();
    const currentMonth = now.getMonth();
    const currentYear = now.getFullYear();

    switch (selectedPeriod) {
      case 'current':
        return {
          startDate: new Date(currentYear, currentMonth, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth + 1, 0).toISOString()
        };
      case 'previous':
        return {
          startDate: new Date(currentYear, currentMonth - 1, 1).toISOString(),
          endDate: new Date(currentYear, currentMonth, 0).toISOString()
        };
      case 'year':
        return {
          startDate: new Date(currentYear, 0, 1).toISOString(),
          endDate: new Date(currentYear, 11, 31).toISOString()
        };
      default:
        return {};
    }
  };

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    }).format(value);
  };

  const getAlertIcon = (alert: string | null) => {
    if (alert === 'CRITICAL') {
      return <AlertTriangle className="w-5 h-5 text-red-500" />;
    } else if (alert === 'WARNING') {
      return <AlertTriangle className="w-5 h-5 text-yellow-500" />;
    }
    return null;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-96">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-navy-light"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-2xl font-bold text-white">Dashboard</h1>
          <p className="text-gray-400">Visão geral das suas finanças</p>
        </div>
        
        {/* Seletor de período */}
        <div className="mt-4 sm:mt-0">
          <select
            value={selectedPeriod}
            onChange={(e) => setSelectedPeriod(e.target.value)}
            className="bg-dark-card border border-dark-border text-white rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-navy-light"
          >
            <option value="current">Mês Atual</option>
            <option value="previous">Mês Anterior</option>
            <option value="year">Ano</option>
          </select>
        </div>
      </div>

      {/* KPIs */}
      {kpis && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <div className="flex items-center">
              <div className="p-2 bg-green-500/20 rounded-lg">
                <TrendingUp className="w-6 h-6 text-green-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Receitas</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(kpis.totalIncome)}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <div className="flex items-center">
              <div className="p-2 bg-red-500/20 rounded-lg">
                <TrendingDown className="w-6 h-6 text-red-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Despesas</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(kpis.totalExpenses)}</p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <div className="flex items-center">
              <div className="p-2 bg-navy-light/20 rounded-lg">
                <DollarSign className="w-6 h-6 text-navy-light" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Saldo Líquido</p>
                <p className={`text-2xl font-bold ${kpis.netBalance >= 0 ? 'text-green-500' : 'text-red-500'}`}>
                  {formatCurrency(kpis.netBalance)}
                </p>
              </div>
            </div>
          </div>

          <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
            <div className="flex items-center">
              <div className="p-2 bg-purple-500/20 rounded-lg">
                <Wallet className="w-6 h-6 text-purple-500" />
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-gray-400">Saldo Total</p>
                <p className="text-2xl font-bold text-white">{formatCurrency(kpis.totalBalance)}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Gráficos */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Gráfico de Pizza - Categorias */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-4">Despesas por Categoria</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                  outerRadius={80}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
              </PieChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Gráfico de Linha - Evolução do Saldo */}
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-4">Evolução do Saldo</h3>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={balanceEvolution}>
                <CartesianGrid strokeDasharray="3 3" stroke="#1f1f1f" />
                <XAxis 
                  dataKey="month" 
                  stroke="#6b7280"
                  tickFormatter={(value) => {
                    const [year, month] = value.split('-');
                    return format(new Date(parseInt(year), parseInt(month) - 1), 'MMM/yy', { locale: ptBR });
                  }}
                />
                <YAxis stroke="#6b7280" />
                <Tooltip 
                  formatter={(value: number) => formatCurrency(value)}
                  contentStyle={{
                    backgroundColor: '#111111',
                    border: '1px solid #1f1f1f',
                    borderRadius: '8px',
                    color: '#ffffff'
                  }}
                />
                <Legend />
                <Line 
                  type="monotone" 
                  dataKey="runningBalance" 
                  stroke="#1e40af" 
                  strokeWidth={2}
                  name="Saldo Acumulado"
                />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* Resumo de Orçamentos */}
      {budgetSummary && (
        <div className="bg-dark-card p-6 rounded-lg border border-dark-border">
          <h3 className="text-lg font-semibold text-white mb-4">Resumo de Orçamentos</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {budgetSummary.budgets.map((budget) => (
              <div key={budget.id} className="p-4 bg-dark-hover rounded-lg border border-dark-border">
                <div className="flex items-center justify-between mb-2">
                  <h4 className="font-medium text-white">{budget.category.name}</h4>
                  {getAlertIcon(budget.alert)}
                </div>
                <div className="space-y-2">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Gasto:</span>
                    <span className="text-white">{formatCurrency(budget.spent)}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-400">Orçado:</span>
                    <span className="text-white">{formatCurrency(budget.amount)}</span>
                  </div>
                  <div className="w-full bg-dark-border rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all duration-300 ${
                        budget.percentage >= 100 ? 'bg-red-500' :
                        budget.percentage >= 80 ? 'bg-yellow-500' : 'bg-green-500'
                      }`}
                      style={{ width: `${Math.min(budget.percentage, 100)}%` }}
                    />
                  </div>
                  <div className="text-right text-sm text-gray-400">
                    {budget.percentage.toFixed(1)}%
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard;
