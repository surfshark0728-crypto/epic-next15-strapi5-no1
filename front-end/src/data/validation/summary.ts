import {z} from 'zod';

export const SummaryUpdateFormSchema = z.object({
  title: z.string().min(1, "제목은 필수 입력 항목입니다.").max(200, "제목은 200자 이하로 입력해주세요."),
  content: z.string().min(10, "내용은 최소 10자 이상 입력해야 합니다.").max(50000, "내용은 50,000자 이하로 입력해주세요."),
  documentId: z.string().min(1, "문서 ID는 필수 입력 항목입니다."),
});

export type SummaryUpdateFormValues =z.infer<typeof SummaryUpdateFormSchema>;


export type SummaryUpdateFormState ={
    success?: boolean;
    message?: string;
    data?: {
        title?: string;
        content?: string;
        documentId?: string;
    };
    strapiErrors?: {
        status: number;
        name: string;
        message: string;
        details?: Record<string, string[]>;
    } | null;
    zodErrors?: {
        title?: string[];
        content?: string[];
        documentId?: string[];
    } | null;
};

export const SummaryDeleteFormSchema =z.object({
  documentId: z.string().min(1, "문서 ID는 필수 입력 항목입니다."),
});

export type SummaryDeleteFormValues  =z.infer<typeof SummaryDeleteFormSchema>;

export type SummaryDeleteFormState ={
    success?: boolean;
    message?: string;
    data?: {
        documentId?: string;
    };
    strapiErrors?: {
        status: number;
        name: string;
        message: string;
        details?: Record<string, string[]>;
    } | null;
    zodErrors?: {
        documentId?: string[];
    } | null;
}







