import ProfileForm from "@/components/forms/profile-form";
import { actions } from "@/data/actions";

import { validateApiResponse } from "@/lib/error-handler";
// import { ProfileImageForm } from "@/components/forms/profile-image-form";

export default async function AccountRoute() {
  //const user = await services.auth.getUserMeService();
  const user = await actions.auth.getUserMeAction();
  const userData = validateApiResponse(user, "user profile");
  const userImage = userData?.image;

  return (
    <div className="grid grid-cols-1 lg:grid-cols-5 gap-4 p-4">
       Accout Page
       <ProfileForm user={userData} className="col-span-3" /> 
      {/* <ProfileImageForm image={userImage} className="col-span-2" /> */}
    </div>
  );
}