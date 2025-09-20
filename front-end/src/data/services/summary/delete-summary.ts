import { getStrapiURL } from "@/lib/utils";
import type { TStrapiResponse } from "@/types";
import { api } from "@/data/data-api";
import { safeRequireAuthToken } from "@/lib/auth-helpers";


const baseUrl = getStrapiURL();



export async function deleteSummaryService(documentId:string) : Promise<TStrapiResponse<null>> {
    
    const { data: authToken } = await safeRequireAuthToken();
   
    const url =new URL(`/api/summaries/${documentId}`, baseUrl);
    const result =await api.delete<null>(url.href, { authToken });

    return result;
}
