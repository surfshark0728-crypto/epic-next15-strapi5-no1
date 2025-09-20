// src/data/actions/index.ts
import * as authActions from "./auth";
import * as profileActions from "./profile";
import * as summaryActions from "./summary";

export const actions = {
  auth: {
    ...authActions,
  },
  profile: {
    ...profileActions,
  },
  summary:{
    ...summaryActions
  }
};
