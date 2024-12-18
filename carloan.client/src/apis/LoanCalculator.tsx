
import { AddLoanCalulator, AddUsers, GetAllUsers, GetLoanMaxMin, GetLoanMaxMinById, GetUserById, GetUserByUserId, LoginUser, signOut, UpdateAdminValue, UpdateUsers } from "../actions/LoanCalculator";

export function addLoanCalculator(payload:any){
    return AddLoanCalulator(payload);
}
export function getLoanMaxMin(){
    return GetLoanMaxMin();
}

export function getLoanMaxMinById(id:any){
    console.log(id,"idbhaiid");
    return GetLoanMaxMinById(id);
}
export function updateAdminValue(payload:any){
    console.log("Fsf",payload);
    
    return UpdateAdminValue(payload);
}
export function addUsers(payload:any){
    // console.log(
    //     payload,"checkregister"
    // );
    
    return AddUsers(payload);
}
export function loginUsers(payload:any){
    return LoginUser(payload);
}
export function getAllUsers(){
    return GetAllUsers();
}
export function  updateUsers(payload:any){
    return UpdateUsers(payload);
}
export function getUserById(id:any){
    return GetUserById(id);
}
export function getUserByUserId(id:any){
    return GetUserByUserId(id);
}
export const signOutUser: any = function () {
    return signOut();
  }; 
