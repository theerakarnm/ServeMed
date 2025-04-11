import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function jnavigate({
  path,
  query = null,
  target = '_self'
}: {
  path: string,
  query?: URLSearchParams | null,
  target: '_self' | '_blank'
}) {
  const url = new URL(window.location.href)
  const origin = url.origin
  window.open(`${origin}${path}?${query ? query.toString() : ''}`, target)
}
