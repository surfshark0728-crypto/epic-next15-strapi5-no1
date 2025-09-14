// src/data/actions/index.ts
import * as authActions from "./auth";
import * as profileActions from "./profile";

export const actions = {
  auth: {
    ...authActions,
  },
  profile: {
    ...profileActions,
  },
};
