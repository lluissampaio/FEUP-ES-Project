import React from "react";
import { render, screen, fireEvent } from '@testing-library/react-native';
import { SafeAreaProvider } from "react-native-safe-area-context";

/*------------Mocks------------*/

// Mock do router (navegação entre abas)
jest.mock('expo-router',() => ({
    router: {
        replace: jest.fn(),
    },
}));

// Mock do avisos (popups)
jest.mock('react-native/Libraries/Alert/Alert',() => ({
    alert: jest.fn(),
}));

// Mock ThemedText - versão que retira contexto
jest.mock('@/components/ThemedText', () => {
    const { Text } = require('react-native');       // Importa os componentes nativos do react native
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

    /*------------Testes preencher campos------------*/





});