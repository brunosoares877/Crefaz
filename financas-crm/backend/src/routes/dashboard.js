const express = require('express');
const { query, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Dashboard principal com KPIs
router.get('/kpis', [
  query('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
  query('endDate').optional().isISO8601().withMessage('Data final inválida')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate } = req.query;
    const userId = req.user.id;

    // Definir período (padrão: mês atual)
    let periodStart, periodEnd;
    if (startDate && endDate) {
      periodStart = new Date(startDate);
      periodEnd = new Date(endDate);
    } else {
      const now = new Date();
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Buscar dados das transações
    const transactions = await prisma.transaction.findMany({
      where: {
        userId,
        date: {
          gte: periodStart,
          lte: periodEnd
        }
      },
      select: {
        amount: true,
        type: true,
        categoryId: true
      }
    });

    // Calcular KPIs
    const totalIncome = transactions
      .filter(t => t.type === 'INCOME')
      .reduce((sum, t) => sum + t.amount, 0);

    const totalExpenses = transactions
      .filter(t => t.type === 'EXPENSE')
      .reduce((sum, t) => sum + t.amount, 0);

    const netBalance = totalIncome - totalExpenses;

    // Buscar saldo total das contas
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      select: { balance: true }
    });

    const totalBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    // Contar transações
    const transactionCount = transactions.length;

    res.json({
      period: {
        start: periodStart,
        end: periodEnd
      },
      kpis: {
        totalIncome: parseFloat(totalIncome.toFixed(2)),
        totalExpenses: parseFloat(totalExpenses.toFixed(2)),
        netBalance: parseFloat(netBalance.toFixed(2)),
        totalBalance: parseFloat(totalBalance.toFixed(2)),
        transactionCount
      }
    });
  } catch (error) {
    console.error('Erro ao buscar KPIs:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Gráfico de pizza por categorias
router.get('/chart/categories', [
  query('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
  query('endDate').optional().isISO8601().withMessage('Data final inválida'),
  query('type').isIn(['INCOME', 'EXPENSE']).withMessage('Tipo é obrigatório')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { startDate, endDate, type } = req.query;
    const userId = req.user.id;

    // Definir período
    let periodStart, periodEnd;
    if (startDate && endDate) {
      periodStart = new Date(startDate);
      periodEnd = new Date(endDate);
    } else {
      const now = new Date();
      periodStart = new Date(now.getFullYear(), now.getMonth(), 1);
      periodEnd = new Date(now.getFullYear(), now.getMonth() + 1, 0);
    }

    // Buscar transações agrupadas por categoria
    const categoryData = await prisma.transaction.groupBy({
      by: ['categoryId'],
      where: {
        userId,
        type,
        date: {
          gte: periodStart,
          lte: periodEnd
        }
      },
      _sum: {
        amount: true
      },
      _count: {
        id: true
      }
    });

    // Buscar detalhes das categorias
    const categoryIds = categoryData.map(item => item.categoryId);
    const categories = await prisma.category.findMany({
      where: { id: { in: categoryIds } },
      select: { id: true, name: true, color: true, icon: true }
    });

    // Formatar dados para o gráfico
    const chartData = categoryData.map(item => {
      const category = categories.find(c => c.id === item.categoryId);
      return {
        id: item.categoryId,
        name: category?.name || 'Sem categoria',
        value: parseFloat(item._sum.amount.toFixed(2)),
        color: category?.color || '#1e40af',
        icon: category?.icon,
        count: item._count.id
      };
    });

    // Ordenar por valor
    chartData.sort((a, b) => b.value - a.value);

    res.json({
      period: { start: periodStart, end: periodEnd },
      type,
      data: chartData
    });
  } catch (error) {
    console.error('Erro ao buscar dados do gráfico de categorias:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Evolução do saldo no tempo
router.get('/chart/balance-evolution', [
  query('months').optional().isInt({ min: 1, max: 24 }).withMessage('Meses deve ser entre 1 e 24')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const months = parseInt(req.query.months) || 12;
    const userId = req.user.id;
    const now = new Date();
    const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

    // Buscar transações mensais
    const monthlyData = await prisma.transaction.findMany({
      where: {
        userId,
        date: { gte: startDate }
      },
      select: {
        amount: true,
        type: true,
        date: true
      },
      orderBy: { date: 'asc' }
    });

    // Agrupar por mês
    const monthlyBalance = {};
    let runningBalance = 0;

    // Inicializar todos os meses
    for (let i = 0; i < months; i++) {
      const date = new Date(now.getFullYear(), now.getMonth() - months + 1 + i, 1);
      const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      monthlyBalance[monthKey] = {
        month: monthKey,
        income: 0,
        expenses: 0,
        balance: 0,
        runningBalance: 0
      };
    }

    // Calcular saldo para cada mês
    monthlyData.forEach(transaction => {
      const monthKey = `${transaction.date.getFullYear()}-${String(transaction.date.getMonth() + 1).padStart(2, '0')}`;
      
      if (monthlyBalance[monthKey]) {
        if (transaction.type === 'INCOME') {
          monthlyBalance[monthKey].income += transaction.amount;
          runningBalance += transaction.amount;
        } else {
          monthlyBalance[monthKey].expenses += transaction.amount;
          runningBalance -= transaction.amount;
        }
        
        monthlyBalance[monthKey].balance = monthlyBalance[monthKey].income - monthlyBalance[monthKey].expenses;
        monthlyBalance[monthKey].runningBalance = runningBalance;
      }
    });

    // Converter para array e ordenar
    const chartData = Object.values(monthlyBalance).sort((a, b) => a.month.localeCompare(b.month));

    res.json({
      months,
      data: chartData
    });
  } catch (error) {
    console.error('Erro ao buscar evolução do saldo:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Projeção de saldo para 24 meses
router.get('/chart/balance-projection', async (req, res) => {
  try {
    const userId = req.user.id;
    const now = new Date();

    // Buscar transações recorrentes
    const recurringTransactions = await prisma.transaction.findMany({
      where: {
        userId,
        isRecurring: true
      },
      select: {
        amount: true,
        type: true,
        recurringType: true
      }
    });

    // Calcular projeção mensal
    const projection = [];
    let projectedBalance = 0;

    // Buscar saldo atual
    const accounts = await prisma.account.findMany({
      where: { userId, isActive: true },
      select: { balance: true }
    });
    
    projectedBalance = accounts.reduce((sum, acc) => sum + acc.balance, 0);

    for (let i = 0; i < 24; i++) {
      const monthDate = new Date(now.getFullYear(), now.getMonth() + i, 1);
      const monthKey = `${monthDate.getFullYear()}-${String(monthDate.getMonth() + 1).padStart(2, '0')}`;
      
      let monthlyIncome = 0;
      let monthlyExpenses = 0;

      // Aplicar transações recorrentes
      recurringTransactions.forEach(transaction => {
        if (transaction.recurringType === 'MONTHLY') {
          if (transaction.type === 'INCOME') {
            monthlyIncome += transaction.amount;
          } else {
            monthlyExpenses += transaction.amount;
          }
        }
      });

      projectedBalance += monthlyIncome - monthlyExpenses;

      projection.push({
        month: monthKey,
        income: monthlyIncome,
        expenses: monthlyExpenses,
        projectedBalance: parseFloat(projectedBalance.toFixed(2))
      });
    }

    res.json({
      currentBalance: parseFloat(accounts.reduce((sum, acc) => sum + acc.balance, 0).toFixed(2)),
      projection
    });
  } catch (error) {
    console.error('Erro ao calcular projeção:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Resumo de orçamentos
router.get('/budgets-summary', [
  query('month').optional().isInt({ min: 1, max: 12 }).withMessage('Mês deve ser entre 1 e 12'),
  query('year').optional().isInt({ min: 2020 }).withMessage('Ano inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const month = parseInt(req.query.month) || new Date().getMonth() + 1;
    const year = parseInt(req.query.year) || new Date().getFullYear();
    const userId = req.user.id;

    // Buscar orçamentos do mês
    const budgets = await prisma.budget.findMany({
      where: { month, year, userId },
      include: {
        category: {
          select: { name: true, color: true }
        }
      }
    });

    // Calcular alertas
    const budgetsWithAlerts = budgets.map(budget => {
      const percentage = (budget.spent / budget.amount) * 100;
      let alert = null;
      
      if (percentage >= 100) {
        alert = 'CRITICAL';
      } else if (percentage >= 80) {
        alert = 'WARNING';
      }

      return {
        ...budget,
        percentage: parseFloat(percentage.toFixed(1)),
        alert
      };
    });

    res.json({
      month,
      year,
      budgets: budgetsWithAlerts
    });
  } catch (error) {
    console.error('Erro ao buscar resumo de orçamentos:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
