"use client"; 
// 참고: 이 에디터는 https://mdxeditor.dev/editor/demo 라이브러리를 기반으로 제작됨

import "@mdxeditor/editor/style.css";
import "./editor.css";

import { cn } from "@/lib/utils";

import {
  headingsPlugin,
  listsPlugin,
  quotePlugin,
  thematicBreakPlugin,
  toolbarPlugin,
  MDXEditor,
  type MDXEditorMethods,
  type MDXEditorProps,
  ConditionalContents,
  Separator,
  ChangeCodeMirrorLanguage,
  UndoRedo,
  BoldItalicUnderlineToggles,
  markdownShortcutPlugin,
  ListsToggle,
  CreateLink,
  InsertTable,
  InsertThematicBreak,
  InsertCodeBlock,
  linkPlugin,
  imagePlugin,
  codeBlockPlugin,
  tablePlugin,
  linkDialogPlugin,
  codeMirrorPlugin,
  diffSourcePlugin,
  CodeToggle,
  BlockTypeSelect,
} from "@mdxeditor/editor";

import { basicLight } from "cm6-theme-basic-light";
import { useTheme } from "next-themes";
import type { ForwardedRef } from "react";

// === MDX 에디터 클라이언트 컴포넌트 ===
export default function MDX에디터클라이언트({
  editorRef,
  ...props
}: {
  editorRef: ForwardedRef<MDXEditorMethods> | null;
} & MDXEditorProps) {
  const { resolvedTheme } = useTheme();
  const theme = [basicLight];

  return (
    <div
      className={cn(
        "min-h-[350px] rounded-md border background-light500_dark200 text-light-700_dark300 light-border-2 w-full dark-editor markdown-editor",
        props.className
      )}
    >
      <MDXEditor
        key={resolvedTheme}
        plugins={[
          headingsPlugin(),
          listsPlugin(),
          linkPlugin(),
          linkDialogPlugin(),
          quotePlugin(),
          thematicBreakPlugin(),
          markdownShortcutPlugin(),
          tablePlugin(),
          imagePlugin(),
          codeBlockPlugin({
            defaultCodeBlockLanguage: "",
          }),
          codeMirrorPlugin({
            codeBlockLanguages: {
              css: "CSS",
              txt: "텍스트",
              sql: "SQL",
              html: "HTML",
              saas: "Sass",
              scss: "SCSS",
              bash: "Bash",
              json: "JSON",
              js: "자바스크립트",
              ts: "타입스크립트",
              "": "미지정",
              tsx: "타입스크립트 (React)",
              jsx: "자바스크립트 (React)",
            },
            autoLoadLanguageSupport: true,
            codeMirrorExtensions: theme,
          }),
          diffSourcePlugin({
            viewMode: "rich-text", // 보기 모드: 리치 텍스트
            diffMarkdown: "",
          }),
          toolbarPlugin({
            toolbarContents: () => (
              <ConditionalContents
                options={[
                  {
                    when: (editor) => editor?.editorType === "codeblock",
                    contents: () => <ChangeCodeMirrorLanguage />,
                  },
                  {
                    fallback: () => (
                      <>
                        {/* 실행 취소 / 다시 실행 */}
                        <UndoRedo />
                        
                        <Separator />

                        {/* 굵게/기울임/밑줄 */}
                        <BoldItalicUnderlineToggles />
                        <CodeToggle />
                        <Separator />

                        {/* 블록 유형 선택 */}
                        <BlockTypeSelect />
                        <Separator />

                        {/* 링크 생성 */}
                        <CreateLink />
                        <Separator />

                        {/* 목록 토글 */}
                        <ListsToggle />
                        <Separator />

                        {/* 표 삽입 */}
                        <InsertTable />
                        {/* 구분선 삽입 */}
                        <InsertThematicBreak />
                        <Separator />

                        {/* 코드 블록 삽입 */}
                        <InsertCodeBlock />
                      </>
                    ),
                  },
                ]}
              />
            ),
          }),
        ]}
        {...props}
        ref={editorRef}
      />
    </div>
  );
}
