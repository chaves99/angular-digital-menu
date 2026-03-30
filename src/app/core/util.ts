import { environment } from '../../environments/environment';

export function getEstablishmentUrl(urlToken: string) {
  return environment.APP_URL + '/customer-menu/' + urlToken;
}

export function getImagesUrl(key: string) {
  return `${TIGRIS_URL}/${key}`;
}
