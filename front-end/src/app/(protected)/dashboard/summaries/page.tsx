import Search from '@/components/custom/search';
import { SummariesGrid } from '@/components/custom/summaries-grid';
import { loaders } from '@/data/loaders';
import { validateApiResponse } from '@/lib/error-handler';
import { SearchParams } from "@/types";
import { PaginationComponent } from "@/components/custom/pagination-component";

interface ISummariesRouteProps {
  searchParams: SearchParams;    
}

export default async function SummariesRoute({ searchParams }: ISummariesRouteProps) {
  const resolvedSearchParams = await searchParams;
  const query = resolvedSearchParams?.query as string;

  console.log("=========query==============>",  query);
  const currentPage = Number(resolvedSearchParams?.page) || 1;

  const data = await loaders.getSummaries(query,currentPage);
  const summaries = validateApiResponse(data, "summaries");
  const pageCount = data?.meta?.pagination?.pageCount || 1;  

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 gap-6">
      <Search className="flex-shrink-0" />
      <SummariesGrid summaries={summaries} className="flex-grow" />
      <PaginationComponent pageCount={pageCount} />
    </div>
  );
}
