"use server";
import { z } from "zod";
import { SignupFormSchema, type FormState } from "@/data/validation/auth";
import { services } from "../services";
import { isAuthError } from "../services/auth";
import { cookies } from "next/headers";
import { CookiesConfig } from "../cookies/config";
import { redirect } from "next/navigation";

const registerUserAction =async (prevState: FormState, formData: FormData) => {
  //console.log(" ✅✅✅✅✅ registerUserAction formData111", formData);

  const fields = {
    username: formData.get("username") as string,
    email: formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,
  };

  //console.log(" ✅✅✅✅✅ registerUserAction fields", fields);
  const validatedFields = SignupFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log(
      " ❌❌❌❌❌ registerUserAction flattenedErrors",
      flattenedErrors.fieldErrors
    );
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

  // ✅ confirmPassword 제외하고 Strapi로 전송할 데이터 만들기
  const {confirmPassword, ...strapiPayload } = validatedFields.data;

  // 사용자 정보를 저장
  const responseData=await services.auth.registerUserService(strapiPayload);

  if(!responseData){
    return{
      success: false,
      message: "회원 가입! 문제가 발생했습니다. 다시 시도해 주세요.",
      strapiErrors: null,
      zodErrors: null,
      data: {
        ...prevState.data,
        ...fields
      },
    }
  }

  // responseData가 오류 응답인지 확인하세요
  if (isAuthError(responseData)) {
    console.log("❌❌❌❌❌ Registration Error:", responseData);
    if(responseData.error?.message && responseData.error.message.includes("Email or Username are already taken")){
      responseData.error.message="이미 존재하는 이메일 또는 아이디입니다. "
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

  console.log("#############");
  console.log("User Registered Successfully", responseData);
  console.log("#############");

  const cookieStore = await cookies();
  cookieStore.set("jwt", responseData.jwt, CookiesConfig);
  redirect("/dashboard");
  // return {
  //   success: true,
  //   message: "회원가입 성공하였습니다.",
  //   strapiErrors: null,
  //   zodErrors: null,
  //   data: {
  //     ...prevState.data,
  //     ...validatedFields.data,
  //   },
  // } as FormState;
};

export default registerUserAction;
