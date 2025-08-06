import './App.css'
import { Header } from '../components/layout/Header'
import { LoanForm } from '../components/sections/LoanForm'
import { WarningMessage } from '../components/sections/WarningMessage'
import { Footer } from '../components/layout/Footer'
import { colors } from '../styles/design-tokens'

function App() {
  return (
    <div className="App" style={{
      background: `linear-gradient(135deg, ${colors.darkBlue} 0%, ${colors.primary[900]} 50%, ${colors.primary[800]} 100%)`,
      minHeight: '100vh',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Decoração de fundo sutil */}
      <div style={{
        position: 'absolute',
        top: '-10%',
        right: '-10%',
        width: '40%',
        height: '40%',
        background: `radial-gradient(circle, ${colors.primary[100]}15 0%, transparent 70%)`,
        borderRadius: '50%',
      }} />
      
      <div style={{
        position: 'absolute',
        bottom: '-20%',
        left: '-20%',
        width: '60%',
        height: '60%',
        background: `radial-gradient(circle, ${colors.gradient.start}10 0%, transparent 70%)`,
        borderRadius: '50%',
      }} />

      {/* Header */}
      <Header />
      
      {/* Conteúdo Principal */}
      <main style={{
        padding: '8rem 1rem 4rem',
        maxWidth: '500px',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
      }}>
        {/* Título Principal */}
        <div style={{ marginBottom: '1.5rem' }}>
          <h1 style={{
            fontSize: 'clamp(1.75rem, 5vw, 2.5rem)',
            fontWeight: 'bold',
            color: colors.white,
            marginBottom: '1rem',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
          }}>
            Empréstimo com débito na conta de luz
          </h1>
          

        </div>
        
        {/* Formulário */}
        <LoanForm />
        
        {/* Aviso */}
        <WarningMessage />
      </main>
      
      {/* Footer */}
      <Footer />
    </div>
  )
}

export default App 