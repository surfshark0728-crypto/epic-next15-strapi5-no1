"use server";
import { z } from "zod";

import { ProfileFormSchema, type ProfileFormState } from "../validation/profile";
import { services } from "../services";
import { getAuthTokenAction } from "./auth";


export async function updateProfileAction(prevState: ProfileFormState, formData: FormData) : Promise<ProfileFormState>{
    
    console.log("🔖 updateProfileAction",  formData);

    const fields=Object.fromEntries(formData);
    console.dir(fields);

    const validatedFields = ProfileFormSchema.safeParse(fields);

    if(!validatedFields.success){
        const flattenedErrors = z.flattenError(validatedFields.error);
        console.log("❌ updateProfileAction flattenedErrors", flattenedErrors.fieldErrors);
        return {
            success: false,
            message: "유효성 검사 실패",
            strapiErrors: null,
            zodErrors: flattenedErrors.fieldErrors,
            data: {
                ...prevState.data,
                ...fields,
            },
        } as ProfileFormState;
    }

    console.log("✅ updateProfileAction validatedFields", validatedFields.data);

    // // JWT 가져오기
    // const token = await getAuthTokenAction();
    // if (!token) throw new Error("로그인이 필요합니다.");

    // // 내 정보 조회
    // const me = await services.auth.getUserMeService(token);
    // if (!me.success || !me.data) throw new Error("사용자 정보를 불러올 수 없습니다.");

    const responseData =await services.profile.updateProfileService(validatedFields.data);

    if(responseData.error){
        return {
            success: false,
            message: "Failed to Login.",
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

   return {
        success: false,
        message: "성공적으로 업데이트 처리되었습니다.",
        strapiErrors: null,
        zodErrors: null,
        data: {
        ...prevState.data,
        ...fields,
        },
    };

}