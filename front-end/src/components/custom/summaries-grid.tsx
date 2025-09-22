import Link from "next/link";
import { TSummary } from "@/types";
import Markdown from "react-markdown";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { CardFooter } from "../tiptap-ui-primitive/card";

interface ILinkCardProps {
  summary: TSummary;
}

const styles = {
  card: "relative hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200",
  cardHeader: "pb-3",
  cardTitle: "text-lg font-semibold text-pink-600 leading-tight line-clamp-2",
  cardContent: "pt-0",
  markdown: `prose prose-sm max-w-none overflow-hidden
    prose-headings:text-gray-900 prose-headings:font-medium prose-headings:text-base prose-headings:mb-1 prose-headings:mt-0 prose-headings:leading-tight
    prose-p:text-gray-600 prose-p:leading-relaxed prose-p:text-sm prose-p:mb-1 prose-p:mt-0
    prose-a:text-pink-500 prose-a:no-underline hover:prose-a:underline
    prose-strong:text-gray-900 prose-strong:font-medium
    prose-ul:list-disc prose-ul:pl-4 prose-ul:text-sm prose-ul:mb-1 prose-ul:mt-0
    prose-ol:list-decimal prose-ol:pl-4 prose-ol:text-sm prose-ol:mb-1 prose-ol:mt-0
    prose-li:text-gray-600 prose-li:text-sm prose-li:mb-0
    [&>*:nth-child(n+4)]:hidden`,
  grid: "grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6",
};

function LinkCard({ summary }: Readonly<ILinkCardProps>) {
  const { documentId, title, content } = summary;
  return (
    <div>    
      <Card className="relative hover:shadow-lg transition-shadow duration-200 cursor-pointer border border-gray-200">
        <CardHeader className="pb-3">
          <CardTitle className="text-lg font-semibold text-pink-600 leading-tight line-clamp-2">
            {title || "Video Summary"}
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-0">

          {content &&<div className={styles.markdown}>
            <Markdown>{content.slice(0, 150)}</Markdown>
            </div>
            }

        </CardContent>
        <CardFooter className="px-6">
          <Link href={`/dashboard/summaries/${documentId}`}>
              <p className="text-pink-500 font-medium text-xs mt-3 !cursor-pointer">상세보기 →</p>
          </Link>
        </CardFooter>
      </Card>    
    </div>
  );
}

interface ISummariesGridProps {
  summaries: TSummary[];
  className?: string;
}

export function SummariesGrid({ summaries, className }: ISummariesGridProps) {
  return (
    <div className={cn(styles.grid, className)}>
      {summaries.map((item: TSummary) => (
        <LinkCard key={item.documentId} summary={item} />
      ))}
    </div>
  );
}