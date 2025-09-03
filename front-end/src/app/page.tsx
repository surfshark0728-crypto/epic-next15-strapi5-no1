import FeaturesSection, { IFeaturesSectionType } from "@/components/custom/features-section";
import HeroSection, { IHeroSection } from "@/components/custom/hero-section";
import { getStrapiURL } from "@/lib/utils";
import qs from "qs";

/**
 * Example API URL (qs.stringify로 자동 변환됨)
 * http://localhost:1337/api/home-page?populate[blocks][on][layout.hero-section][populate][image][fields][0]=url
 * &populate[blocks][on][layout.hero-section][populate][image][fields][1]=alternativeText
 * &populate[blocks][on][layout.hero-section][populate][link][populate]=true
 */
const homePageQuery = qs.stringify({
  populate: {
    blocks: {
      on: {
        "layout.hero-section": {
          populate: {
            image: { fields: ["url", "alternativeText"] },
            link: { populate: true },
          },
        },
        "layout.features-section": {
          populate: {
            features: { populate: true },
          },
        },
      },
    },
  },
});

/**
 * Strapi 데이터 가져오기
 */
async function getStrapiData(path: string) {
  const baseUrl = getStrapiURL();

  try {
    const url = new URL(path, baseUrl);
    url.search = homePageQuery;

    const response = await fetch(url.href, { cache: "no-store" });
    if (!response.ok) {
      throw new Error(`Failed to fetch data: ${response.status}`);
    }

    const data = await response.json();
    console.log("Strapi Response:", data);
    return data;
  } catch (error) {
    console.error("Strapi fetch error:", error);
    throw error;
  }
}

/**
 * HomePage 타입 정의
 */
interface HomePage {
  title: string;
  description: string;
  blocks: (IHeroSection | IFeaturesSectionType)[];
}

/**
 * Type Guards
 */
function isHeroSection(block: any): block is IHeroSection {
  return block.__component === "layout.hero-section";
}

function isFeaturesSection(block: any): block is IFeaturesSectionType {
  return block.__component === "layout.features-section";
}

/**
 * Home 컴포넌트
 */
export default async function Home() {
  const strapiData = await getStrapiData("/api/home-page");

  const { blocks } = strapiData.data as HomePage;

  return (
    <main>
      {blocks.map((block, index) => {
        if (isHeroSection(block) && index === 0) {
          return <HeroSection key={block.id} data={block} />;
        }

        if (isFeaturesSection(block)) {
          return <FeaturesSection key={block.id} data={block} />;
        }

        return null;
      })}
    </main>
  );
}
