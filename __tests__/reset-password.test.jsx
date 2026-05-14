import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import ResetPassword from '../app/reset-password';
import { sendPasswordResetEmail } from 'firebase/auth';

jest.mock('firebase/auth', () => ({
  sendPasswordResetEmail: jest.fn(),
}));
jest.mock('expo-router', () => ({ router: { back: jest.fn() } }));
jest.mock('@/firebaseConfig', () => ({ auth: {} }));

jest.mock('@/components/ThemedText', () => {
  const { Text } = require('react-native');
  return ({ children }) => <Text>{children}</Text>;
});
jest.mock('@/components/ThemedButton', () => {
  const { Pressable } = require('react-native');
  return ({ children, onPress }) => <Pressable onPress={onPress}>{children}</Pressable>;
});
jest.mock('@/components/AppIcon', () => {
  const { Text } = require('react-native');
  return () => <Text>Icon</Text>;
});
jest.mock('react-native-safe-area-context', () => ({
  SafeAreaProvider: ({ children }) => children,
  useSafeAreaInsets: () => ({ top: 0, bottom: 0 }),
}));

describe('Testes Unitários - Lógica isolada', () => {
  
  describe('Validação de email', () => {
    const validateEmail = (email) => {
      const regex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
      return regex.test(email);
    };

    it('deve aceitar email com formato válido', () => {
      expect(validateEmail('teste@email.com')).toBe(true);
    });

    it('deve rejeitar email sem @', () => {
      expect(validateEmail('testeemail.com')).toBe(false);
    });

    it('deve rejeitar email vazio', () => {
      expect(validateEmail('')).toBe(false);
    });
  });

  describe('Mensagens de erro', () => {
    const getErrorMessage = (errorCode) => {
      switch (errorCode) {
        case 'auth/too-many-requests': 
          return 'Muitas tentativas. Tente novamente mais tarde';
        default: 
          return 'Erro ao enviar email de recuperação';
      }
    };

    it('deve retornar mensagem para muitas tentativas', () => {
      expect(getErrorMessage('auth/too-many-requests')).toBe('Muitas tentativas. Tente novamente mais tarde');
    });

    it('deve retornar mensagem genérica para erro desconhecido', () => {
      expect(getErrorMessage('auth/unknown')).toBe('Erro ao enviar email de recuperação');
    });
  });
});

describe('Testes de Integração - Componente com Firebase', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    render(<ResetPassword />);
  });

  it('deve mostrar erro quando email está vazio', () => {
    const botao = screen.getByText('Enviar email de recuperação');
    fireEvent.press(botao);
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor insira o seu email');
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });

  it('deve chamar Firebase e mostrar sucesso para email válido', async () => {
    sendPasswordResetEmail.mockResolvedValueOnce();
    
    const emailInput = screen.getByTestId('email-input');
    const botao = screen.getByText('Enviar email de recuperação');
    
    fireEvent.changeText(emailInput, 'teste@email.com');
    fireEvent.press(botao);
    
    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalledWith(expect.anything(), 'teste@email.com');
    });
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Email enviado!', 
      expect.stringContaining('teste@email.com'),
      expect.any(Array)
    );
  });

  it('deve mostrar erro quando Firebase retorna muitas tentativas', async () => {
    sendPasswordResetEmail.mockRejectedValueOnce({ code: 'auth/too-many-requests' });
    
    const emailInput = screen.getByTestId('email-input');
    const botao = screen.getByText('Enviar email de recuperação');
    
    fireEvent.changeText(emailInput, 'teste@email.com');
    fireEvent.press(botao);
    
    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Muitas tentativas. Tente novamente mais tarde');
    });
  });
});

describe('Testes de Aceitação - Fluxo do utilizador', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
  });

  it('Cenário: Utilizador recupera senha com sucesso', async () => {
    sendPasswordResetEmail.mockResolvedValueOnce();
    render(<ResetPassword />);
    
    expect(screen.getByText('Recuperar Senha')).toBeTruthy();
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.changeText(emailInput, 'meuemail@teste.com');
    
    const botao = screen.getByText('Enviar email de recuperação');
    fireEvent.press(botao);
    
    await waitFor(() => {
      expect(sendPasswordResetEmail).toHaveBeenCalled();
    });
    
    expect(Alert.alert).toHaveBeenCalledWith(
      'Email enviado!', 
      expect.stringContaining('meuemail@teste.com'),
      expect.any(Array)
    );
  });

  it('Cenário: Utilizador tenta recuperar com email inválido', async () => {
    render(<ResetPassword />);
    
    const emailInput = screen.getByTestId('email-input');
    fireEvent.changeText(emailInput, 'email_invalido');
    
    const botao = screen.getByText('Enviar email de recuperação');
    fireEvent.press(botao);
    
    expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Email inválido');
    expect(sendPasswordResetEmail).not.toHaveBeenCalled();
  });
});