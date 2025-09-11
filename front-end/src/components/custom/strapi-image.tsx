import { getStrapiURL } from "@/lib/utils";
import Image from "next/image";


interface IStrapiMediaProps {
    src:string;
    alt:string | null;
    height?: number;
    width?: number;
    className?: string;
    fill?: boolean;
    priority?: boolean;
}



export function getStrapiMedia(url: string | null) {
    const strapiURL= getStrapiURL();
    if(url==null) return null;
    if(url.startsWith("data:")) return url;
    if(url.startsWith("http") || url.startsWith("//")) return url;
    return `${strapiURL}${url}`
}



const StrapiImage = ({src, alt, className, ...rest}:Readonly<IStrapiMediaProps>) => {

  const imageUrl =getStrapiMedia(src); 

  if(!imageUrl) return null;

  return (
    <Image
      src={imageUrl}
      alt={alt ?? "No alternative text provided"}
      className={className}
      {...rest}
    />
  );

}



export default StrapiImage;
