"use server";
import { z } from "zod";
import { SigninFormSchema, SignupFormSchema, type FormState } from "@/data/validation/auth";
import { services } from "@/data/services";
import { isAuthError } from "@/data/services/auth";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import { TAuthUser, TStrapiResponse } from "@/types";

const CookiesConfig = {
  maxAge: 60 * 60 * 24 * 7, // 1 week
  path: "/",
  domain: process.env.HOST ?? "localhost",
  httpOnly: true,
  secure: process.env.NODE_ENV === "production",
};

// 회원가입 액션 함수
export const registerUserAction = async (prevState: FormState, formData: FormData) => {
  // 사용자가 입력한 값 가져오기
  const fields = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  // Zod 스키마로 유효성 검사 실행
  const validatedFields = SignupFormSchema.safeParse(fields);

  // 유효성 검사 실패 시 → 에러 메시지와 입력값 반환
  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log(" ❌❌❌❌❌ registerUserAction flattenedErrors", flattenedErrors.fieldErrors);

    return {
      success: false,
      message: "유효성 검사 실패",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    } as FormState;
  }

  console.log("Validation successful:", validatedFields.data);

  // confirmPassword 제외하고 Strapi 서버로 보낼 payload 생성
  const { confirmPassword, ...strapiPayload } = validatedFields.data;

  console.log("confirmPassword 제외하고 Strapi 서버로 보낼 payload 생성 :", confirmPassword);
  // Strapi API를 호출하여 회원가입 요청
  const responseData = await services.auth.registerUserService(strapiPayload);

  // 응답이 없을 경우 → 실패 처리
  if (!responseData) {
    return {
      success: false,
      message: "회원 가입 중 문제가 발생했습니다. 다시 시도해 주세요.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // Strapi 응답이 에러 형식일 경우 처리
  if (isAuthError(responseData)) {
    console.log("❌❌❌❌❌ Registration Error:", responseData);

    // 이메일/아이디 중복 에러 메시지를 한글로 변환
    if (
      responseData.error?.message &&
      responseData.error.message.includes("Email or Username are already taken")
    ) {
      responseData.error.message = "이미 존재하는 이메일 또는 아이디입니다.";
    }

    return {
      success: false,
      message: "등록에 실패했습니다.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  // 회원가입 성공
  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  // JWT 토큰을 쿠키에 저장 (로그인 상태 유지)
  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, CookiesConfig);

  // 회원가입 후 대시보드 페이지로 리다이렉트
  redirect("/dashboard");

  // (참고) 성공 응답을 리턴하고 싶다면 아래 주석 해제
  /*
  return {
    success: true,
    message: "회원가입 성공하였습니다.",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...validatedFields.data,
    },
  } as FormState;
  */
};


// 로그인 액션 함수
export async function loginUserAction(prevState: FormState, formData: FormData) : Promise<FormState>{

  // 사용자가 입력한 값 가져오기
  const fields = {
    identifier: formData.get("identifier") as string,    
    password: formData.get("password") as string,    
  };

  console.dir("❌로그인 파라미터 :  ",fields);

  // Zod 스키마로 유효성 검사 실행
  const validatedFields = SigninFormSchema.safeParse(fields);

  // 유효성 검사 실패 시 → 에러 메시지와 입력값 반환
  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log(" ❌❌❌❌❌ loginUserAction flattenedErrors", flattenedErrors.fieldErrors);
    return {
      success: false,
      message: "유효성 검사 실패",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data: {
        ...prevState.data,
        ...fields,
      },
    } as FormState;
  }

  console.log("Validation successful:", validatedFields.data);
  
  
  const responseData = await services.auth.loginUserService(validatedFields.data);
  console.dir("1.로그인 응답 :  ",responseData);
  if(!responseData){    
     console.log("❌2.responseData 로그인 응답 :  ",responseData);
    return{
      success: false,
      message: "로그인 중 문제가 발생했습니다. 다시 시도해 주시기 바로.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    }
  }

  // Check if responseData is an error response
  if (isAuthError(responseData)) {
     console.log("3.!responseData 로그인 응답 :  ",responseData.error);
  
    if(responseData.error?.message){
      if(responseData.error.message.includes("Invalid identifier or password")){
        responseData.error.message = "아이디(이메일) 또는 비밀번호가 올바르지 않습니다.";
      }
    }       

    return {
      success: false,
      message: "로그인 중 문제가 발생했습니다.",
      strapiErrors: responseData.error,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields,
      },
    };
  }

  console.log("#############");
  console.log("User Login Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, CookiesConfig);

  redirect("/dashboard");
}





// JWT 토큰 가져오기 액션
export async function getAuthTokenAction() {
  const cookieStore = await cookies();
  const authToken = cookieStore.get("jwt")?.value;
  return authToken;
}


// ✅🔖 사용자 정보 가져오기 액션
export async function getUserMeAction(): Promise<TStrapiResponse<TAuthUser>> {
  const token = await getAuthTokenAction();
  if (!token){
     return {
      success: false,
      data: undefined,
      error: {
        status: 500,
        name: "NetworkError",
        message: "token not found",
        details: {},
      },
      status: 500,
    };
  }
  return services.auth.getUserMeService(token);
}



// 로그아웃 액션
export async function logoutUserAction() {
  const cookieStore = await cookies();
  // jwt 쿠키 만료 처리 (maxAge: 0)
  cookieStore.set("jwt", "", { ...CookiesConfig, maxAge: 0 });
  redirect("/");
}
