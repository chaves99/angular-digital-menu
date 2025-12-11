
export interface CreateUserResponse {
  token: string;
  email: string;
  establishmentName: string;
  cratedAt: Date;
  updatedAt: Date;
}

export interface CategoryResponse {
  id: number;
  name: string;
  enabled: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface ProductResponse {
  id: number;
  name: string;
  description: string;
  active: boolean;
  prices: PriceResponse[];
  updatedAt: Date;
  createdAt: Date;
  categoryId: number;
  categoryName: string;
}

export interface PriceResponse {
  id: number | null;
  value: number;
  unit: string;
  priceLayerId: number;
}

export interface ErrorDetailResponse {
  message: string;
}

export interface PriceLayerResponse {
  id: number;
  name: string;
  active: boolean;
  updatedAt: Date;
  createdAt: Date;
}

export interface AddressResponse {
  id: number;
  code: string;
  line: string;
  city: string;
}

interface ErrorMessages {
  [key: string]: string;
}

export const ERROR_MESSAGES: ErrorMessages = {
  "EMAIL_EXISTS": "Email já existe!",
  "ESTABLISHMENT_EXISTS": "Estabelecimento já existe!",
  "INTERNAL_ERROR": "Erro interno!",
  "NO_RESOURCE_FOUND": "Recurso não encontrado!",
}
