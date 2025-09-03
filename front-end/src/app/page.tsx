
import HeroSection, { IHeroSection } from "@/components/custom/hero-section";
import qs from "qs";
/**
 * 
 http://localhost:1337/api/home-page?populate[blocks][on][layout.hero-section][populate][image][fields][0]=url&populate[blocks][on][layout.hero-section][populate][image][fields][1]=alternativeText&populate[blocks][on][layout.hero-section][populate][link][populate]=true
 
 * 
 */

const homePageQuery =qs.stringify({
  populate:{
    blocks: {
       on :{
        "layout.hero-section":{
          populate: {
            image: {
              fields: ["url", "alternativeText"]
            },
            link: {
              populate: true
            }
          }
        }
       }
    }
  }
})


async function getStarapiData(path:string){
  const baseUrl ="http://localhost:1337";
  try {
    const url =new URL(path, baseUrl);
    url.search =homePageQuery;

    console.log("1.url.href:", url.href);

    const response = await fetch(url.href);
    const data =await response.json();

    console.log("2.strapiData:",data);
    console.dir( data);

    return data;  
  } catch (error) {
    console.log(error);
  }
}

interface HomePage {
  title: string;
  description: string;
  blocks: [IHeroSection];
}

export default async function Home() {
  const strapiData =await getStarapiData("/api/home-page");  
  console.dir(strapiData.data, {data:null});
  const { blocks } = strapiData.data as HomePage;


  return (
   <main>
     <HeroSection data={blocks[0] } />     
    </main>
  );
}





