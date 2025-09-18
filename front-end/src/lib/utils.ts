import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL  || 'http://localhost:1337';
}


export function extractYouTubeID(urlOrID: string): string | null {
  // 순수 ID 체크
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;
  if (regExpID.test(urlOrID)) return urlOrID;

  // 모든 URL에서 쿼리 파라미터/경로로 추출
  const regExp =
    /(?:youtube\.com\/(?:watch\?v=|shorts\/)|youtu\.be\/)([a-zA-Z0-9_-]{11})/;
  const match = urlOrID.match(regExp);
  return match ? match[1] : null;
}
