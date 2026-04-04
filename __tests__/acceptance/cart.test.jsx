import Cart from '@/app/(tabs)/cart';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

describe('Acceptance Test: Página do Carrinho', () => {
  
  it('fluxo completo: mostra produtos, limpa o carrinho e tenta limpar vazio', () => {
    render(<Cart />);

    expect(screen.getByText('Leite')).toBeTruthy();
    expect(screen.getByText('Pão')).toBeTruthy();
    expect(screen.getByText('Total: 2.09 €')).toBeTruthy();

    const botaoLimpar = screen.getByText('Limpar');
    fireEvent.press(botaoLimpar);

    expect(screen.queryByText('Leite')).toBeNull();
    expect(screen.queryByText('Pão')).toBeNull();
    expect(screen.queryByText('Total: 2.09 €')).toBeNull();

    fireEvent.press(botaoLimpar);

    expect(screen.getByText('Impossível limpar carrinho vazio')).toBeTruthy();
  });

});