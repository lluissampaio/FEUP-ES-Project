import LocationPage from '@/app/location/index';
import { useActiveLocation } from '@/hooks/useActiveLocation';
import { searchLocations } from '@/utils/photon';
import { act, fireEvent, render, screen, waitFor } from '@testing-library/react-native';

// Mock expo-router
jest.mock('expo-router', () => ({
  router: { push: jest.fn(), back: jest.fn() },
}));

// Mock useActiveLocation hook
const mockSetManualLocation = jest.fn();
const mockClearOverride = jest.fn();
const mockRefreshLocation = jest.fn();

jest.mock('@/hooks/useActiveLocation', () => ({
  useActiveLocation: jest.fn(),
}));

// Mock searchLocations (photon util)
jest.mock('@/utils/photon', () => ({
  searchLocations: jest.fn(),
}));

// Mock SafeAreaContext
jest.mock('react-native-safe-area-context', () => {
  return {
    ...require('react-native-safe-area-context/jest/mock').default,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

// Mock AppIcon to easily find icons by testID
jest.mock('@/components/AppIcon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  
  function MockAppIcon({ name, color, weight }) {
    return (
      <Text testID={`icon-${name}`} color={color} weight={weight}>
        Icon: {name}
      </Text>
    );
  }
  return MockAppIcon;
});

describe('Acceptance Test: Página de Localização', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    useActiveLocation.mockReturnValue({
      location: null,
      isLoading: false,
      override: null,
      setManualLocation: mockSetManualLocation,
      clearOverride: mockClearOverride,
      refreshLocation: mockRefreshLocation,
    });

    // Default mock for Photon API: no results
    searchLocations.mockResolvedValue([]);
    
    // mockSetManualLocation precisa de resolver para não bloquear act()
    mockSetManualLocation.mockResolvedValue(undefined);
    mockClearOverride.mockResolvedValue(undefined);
  });

  describe('Estados de Status', () => {
    it('Sem localização definida mostra mensagem de erro e ícone vermelho', () => {
      render(<LocationPage />);

      expect(screen.getByText('Sem localização definida')).toBeTruthy();
      expect(screen.getByTestId('icon-map')).toBeTruthy();
      expect(screen.getByTestId('icon-map').props.color).toBe('#cc475a');
    });

    it('Localização GPS ativa mostra mensagem de sucesso e ícone verde', () => {
      useActiveLocation.mockReturnValue({
        location: { latitude: 41.15, longitude: -8.61 },
        isLoading: false,
        override: null,
        setManualLocation: mockSetManualLocation,
        clearOverride: mockClearOverride,
        refreshLocation: mockRefreshLocation,
      });

      render(<LocationPage />);

      expect(screen.getByText('Localização GPS ativa')).toBeTruthy();
      expect(screen.getByTestId('icon-map').props.color).toBe('#53B175');
    });

    it('Localização Manual ativa mostra card com detalhes', () => {
      useActiveLocation.mockReturnValue({
        location: { latitude: 38.72, longitude: -9.13 },
        isLoading: false,
        override: { type: 'manual', lat: 38.72, lon: -9.13, name: 'Lisboa, Portugal' },
        setManualLocation: mockSetManualLocation,
        clearOverride: mockClearOverride,
        refreshLocation: mockRefreshLocation,
      });

      render(<LocationPage />);

      expect(screen.getByText('Localização manual ativa')).toBeTruthy();
      expect(screen.getByTestId('icon-map').props.color).toBe('#53B175');
      
      expect(screen.getByText('Lisboa, Portugal')).toBeTruthy();
      expect(screen.getByText('38.7200, -9.1300')).toBeTruthy();
      expect(screen.getByText('Remover')).toBeTruthy();
    });
  });

  describe('Interações de Localização', () => {
    it('Deve chamar refreshLocation ao pressionar o botão GPS', () => {
      render(<LocationPage />);
      
      const gpsButton = screen.getByText('Usar localização GPS');
      fireEvent.press(gpsButton);

      expect(mockRefreshLocation).toHaveBeenCalledTimes(1);
    });

    it('Deve chamar clearOverride ao pressionar o botão Remover', async () => {
      useActiveLocation.mockReturnValue({
        location: { latitude: 38.72, longitude: -9.13 },
        isLoading: false,
        override: { type: 'manual', lat: 38.72, lon: -9.13, name: 'Lisboa, Portugal' },
        setManualLocation: mockSetManualLocation,
        clearOverride: mockClearOverride,
        refreshLocation: mockRefreshLocation,
      });

      render(<LocationPage />);

      await act(async () => {
        fireEvent.press(screen.getByText('Remover'));
      });

      expect(mockClearOverride).toHaveBeenCalledTimes(1);
    });
  });

  describe('Pesquisa de Localização (Photon API)', () => {
    it('Deve chamar a API após 300ms de debounced input', async () => {
      jest.useFakeTimers();
      render(<LocationPage />);

      const searchInput = screen.getByPlaceholderText('Pesquisar cidade, morada...');
      
      await act(async () => {
        fireEvent.changeText(searchInput, 'Porto');
      });

      expect(searchLocations).not.toHaveBeenCalled();

      await act(async () => {
        jest.advanceTimersByTime(300);
      });

      expect(searchLocations).toHaveBeenCalledWith('Porto');

      jest.useRealTimers();
    });

    it('Não deve chamar a API para queries com menos de 3 caracteres', async () => {
      jest.useFakeTimers();
      render(<LocationPage />);

      const searchInput = screen.getByPlaceholderText('Pesquisar cidade, morada...');
      
      await act(async () => {
        fireEvent.changeText(searchInput, 'Po');
        jest.advanceTimersByTime(300);
      });

      expect(searchLocations).not.toHaveBeenCalled();

      jest.useRealTimers();
    });

    it('Deve exibir os resultados da pesquisa quando a API retorna dados', async () => {
      searchLocations.mockResolvedValue([
        { id: '1', displayString: 'Porto, Portugal', latitude: 41.15, longitude: -8.61 },
        { id: '2', displayString: 'Porto União, Brasil', latitude: -26.23, longitude: -51.07 },
      ]);

      render(<LocationPage />);

      const searchInput = screen.getByPlaceholderText('Pesquisar cidade, morada...');
      
      await act(async () => {
        fireEvent.changeText(searchInput, 'Porto');
      });

      await waitFor(() => {
        expect(screen.getByText('Porto, Portugal')).toBeTruthy();
        expect(screen.getByText('Porto União, Brasil')).toBeTruthy();
      });
    });

    it('Deve chamar setManualLocation ao selecionar um resultado', async () => {
      const mockResult = { id: '1', displayString: 'Porto, Portugal', latitude: 41.15, longitude: -8.61 };
      searchLocations.mockResolvedValue([mockResult]);

      render(<LocationPage />);

      const searchInput = screen.getByPlaceholderText('Pesquisar cidade, morada...');
      
      await act(async () => {
        fireEvent.changeText(searchInput, 'Porto');
      });

      const resultItem = await waitFor(() => screen.getByText('Porto, Portugal'));
      
      await act(async () => {
        fireEvent.press(resultItem);
      });

      expect(mockSetManualLocation).toHaveBeenCalledWith(mockResult);
    });

    it('Deve exibir "Sem resultados" para pesquisas sem match', async () => {
      searchLocations.mockResolvedValue([]);

      render(<LocationPage />);

      const searchInput = screen.getByPlaceholderText('Pesquisar cidade, morada...');
      
      await act(async () => {
        fireEvent.changeText(searchInput, 'xyz');
      });

      await waitFor(() => {
        expect(screen.getByText('Sem resultados para xyz')).toBeTruthy();
      });
    });

    it('Deve exibir "A pesquisar..." durante a chamada à API', async () => {
      let resolveApi;
      searchLocations.mockReturnValue(new Promise((resolve) => {
        resolveApi = resolve;
      }));

      jest.useFakeTimers();
      render(<LocationPage />);

      const searchInput = screen.getByPlaceholderText('Pesquisar cidade, morada...');
      
      await act(async () => {
        fireEvent.changeText(searchInput, 'Lisboa');
        jest.advanceTimersByTime(300);
      });

      expect(screen.getByText('A pesquisar...')).toBeTruthy();

      await act(async () => {
        resolveApi([]);
      });

      jest.useRealTimers();
    });
  });
});