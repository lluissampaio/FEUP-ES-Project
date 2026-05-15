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

jest.mock('@/hooks/useSupermarkets', () => ({
  useSupermarkets: () => ({ supermarkets: [{ id: 'continente', name: 'Continente' }, { id: 'pingo-doce', name: 'Pingo Doce' }] }),
}));

import Cart from '@/app/(tabs)/cart';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import useCart from '@/hooks/useCart';

jest.mock('@/hooks/useCart');

describe('Acceptance Test: Página do Carrinho - Novas Funcionalidades', () => {
  
  it('deve renderizar o seletor global "Poupar em:"', () => {
    useCart.mockReturnValue({
      products: [{ id: '1', name: 'Pimento', currentPrice: 1.0, quantity: 1, bestStore: 'continente', prices: { continente: { current_price: 1.0 } } }],
      total: 1.0,
      loading: false,
      updateAllItemsStore: jest.fn(),
    });

    render(<Cart />);
    expect(screen.getByText('Poupar em:')).toBeTruthy();
    expect(screen.getByText('Melhor Preço (Mix)')).toBeTruthy();
  });

  it('deve chamar updateAllItemsStore ao selecionar um supermercado global', () => {
    const updateAllItemsStore = jest.fn();
    useCart.mockReturnValue({
      products: [{ id: '1', name: 'Pimento', currentPrice: 1.0, quantity: 1, bestStore: 'continente', prices: { continente: { current_price: 1.0 }, 'pingo-doce': { current_price: 0.8 } } }],
      total: 1.0,
      loading: false,
      updateAllItemsStore,
    });

    render(<Cart />);
    
    // Clicar no DropdownPill (que mostra "Melhor Preço (Mix)")
    fireEvent.press(screen.getByText('Melhor Preço (Mix)'));
    
    expect(screen.getByText('Pingo Doce')).toBeTruthy();
    
    fireEvent.press(screen.getByText('Pingo Doce'));
    expect(updateAllItemsStore).toHaveBeenCalledWith('pingo-doce');
  });

  it('deve remover o item da UI quando a quantidade chega a 0', () => {
    const updateQuantity = jest.fn();
    useCart.mockReturnValue({
      products: [{ id: '1', name: 'Pimento', currentPrice: 1.0, quantity: 1, bestStore: 'continente', prices: { continente: { current_price: 1.0 } } }],
      total: 1.0,
      loading: false,
      updateQuantity,
    });

    render(<Cart />);
    
    fireEvent.press(screen.getByTestId('decrement-button'));
    expect(updateQuantity).toHaveBeenCalledWith('1', -1);
  });
});