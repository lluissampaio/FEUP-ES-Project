import SearchSupermarkets from '@/app/search/supermarkets';
import { useSupermarkets } from '@/hooks/useSupermarkets';
import { fireEvent, render, screen } from '@testing-library/react-native';

jest.mock('expo-location', () => ({
  requestForegroundPermissionsAsync: jest.fn().mockResolvedValue({ status: 'granted' }),
  getCurrentPositionAsync: jest.fn().mockResolvedValue({ coords: { latitude: 41.177, longitude: -8.591 } }),
  Accuracy: { Balanced: 3 }
}));

jest.mock('@/hooks/useSupermarkets', () => ({
  useSupermarkets: jest.fn()
}));

jest.mock('react-native-safe-area-context', () => require('react-native-safe-area-context/jest/mock').default);

describe('Acceptance Test: Pesquisa de Supermercados', () => {

  it('Cenário 1: Pesquisa com sucesso retorna apenas a lista filtrada', async () => {
    useSupermarkets.mockReturnValue({
      loading: false,
      supermarkets: [
        { 
          id: '1', 
          name: 'Continente Asprela', 
          formattedDistance: '1.2 km',
          isOpen: true,
          scheduleToday: '8h-22h'
        },
        { 
          id: '2', 
          name: 'Pingo Doce Areosa', 
          formattedDistance: '3.0 km',
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
    expect(screen.getByText('Aberto')).toBeTruthy();
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
          isOpen: true,
          scheduleToday: '8h-22h'
        },
        { 
          id: '2', 
          name: 'Pingo Doce Areosa', 
          formattedDistance: '3.0 km',
          isOpen: false,
          scheduleToday: 'Fechado'
        }
      ]
    });

    render(<SearchSupermarkets />);

    expect(screen.getByText('Continente Asprela')).toBeTruthy();
    expect(screen.getByText('Aberto')).toBeTruthy();

    expect(screen.getByText('Pingo Doce Areosa')).toBeTruthy();
    expect(screen.getByText('Fechado')).toBeTruthy();
  });

});