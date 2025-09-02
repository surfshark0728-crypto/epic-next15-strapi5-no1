
import { Button } from "@/components/ui/button";
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
}



export default async function Home() {
  const strapiData =await getStarapiData("/api/home-page");

  const { title, description } = strapiData.data as HomePage;


  return (
    <div className="font-sans grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20">
      
      <h1 className="text-5xl font-bold">{title}</h1>
      <p className="text-xl mt-4">{description}</p>

      <main className="flex flex-col gap-[32px] row-start-2 items-center sm:items-start">
        <Button>Our Cool Button</Button>
      </main>
      
    </div>
  );
}





