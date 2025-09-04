import FeaturesSection, {  IFeaturesSectionType } from "@/components/custom/features-section";
import HeroSection, {  IHeroSectionType } from "@/components/custom/hero-section";
import { loaders } from "@/data/loaders";
import { validateApiResponse } from "@/lib/error-handler";

export type TBlocks = IHeroSectionType | IFeaturesSectionType;

interface HomePage {
  title: string;
  description: string;
  blocks: TBlocks[];
}


function blockRenderer(block: TBlocks , index: number) {

  switch (block.__component) {
    case "layout.hero-section":
      if (index !== 0) return null;
      return <HeroSection key={index} data={block as IHeroSectionType} />;
    case "layout.features-section":
      //console.log("Sections data:", block);
      return (
        <FeaturesSection key={index} data={block as IFeaturesSectionType} />
      );
    default:
      return null;
  }

}


export default async function Home() {
  const homePageData = await loaders.getHomePageData();
  const data =validateApiResponse(homePageData, "Home Page");
  const { blocks } = data as HomePage;

  return (
    <main>
      {blocks.map((block, index) => blockRenderer(block, index))}
    </main>
  );
}

