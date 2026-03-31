import { environment } from '../../environments/environment';
import { SubscriptionResponse } from '../services/payload';

export function getEstablishmentUrl(urlToken: string) {
  return environment.APP_URL + '/customer-menu/' + urlToken;
}

export function getImagesUrl(key: string) {
  return `${TIGRIS_URL}/${key}`;
}

export function isFreeTierActive(subs: SubscriptionResponse): boolean {
  return subs.active !== null
      && subs.active.freeTier;
}
