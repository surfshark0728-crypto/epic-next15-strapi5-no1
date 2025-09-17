import * as authServices from "./auth";
import * as profileServices from "./profile";
import * as fileServices from "./file";
import * as summarizeServices from "./summary";

export const services ={
    auth:{
       ...authServices
    },
    profile:{
       ...profileServices
    },
    file: {
      ...fileServices
    },
    summarize: {
      ...summarizeServices
    }
}

