import ProductDetail from '@/app/product/[id]';
import { useProductDetail } from '@/hooks/useProductDetails';
import { fireEvent, render, screen } from '@testing-library/react-native';
import React from 'react';
import { ActivityIndicator } from 'react-native';

jest.mock('expo-router', () => ({
  router: { back: jest.fn() },
  useLocalSearchParams: () => ({ id: 'prod_123' }),
}));

jest.mock('react-native-safe-area-context', () => 
  require('react-native-safe-area-context/jest/mock').default
);

jest.mock('@/hooks/useProductDetails', () => ({
  useProductDetail: jest.fn(),
  formatUnitPrice: jest.fn((data, cap, unit) => {
    if (!data.unit_price || !unit) return null;
    return `${data.unit_price.toFixed(2)}€ / ${unit}`;
  }),
}));

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
    measurement_unit: 'kg',
    image_ref: 'mercearia',
    eco_score: 'B',
    nutri_score: 'D'
  };

  it('Cenário 1: Renderização básica (Loading, Dados e Badges)', () => {
    useProductDetail.mockReturnValue({ loading: true, product: null });
    const { rerender } = render(<ProductDetail />);
    
    expect(screen.UNSAFE_getByType(ActivityIndicator)).toBeTruthy(); 

    useProductDetail.mockReturnValue({
      loading: false,
      quantity: 1,
      product: baseProduct,
      sortedPrices: [],
      selectedStoreKey: null,
      totalPrice: 0,
      handleSelectStore: jest.fn(),
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
    });

    rerender(<ProductDetail />);

    expect(screen.getByText('Açúcar Branco')).toBeTruthy();
    expect(screen.getByText('Mercearia • 1 Kg')).toBeTruthy();
    
    // Verifica renderização das Badges Eco e Nutri
    expect(screen.getByText('ECO')).toBeTruthy();
    expect(screen.getByText('B')).toBeTruthy();
    expect(screen.getByText('NUTRI')).toBeTruthy();
    expect(screen.getByText('D')).toBeTruthy();
  });

  it('Cenário 2: Ordenação de Preços, "Melhor Escolha", Promoções e Preço Unitário', () => {
    useProductDetail.mockReturnValue({
      loading: false,
      quantity: 1,
      product: baseProduct,
      sortedPrices: [
        ['minipreco', { current_price: 0.94, original_price: 1.08, is_promo: true, unit_price: 0.94 }],
        ['continente', { current_price: 0.99, original_price: null, is_promo: false, unit_price: 0.99 }],
      ],
      selectedStoreKey: 'minipreco',
      totalPrice: 0.94,
      handleSelectStore: jest.fn(),
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
    });

    render(<ProductDetail />);

    // Verifica a tag da Melhor Escolha
    expect(screen.getByText('MELHOR ESCOLHA')).toBeTruthy();

    // Verifica o preço promocional rasurado
    const originalPrice = screen.getByText('1.08€');
    expect(originalPrice).toBeTruthy();
    expect(originalPrice.props.style).toEqual(
      expect.arrayContaining([expect.objectContaining({ textDecorationLine: 'line-through' })])
    );

    // Verifica renderização do Preço por Unidade gerado pelo mock formatUnitPrice
    expect(screen.getByText('0.94€ / kg')).toBeTruthy();
    expect(screen.getByText('0.99€ / kg')).toBeTruthy();
  });

  it('Cenário 3: Interação com Lojas e alteração dinâmica do preço no CTA', () => {
    const mockHandleSelect = jest.fn();
    
    useProductDetail.mockReturnValue({
      loading: false,
      quantity: 1,
      product: baseProduct,
      sortedPrices: [
        ['minipreco', { current_price: 0.94, original_price: null, is_promo: false, unit_price: 0.94 }],
        ['continente', { current_price: 0.99, original_price: null, is_promo: false, unit_price: 0.99 }],
      ],
      selectedStoreKey: 'continente',
      totalPrice: 0.99, 
      handleSelectStore: mockHandleSelect,
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
    });

    render(<ProductDetail />);

    const storeButton = screen.getByLabelText('Selecionar Minipreco, 0.94 euros');
    fireEvent.press(storeButton);

    expect(mockHandleSelect).toHaveBeenCalledWith('minipreco');
    expect(screen.getByText('Adicionar à Lista')).toBeTruthy();
    
    const prices = screen.getAllByText('0.99€');
    expect(prices.length).toBe(2);
  });

  it('Cenário 4: Interação com Seletor de Quantidade e reflexo no Footer CTA', () => {
    const mockHandleIncrement = jest.fn();
    const mockHandleDecrement = jest.fn();

    useProductDetail.mockReturnValue({
      loading: false,
      quantity: 3,
      product: baseProduct,
      sortedPrices: [
        ['minipreco', { current_price: 1.00, original_price: null, is_promo: false, unit_price: 1.00 }],
      ],
      selectedStoreKey: 'minipreco',
      totalPrice: 3.00, 
      handleSelectStore: jest.fn(),
      handleIncrement: mockHandleIncrement,
      handleDecrement: mockHandleDecrement,
    });

    render(<ProductDetail />);

    // Verifica se o texto do botão muda dinamicamente de acordo com a quantidade
    expect(screen.getByText('Adicionar 3 à Lista')).toBeTruthy();
    expect(screen.getByText('3.00€')).toBeTruthy();

    // Aciona os handlers do seletor de quantidade
    const btnIncrease = screen.getByLabelText('Aumentar quantidade');
    const btnDecrease = screen.getByLabelText('Diminuir quantidade');
    
    fireEvent.press(btnIncrease);
    expect(mockHandleIncrement).toHaveBeenCalled();

    fireEvent.press(btnDecrease);
    expect(mockHandleDecrement).toHaveBeenCalled();
  });

  it('Cenário 5: Tratamento de Loja Única', () => {
    useProductDetail.mockReturnValue({
      loading: false,
      quantity: 1,
      product: baseProduct,
      sortedPrices: [
        ['mercadona', { current_price: 0.98, original_price: null, is_promo: false, unit_price: 0.98 }],
      ],
      selectedStoreKey: 'mercadona',
      totalPrice: 0.98,
      handleSelectStore: jest.fn(),
      handleIncrement: jest.fn(),
      handleDecrement: jest.fn(),
    });

    render(<ProductDetail />);

    const prices = screen.getAllByText('0.98€');
    expect(prices.length).toBe(2); 

    expect(screen.getByText('Mercadona')).toBeTruthy();
    expect(screen.queryByText('Continente')).toBeNull();
  });

  it('Exibe fallback quando o produto não existe', () => {
    useProductDetail.mockReturnValue({
      loading: false,
      product: null,
    });

    render(<ProductDetail />);
    expect(screen.getByText('Produto não encontrado.')).toBeTruthy();
  });
});