import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export function getStrapiURL() {
  return process.env.NEXT_PUBLIC_STRAPI_URL  || 'http://localhost:1337';
}


export function extractYouTubeID(urlOrID: string): string | null {
  // 유튜브 영상 ID 형식에 맞는 정규식 (11자리 영문, 숫자, _, -)
  const regExpID = /^[a-zA-Z0-9_-]{11}$/;

  // 입력값이 유튜브 영상 ID인지 확인
  if (regExpID.test(urlOrID)) {
    return urlOrID;
  }

  // 일반적인 유튜브 링크 정규식
  const regExpStandard = /youtube\.com\/watch\?v=([a-zA-Z0-9_-]+)/;

  // 유튜브 쇼츠 링크 정규식
  const regExpShorts = /youtube\.com\/shorts\/([a-zA-Z0-9_-]+)/;

  // 일반적인 유튜브 링크인지 확인
  const matchStandard = urlOrID.match(regExpStandard);
  if (matchStandard) {
    return matchStandard[1]; // 캡처된 ID 반환
  }

  // 유튜브 쇼츠 링크인지 확인
  const matchShorts = urlOrID.match(regExpShorts);
  if (matchShorts) {
    return matchShorts[1]; // 캡처된 ID 반환
  }

  // 어느 경우에도 해당하지 않으면 null 반환
  return null;
}

