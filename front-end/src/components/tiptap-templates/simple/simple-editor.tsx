"use client"

import * as React from "react"
import { EditorContent, EditorContext, useEditor } from "@tiptap/react"

// --- Tiptap Core Extensions ---
import { StarterKit } from "@tiptap/starter-kit"
import { Image } from "@tiptap/extension-image"
import { TaskItem, TaskList } from "@tiptap/extension-list"
import { TextAlign } from "@tiptap/extension-text-align"
import { Typography } from "@tiptap/extension-typography"
import { Highlight } from "@tiptap/extension-highlight"
import { Subscript } from "@tiptap/extension-subscript"
import { Superscript } from "@tiptap/extension-superscript"
import { Selection } from "@tiptap/extensions"

// --- UI Primitives ---
import { Button } from "@/components/tiptap-ui-primitive/button"
import {
  Toolbar,
  ToolbarGroup,
  ToolbarSeparator,
} from "@/components/tiptap-ui-primitive/toolbar"

// --- Tiptap Node ---
import { ImageUploadNode } from "@/components/tiptap-node/image-upload-node/image-upload-node-extension"
import { HorizontalRule } from "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node-extension"
import "@/components/tiptap-node/blockquote-node/blockquote-node.scss"
import "@/components/tiptap-node/code-block-node/code-block-node.scss"
import "@/components/tiptap-node/horizontal-rule-node/horizontal-rule-node.scss"
import "@/components/tiptap-node/list-node/list-node.scss"
import "@/components/tiptap-node/image-node/image-node.scss"
import "@/components/tiptap-node/heading-node/heading-node.scss"
import "@/components/tiptap-node/paragraph-node/paragraph-node.scss"

// --- Tiptap UI ---
import { HeadingDropdownMenu } from "@/components/tiptap-ui/heading-dropdown-menu"
import { ImageUploadButton } from "@/components/tiptap-ui/image-upload-button"
import { ListDropdownMenu } from "@/components/tiptap-ui/list-dropdown-menu"
import { BlockquoteButton } from "@/components/tiptap-ui/blockquote-button"
import { CodeBlockButton } from "@/components/tiptap-ui/code-block-button"
import {
  ColorHighlightPopover,
  ColorHighlightPopoverContent,
  ColorHighlightPopoverButton,
} from "@/components/tiptap-ui/color-highlight-popover"
import {
  LinkPopover,
  LinkContent,
  LinkButton,
} from "@/components/tiptap-ui/link-popover"
import { MarkButton } from "@/components/tiptap-ui/mark-button"
import { TextAlignButton } from "@/components/tiptap-ui/text-align-button"
import { UndoRedoButton } from "@/components/tiptap-ui/undo-redo-button"

// --- Icons ---
import { ArrowLeftIcon } from "@/components/tiptap-icons/arrow-left-icon"
import { HighlighterIcon } from "@/components/tiptap-icons/highlighter-icon"
import { LinkIcon } from "@/components/tiptap-icons/link-icon"

// --- Hooks ---
import { useIsMobile } from "@/hooks/use-mobile"
import { useWindowSize } from "@/hooks/use-window-size"
import { useCursorVisibility } from "@/hooks/use-cursor-visibility"

// --- Components ---
import { ThemeToggle } from "@/components/tiptap-templates/simple/theme-toggle"

// --- Lib ---
import { handleImageUpload, MAX_FILE_SIZE } from "@/lib/tiptap-utils"

// --- Styles ---
import "@/components/tiptap-templates/simple/simple-editor.scss"

//import content from "@/components/tiptap-templates/simple/data/content.json"

const MainToolbarContent = ({
  onHighlighterClick,
  onLinkClick,
  isMobile,
}: {
  onHighlighterClick: () => void
  onLinkClick: () => void
  isMobile: boolean
}) => {
  return (
    <>
      <ToolbarGroup>
        <UndoRedoButton action="undo" tooltip="되돌리기" />
        <UndoRedoButton action="redo" tooltip="다시 실행" />
      </ToolbarGroup>
 
      <ToolbarSeparator />
 
      <ToolbarGroup>
        <HeadingDropdownMenu
          levels={[1, 2, 3, 4]}
          portal={isMobile}
          tooltip="제목 스타일"
        />
        <ListDropdownMenu
          types={["bulletList", "orderedList", "taskList"]}
          portal={isMobile}
          tooltip="목록"
        />
        <BlockquoteButton tooltip="인용문" />
        <CodeBlockButton tooltip="코드 블록" />
      </ToolbarGroup>
 
      <ToolbarSeparator />
 
      <ToolbarGroup>
        <MarkButton type="bold" tooltip="굵게" />
        <MarkButton type="italic" tooltip="기울임꼴" />
        <MarkButton type="strike" tooltip="취소선" />
        <MarkButton type="code" tooltip="인라인 코드" />
        <MarkButton type="underline" tooltip="밑줄" />
        {!isMobile ? (
          <ColorHighlightPopover tooltip="형광펜" />
        ) : (
          <ColorHighlightPopoverButton
            onClick={onHighlighterClick}
            tooltip="형광펜"
          />
        )}
        {!isMobile ? (
          <LinkPopover tooltip="링크" />
        ) : (
          <LinkButton onClick={onLinkClick} tooltip="링크 추가" />
        )}
      </ToolbarGroup>
 
      <ToolbarSeparator />
 
      <ToolbarGroup>
        <MarkButton type="superscript" tooltip="위 첨자" />
        <MarkButton type="subscript" tooltip="아래 첨자" />
      </ToolbarGroup>
 
      <ToolbarSeparator />
 
      <ToolbarGroup>
        <TextAlignButton align="left" tooltip="왼쪽 정렬" />
        <TextAlignButton align="center" tooltip="가운데 정렬" />
        <TextAlignButton align="right" tooltip="오른쪽 정렬" />
        <TextAlignButton align="justify" tooltip="양쪽 정렬" />
      </ToolbarGroup>
 
      <ToolbarSeparator />
 
      <ToolbarGroup>
        <ImageUploadButton text="이미지 추가" tooltip="이미지 업로드" />
      </ToolbarGroup>
 
      {/* <Spacer /> */}
 
      {isMobile && <ToolbarSeparator />}
 
      <ToolbarGroup>
        <ThemeToggle  />
      </ToolbarGroup>
    </>
  )
}

