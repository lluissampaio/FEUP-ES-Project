import ProductDetail from '@/app/product/[id]';
import { useProductDetail } from '@/hooks/useProductDetails';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native'; // {Import adicionado para o teste do Loading}

// {Mocks de navegação e safe-area}
jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => ({ id: 'prod_123' }),
}));

jest.mock('react-native-safe-area-context', () => 
  require('react-native-safe-area-context/jest/mock').default
);

// {Mock do hook central que substituí o Firebase neste ecrã}
jest.mock('@/hooks/useProductDetails', () => ({
  useProductDetail: jest.fn(),
  formatUnitPrice: jest.fn((data, cap, unit) => `${data.current_price}€ / ${unit}`),
}));

// {Mock de componentes visuais para evitar erros de renderização complexa}
jest.mock('@/constants/images', () => ({
  getImageForProductCategory: jest.fn(() => null),
  getImageForSupermarket: jest.fn(() => null),
}));

describe('Acceptance Test: Detalhe do Produto e Comparador de Preços', () => {
  
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const baseProduct = {
    id: 'prod_123',
    name: 'Açúcar Branco',
    category: 'Mercearia',
    formattedCapacity: '1 Kg',
    capacity: 1,
    measurement_unit: 'Kg',
    image_ref: 'mercearia',
  };

  it('Cenário 1: Renderização básica (Loading e Dados)', () => {
    // {Simula o estado inicial de carregamento}
    useProductDetail.mockReturnValue({ loading: true, product: null });
    const { rerender } = render(<ProductDetail />);
    
    // {Procura diretamente pelo componente ActivityIndicator sem depender de TestIDs}
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy(); 

    // {Simula os dados carregados}
    useProductDetail.mockReturnValue({
      loading: false,
      product: baseProduct,
      sortedPrices: [],
      selectedStoreKey: null,
      totalPrice: 0,
      handleSelectStore: jest.fn(),
    });

    rerender(<ProductDetail />);

    expect(screen.getByText('Açúcar Branco')).toBeTruthy();
    expect(screen.getByText('Mercearia • 1 Kg')).toBeTruthy();
  });

  it('Cenário 2 & 4: Ordenação de Preços, "Melhor Escolha" e Promoções', () => {
    useProductDetail.mockReturnValue({
      loading: false,
      product: baseProduct,
      sortedPrices: [
        ['minipreco', { current_price: 0.94, original_price: 1.08, is_promo: true }],
        ['continente', { current_price: 0.99, original_price: null, is_promo: false }],
      ],
      selectedStoreKey: 'minipreco', // {Mais barato selecionado por defeito}
      totalPrice: 0.94,
      handleSelectStore: jest.fn(),
    });

    render(<ProductDetail />);

    // {Verifica a tag da Melhor Escolha}
    expect(screen.getByText('MELHOR ESCOLHA')).toBeTruthy();

    // {Verifica o preço promocional rasurado no Minipreço}
    const originalPrice = screen.getByText('1.08€');
    expect(originalPrice).toBeTruthy();
    expect(originalPrice.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
    );

    // {Verifica que o preço 0.94€ existe 2 vezes (1x no Cartão, 1x no Rodapé)}
    const prices = screen.getAllByText('0.94€');
    expect(prices.length).toBe(2);
  });

  it('Cenário 3: Interação e alteração dinâmica do preço no CTA', () => {
    const mockHandleSelect = jest.fn();
    
    // {Inicia com Continente selecionado para simular o clique}
    useProductDetail.mockReturnValue({
      loading: false,
      product: baseProduct,
      sortedPrices: [
        ['minipreco', { current_price: 0.94, original_price: null, is_promo: false }],
        ['continente', { current_price: 0.99, original_price: null, is_promo: false }],
      ],
      selectedStoreKey: 'continente',
      totalPrice: 0.99, 
      handleSelectStore: mockHandleSelect,
    });

    render(<ProductDetail />);

    // {A label de acessibilidade no PriceCard permite encontrar o botão exato}
    const storeButton = screen.getByLabelText('Selecionar Minipreco, 0.94 euros');
    fireEvent.press(storeButton);

    // {Garante que a função do hook é chamada com a loja certa}
    expect(mockHandleSelect).toHaveBeenCalledWith('minipreco');
    
    // {Garante que o rodapé reflete o preço}
    expect(screen.getByText('Adicionar à Lista')).toBeTruthy();
    
    // {Verifica que o preço 0.99€ existe 2 vezes (1x no Cartão, 1x no Rodapé)}
    const prices = screen.getAllByText('0.99€');
    expect(prices.length).toBe(2);
  });

  it('Cenário 5: Tratamento de Loja Única', () => {
    useProductDetail.mockReturnValue({
      loading: false,
      product: baseProduct,
      sortedPrices: [
        ['mercadona', { current_price: 0.98, original_price: null, is_promo: false }],
      ],
      selectedStoreKey: 'mercadona',
      totalPrice: 0.98,
      handleSelectStore: jest.fn(),
    });

    render(<ProductDetail />);

    // {Deve aparecer apenas uma vez o preço 0.98 (no card) e outra no rodapé}
    const prices = screen.getAllByText('0.98€');
    expect(prices.length).toBe(2); 

    // {Garante que só há um supermercado renderizado}
    expect(screen.getByText('Mercadona')).toBeTruthy();
    expect(screen.queryByText('Continente')).toBeNull();
  });

  it('Exibe fallback quando o produto não existe', () => {
    useProductDetail.mockReturnValue({
      loading: false,
      product: null, // {Produto não encontrado}
    });

    render(<ProductDetail />);

    expect(screen.getByText('Produto não encontrado.')).toBeTruthy();
  });
});