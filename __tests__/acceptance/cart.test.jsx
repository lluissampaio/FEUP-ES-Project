import Cart from '@/app/(tabs)/cart';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

describe('Acceptance Test: Página do Carrinho', () => {
  
  it('Cenário 1: Limpa todos os itens do carrinho com sucesso', () => {
    render(<Cart />);

    const itensIniciais = screen.getAllByTestId('cart-item');
    expect(itensIniciais.length).toBeGreaterThan(0);

    expect(screen.getByText(/Total:/i)).toBeTruthy();

    const botaoLimpar = screen.getByText('Limpar');
    fireEvent.press(botaoLimpar);

    const itensFinais = screen.queryAllByTestId('cart-item');
    expect(itensFinais.length).toBe(0);

    expect(screen.queryByText(/Total:/i)).toBeNull();
  });

  it('Cenário 2: Mostra aviso ao tentar limpar um carrinho que já está vazio', () => {
    render(<Cart />);
    
    const botaoLimpar = screen.getByText('Limpar');

    fireEvent.press(botaoLimpar);
    
    expect(screen.queryAllByTestId('cart-item').length).toBe(0);

    fireEvent.press(botaoLimpar);

    expect(screen.getByText('Impossível limpar carrinho vazio')).toBeTruthy();
  });

});