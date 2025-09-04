import { THeader } from "@/types";
import React from "react";
import Link from "next/link";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";


const styles = {
  header:
    "flex  items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800",
  actions: "flex items-center gap-4",
  summaryContainer: "flex-1 flex justify-center max-w-2xl mx-auto",
};

interface IHeaderProps {
  data?: THeader | null;
}

const Header = ({ data }: IHeaderProps) => {
  if (!data) return null;

  const {logoText, ctaButton} =data;

    return(
        <div className={styles.header}>
            <Logo text={logoText.label} />
            <div className={styles.actions}>
                <Link href={ctaButton.href}>
                    <Button>{ctaButton.label}</Button>
                </Link>
            </div>
        </div>
    )
 
};

export default Header;
