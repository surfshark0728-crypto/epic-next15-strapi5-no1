"use client";
import { useState } from "react";

import type { TSummary } from "@/types";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "../custom/delete-button";
import EditorWrapper from "../custom/editor/mdxeditor/editor-wrapper";

import dynamic from 'next/dynamic'
import { SimpleEditor } from "../tiptap-templates/simple/simple-editor";
import TiptapMDEditorWrapper from "../tiptap-templates/simple/editor-md-wrapper";

// SSR 비활성화해서 클라이언트 전용 렌더링
const Tiptap = dynamic(() => import('@/components/custom/editor/tiptap/tiptap'), {
  ssr: false,
})

interface ISummaryUpdateFormProps {
  summary: TSummary;
}

const styles = {
  container: "flex flex-col px-2 py-0.5 relative",
  titleInput: "mb-3",
  editor: "h-[calc(100vh-215px)] overflow-y-auto",
  buttonContainer: "mt-3",
  updateButton: "inline-block",
  deleteFormContainer: "absolute bottom-0 right-2",
  deleteButton: "bg-pink-500 hover:bg-pink-600 cursor-pointer",
};

export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {
  const [content, setContent] = useState(summary.content);

  return (
    <div className={styles.container}>
      <form>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder={"Title"}
          defaultValue={summary.title || ""}
          className={styles.titleInput}
        />

        <input type="hidden" name="content" value={content} />

    

        <div className="max-w-4xl  h-[calc(100vh-215px)] overflow-y-auto">          
             <TiptapMDEditorWrapper markdown={content} />
        </div>



        {/* <div className="max-w-3xl  h-[calc(100vh-215px)] overflow-y-auto" >
        <EditorWrapper
            markdown={summary.content}
            onChange={setContent}
            className={styles.editor}
          />  
        </div> */}

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="Update Summary"
              loadingText="Updating Summary"
            />
          </div>
        </div>
      </form>

      <div className={styles.deleteFormContainer}>
        <form onSubmit={() => console.log("DELETE FORM SUBMITTED")}>
          <DeleteButton className={styles.deleteButton} />
        </form>
      </div>
    </div>
  );
}