import axios from "axios";
import { baseUrl } from "../common";
import { log } from "console";
import axiosInstance from "../ApiaxiiosInstance";

export function AddLoanCalulator(payload:any){

    return axiosInstance.post(`${baseUrl}` + "LoanConfigurations/calculate-loan",payload);
}
export function GetLoanMaxMin(){
    return axiosInstance.get(`${baseUrl}` +"LoanConfigurations/GetLoanConfiguration");
}
export function GetLoanMaxMinById(id:any){
    console.log(id,"idhih");
    
    return axiosInstance.get(`${baseUrl}` +`LoanConfigurations/GetLoanConfigurationById?id=${id}`);
}
export function UpdateAdminValue(payload:any ){
    console.log("sdgds",payload);
    
    return axiosInstance.put(`${baseUrl}`+"LoanConfigurations/UpdateLoanConfiguration",payload)
}
export async function AddUsers(payload:any){
    console.log(payload,"register");
    return  axios.post(`${baseUrl}`+"auth/register",payload);
    //console.log(data)
  //  return data;

}
export function LoginUser(payload:any){
    return axios.post(`${baseUrl}`+ "login",payload);
}
export function GetAllUsers(){
    return axiosInstance.get(`${baseUrl}`+ "Account/all");
}
export function UpdateUsers(payload:any){
    return axiosInstance.put(`${baseUrl}`+ "User-Update",payload)
}
export function GetUserById(id:any){
    return axiosInstance.get(`${baseUrl}`+"Account/~api/userInfoById?id="+id);
}
export function GetUserByUserId(UserId:any){
    return axiosInstance.get(`${baseUrl}`+"Account/~api/loginUserInfoByUserId?UserId="+UserId);
}
export function signOut() {
    return axios.post("SignOut");
  }