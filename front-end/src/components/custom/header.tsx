import Link from "next/link";
import type { THeader } from "@/types";
import { Logo } from "@/components/custom/logo";
import { Button } from "@/components/ui/button";
import { LoggedInUser } from "@/components/custom/logged-in-user";
import { actions } from "@/data/actions";
import { SummaryForm } from "../forms/summary-form";

const styles = {
  header:
     "flex  items-center justify-between px-4 py-3 bg-white shadow-md dark:bg-gray-800",
  actions: "flex items-center   gap-4",
  summaryContainer: "flex-1 flex justify-center max-w-2xl mx-auto",
};

interface IHeaderProps {
  data?: THeader | null;
}

export async function Header({ data }:Readonly<IHeaderProps>) {
  if (!data) return null;
  const user = await actions.auth.getUserMeAction();
  const { logoText, ctaButton } = data;

  return (
    <div className={styles.header}>
      <Logo text={logoText.label} />

      {user.success && <SummaryForm />}
      
      <div className={styles.actions}>
        {user.success && user.data ? (
          <LoggedInUser userData={user.data} />
        ) : (
          <Link href={ctaButton.href}>
            <Button>{ctaButton.label}</Button>
          </Link>
        )}
      </div>
    </div>
  );
}