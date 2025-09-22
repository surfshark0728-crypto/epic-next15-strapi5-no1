"use client";
import { useActionState, useEffect, useState } from "react";

import type { TSummary } from "@/types";

import { Input } from "@/components/ui/input";
import { SubmitButton } from "@/components/custom/submit-button";
import { DeleteButton } from "../custom/delete-button";

import TiptapMDEditorWrapper from "../tiptap-templates/simple/editor-md-wrapper";
import type { SummaryUpdateFormState, SummaryDeleteFormState } from "@/data/validation/summary";
import { actions } from "@/data/actions";
import { ZodErrors } from "../custom/zod-errors";
import { StrapiErrors } from "../custom/strapi-errors";



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
  fieldGroup: "space-y-1",
};

const INITIAL_UPDATE_STATE:SummaryUpdateFormState ={
   success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
}


const INITIAL_DELETE_STATE: SummaryDeleteFormState = {
  success: false,
  message: undefined,
  strapiErrors: null,
  zodErrors: null,
};

export function SummaryUpdateForm({ summary }: ISummaryUpdateFormProps) {

  const [updateFormState, updateFormAction] = useActionState(actions.summary.updateSummaryAction, INITIAL_UPDATE_STATE);

  const [deleteFormState, deleteFormAction] = useActionState(actions.summary.deleteSummaryAction, INITIAL_DELETE_STATE);

  const [content, setContent] = useState(summary.content);

  useEffect(() => {
    setContent(summary.content);
  }, [summary.content]);


  return (
    <div className={styles.container}>
      <form action={updateFormAction}>
        <input type="hidden" name="documentId" value={summary.documentId} />

      <div className={styles.fieldGroup}>
        <Input
          id="title"
          name="title"
          type="text"
          placeholder={"Title"}
          defaultValue={summary.title || ""}
          className={styles.titleInput}
        />
        <ZodErrors error={updateFormState?.zodErrors?.title} />       
      </div>

      
        <textarea
              name="content"
              value={content}
              placeholder="Enter summary content"
              title="Summary Content"
              readOnly
              hidden
            />



    <div className={styles.fieldGroup}>
     <div className="w-full flex flex-col items-center justify-center  gap-10   ">
           <div className="w-full  h-[calc(100vh-215px)] overflow-y-auto">          
              <TiptapMDEditorWrapper 
              onChange={(value) => setContent(value)}
              setContent={setContent}
              markdown={content} />

             <ZodErrors error={updateFormState?.zodErrors?.content} />
          </div>
      </div> 



         {/* <div className="w-full  overflow-y-auto">
              <EditorWrapper
                markdown={summary.content}
                onChange={(value) => {
                  const hiddenInput = document.querySelector('textarea[name="content"]') as HTMLInputElement;
                  if (hiddenInput) hiddenInput.value = value;
                }}
                className={styles.editor}
              />
            </div>  
          */}

        </div>

        <div className={styles.buttonContainer}>
          <div className={styles.updateButton}>
            <SubmitButton
              text="요약 업데이트"
              loadingText="요약 업데이트 중..."
            />
          </div>
        </div>

        <StrapiErrors error={updateFormState?.strapiErrors} />
        {updateFormState?.success && (
          <div className="text-green-600  mt-2 ">
            {updateFormState.message}
          </div>
        )}  

        {updateFormState?.message && !updateFormState?.success && (
          <div className="text-red-600 mt-2">{updateFormState.message}</div>
        )}


      </form>

      <div className={styles.deleteFormContainer}>
        <form  action={deleteFormAction}>
           <input type="hidden" name="documentId" value={summary.documentId}  />           
          <DeleteButton className={styles.deleteButton} />
        </form>
        <StrapiErrors error={deleteFormState?.strapiErrors} />
        {
          deleteFormState?.message && !deleteFormState?.success && (
           <div className="text-red-600 mt-1 text-sm">{deleteFormState.message}</div>
          )
        }
      </div>
    </div>
  );
}