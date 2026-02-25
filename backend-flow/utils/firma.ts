import crypto from 'node:crypto';

export function firmar(
  params: Record<string, string | number>,
  secretKey: string
): string {

  const keys = Object.keys(params).sort();

  let stringFirmar = '';

  for (const key of keys) {
    stringFirmar += key + params[key];
  }

  return crypto
    .createHmac('sha256', secretKey)
    .update(stringFirmar)
    .digest('hex');
}