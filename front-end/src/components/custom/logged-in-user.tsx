import Link from "next/link";
import LogoutButton from "./logout-button";



interface ILoggedInUserProps  {
    readonly userData: {
        username: string;
        email: string;
    }
}

export  function LoggedInUser({userData}: ILoggedInUserProps) {
  return (
    <div className="flex items-center gap-2">
      <Link href="/dashboard/account" className="font-semibold hover:text-primary">
        {userData.username}
      </Link>
      <LogoutButton />
    </div>
  )
}
