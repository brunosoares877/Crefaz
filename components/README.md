# Componentes do Projeto Figma

Esta pasta contém todos os componentes reutilizáveis do seu projeto baseado no Figma.

## Estrutura Sugerida

```
components/
├── layout/
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── Sidebar.tsx
│   └── Navigation.tsx
├── ui/
│   ├── Button.tsx
│   ├── Card.tsx
│   ├── Input.tsx
│   └── Modal.tsx
├── sections/
│   ├── Hero.tsx
│   ├── About.tsx
│   ├── Services.tsx
│   └── Contact.tsx
└── pages/
    ├── Home.tsx
    ├── About.tsx
    └── Contact.tsx
```

## Como usar

1. Crie componentes baseados nas seções do seu Figma
2. Mantenha componentes pequenos e reutilizáveis
3. Use TypeScript para tipagem
4. Documente props e funcionalidades

## Exemplo de Componente

```tsx
interface ButtonProps {
  text: string;
  onClick?: () => void;
  variant?: 'primary' | 'secondary';
}

export const Button = ({ text, onClick, variant = 'primary' }: ButtonProps) => {
  return (
    <button 
      className={`button ${variant}`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};
``` 