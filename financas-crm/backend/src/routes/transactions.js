const express = require('express');
const { body, query, validationResult } = require('express-validator');
const { PrismaClient } = require('@prisma/client');
const { auth } = require('../middleware/auth');

const router = express.Router();
const prisma = new PrismaClient();

// Middleware de autenticação para todas as rotas
router.use(auth);

// Listar transações com filtros
router.get('/', [
  query('startDate').optional().isISO8601().withMessage('Data inicial inválida'),
  query('endDate').optional().isISO8601().withMessage('Data final inválida'),
  query('categoryId').optional().isString().withMessage('ID da categoria inválido'),
  query('accountId').optional().isString().withMessage('ID da conta inválido'),
  query('type').optional().isIn(['INCOME', 'EXPENSE']).withMessage('Tipo inválido'),
  query('page').optional().isInt({ min: 1 }).withMessage('Página inválida'),
  query('limit').optional().isInt({ min: 1, max: 100 }).withMessage('Limite inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      startDate,
      endDate,
      categoryId,
      accountId,
      type,
      page = 1,
      limit = 20
    } = req.query;

    const userId = req.user.id;
    const skip = (page - 1) * limit;

    // Construir filtros
    const where = { userId };
    
    if (startDate && endDate) {
      where.date = {
        gte: new Date(startDate),
        lte: new Date(endDate)
      };
    }
    
    if (categoryId) where.categoryId = categoryId;
    if (accountId) where.accountId = accountId;
    if (type) where.type = type;

    // Buscar transações
    const [transactions, total] = await Promise.all([
      prisma.transaction.findMany({
        where,
        include: {
          category: {
            select: { id: true, name: true, color: true, icon: true }
          },
          account: {
            select: { id: true, name: true, type: true, color: true }
          }
        },
        orderBy: { date: 'desc' },
        skip,
        take: parseInt(limit)
      }),
      prisma.transaction.count({ where })
    ]);

    res.json({
      transactions,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total,
        pages: Math.ceil(total / limit)
      }
    });
  } catch (error) {
    console.error('Erro ao listar transações:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Buscar transação por ID
router.get('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId },
      include: {
        category: true,
        account: true
      }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    res.json(transaction);
  } catch (error) {
    console.error('Erro ao buscar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Criar nova transação
router.post('/', [
  body('description').trim().isLength({ min: 1 }).withMessage('Descrição é obrigatória'),
  body('amount').isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
  body('type').isIn(['INCOME', 'EXPENSE']).withMessage('Tipo inválido'),
  body('date').isISO8601().withMessage('Data inválida'),
  body('categoryId').isString().withMessage('ID da categoria é obrigatório'),
  body('accountId').isString().withMessage('ID da conta é obrigatório'),
  body('isRecurring').optional().isBoolean().withMessage('isRecurring deve ser booleano'),
  body('recurringType').optional().isIn(['DAILY', 'WEEKLY', 'MONTHLY', 'YEARLY']).withMessage('Tipo recorrente inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const {
      description,
      amount,
      type,
      date,
      categoryId,
      accountId,
      isRecurring = false,
      recurringType
    } = req.body;

    const userId = req.user.id;

    // Verificar se categoria e conta pertencem ao usuário
    const [category, account] = await Promise.all([
      prisma.category.findFirst({ where: { id: categoryId, userId } }),
      prisma.account.findFirst({ where: { id: accountId, userId } })
    ]);

    if (!category) {
      return res.status(400).json({ error: 'Categoria não encontrada' });
    }

    if (!account) {
      return res.status(400).json({ error: 'Conta não encontrada' });
    }

    // Criar transação
    const transaction = await prisma.transaction.create({
      data: {
        description,
        amount: parseFloat(amount),
        type,
        date: new Date(date),
        categoryId,
        accountId,
        userId,
        isRecurring,
        recurringType: isRecurring ? recurringType : null
      },
      include: {
        category: true,
        account: true
      }
    });

    // Atualizar saldo da conta
    const balanceChange = type === 'INCOME' ? amount : -amount;
    await prisma.account.update({
      where: { id: accountId },
      data: { balance: { increment: balanceChange } }
    });

    res.status(201).json({
      message: 'Transação criada com sucesso',
      transaction
    });
  } catch (error) {
    console.error('Erro ao criar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Atualizar transação
router.put('/:id', [
  body('description').optional().trim().isLength({ min: 1 }).withMessage('Descrição deve ter pelo menos 1 caractere'),
  body('amount').optional().isFloat({ min: 0.01 }).withMessage('Valor deve ser maior que zero'),
  body('date').optional().isISO8601().withMessage('Data inválida'),
  body('categoryId').optional().isString().withMessage('ID da categoria inválido'),
  body('accountId').optional().isString().withMessage('ID da conta inválido')
], async (req, res) => {
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { id } = req.params;
    const userId = req.user.id;

    // Buscar transação existente
    const existingTransaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!existingTransaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Reverter saldo anterior
    const previousBalanceChange = existingTransaction.type === 'INCOME' 
      ? -existingTransaction.amount 
      : existingTransaction.amount;

    await prisma.account.update({
      where: { id: existingTransaction.accountId },
      data: { balance: { increment: previousBalanceChange } }
    });

    // Atualizar transação
    const updatedTransaction = await prisma.transaction.update({
      where: { id },
      data: req.body,
      include: {
        category: true,
        account: true
      }
    });

    // Aplicar novo saldo
    const newBalanceChange = updatedTransaction.type === 'INCOME' 
      ? updatedTransaction.amount 
      : -updatedTransaction.amount;

    await prisma.account.update({
      where: { id: updatedTransaction.accountId },
      data: { balance: { increment: newBalanceChange } }
    });

    res.json({
      message: 'Transação atualizada com sucesso',
      transaction: updatedTransaction
    });
  } catch (error) {
    console.error('Erro ao atualizar transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

// Excluir transação
router.delete('/:id', async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    const transaction = await prisma.transaction.findFirst({
      where: { id, userId }
    });

    if (!transaction) {
      return res.status(404).json({ error: 'Transação não encontrada' });
    }

    // Reverter saldo
    const balanceChange = transaction.type === 'INCOME' 
      ? -transaction.amount 
      : transaction.amount;

    await prisma.account.update({
      where: { id: transaction.accountId },
      data: { balance: { increment: balanceChange } }
    });

    // Excluir transação
    await prisma.transaction.delete({ where: { id } });

    res.json({ message: 'Transação excluída com sucesso' });
  } catch (error) {
    console.error('Erro ao excluir transação:', error);
    res.status(500).json({ error: 'Erro interno do servidor' });
  }
});

module.exports = router;
