
import { TImage, TLink } from "@/types";
import Link from "next/link";
import StrapiImage from "./strapi-image";
import { actions } from "@/data/actions";

export type THeroSectionType={
   id: number;
   documentId: string;
   __component: string;
   heading: string;
   subHeading: string;
   image: TImage;
   link: TLink;
}
export interface IHeroSectionProps {
  readonly data: THeroSectionType;  
}

const styles = {
  header: "relative h-[600px] overflow-hidden",
  backgroundImage: "absolute inset-0 object-cover w-full h-full",
  overlay:
    "relative z-10 flex flex-col items-center justify-center h-full text-center text-white bg-black/50",
  heading: "text-4xl font-bold md:text-5xl lg:text-6xl",
  subheading: "mt-4 text-lg md:text-xl lg:text-2xl",
  button:
    "mt-8 inline-flex items-center justify-center px-6 py-3 text-base font-medium text-black bg-white rounded-md shadow hover:bg-gray-100 transition-colors",
};


const HeroSection =async ({ data }: IHeroSectionProps ) => {
  if(!data) return null;
  //const user =await services.auth.getUserMeService();
  const user = await actions.auth.getUserMeAction();
  const userLoggedIn =user.success;

  const {heading, subHeading, link, image} =data;

  // console.log("✅ Hero Section");
  // console.dir(data, { depth: null });

  return (
    <header className={styles.header} >
      <StrapiImage
        alt={image.alternativeText ?? "no alternative text"}
        className="absolute inset-0 object-cover w-full h-full aspect/16:9"
        src={image.url}
        height={1080}
        width={1920}
      />

      <div className={styles.overlay}>
        <h1 className={styles.heading}>{heading}</h1>
        <p className={styles.subheading}>{subHeading}</p>

        <Link
          className={styles.button}
          href={userLoggedIn ? "/dashboard" : link.href}
        >
          {userLoggedIn ? "대시보드" : link.label}
        </Link>


   
      </div>
    </header>
  );

};

export default HeroSection;
