'use client'

import { useEditor, EditorContent } from '@tiptap/react'
import StarterKit from '@tiptap/starter-kit'
import "./tiptap.css";

const Tiptap = () => {
  const editor = useEditor({
    extensions: [StarterKit],
    content: '<p>Hello World! 🌎️</p>',
    immediatelyRender: false, // ✅ SSR 환경에서 반드시 필요
  })

  if (!editor) {
    // 초기 로딩 중에는 null일 수 있으므로 안전하게 처리
    return <div>Loading editor...</div>
  }

  return <EditorContent editor={editor} />
}

export default Tiptap
