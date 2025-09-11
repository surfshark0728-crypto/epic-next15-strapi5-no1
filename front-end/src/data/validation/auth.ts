import {z} from 'zod';


export const SigninFormSchema =z.object({
    identifier:z.string().min(3,"사용자 이름 또는 이메일은 최소 3자 이상이어야 합니다."),
    password: z.string().min(6, "비밀번호는 최소 4자 이상이어야 합니다.").max(100, "비밀번호는 100자 이내여야 합니다."),
});

export const SignupFormSchema = z.object({
  username: z.string()
    .min(3, "사용자 이름은 최소 3자 이상이어야 합니다.")
    .max(30, "사용자 이름은 30자 이내여야 합니다.")
    .regex(/^[a-zA-Z][a-zA-Z0-9_]*$/, "사용자 이름은 영문자로 시작하고, 영문자, 숫자, 밑줄(_)만 포함할 수 있습니다."),

    email: z.email("유효한 이메일 주소를 입력하세요."),

    password: z.string().min(4, "비밀번호는 최소 4자 이상이어야 합니다.").max(100, "비밀번호는 100자 이내여야 합니다."),    
    confirmPassword: z.string().min(4, "비밀번호 확인은 최소 4자 이상이어야 합니다.").max(100, "비밀번호 확인은 100자 이내여야 합니다."),
}).refine((data) => data.password === data.confirmPassword, {
    message: "비밀번호와 비밀번호 확인이 일치하지 않습니다.",
    path: ["confirmPassword"],
});


export type SigninFormValues =z.infer<typeof SigninFormSchema>;
export type SignupFormValues=z.infer<typeof SignupFormSchema>;

export type FormState ={
    success?:boolean;
    message?:string;
    data?:{
        identifier?: string;
        username?: string;
        email?: string;
        password?: string;
        confirmPassword?: string;
    };
    strapiErrors?:{
        status: number;
        name: string;
        message: string;
        details?: Record<string, string[]>;
    } | null;    
    zodErrors?: {
        identifier?: string[];
        username?: string[];
        email?: string[];
        password?: string[];
        confirmPassword?: string[];
    } | null;
}