// Mocks devem vir antes de quase tudo
jest.mock("@/firebaseConfig", () => ({
  auth: { currentUser: { uid: "test-uid" } },
  db: {},
}));

jest.mock("firebase/firestore", () => ({
  doc: jest.fn(),
  onSnapshot: jest.fn(() => jest.fn()),
  setDoc: jest.fn(),
  updateDoc: jest.fn(),
}));

jest.mock('react-native-safe-area-context', () => ({
  useSafeAreaInsets: () => ({ top: 0, bottom: 0, left: 0, right: 0 }),
}));

import Cart from '@/app/(tabs)/cart';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import useCart from '@/hooks/useCart';

jest.mock('@/hooks/useCart');

describe('Acceptance Test: Página do Carrinho', () => {
  
  it('deve mostrar mensagem de carrinho vazio', () => {
    useCart.mockReturnValue({
      products: [],
      total: 0,
      loading: false,
      error: null,
    });

    render(<Cart />);
    expect(screen.getByText('O seu carrinho está vazio')).toBeTruthy();
  });

  it('deve renderizar produtos e o total estimado', () => {
    useCart.mockReturnValue({
      products: [
        { 
          id: '1', 
          name: 'Pimento Vermelho', 
          currentPrice: 0.94, 
          quantity: 2, 
          image_ref: 'frutas_vegetais',
          formattedCapacity: '1kg'
        },
      ],
      total: 1.88,
      loading: false,
      error: null,
      remove: jest.fn(),
      updateQuantity: jest.fn(),
    });

    render(<Cart />);
    
    expect(screen.getByText('Pimento Vermelho')).toBeTruthy();
    expect(screen.getByText('1.88 €')).toBeTruthy();
    expect(screen.getByText('Total Estimado')).toBeTruthy();
  });

  it('deve chamar updateQuantity ao clicar nos botões de + e -', () => {
    const updateQuantity = jest.fn();
    useCart.mockReturnValue({
      products: [
        { 
          id: '1', 
          name: 'Pimento', 
          currentPrice: 0.94, 
          quantity: 1, 
          image_ref: 'frutas_vegetais' 
        },
      ],
      total: 0.94,
      loading: false,
      updateQuantity,
    });

    render(<Cart />);
    
    fireEvent.press(screen.getByTestId('increment-button'));
    expect(updateQuantity).toHaveBeenCalledWith('1', 1);

    fireEvent.press(screen.getByTestId('decrement-button'));
    expect(updateQuantity).toHaveBeenCalledWith('1', -1);
  });
});