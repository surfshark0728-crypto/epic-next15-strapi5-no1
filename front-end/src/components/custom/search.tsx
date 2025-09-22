"use client";
import { usePathname, useSearchParams,useRouter } from "next/navigation";
import { Input } from "../ui/input";
import { cn } from "@/lib/utils";
import { useDebouncedCallback } from "use-debounce";


interface ISearchProps {
    className?: string;
}


export default function Search({className}:ISearchProps) {
  const searchParams = useSearchParams();
  const {replace} =useRouter();
  const pathname=usePathname();


 const handleSearch = useDebouncedCallback((term: string) => {
    console.log(`✅Searching... ${term}`);
    const params = new URLSearchParams(searchParams);
    params.set("page", "1");

    if (term) {
      params.set("query", term);
    } else {
      params.delete("query");
    }

    replace(`${pathname}?${params.toString()}`);
  }, 300);

  return (
       <Input 
            type="text"
            placeholder="검색"
            onChange={(e:React.ChangeEvent<HTMLInputElement>)=>handleSearch(e.target.value)}
            className={cn("", className)}
      />        
  )


}
