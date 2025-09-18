import { SummariesGrid } from '@/components/custom/summaries-grid';
import { loaders } from '@/data/loaders'
import { validateApiResponse } from '@/lib/error-handler';
import React from 'react'

export default async function SummariesRoute() {
   const data = await loaders.getSummaries();
   const summaries = validateApiResponse(data, "summaries");

  return (
    <div className="flex flex-col min-h-[calc(100vh-80px)] p-4 gap-6">
        <SummariesGrid summaries={summaries} className="flex-grow" />
    </div>
  )
}
