import React from 'react';
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { Alert } from 'react-native';
import Register from '../app/register';

// Mocks
jest.mock('expo-router', () => ({
  router: { replace: jest.fn(), back: jest.fn() },
}));

jest.mock('firebase/auth', () => ({
  createUserWithEmailAndPassword: jest.fn(),
}));

jest.mock('@/firebaseConfig', () => ({ auth: {} }));

// Mocks de componentes com versão simplificada
jest.mock('@/components/ThemedText', () => {
  const { Text } = require('react-native');
  return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

jest.mock('@/components/ThemedView', () => {
  const { View } = require('react-native');
  return ({ children, ...props }) => <View {...props}>{children}</View>;
});

jest.mock('@/components/ThemedButton', () => {
  const { Pressable } = require('react-native');
  return ({ children, onPress }) => <Pressable onPress={onPress}>{children}</Pressable>;
});

jest.mock('@/components/Spacer', () => {
  const { View } = require('react-native');
  return () => <View />;
});

jest.mock('react-native-safe-area-context', () => 
  require('react-native-safe-area-context/jest/mock').default
);

describe('Register Screen', () => {
  const { createUserWithEmailAndPassword } = require('firebase/auth');
  const { router } = require('expo-router');

  beforeEach(() => {
    jest.clearAllMocks();
    jest.spyOn(Alert, 'alert').mockImplementation(() => {});
    render(<Register />);
  });

  /* ========== TESTES UNITÁRIOS ========== */
  describe('Testes unitários', () => {
    it('renderiza todos os elementos do formulário', () => {
      expect(screen.getByText('Criar Conta')).toBeTruthy();
      expect(screen.getByText('Email')).toBeTruthy();
      expect(screen.getByText('Password')).toBeTruthy();
      expect(screen.getByText('Confirmar Password')).toBeTruthy();
      expect(screen.getByText('Registar')).toBeTruthy();
      expect(screen.getByText('Faça login')).toBeTruthy();
    });

    it('atualiza os valores dos inputs corretamente', () => {
      const emailInput = screen.getByTestId('email-input');
      const passwordInput = screen.getByTestId('password-input');
      const confirmInput = screen.getByTestId('confirm-password-input');

      fireEvent.changeText(emailInput, 'teste@email.com');
      fireEvent.changeText(passwordInput, '123456');
      fireEvent.changeText(confirmInput, '123456');

      expect(emailInput.props.value).toBe('teste@email.com');
      expect(passwordInput.props.value).toBe('123456');
      expect(confirmInput.props.value).toBe('123456');
    });
  });

  /* ========== TESTES DE INTEGRAÇÃO ========== */
  describe('Testes de integração', () => {
    const getInputs = () => ({
      email: screen.getByTestId('email-input'),
      password: screen.getByTestId('password-input'),
      confirm: screen.getByTestId('confirm-password-input'),
      button: screen.getByText('Registar'),
    });

    it('valida campos obrigatórios', () => {
      fireEvent.press(getInputs().button);
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor preencha todos os campos');
    });

    it('verifica se as passwords coincidem', () => {
      const { email, password, confirm, button } = getInputs();
      fireEvent.changeText(email, 'teste@email.com');
      fireEvent.changeText(password, '123456');
      fireEvent.changeText(confirm, '654321');
      fireEvent.press(button);
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'As passwords não coincidem');
    });

    it('valida tamanho mínimo da password (6 chars)', () => {
      const { email, password, confirm, button } = getInputs();
      fireEvent.changeText(email, 'teste@email.com');
      fireEvent.changeText(password, '12345');
      fireEvent.changeText(confirm, '12345');
      fireEvent.press(button);
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'A password deve ter pelo menos 6 caracteres');
    });

    it('valida formato do email', () => {
      const { email, password, confirm, button } = getInputs();
      fireEvent.changeText(email, 'email_invalido');
      fireEvent.changeText(password, '123456');
      fireEvent.changeText(confirm, '123456');
      fireEvent.press(button);
      expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor insira um email válido');
    });
  });

  /* ========== TESTES DE ACEITAÇÃO ========== */
  describe('Testes de aceitação - Firebase e Navegação', () => {
    const fillForm = () => {
      fireEvent.changeText(screen.getByTestId('email-input'), 'teste@email.com');
      fireEvent.changeText(screen.getByTestId('password-input'), '123456789');
      fireEvent.changeText(screen.getByTestId('confirm-password-input'), '123456789');
      fireEvent.press(screen.getByText('Registar'));
    };

    it('cria conta com sucesso e redireciona', async () => {
      createUserWithEmailAndPassword.mockResolvedValueOnce({ user: {} });
      fillForm();

      await waitFor(() => {
        expect(createUserWithEmailAndPassword).toHaveBeenCalled();
        expect(Alert.alert).toHaveBeenCalledWith('Sucesso', 'Conta criada!', expect.any(Array));
      });
    });

    it('mostra erro quando email já existe', async () => {
      createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/email-already-in-use' });
      fillForm();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Email já registado');
      });
    });

    it('mostra erro quando password é fraca', async () => {
      createUserWithEmailAndPassword.mockRejectedValueOnce({ code: 'auth/weak-password' });
      fillForm();

      await waitFor(() => {
        expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Password muito fraca');
      });
    });

    it('navega para o login ao clicar em "Faça login"', () => {
      fireEvent.press(screen.getByText('Faça login'));
      expect(router.back).toHaveBeenCalled();
    });
  });
});