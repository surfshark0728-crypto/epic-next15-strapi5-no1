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

function SigninForm() {
  return (
    <div className="w-full max-w-md">
      <form>
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
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="password">비밀번호</Label>
              <Input
                id="password"
                name="password"
                type="password"
                placeholder="비밀번호"
              />
            </div>
          </CardContent>
          <CardFooter className="flex flex-col">
            <Button className="w-full">로그인</Button>
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
