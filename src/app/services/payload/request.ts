
export interface CreateUserRequest {
  email: string;
  password: string;
  establishmentName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface CreateProductRequest {
  name: string;
  description: string | null | undefined;
  prices: PricesRequest[];
  active: boolean;
  categoryId: number;
}

export interface PriceLayerRequest {
  name: string;
  active: boolean;
}

export interface PricesRequest {
  id: number | null;
  value: number;
  unit: string;
  layerId: number;
}

export interface AddressRequest {
  code: string;
  city: string;
  line: string;
}
