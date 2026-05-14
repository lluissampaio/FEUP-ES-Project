import SearchSupermarkets from '@/app/search/supermarkets';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('@react-native-async-storage/async-storage', () => ({
  getItem: jest.fn(() => Promise.resolve(null)),
  setItem: jest.fn(() => Promise.resolve()),
  removeItem: jest.fn(() => Promise.resolve()),
}));

jest.mock('@/hooks/useSupermarkets', () => ({
  useSupermarkets: jest.fn()
}));

// FIX: o ecrã usa useActiveLocation, não useUserLocation
jest.mock('@/hooks/useActiveLocation', () => ({
  useActiveLocation: jest.fn()
}));

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

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

describe('Acceptance Test: Pesquisa de Supermercados', () => {

  beforeEach(() => {
    jest.clearAllMocks();
    useActiveLocation.mockReturnValue({
      location: { latitude: 41.177, longitude: -8.591 },
      isLoading: false,
    });
  });

  it('Cenário 1: Pesquisa com sucesso retorna apenas a lista filtrada', async () => {
    useSupermarkets.mockReturnValue({
      loading: false,
      supermarkets: [
        { 
          id: '1', 
          name: 'Continente Asprela', 
          formattedDistance: '1.2 km',
          rawDistance: 1.2,
          isOpen: true,
          scheduleToday: '8h-22h'
        },
        { 
          id: '2', 
          name: 'Pingo Doce Areosa', 
          formattedDistance: '3.0 km',
          rawDistance: 3.0,
          isOpen: false,
          scheduleToday: 'Fechado'
        }
      ]
    });

    render(<SearchSupermarkets />);

    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.changeText(searchInput, 'Continente');

    expect(screen.getByText('Continente Asprela')).toBeTruthy();
    expect(screen.getByText('1.2 km')).toBeTruthy();
    expect(screen.getAllByText('Aberto').length).toBeGreaterThan(0);
    expect(screen.getByText('Hoje: 8h-22h')).toBeTruthy();

    expect(screen.queryByText('Pingo Doce Areosa')).toBeNull();
  });

  it('Cenário 2: Erro de rede/Sem resultados mostra mensagem de Empty State', async () => {
    useSupermarkets.mockReturnValue({
      loading: false,
      supermarkets: []
    });

    render(<SearchSupermarkets />);

    const searchInput = screen.getByPlaceholderText('Pesquisar...');
    fireEvent.changeText(searchInput, 'Inexistente');

    expect(screen.getByText('Nenhuma loja encontrada')).toBeTruthy();
  });

  it('Cenário 3: Renderização inicial exibe todos os supermercados com os devidos estados', async () => {
    useSupermarkets.mockReturnValue({
      loading: false,
      supermarkets: [
        { 
          id: '1', 
          name: 'Continente Asprela', 
          formattedDistance: '1.2 km',
          rawDistance: 1.2,
          isOpen: true,
          scheduleToday: '8h-22h'
        },
        { 
          id: '2', 
          name: 'Pingo Doce Areosa', 
          formattedDistance: '3.0 km',
          rawDistance: 3.0,
          isOpen: false,
          scheduleToday: 'Fechado'
        }
      ]
    });

    render(<SearchSupermarkets />);

    expect(screen.getByText('Continente Asprela')).toBeTruthy();
    expect(screen.getAllByText('Aberto').length).toBeGreaterThan(0);

    expect(screen.getByText('Pingo Doce Areosa')).toBeTruthy();
    expect(screen.getByText('Fechado')).toBeTruthy();
  });

});