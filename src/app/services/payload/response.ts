import { CustomizationResponse } from "@features/customization/customization.service";

export interface Pagination<T> {
  content: T[];
  totalPages: number;
  last: boolean;
  size: number;
  number: number; // actual page number
  pageable: Pageable;
  numberOfElements: number; // elements on actual page
  totalElements: number; // total number of elements
  first: boolean;
}

export interface Pageable {
  offset: number;
}


export interface CreateUserResponse {
  token: string;
  email: string;
  establishmentName: string;
  establishmentUrl: string;
  establishmentDescription: string | null;
  subscription: string;
  wifiName?: string;
  wifiPassword?: string;
  // subscriptionStatus: SubscriptionStatus;
  image: string | null;
  createdAt: Date;
  updatedAt: Date;
}


export interface AddressResponse {
  code: string;
  line: string;
  city: string;
}

export interface ContactResponse {
  whatsapp: string | null;
  phone: string | null;
  facebook: string | null;
  instagram: string | null;
  website: string | null;
}

export interface MenuResponse {
  info: EstablishmentInfoResponse & ContactResponse;
  schedules: ScheduleResponse[];
  categories: MenuCategoryResponse[];
  customization?: CustomizationResponse;
}

export interface MenuCategoryResponse {
  id: number;
  name: string;
  products: MenuProductResponse[];
}

export interface MenuProductResponse {
  id: number;
  name: string;
  description: string;
  image: string;
  prices: MenuPriceResponse[];
}

export interface MenuPriceResponse {
  id: number;
  value: number;
  unit: string;
}

export interface EstablishmentInfoResponse {
  id: number;
  establishmentName: string;
  description: string | null;
  wifiName: string | null;
  wifiPassword: string | null;
  image: string;
  addressLine: string | null;
  addressCode: string | null;
  city: string | null;
}

export interface ScheduleResponse {
  id: number;
  days: string;
  openHour: string;
  closeHour: string;
  startLaunch: string | null;
  endLaunch: string | null;
}


export interface DashboardResponse {
  product: DashboardItemResponse;
  category: DashboardItemResponse;
}

export interface DashboardItemResponse {
  active: number;
  inactive: number;
}

export interface ErrorDetailResponse {
  message: string | null;
}

interface ErrorMessages {
  [key: string]: string;
}

export const ERROR_MESSAGES: ErrorMessages = {
  "PASSWORD_INVALID": "Senha inválida",
  "EMAIL_EXISTS": "Email já existe!",
  "ESTABLISHMENT_EXISTS": "Estabelecimento já existe!",
  "INTERNAL_ERROR": "Erro interno!",
  "NO_RESOURCE_FOUND": "Recurso não encontrado!",
  "ESTABLISHMENT_NOT_EXISTS": "Estabelecimento não encontrado",
}
