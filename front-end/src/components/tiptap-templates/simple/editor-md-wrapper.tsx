"use client";

import { AlertCircle } from "lucide-react";
import { useEffect, useState, forwardRef } from "react";

import { Skeleton } from "@/components/ui/skeleton";
import { Alert, AlertDescription } from "@/components/ui/alert";

import { useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";

// 📝 Markdown ↔ HTML 변환기
import { marked } from "marked";
import TurndownService from "turndown";
import { SimpleEditor } from "./simple-editor";

//pnpm i --save-dev @types/turndown

const turndownService = new TurndownService();


const LoadingFallback = () => (
  <div className="min-h-[350px] rounded-md border background-light500_dark200 text-light-700_dark300 p-4">
    <div className="space-y-3">
      <Skeleton className="h-8 w-full" />
      <Skeleton className="h-4 w-3/4" />
      <Skeleton className="h-4 w-1/2" />
      <Skeleton className="h-4 w-5/6" />
      <div className="space-y-2 pt-4">
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-full" />
        <Skeleton className="h-4 w-2/3" />
      </div>
    </div>
  </div>
);

interface EditorWrapperProps {
  markdown?: string;
  onChange?: (markdown: string) => void;
  className?: string;
}

export function TiptapMDEditorWrapper({
  markdown = "",
  onChange,
  className,
}: EditorWrapperProps) {
  const [hasError, setHasError] = useState(false);

  // ✅ Markdown → HTML 변환 후 초기 content 세팅
  const initialHTML = markdown ? marked.parse(markdown) : "";

  const editor = useEditor({
    extensions: [StarterKit],
    content: initialHTML,
    editorProps: {
      attributes: {
        class: `prose dark:prose-invert focus:outline-none ${className ?? ""}`,
      },
    },
    immediatelyRender: false, // 👈 SSR 방지
    onUpdate: ({ editor }) => {
      // ✅ HTML → Markdown 변환
      const html = editor.getHTML();
      const md = turndownService.turndown(html);
      onChange?.(md);
    },
  });

  useEffect(() => {
    if (typeof window !== "undefined") {
      setHasError(false);
    }
  }, []);

  if (hasError) {
    return (
      <Alert
        variant="destructive"
        className="min-h-[350px] flex items-center justify-center"
      >
        <AlertCircle className="h-4 w-4" />
        <AlertDescription>
          편집기를 로드하지 못했습니다. 페이지를 새로고침하여 다시 시도해 주세요.
        </AlertDescription>
      </Alert>
    );
  }

  return (
    <div className="min-h-[350px] rounded-md border p-4 ">
      {editor ? <SimpleEditor content={editor.getHTML()} /> : <LoadingFallback />}
    </div>
  );
}

// ForwardRef 지원
export const ForwardRefEditor = forwardRef<any, EditorWrapperProps>(
  (props, ref) => <TiptapMDEditorWrapper {...props} />
);

ForwardRefEditor.displayName = "ForwardRefEditor";

export default TiptapMDEditorWrapper;
