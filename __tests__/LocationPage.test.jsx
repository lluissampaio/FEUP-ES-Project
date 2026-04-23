import { render, screen, fireEvent, waitFor, act } from '@testing-library/react-native';
import LocationPage from '@/app/location/index';
import { searchLocations } from '@/utils/photon';
import { useActiveLocation } from '@/hooks/useActiveLocation';

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
  const React = require('react');
  const { View } = require('react-native');
  return {
    ...require('react-native-safe-area-context/jest/mock').default,
    useSafeAreaInsets: jest.fn(() => ({ top: 0, bottom: 0, left: 0, right: 0 })),
  };
});

// Mock AppIcon to easily find icons by testID
jest.mock('@/components/AppIcon', () => {
  const React = require('react');
  const { Text } = require('react-native');
  return ({ name, color, weight }) => (
    <Text testID={`icon-${name}`} color={color} weight={weight}>
      Icon: {name}
    </Text>
  );
});

describe('Acceptance Test: Página de Localização', () => {
  beforeEach(() => {
    jest.clearAllMocks();

    // Default mock state: No location defined
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
  });

  describe('Estados de Status', () => {
    it('Sem localização definida mostra mensagem de erro e ícone vermelho', () => {
      render(<LocationPage />);

      expect(screen.getByText('Sem localização definida')).toBeTruthy();
      expect(screen.getByTestId('icon-map')).toBeTruthy();
      // Check if icon has warning color
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
      
      // Card details
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

    it('Deve chamar clearOverride ao pressionar o botão Remover', () => {
      useActiveLocation.mockReturnValue({
        location: { latitude: 38.72, longitude: -9.13 },
        isLoading: false,
        override: { type: 'manual', lat: 38.72, lon: -9.13, name: 'Lisboa, Portugal' },
        setManualLocation: mockSetManualLocation,
        clearOverride: mockClearOverride,
        refreshLocation: mockRefreshLocation,
      });

      render(<LocationPage />);

      const removeButton = screen.getByText('Remover');
      fireEvent.press(removeButton);

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

      // Should NOT have called the API yet (debounce)
      expect(searchLocations).not.toHaveBeenCalled();

      // Advance time by 300ms
      await act(async () => {
        jest.advanceTimersByTime(300);
      });

      // Now it should have called the API
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

      // Wait for the API mock to resolve and UI to update
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

      // Wait for result to appear
      const resultItem = await waitFor(() => screen.getByText('Porto, Portugal'));
      
      // Press the result
      fireEvent.press(resultItem);

      // Verify it called the hook with the correct location data
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
        expect(screen.getByText('Sem resultados para "xyz"')).toBeTruthy();
      });
    });

    it('Deve exibir "A pesquisar..." durante a chamada à API', async () => {
      // Create a promise that we control, so it stays pending
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

      // While the API is pending, we should see the loading text
      expect(screen.getByText('A pesquisar...')).toBeTruthy();

      // Resolve the API to clean up
      await act(async () => {
        resolveApi([]);
      });

      jest.useRealTimers();
    });
  });
});