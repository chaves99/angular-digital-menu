
export interface CreateUserRequest {
  email: string;
  password: string;
  establishmentName: string;
}

export interface LoginRequest {
  email: string;
  password: string;
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
  startLaunch?: string;
  endLaunch?: string;
}

type CancellationFeedback =
  'unused' |
  'too_expensive' |
  'too_complex' |
  'switched_service' |
  'other' |
  'missing_features' |
  'low_quality';

export interface SubscriptionCancellation {
  comment?: string;
  feedback: CancellationFeedback;
}
