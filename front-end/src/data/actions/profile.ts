"use server";
import { z } from "zod";
import {
  ProfileFormSchema,
  ProfileImageFormSchema,
  ProfileImageFormState,
  type ProfileFormState,
} from "../validation/profile";
import { services } from "../services";
import { requireAuthUser } from "@/lib/auth-helpers";

export async function updateProfileAction(
  prevState: ProfileFormState,
  formData: FormData
): Promise<ProfileFormState> {
  console.log("🔖 updateProfileAction", formData);

  const fields = Object.fromEntries(formData);
  console.dir(fields);

  const validatedFields = ProfileFormSchema.safeParse(fields);

  if (!validatedFields.success) {
    const flattenedErrors = z.flattenError(validatedFields.error);
    console.log(
      "❌ updateProfileAction flattenedErrors",
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
    } as ProfileFormState;
  }

  console.log("✅ updateProfileAction validatedFields", validatedFields.data);

  // // JWT 가져오기
  // const token = await getAuthTokenAction();
  // if (!token) throw new Error("로그인이 필요합니다.");

  // // 내 정보 조회
  // const me = await services.auth.getUserMeService(token);
  // if (!me.success || !me.data) throw new Error("사용자 정보를 불러올 수 없습니다.");

  const responseData = await services.profile.updateProfileService(
    validatedFields.data
  );

  if (responseData.error) {
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

export async function updateProfileImageAction(
  prevState: ProfileImageFormState,
  formData: FormData
): Promise<ProfileImageFormState> {
  
  try {
    

    const { authToken, user } = await requireAuthUser();
    console.log("프로필 이미지 업데이트 작업:", authToken);

    const currentImageId = user.image?.id;

    const image = formData.get("image") as File | null;
    
    if (!image || image.size === 0) {
        return {
            success: false,
            message: "제공된 이미지가 없습니다.",
            strapiErrors: null,
            zodErrors: { image: ["이미지가 필요합니다."] },
            data: prevState.data,
        };
    }


    const validatedFields = ProfileImageFormSchema.safeParse({ image });

    if (!validatedFields.success) {
        const flattenedErrors = z.flattenError(validatedFields.error);
        console.log("❌ updateProfileImageAction flattenedErrors", flattenedErrors.fieldErrors);
        return {
            success: false,
            message: "유효성 검사 실패",
            strapiErrors: null,
            zodErrors: flattenedErrors.fieldErrors,
            data: {
                ...prevState.data,
                image,
            },
        } as ProfileImageFormState;
    }

    console.log("Validation successful:", validatedFields.data);
    console.log(currentImageId);
    console.log(currentImageId);

    
    // 이전 이미지가 있으면 삭제합니다.
    console.log("✅이전 이미지가 있으면 삭제합니다.");
    if (currentImageId) {
        console.log(currentImageId);
        try {
            await services.file.fileDeleteService(currentImageId);
        } catch (error) {
            console.error("이전 이미지를 삭제하지 못했습니다.:", error);
            // 삭제에 실패하더라도 업로드를 계속합니다.
        }
    }


    // 미디어 라이브러리에 새 이미지 업로드
    console.log("✅ 미디어 라이브러리에 새 이미지 업로드");
    const fileUploadResponse = await services.file.fileUploadService(validatedFields.data.image);
        
    
    if(!fileUploadResponse.success || !fileUploadResponse.data){
        return {
              success: false,
              message: "이미지 업로드에 실패했습니다",
              strapiErrors: fileUploadResponse.error,
              zodErrors: null,
              data: prevState.data,
        }
    }


    const uploadedImageId = fileUploadResponse.data[0].id;

    //새 이미지로 사용자 프로필 업데이트
    const updateImageResponse =await services.profile.updateProfileImageService(uploadedImageId);

    if (!updateImageResponse.success) {
        return {
        success: false,
        message: "새 이미지로 프로필을 업데이트하지 못했습니다.",
        strapiErrors: updateImageResponse.error,
        zodErrors: null,
        data: prevState.data,
        };
    }

    console.log("#############");
    console.log("프로필 이미지가 성공적으로 업데이트되었습니다.");
    console.log("#############");


    return {
        success:true,
        message :"새 이미지로 프로필을 업데이트하었습니다.",
        strapiErrors: null,
        zodErrors: null,
        data:{
            image:validatedFields.data.image
        }
    }
    

  } catch (error) {
    return {
      success: false,
      message:  "인증 오류가 발생했습니다.:"+ error,
      strapiErrors: null,
      zodErrors: null,
      data: prevState.data,
    };
  }
}
