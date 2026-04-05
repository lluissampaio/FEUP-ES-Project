import React from "react";
import { render, screen, fireEvent, waitFor } from '@testing-library/react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";
import { Alert } from 'react-native';

/*------------Mocks------------*/

// Mock do router (navegação entre abas)
jest.mock('expo-router',() => ({
    router: {
        replace: jest.fn(),
    },
}));


// Mock ThemedText - versão que retira contexto
jest.mock('@/components/ThemedText', () => {
    const { Text, Alert } = require('react-native');       // Importa os componentes nativos do react native
    return ({ children, ...props }) => <Text {...props}>{children}</Text>;
});

// Mock ThemedView - versão que retira contexto
jest.mock('@/components/ThemedView', () => {
    const { View } = require('react-native');
    return ({ children, ...props }) => <View {...props}>{children}</View>;
});


import Login from '../../app/index.jsx';   // Apenas pode ser importado aqui por causa dos mocks

/*------------Testes------------*/

describe('Login screen', () => {
    // Antes de cada testes resetar os mocks
    beforeEach(() => {
        jest.clearAllMocks();
        // Mock do Alert
        jest.spyOn(Alert, 'alert').mockImplementation(() => {});       // Tem de ser apenas spyOn desta forma porque é nativo e não pode ser substituido
        render(
            <Login />      /* Renderiza a componente Login antes de cada teste (importante!!!)*/
        );
    });

    /*------------Texto no ecrã------------*/

    describe('Text', () => {

        it('Título', () => {
            expect(screen.getByText('Log in')).toBeTruthy();
        });

        it('Subtítulo', () => {
            expect(screen.getByText('Insira as suas credenciais')).toBeTruthy();
        });

        it('Email', () => {
            expect(screen.getByText('Email')).toBeTruthy();
        });

        it('Password', () => {
            expect(screen.getByText('Password')).toBeTruthy();
        });

        it('Login button', () => {
            expect(screen.getByText('Log In')).toBeTruthy();
        });

        it('Password esquecida', () => {
            expect(screen.getByText('Esqueceu-se da sua password?')).toBeTruthy();
        });
        
        it('Registar-se', () => {
            expect(screen.getByText('Registe-se')).toBeTruthy();
        });
    });

    /*------------Testes de aceitação------------*/

    describe('Testes de aceitação', () => {

        it('Login com sucesso', async () => {
            const emailInput = screen.getByTestId('email-input');
            const passwordInput = screen.getByTestId('password-input');
            const loginButton = screen.getByTestId('login-button');

            const { router } = require('expo-router');

            fireEvent.changeText(emailInput, 'exemplo@email.com');
            fireEvent.changeText(passwordInput, 'exemplo123');
            fireEvent.press(loginButton);

            await waitFor(() => {
                expect(router.replace).toHaveBeenCalledWith('/(tabs)'); // Esperar para ver se a troca de ecrã é feita pelo router
            });
        });

        it('Campos vazios', () => {
            const loginButton = screen.getByTestId('login-button');

            fireEvent.press(loginButton);

            expect(Alert.alert).toHaveBeenCalledWith('Erro', 'Por favor preencha todos os campos');
        });



    });





});