import './App.css'
import { Header } from '../components/layout/Header'
import { LoanForm } from '../components/sections/LoanForm'
import { WarningMessage } from '../components/sections/WarningMessage'
import { Footer } from '../components/layout/Footer'
import { EnvironmentInfo } from '../components/ui/EnvironmentInfo'
import { TermsOfService } from '../components/pages/TermsOfService'
import { PrivacyPolicy } from '../components/pages/PrivacyPolicy'
import { NavigationProvider, useNavigation } from './contexts/NavigationContext'
import { colors } from '../styles/design-tokens'

const AppContent: React.FC = () => {
  const { currentPage } = useNavigation()

  if (currentPage === 'terms') {
    return <TermsOfService />
  }

  if (currentPage === 'privacy') {
    return <PrivacyPolicy />
  }

  // Página home
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
        padding: 'clamp(6rem, 15vw, 8rem) clamp(1rem, 4vw, 2rem) clamp(2rem, 8vw, 4rem)',
        maxWidth: 'clamp(320px, 90vw, 500px)',
        margin: '0 auto',
        textAlign: 'center',
        position: 'relative',
        zIndex: 1,
        width: '100%',
        boxSizing: 'border-box',
      }}>
        {/* Título Principal */}
        <div style={{ marginBottom: 'clamp(1rem, 3vw, 1.5rem)' }}>
          <h1 style={{
            fontSize: 'clamp(1.5rem, 6vw, 2.5rem)',
            fontWeight: 'bold',
            color: colors.white,
            marginBottom: 'clamp(0.25rem, 1vw, 0.5rem)',
            fontFamily: 'Inter, system-ui, sans-serif',
            lineHeight: 1.2,
            textShadow: '0 2px 4px rgba(0, 0, 0, 0.3)',
            padding: '0 clamp(0.5rem, 2vw, 1rem)',
          }}>
            💡 Empréstimo com débito na conta de luz
          </h1>
          
          <p style={{
            fontSize: 'clamp(0.875rem, 3vw, 1.125rem)',
            color: 'rgba(255, 255, 255, 0.9)',
            marginBottom: 'clamp(0.5rem, 2vw, 1rem)',
            fontFamily: 'Inter, system-ui, sans-serif',
            fontWeight: '500',
            textShadow: '0 1px 3px rgba(0, 0, 0, 0.3)',
            padding: '0 clamp(0.5rem, 2vw, 1rem)',
          }}>
            ✨ Rápido, seguro e sem burocracia
          </p>

        </div>
        
        {/* Formulário */}
        <LoanForm />
        
        {/* Aviso */}
        <WarningMessage />
      </main>
      
      {/* Footer */}
      <Footer />
      
      {/* Indicador de Ambiente */}
      <EnvironmentInfo />
    </div>
  )
}

function App() {
  return (
    <NavigationProvider>
      <AppContent />
    </NavigationProvider>
  )
}

export default App 