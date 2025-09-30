import qs  from  "qs";
import type { TStrapiResponse, THomePage, TGlobal, TMetaData, TSummary } from "@/types";
import {api} from "@/data/data-api";
import {getStrapiURL} from "@/lib/utils";
import { safeRequireAuthToken } from "@/lib/auth-helpers";


/**
 * Example API URL (qs.stringify로 자동 변환됨)
 * http://localhost:1337/api/home-page?populate[blocks][on][layout.hero-section][populate][image][fields][0]=url
 * &populate[blocks][on][layout.hero-section][populate][image][fields][1]=alternativeText
 * &populate[blocks][on][layout.hero-section][populate][link][populate]=true
 */



const baseUrl = getStrapiURL();

async function getHomePageData(): Promise<TStrapiResponse<THomePage>> {
    const query =qs.stringify({
        populate:{
            blocks:{
                on:{
                    "layout.hero-section":{
                        populate:{
                            image:{fields:["url","alternativeText"]},
                            link:{populate:true}
                        }
                    },
                    "layout.features-section":{
                        populate:{
                            features:{populate:true}
                        }
                    }
                }
            }
        }
    })


    const url = new URL("/api/home-page", baseUrl);
    url.search = query;
    //로딩 테스트
    //await new Promise(resolve => setTimeout(resolve, 6000));
    return api.get<THomePage>(url.href);
}



async function getGlobalData():Promise<TStrapiResponse<TGlobal>> {
    //throw new Error("Test error");
    const query=qs.stringify({
        populate:[
            "header.logoText",
            "header.ctaButton",
            "footer.logoText",
            "footer.socialLink",
        ]
    })
    const url = new URL("/api/global", baseUrl);
    url.search = query;            
    //console.log(" ✅ getGlobalData Strapi URL", url.href);
    return api.get<TGlobal>(url.href);
}



async function getMetaData():Promise<TStrapiResponse<TMetaData>>{
    const query =qs.stringify({
        fields: ["title", "description"]
    });

    const url=new URL("/api/global", baseUrl);
    url.search=query;
    return api.get<TMetaData>(url.href);
}


// 요약 목록 가져오기
// 요약 목록 가져오기 함수
// - 검색어(queryString)가 있으면 제목(title)이나 내용(content)에 해당 검색어가 포함된 항목만 가져옴
// - 최신순(createdAt:desc)으로 정렬
async function getSummaries(queryString: string, page: number=1): Promise<TStrapiResponse<TSummary[]>> {
  // 1) 인증 토큰 확인
  const { success, data: authToken } = await safeRequireAuthToken();
  if (!success || !success) throw new Error("You are not authorized"); 
  // ✅ 인증 실패 시 에러 발생

  // 2) 쿼리스트링 생성
  const query = qs.stringify({
    sort: ["createdAt:desc"], // 항상 최신순 정렬
    ...(queryString && {      // 검색어가 있을 때만 필터 추가
      filters: {
        $or: [                // OR 조건 → 둘 중 하나라도 true면 매칭
          { title: { $containsi: queryString } },   // 제목에 검색어 포함 (대소문자 구분 X)
          { content: { $containsi: queryString } }, // 내용에 검색어 포함 (대소문자 구분 X)
        ],
      },
    }),
    pagination: {
      page: page,
      pageSize: process.env.PAGE_SIZE || 4,
    },
  });

  // 3) API URL 구성
  const url = new URL("/api/summaries", baseUrl);
  url.search = query; // 만들어둔 쿼리스트링 적용

  console.log("✅✔️ 검색 :",queryString, url.href);
  // 4) API 요청 → 인증 토큰 포함
  return api.get<TSummary[]>(url.href, { authToken });
}













// 요약 개별 데이터 가져오기
async function getSummaryByDocumentId( documentId: string) : Promise<TStrapiResponse<TSummary>>{
  const {success, data: authToken} = await safeRequireAuthToken();
  if (!success || !success) throw new Error("You are not authorized");

  const path = `/api/summaries/${documentId}`;
  const url=new URL(path, baseUrl);

  return api.get<TSummary>(url.href, { authToken });
}   




export const loaders = {
    getHomePageData,
    getGlobalData,
    getMetaData,
    getSummaries,
    getSummaryByDocumentId
};





