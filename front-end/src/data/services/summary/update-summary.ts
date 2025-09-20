
import { api } from "@/data/data-api";
import { safeRequireAuthToken } from "@/lib/auth-helpers";
import { getStrapiURL } from "@/lib/utils";
import { TStrapiResponse, TSummary } from "@/types";
import qs from "qs";

const baseUrl = getStrapiURL();

export async function updateSummaryService(
    documentId: string,
    summaryData:Partial<TSummary>
):Promise<TStrapiResponse<TSummary>>{

  const { data: authToken } = await safeRequireAuthToken();
   
  const query = qs.stringify({populate: "*",});

  const url =new URL(`/api/summaries/${documentId}`, baseUrl);
  url.search = query;


  const payload = {data: summaryData};
  const result =await api.put<TSummary, typeof payload>(url.href, payload, { authToken });

  return result;
}