const MobileToolbarContent = ({
  type,
  onBack,
}: {
  type: "highlighter" | "link"
  onBack: () => void
}) => (
  <>
    <ToolbarGroup>
      <Button data-style="ghost" onClick={onBack}>
        <ArrowLeftIcon className="tiptap-button-icon" />
        {type === "highlighter" ? (
          <HighlighterIcon className="tiptap-button-icon" />
        ) : (
          <LinkIcon className="tiptap-button-icon" />
        )}
      </Button>
    </ToolbarGroup>

    <ToolbarSeparator />

    {type === "highlighter" ? (
      <ColorHighlightPopoverContent />
    ) : (
      <LinkContent />
    )}
  </>
)

export function SimpleEditor({ content, onChange }: { content?: string, onChange?: (content: string) => void }) {
  const isMobile = useIsMobile()
  const { height } = useWindowSize()
  const [mobileView, setMobileView] = React.useState<
    "main" | "highlighter" | "link"
  >("main")
  const toolbarRef = React.useRef<HTMLDivElement>(null)

  const editor = useEditor({
    immediatelyRender: false,
    shouldRerenderOnTransaction: false,
    editorProps: {
      attributes: {
        autocomplete: "off",
        autocorrect: "off",
        autocapitalize: "off",
        "aria-label": "Main content area, start typing to enter text.",
        class: "simple-editor",
      },
    },
    extensions: [
      StarterKit.configure({
        horizontalRule: false,
        link: {
          openOnClick: false,
          enableClickSelection: true,
        },
      }),
      HorizontalRule,
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      TaskList,
      TaskItem.configure({ nested: true }),
      Highlight.configure({ multicolor: true }),
      Image,
      Typography,
      Superscript,
      Subscript,
      Selection,
      ImageUploadNode.configure({
        accept: "image/*",
        maxSize: MAX_FILE_SIZE,
        limit: 3,
        upload: handleImageUpload,
        onError: (error) => console.error("Upload failed:", error),
      }),
    ],
    content, // 초기 렌더링 시 content 반영
    onUpdate: ({ editor }) => {
      onChange?.(editor.getHTML()) // ✅ 부모에 값 전달
    },
  

  })

  const rect = useCursorVisibility({
    editor,
    overlayHeight: toolbarRef.current?.getBoundingClientRect().height ?? 0,
  })

  React.useEffect(() => {
    if (!isMobile && mobileView !== "main") {
      setMobileView("main")
    }
  }, [isMobile, mobileView])

  
  // 🔥 트랜잭션/포맷팅도 감지해서 부모에 반영
  React.useEffect(() => {
    if (!editor) return;

    const handler = () => {
      // HTML로 전달 (부모는 DB 저장 등에 사용)
      onChange?.(editor.getHTML());
      // 필요하다면 plain text도 가능: editor.getText()
      // JSON 구조도 가능: editor.getJSON()
    };

    // ✅ update 이벤트 하나면 transaction, selectionUpdate 모두 커버
    editor.on("update", handler);

    return () => {
      editor.off("update", handler);
    };
  }, [editor, onChange]);




   // ✅ 외부에서 content가 바뀌면 editor 내용 갱신
  React.useEffect(() => {
    if (editor && content !== undefined) {
      editor.commands.setContent(content)
    }
  }, [content, editor])

  return (
    <div className="simple-editor-wrapper w-full max-w-full h-full max-h-full">
      <EditorContext.Provider value={{ editor }}>
        <Toolbar
          ref={toolbarRef}
          className="flex flex-wrap gap-1 py-2 px-4 bg-white dark:bg-gray-800 shadow-md z-30 absolute w-full"
          style={{
            ...(isMobile
              ? {
                  bottom: `calc(100% - ${height - rect.y}px)`,
                }
              : {}),
          }}
        >
          {mobileView === "main" ? (
            <MainToolbarContent
              onHighlighterClick={() => setMobileView("highlighter")}
              onLinkClick={() => setMobileView("link")}
              isMobile={isMobile}
            />
          ) : (
            <MobileToolbarContent
              type={mobileView === "highlighter" ? "highlighter" : "link"}
              onBack={() => setMobileView("main")}
            />
          )}
        </Toolbar>

        <EditorContent
          editor={editor}
          role="presentation"
          className="simple-editor-content"        
        />
      </EditorContext.Provider>
    </div>
  )
}
