const { PrismaClient } = require('@prisma/client');
const bcrypt = require('bcryptjs');

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco de dados...');

  // Criar usuário admin padrão
  const adminPassword = await bcrypt.hash('admin123', 12);
  const admin = await prisma.user.upsert({
    where: { email: 'admin@financas.com' },
    update: {},
    create: {
      email: 'admin@financas.com',
      name: 'Administrador',
      password: adminPassword,
      role: 'ADMIN'
    }
  });

  console.log('Usuário admin criado:', admin.email);

  // Criar usuário de teste
  const userPassword = await bcrypt.hash('user123', 12);
  const user = await prisma.user.upsert({
    where: { email: 'user@financas.com' },
    update: {},
    create: {
      email: 'user@financas.com',
      name: 'Usuário Teste',
      password: userPassword,
      role: 'USER'
    }
  });

  console.log('Usuário teste criado:', user.email);

  // Criar contas padrão
  const defaultAccounts = [
    {
      name: 'Conta Corrente',
      type: 'BANK',
      balance: 5000.00,
      color: '#1e40af',
      userId: user.id
    },
    {
      name: 'Carteira',
      type: 'WALLET',
      balance: 500.00,
      color: '#059669',
      userId: user.id
    },
    {
      name: 'Cartão de Crédito',
      type: 'CREDIT_CARD',
      balance: -1500.00,
      color: '#dc2626',
      userId: user.id
    },
    {
      name: 'Investimentos',
      type: 'INVESTMENT',
      balance: 10000.00,
      color: '#7c3aed',
      userId: user.id
    }
  ];

  for (const accountData of defaultAccounts) {
    await prisma.account.upsert({
      where: {
        id: `${user.id}_${accountData.name.toLowerCase().replace(/\s+/g, '_')}`
      },
      update: {},
      create: accountData
    });
  }

  console.log('Contas padrão criadas');

  // Criar categorias de receita
  const incomeCategories = [
    { name: 'Salário', color: '#059669', icon: 'Money' },
    { name: 'Freelance', color: '#0d9488', icon: 'Work' },
    { name: 'Investimentos', color: '#7c3aed', icon: 'Chart' },
    { name: 'Outros', color: '#1e40af', icon: 'Plus' }
  ];

  for (const categoryData of incomeCategories) {
    await prisma.category.upsert({
      where: {
        id: `${user.id}_income_${categoryData.name.toLowerCase().replace(/\s+/g, '_')}`
      },
      update: {},
      create: {
        ...categoryData,
        type: 'INCOME',
        userId: user.id
      }
    });
  }

  // Criar categorias de despesa
  const expenseCategories = [
    { name: 'Alimentação', color: '#dc2626', icon: 'Food' },
    { name: 'Transporte', color: '#ea580c', icon: 'Car' },
    { name: 'Moradia', color: '#1e40af', icon: 'Home' },
    { name: 'Saúde', color: '#059669', icon: 'Health' },
    { name: 'Educação', color: '#7c3aed', icon: 'Book' },
    { name: 'Lazer', color: '#db2777', icon: 'Game' },
    { name: 'Vestuário', color: '#0891b2', icon: 'Shirt' },
    { name: 'Serviços', color: '#6b7280', icon: 'Tool' }
  ];

  for (const categoryData of expenseCategories) {
    await prisma.category.upsert({
      where: {
        id: `${user.id}_expense_${categoryData.name.toLowerCase().replace(/\s+/g, '_')}`
      },
      update: {},
      create: {
        ...categoryData,
        type: 'EXPENSE',
        userId: user.id
      }
    });
  }

  console.log('Categorias padrão criadas');

  // Criar algumas transações de exemplo
  const sampleTransactions = [
    {
      description: 'Salário Janeiro',
      amount: 5000.00,
      type: 'INCOME',
      date: new Date(2024, 0, 5),
      categoryId: `${user.id}_income_salário`,
      accountId: `${user.id}_conta_corrente`,
      userId: user.id
    },
    {
      description: 'Supermercado',
      amount: 350.00,
      type: 'EXPENSE',
      date: new Date(2024, 0, 10),
      categoryId: `${user.id}_expense_alimentação`,
      accountId: `${user.id}_conta_corrente`,
      userId: user.id
    },
    {
      description: 'Combustível',
      amount: 120.00,
      type: 'EXPENSE',
      date: new Date(2024, 0, 12),
      categoryId: `${user.id}_expense_transporte`,
      accountId: `${user.id}_carteira`,
      userId: user.id
    },
    {
      description: 'Aluguel',
      amount: 1200.00,
      type: 'EXPENSE',
      date: new Date(2024, 0, 1),
      categoryId: `${user.id}_expense_moradia`,
      accountId: `${user.id}_conta_corrente`,
      userId: user.id,
      isRecurring: true,
      recurringType: 'MONTHLY'
    }
  ];

  for (const transactionData of sampleTransactions) {
    await prisma.transaction.upsert({
      where: {
        id: `${user.id}_${transactionData.description.toLowerCase().replace(/\s+/g, '_')}_${transactionData.date.getTime()}`
      },
      update: {},
      create: transactionData
    });
  }

  console.log('Transações de exemplo criadas');

  // Criar orçamentos de exemplo
  const currentMonth = new Date().getMonth() + 1;
  const currentYear = new Date().getFullYear();

  const sampleBudgets = [
    {
      month: currentMonth,
      year: currentYear,
      amount: 800.00,
      spent: 350.00,
      categoryId: `${user.id}_expense_alimentação`,
      userId: user.id
    },
    {
      month: currentMonth,
      year: currentYear,
      amount: 300.00,
      spent: 120.00,
      categoryId: `${user.id}_expense_transporte`,
      userId: user.id
    },
    {
      month: currentMonth,
      year: currentYear,
      amount: 1500.00,
      spent: 1200.00,
      categoryId: `${user.id}_expense_moradia`,
      userId: user.id
    }
  ];

  for (const budgetData of sampleBudgets) {
    await prisma.budget.upsert({
      where: {
        month_year_categoryId_userId: {
          month: budgetData.month,
          year: budgetData.year,
          categoryId: budgetData.categoryId,
          userId: budgetData.userId
        }
      },
      update: {},
      create: budgetData
    });
  }

  console.log('Orçamentos de exemplo criados');

  // Criar metas de exemplo
  const sampleGoals = [
    {
      title: 'Viagem para Europa',
      description: 'Economizar para uma viagem de 15 dias pela Europa',
      targetAmount: 15000.00,
      currentAmount: 5000.00,
      targetDate: new Date(2025, 5, 1),
      userId: user.id
    },
    {
      title: 'Entrada do Apartamento',
      description: 'Juntar dinheiro para dar entrada em um apartamento',
      targetAmount: 50000.00,
      currentAmount: 15000.00,
      targetDate: new Date(2026, 11, 1),
      userId: user.id
    }
  ];

  for (const goalData of sampleGoals) {
    await prisma.goal.upsert({
      where: {
        id: `${user.id}_${goalData.title.toLowerCase().replace(/\s+/g, '_')}`
      },
      update: {},
      create: goalData
    });
  }

  console.log('Metas de exemplo criadas');

  console.log('\nSeed concluído com sucesso!');
  console.log('\nCredenciais de acesso:');
  console.log('Admin: admin@financas.com / admin123');
  console.log('Usuário: user@financas.com / user123');
}

main()
  .catch((e) => {
    console.error('Erro durante o seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
