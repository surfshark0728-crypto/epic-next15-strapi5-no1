import {z} from 'zod';

export const ProfileFormSchema = z.object({
  firstName: z
    .string()
    .min(1, "이름을 입력해주세요")
    .max(50, "이름은 50자 이하로 입력해주세요"),
  lastName: z
    .string()
    .min(1, "성을 입력해주세요")
    .max(50, "성은 50자 이하로 입력해주세요"),
  bio: z
    .string()
    .min(10, "자기소개는 최소 10자 이상 입력해주세요")
    .max(500, "자기소개는 500자 이하로 입력해주세요"),
});

export type ProfileFormValues = z.infer<typeof ProfileFormSchema>;

export type  ProfileFormState ={
    success?:boolean;
    message?:string;
    data?:{
       firstName?: string;
       lastName?: string;
       bio?: string;
    };
    strapiErrors?:{
        status: number;
        name: string;
        message: string;
        details?: Record<string, string[]>;
    } | null;    
    zodErrors?: {
        firstName?: string[];
        lastName?: string[];
        bio?: string[];
    } | null;
}

export const ProfileImageFormSchema = z.object({
  image: z
    .instanceof(File)
    .refine((file) => file.size > 0, "프로필 이미지를 업로드해주세요")
    .refine((file) => file.size <= 5000000, "이미지 크기는 5MB 이하여야 합니다")
    .refine(
      (file) => ["image/jpeg", "image/png", "image/webp"].includes(file.type),
      "이미지는 JPEG, PNG, WebP 형식만 가능합니다"
    ),
});


export type ProfileImageFormValues= z.infer<typeof ProfileImageFormSchema>;



export type ProfileImageFormState = {
  success?: boolean;
  message?: string;
  data?: {
    image?: File;
  };
  strapiErrors?: {
    status: number;
    name: string;
    message: string;
    details?: Record<string, string[]>;
  } | null;
  zodErrors?: {
    image?: string[];
  } | null;
};




