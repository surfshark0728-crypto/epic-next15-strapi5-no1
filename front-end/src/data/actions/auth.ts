"use server";
import {  z } from "zod";
import { SignupFormSchema, type FormState } from "@/data/validation/auth";





const registerUserAction = (prevState :FormState,  formData :FormData) => {
  console.log(" ✅✅✅✅✅ registerUserAction formData111", formData);

  const fields={
    username :formData.get("username") as string,
    email : formData.get("email") as string,
    password: formData.get("password") as string,
    confirmPassword: formData.get("confirmPassword") as string,    
  };

  console.log(" ✅✅✅✅✅ registerUserAction fields", fields);
  const validatedFields  = SignupFormSchema.safeParse(fields);

  if(!validatedFields.success) {
    const  flattenedErrors = z.flattenError(validatedFields.error);
    console.log(" ❌❌❌❌❌ registerUserAction flattenedErrors", flattenedErrors.fieldErrors);
    return {
      success: false,
      message: "유효성 검사 실패",
      strapiErrors: null,
      zodErrors: flattenedErrors.fieldErrors,
      data:{
        ...prevState.data,
        ...fields
      }
    } as FormState;
  }
   

    console.log("Validation successful:", validatedFields.data);


    //로그인후 사용자 정보를 저장하는 로직 추가 예정

  
  return {
    success: true,
    message: "회원가입 성공",
    strapiErrors: null,
    zodErrors: null,
    data: {
      ...prevState.data,
      ...validatedFields.data
    },
  } as FormState;


}

export default registerUserAction;