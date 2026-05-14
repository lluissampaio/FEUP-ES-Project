import Cart from '@/app/(tabs)/cart';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { Alert } from 'react-native';

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

describe('Acceptance Test: Página do Carrinho', () => {
  
  it('Cenário 1: Remove um item individual do carrinho', () => {
    render(<Cart />);

    const itensIniciais = screen.getAllByTestId('cart-item');
    const totalItens = itensIniciais.length;

    const botoesRemover = screen.getAllByTestId('remove-item');
    fireEvent.press(botoesRemover[0]);

    const itensFinais = screen.getAllByTestId('cart-item');
    expect(itensFinais.length).toBe(totalItens - 1);
  });

});