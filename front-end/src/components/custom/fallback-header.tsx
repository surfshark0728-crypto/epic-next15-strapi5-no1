import Link from "next/link";
import type { THeader } from "@/types";

import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";

interface IFallbackHeaderProps {
  header?: THeader | null;
}

const styles = {
  header:
    "flex items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800",
  actions: "flex items-center gap-4",
};

export function FallbackHeader({ header }: IFallbackHeaderProps) {
  if (!header) return null;

  const { logoText, ctaButton } = header;
  return (
    <div className={styles.header}>
      <Logo text={logoText.label} />
      <div className={styles.actions}>
        <Link href={ctaButton.href}>
          <Button>{ctaButton.label}</Button>
        </Link>
      </div>
    </div>
  );
}