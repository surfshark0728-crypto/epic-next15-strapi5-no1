import qs  from  "qs";
import type { TStrapiResponse, THomePage, TGlobal } from "@/types";
import {api} from "@/data/data-api";
import {getStrapiURL} from "@/lib/utils";


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
    return api.get<THomePage>(url.href);
}



async function getGlobalData():Promise<TStrapiResponse<TGlobal>> {
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
    console.log(" ✅ getGlobalData Strapi URL", url.href);
    return api.get<TGlobal>(url.href);
}


export const loaders = {
    getHomePageData,
    getGlobalData
};





