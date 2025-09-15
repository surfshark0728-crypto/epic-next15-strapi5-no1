"use client";
import { actions } from '@/data/actions';
import { ProfileImageFormState } from '@/data/validation/profile';
import { cn } from '@/lib/utils';
import { TImage } from '@/types';
import React, { useActionState } from 'react'
import ImagePicker from '../custom/image-picker';
import { ZodErrors } from "@/components/custom/zod-errors";
import { StrapiErrors } from "@/components/custom/strapi-errors";
import { SubmitButton } from '../custom/submit-button';


interface IProfileImageFormProps {
  image?: TImage | null;
  className?: string;
}

const INITIAL_STATE: ProfileImageFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};


export default function ProfileImageForm({image,  className}:Readonly<IProfileImageFormProps>) {

  const [formState, formAction] =useActionState(actions.profile.updateProfileImageAction,INITIAL_STATE);

  return (
    <form action={formAction} className={cn("space-y-4", className)}>
        <div className="space-y-2">
            <input
                hidden
                id="id"
                name='id'
                defaultValue={image?.documentId || ""}
            /> 

            <ImagePicker
                id="image"
                name="image"
                label="프로필 이미지"
                defaultValue={image?.url || ""}
            />
            <ZodErrors error={formState?.zodErrors?.image} />
            <StrapiErrors error={formState?.strapiErrors} />
        </div>

        <div className='flex justify-end'>
            <SubmitButton text="이미지 변경" loadingText='이미지 변경 중...'  />
        </div>
    </form>
  )
}
