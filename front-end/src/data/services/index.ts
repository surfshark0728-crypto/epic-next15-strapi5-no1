import * as authServices from "./auth";
import * as profileServices from "./profile";
export const services ={
    auth:{
       ...authServices
    },
    profile:{
       ...profileServices
    }
}

