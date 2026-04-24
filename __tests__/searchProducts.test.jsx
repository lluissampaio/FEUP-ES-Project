import Explore from '@/app/(tabs)/explore';
import useProducts from '@/hooks/useProducts';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('@/hooks/useProducts', () => {
  return {
    __esModule: true,
    default: jest.fn()
  };
});

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

// Mock do FlashList para evitar erros de act() com o render assíncrono interno do componente
jest.mock('@shopify/flash-list', () => {
  const { View } = require('react-native');
  const React = require('react');
  return {
    FlashList: ({ data, renderItem, ListEmptyComponent }) => (
      <View>
        {data && data.length > 0
          ? data.map((item, index) => (
              <View key={item.id ?? index}>{renderItem({ item, index })}</View>
            ))
          : ListEmptyComponent}
      </View>
    ),
  };
});

describe('Acceptance Test: Pesquisa de Produtos e Preços no Explore', () => {

  it('Cenário 1 e 2: Renderiza produto base, capacidade e calcula a badge de Melhor Preço', () => {
    useProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: 'prod_acucar_mb',
          name: 'Açúcar Branco',
          formattedCapacity: '1 Kg',
          currentPrice: 0.94,
          isPromo: true,
          originalPrice: 1.08,
          bestStore: 'Minipreço'
        }
      ]
    });

    render(<Explore />);

    expect(screen.getByText('Açúcar Branco')).toBeTruthy();
    expect(screen.getByText('1 Kg')).toBeTruthy();

    expect(screen.getByText(/Melhor preço:/)).toBeTruthy();
    expect(screen.getByText('Minipreço')).toBeTruthy();
  });

  it('Cenário 3: Renderiza preço promocional com strikethrough vs Preço Normal', () => {
    useProducts.mockReturnValue({
      loading: false,
      products: [
        {
          id: 'prod_1',
          name: 'Produto Com Promo',
          currentPrice: 0.94,
          isPromo: true,
          originalPrice: 1.08,
          bestStore: 'Minipreço'
        },
        {
          id: 'prod_2',
          name: 'Produto Sem Promo',
          currentPrice: 0.99,
          isPromo: false,
          originalPrice: 0.99,
          bestStore: 'Continente'
        }
      ]
    });

    render(<Explore />);

    expect(screen.getByText('0.94€')).toBeTruthy();
    
    const originalPricePromo = screen.getByText('1.08€');
    expect(originalPricePromo).toBeTruthy();
    expect(originalPricePromo.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
    );

    expect(screen.getByText('0.99€')).toBeTruthy();
    const originalPrices = screen.queryAllByText('0.99€');
    expect(originalPrices.length).toBe(1);
  });

  it('Cenário 4: Erro de rede / Sem resultados mostra Empty State', () => {
    useProducts.mockReturnValue({
      loading: false,
      products: []
    });

    render(<Explore />);

    const searchInput = screen.getByPlaceholderText('Pesquisar produtos...');
    fireEvent.changeText(searchInput, 'Inexistente');

    expect(screen.getByText('Nenhum produto encontrado')).toBeTruthy();
  });

});