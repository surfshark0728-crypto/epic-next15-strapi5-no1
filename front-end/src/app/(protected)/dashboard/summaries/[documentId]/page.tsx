import YouTubePlayer from "@/components/custom/youtube-player";
import { SummaryUpdateForm } from "@/components/forms/summary-update-form";
import { SimpleEditor } from "@/components/tiptap-templates/simple/simple-editor";
import { loaders } from "@/data/loaders";
import { validateApiResponse } from "@/lib/error-handler";
import { extractYouTubeID } from "@/lib/utils";
import { Params } from "@/types";


interface IPageProps {
  params: Params;
}

export default async function SummarySingleRoute({ params }: IPageProps) {
  const resolvedParams = await params;
  const documentId = resolvedParams?.documentId;

  if(!documentId) return null;

  const data = await loaders.getSummaryByDocumentId(documentId);
  const summary=validateApiResponse(data, "summary");
  const videoId = extractYouTubeID(summary.videoId);


  return (
    <div>
      <div className="h-full grid gap-4 grid-cols-5 p-4">
        <div className="col-span-3">


            {/* <pre>Document Id: {documentId}</pre>
            <pre>{JSON.stringify(summary)}</pre> */}
             <SummaryUpdateForm summary={summary}/> 
        </div>
        <div className="col-span-2">
            <div>
          {videoId ? (
              <YouTubePlayer videoId={videoId} />
            ) : (
              <p>Invalid video URL</p>
            )}
            <h1 className="text-2xl font-bold mt-4">{summary.title}</h1> 
            </div>
        </div>
      </div>
    </div>
  )
}
