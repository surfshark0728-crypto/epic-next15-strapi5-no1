import { getStrapiURL } from "@/lib/utils";
import { TAuthUser, TStrapiResponse } from "@/types";
import { api } from "@/data/data-api";
import { requireAuthUser } from "@/lib/auth-helpers";

type TUpdateProfile = {
  firstName: string;
  lastName: string;
  bio: string;
};

const baseUrl = getStrapiURL();

export const updateProfileService = async (
  profileData: TUpdateProfile,
): Promise<TStrapiResponse<TAuthUser>> => {
  //const userId = (await services.auth.getUserMeService()).data?.id;
  // const userId = (await actions.auth.getUserMeAction()).data?.id;
  // if (!userId) throw new Error("사용자 ID를 확인할 수 없습니다.");

  // const authToken = await actions.auth.getAuthTokenAction();
  // if (!authToken) throw new Error("로그인이 필요합니다.");
  const { authToken, user } = await requireAuthUser();
  const url = new URL(`/api/users/${user.id}`, baseUrl);
  
  const result = await api.put<TAuthUser, TUpdateProfile>(
    url.href,
    profileData,
    { authToken }
  );



  console.log("✅ 프로필 업데이트 응답 결과:");
  console.dir(result, { depth: null });

  return result;
};
