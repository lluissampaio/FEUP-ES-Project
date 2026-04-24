import SearchSupermarkets from '@/app/search/supermarkets';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

jest.mock('@/hooks/useSupermarkets', () => ({
  useSupermarkets: jest.fn()
}));

jest.mock('@/hooks/useActiveLocation', () => ({
  useActiveLocation: jest.fn()
}));

jest.mock('@/constants/images', () => ({
  getImageForSupermarket: jest.fn(() => null),
}));

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

describe('Acceptance Test: Filtros de Supermercados (Aberto e Distância)', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();

    useActiveLocation.mockReturnValue({
      location: { latitude: 41.15, longitude: -8.61 },
      isLoading: false,
    });

    useSupermarkets.mockReturnValue({
      loading: false,
      supermarkets: [
        { 
          id: '1', 
          name: 'Continente Perto Aberto', 
          rawDistance: 0.5,
          formattedDistance: '0.5 km', 
          isOpen: true, 
          scheduleToday: '8h-22h' 
        },
        { 
          id: '2', 
          name: 'Pingo Doce Longe Aberto', 
          rawDistance: 6.0, 
          formattedDistance: '6.0 km', 
          isOpen: true, 
          scheduleToday: '8h-22h' 
        },
        { 
          id: '3', 
          name: 'Mercadona Perto Fechado', 
          rawDistance: 0.8, 
          formattedDistance: '0.8 km', 
          isOpen: false, 
          scheduleToday: 'Fechado' 
        }
      ]
    });
  });

  it('Cenário 1: Filtro aplicado com sucesso (Oculta lojas fechadas e distantes)', () => {
    render(<SearchSupermarkets />);

    expect(screen.getByText('Continente Perto Aberto')).toBeTruthy();
    expect(screen.getByText('Pingo Doce Longe Aberto')).toBeTruthy();
    expect(screen.getByText('Mercadona Perto Fechado')).toBeTruthy();

    const btnAberto = screen.getAllByText('Aberto')[0];
    fireEvent.press(btnAberto);

    expect(screen.queryByText('Mercadona Perto Fechado')).toBeNull();
    expect(screen.getByText('Continente Perto Aberto')).toBeTruthy();
    expect(screen.getByText('Pingo Doce Longe Aberto')).toBeTruthy();

    const btnDistancia = screen.getByText('Distância');
    fireEvent.press(btnDistancia);
    
    const opcaoDistancia = screen.getByText('< 5 km');
    fireEvent.press(opcaoDistancia);

    expect(screen.queryByText('Pingo Doce Longe Aberto')).toBeNull();
    expect(screen.getByText('Continente Perto Aberto')).toBeTruthy();
  });

  it('Cenário 2: Filtros demasiado restritos (Exclui todos os resultados)', () => {
    render(<SearchSupermarkets />);

    const btnDistancia = screen.getByText('Distância');
    fireEvent.press(btnDistancia);
    
    const opcaoDistancia = screen.getByText('< 1 km');
    fireEvent.press(opcaoDistancia);

    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.changeText(searchInput, 'Pingo Doce');

    expect(screen.queryByText('Pingo Doce Longe Aberto')).toBeNull();
    expect(screen.queryByText('Continente Perto Aberto')).toBeNull();
    expect(screen.getByText('Nenhuma loja encontrada')).toBeTruthy();
  });

});