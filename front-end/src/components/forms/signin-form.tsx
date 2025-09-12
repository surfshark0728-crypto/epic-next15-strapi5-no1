"use client";

import {
  CardTitle,
  CardDescription,
  CardHeader,
  CardContent,
  CardFooter,
  Card,
} from "@/components/ui/card";
import { Label } from "@/components/ui/label";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { FormState } from "@/data/validation/auth";
import { actions } from "@/data/actions";
import { useActionState } from "react";
import { ZodErrors } from "../custom/zod-errors";
import { SubmitButton } from "../custom/submit-button";
import { StrapiErrors } from "../custom/strapi-errors";


const INITIAL_STATE: FormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

function SigninForm() {

  const [formState, formAction] = useActionState(actions.auth.loginUserAction, INITIAL_STATE);


  return (
    <div className="w-full max-w-md">
      <form action={formAction} >
        <Card>
          <CardHeader className="space-y-1">
            <CardTitle className="text-3xl font-bold text-pink-500">로그인</CardTitle>
            <CardDescription>
              계정에 로그인하려면 세부 정보를 입력하세요.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">이메일</Label>
              <Input
                id="identifier"
                name="identifier"
                type="text"
                placeholder="아이디 or 이메일"
                defaultValue={formState?.data?.identifier || ""}
              />
              <ZodErrors error={formState?.zodErrors?.identifier} />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호"
                defaultValue={formState?.data?.password || ""}
              />
              <ZodErrors error={formState?.zodErrors?.password} />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <SubmitButton 
             className="w-full"
             text="로그인" loadingText="로그인 중"
           />
           <StrapiErrors error={formState?.strapiErrors} />
            
          </CardFooter>
        </Card>
        <div className="mt-4 text-center text-sm">
          계정이 없으신가요?
          <Link className="ml-2 text-pink-500" href="signup">
            회원가입
          </Link>
        </div>
      </form>
    </div>
  );
}

export default SigninForm;
