"use client";
import React, { useActionState } from "react";
import { cn } from "@/lib/utils";

import type { TAuthUser } from "@/types";

import { SubmitButton } from "@/components/custom/submit-button";
import { Input } from "@/components/ui/input";
import { Textarea } from "../ui/textarea";
import { ProfileFormState } from "@/data/validation/profile";
import { actions } from "@/data/actions";
import { ZodErrors } from "../custom/zod-errors";
import { StrapiErrors } from "../custom/strapi-errors";


interface IProfileFormProps  {
    user?: TAuthUser | null;
    readonly className?: string
}

const styles = {
  form: "space-y-4",
  container: "space-y-4 grid",
  topRow: "grid grid-cols-3 gap-4",
  nameRow: "grid grid-cols-2 gap-4",
  fieldGroup: "space-y-2",
  textarea: "resize-none border rounded-md w-full h-[224px] p-2",
  buttonContainer: "flex justify-end",
  countBox:
    "flex items-center justify-center h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-sm shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none",
  creditText: "font-bold text-md mx-1",
};

const INITIAL_STATE: ProfileFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export default function ProfileForm({user, className} :IProfileFormProps ) {

  const [formState, formAction] = useActionState(actions.profile.updateProfileAction, INITIAL_STATE);


  if(!user) {
    return(
        <div className={cn(styles.form, className)}>
          <p>프로필 데이터를 로드할 수 없습니다.</p>
        </div>
    )
  }


  return (
    <form  action={formAction}  className={cn("space-y-4", className)}  >
        <div className="space-y-4 grid">
             <div className="grid grid-cols-3 gap-4">
                    <Input
                        id="username"            
                        name="username"
                        placeholder="아이디"
                        defaultValue={user.username || ""}
                        disabled
                    />
                    <Input 
                        id="email"
                        name="email"
                        placeholder="이메일"
                        defaultValue={user.email || ""}
                        disabled
                    />
                    <CountBox text={user.credits || 0} />
            </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
            <div className={styles.fieldGroup}>
                <Input
                    id="firstName"
                    name="firstName"
                    placeholder="이름"
                    defaultValue={formState?.data?.firstName || user.firstName || ""}
                    />                

                <ZodErrors error={formState?.zodErrors?.firstName} />    
            </div>
            <div className={styles.fieldGroup}>
            <Input
                id="lastName"
                name="lastName"
                placeholder="성"
                 defaultValue={formState?.data?.lastName || user.lastName || ""}
                />
                <ZodErrors error={formState?.zodErrors?.lastName} />
            </div>
        </div>
        <div className={styles.fieldGroup}>
          <Textarea
            id="bio"
            name="bio"
            placeholder="자기소개를 입력하세요..."
            className={styles.textarea}
            defaultValue={formState?.data?.bio || user.bio || ""}
          />
          <ZodErrors error={formState?.zodErrors?.bio} />
        </div>      
      <div className="flex items-center justify-center">
          <StrapiErrors error={formState?.strapiErrors} /> 
      </div>
      <div className={styles.buttonContainer}>
        <SubmitButton text="프로필 업데이트" loadingText="프로필 저장 중..." />         
      </div>
    </form>
  )
}



function CountBox({ text }: { text: number }) {
  const color = text > 0 ? "text-primary" : "text-red-500";
  return (
    <div className={styles.countBox}>
      보유 크레딧:
      <span className={cn(styles.creditText, color)}>{text}</span>
      개
    </div>
  );
}
