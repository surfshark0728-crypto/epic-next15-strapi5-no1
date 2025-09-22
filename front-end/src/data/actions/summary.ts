"use server"; 
// Next.js App Router 서버 액션 선언

import { z } from "zod"; 
// zod: 유효성 검증 라이브러리

import { redirect } from "next/navigation"; 
// redirect: 서버 액션 실행 후 특정 경로로 이동

import { revalidatePath } from "next/cache"; 
// revalidatePath: 캐시 무효화 → 페이지/데이터 최신화

import { services } from "@/data/services"; 
// 백엔드 API 호출 모듈

import {
  SummaryUpdateFormSchema,
  SummaryDeleteFormSchema,
  type SummaryUpdateFormState,
  type SummaryDeleteFormState,
} from "@/data/validation/summary";
// Zod 스키마 및 상태 타입 정의 (업데이트/삭제 폼에 사용)

/* ==========================================================
   ✅ 요약(Update) 액션
   - 폼 데이터를 받아 유효성 검사 → API 호출 → 캐시 갱신
========================================================== */
export async function updateSummaryAction(
  prevState: SummaryUpdateFormState,
  formData: FormData
): Promise<SummaryUpdateFormState> {
  // 1) FormData → 일반 객체로 변환
  const fields = Object.fromEntries(formData);

  // 2) Zod 스키마 기반 유효성 검사
  const validatedFields = SummaryUpdateFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    // 유효성 검사 실패 시 에러 반환
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: "Validation failed", // 메시지
      strapiErrors: null,           // Strapi API 에러(현재 없음)
      zodErrors: flattenedErrors.fieldErrors, // 필드별 에러 전달
      data: {
        ...prevState.data, // 기존 데이터 유지
        ...fields,         // 이번에 입력한 값 반영
      },
    };
  }

  // 3) 유효성 검증된 데이터 구조 분리
  const { documentId, ...updateData } = validatedFields.data;

  try {
    // 4) API 호출 → 요약 데이터 수정
    const responseData = await services.summarize.updateSummaryService(
      documentId,
      updateData
    );

    // 5) API 에러 발생 시
    if (responseData.error) {
      return {
        success: false,
        message: "Failed to update summary.",
        strapiErrors: responseData.error, // 백엔드 에러 전달
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields,
        },
      };
    }

    // 6) 성공 시 캐시 갱신 → 최신화
    revalidatePath(`/dashboard/summaries/${documentId}`);
    revalidatePath("/dashboard/summaries");

    // 7) 최종 성공 응답
    return {
      success: true,
      message: "Summary updated successfully!",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  } catch (error) {
    // try 블록에서 오류 발생 시
    return {
      success: false,
      message: "Failed to update summary. Please try again. :"+error,
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }
}

/* ==========================================================
   ✅ 요약(Delete) 액션
   - 폼 데이터를 받아 유효성 검사 → API 호출 → 삭제 후 리다이렉트
========================================================== */
export async function deleteSummaryAction(
  prevState: SummaryDeleteFormState,
  formData: FormData
): Promise<SummaryDeleteFormState> {
  // 1) FormData → 일반 객체 변환
  const fields = Object.fromEntries(formData);

  // 2) Zod 스키마 유효성 검사
  const validatedFields = SummaryDeleteFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    // 유효성 검사 실패 시
    const flattenedErrors = z.flattenError(validatedFields.error);

    return {
      success: false,
      message: "Validation failed",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  try {
    // 3) API 호출 → 요약 삭제
    const responseData = await services.summarize.deleteSummaryService(
      validatedFields.data.documentId
    );

    // 4) API 에러 발생 시
    if (responseData.error) {
      return {
        success: false,
        message: "Failed to delete summary.",
        strapiErrors: responseData.error,
        zodErrors: null,
        data: {
          ...prevState.data,
          ...fields,
        },
      };
    }

    // 5) 성공 시 목록 페이지 캐시 갱신
    revalidatePath("/dashboard/summaries");
  } catch (error) {
    // API 호출 실패 시
    return {
      success: false,
      message: "Failed to delete summary. Please try again. :"+error,
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // 6) 성공적으로 삭제된 경우 목록 페이지로 리다이렉트
  redirect("/dashboard/summaries");
}
