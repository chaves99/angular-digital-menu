
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

export interface PricesRequest {
  id: number | null;
  value: number;
  unit: string;
}

export interface AddressRequest {
  code?: string;
  city?: string;
  line?: string;
}

export interface ScheduleRequest {
  days: string;
  openHour: string;
  closeHour: string;
  startLaunch: string | null;
  endLaunch: string | null;
}
