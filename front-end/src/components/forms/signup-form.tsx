
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

const styles = {
  container: "w-full max-w-md",
  header: "space-y-1",
  title: "text-3xl font-bold text-pink-500",
  content: "space-y-4",
  fieldGroup: "space-y-3",
  footer: "flex flex-col",
  button: "w-full",
  prompt: "mt-4 text-center text-sm",
  link: "ml-2 text-pink-500",
};

const SignupForm = () => {
  return (
    <div className="w-full max-w-md">
        <form>
            <Card>
                <CardHeader className="space-y-1">
                    <CardTitle className="text-3xl font-bold flex items-center justify-center text-pink-500">회원가입</CardTitle>
                    <CardDescription>
                        회원가입을 위한 세부 정보를 입력해주세요.
                    </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className={styles.fieldGroup}>
                        <Label htmlFor="username">아이디</Label>
                        <Input
                            id="username"
                            name="username"
                            type="text"
                            placeholder="아이디"
                        />
                    </div>
                    <div className={styles.fieldGroup}>
                        <Label htmlFor="email">이메일</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            placeholder="name@example.com"
                        />
                        </div>
                    <div className={styles.fieldGroup}>
                        <Label htmlFor="password">비밀번호</Label>
                        <Input
                            id="password"
                            name="password"
                            type="password"
                            placeholder="비밀번호"
                        />
                    </div>
                    
                    <div className={styles.fieldGroup}>
                        <Label htmlFor="passwordConfirm">비밀번호 확인</Label>
                        <Input
                            id="passwordConfirm"    
                            name="passwordConfirm"
                            type="password"
                            placeholder="비밀번호 확인"
                        />
                    </div>

                </CardContent>
                <CardFooter className={styles.footer}>
                  <Button className={styles.button}>회원가입</Button>
                </CardFooter>
                </Card>
                <div className={styles.prompt}>
                        계정이 있으신가요?
                    <Link className={styles.link} href="signin">
                            로그인
                     </Link>
                 </div>

            
        </form>      
    </div>
  )
}

export default SignupForm;
