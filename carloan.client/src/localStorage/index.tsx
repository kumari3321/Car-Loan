import { Link, useNavigate, useNavigation } from "react-router-dom";
import { signOutUser } from "../apis/LoanCalculator";
import { remove } from "../Utils";

export const isLoggedIn = () => {
    let token = localStorage.getItem('accessToken');
    if (token !== undefined && token !== '' && token !== null) {
        return true
    } else {
        return false
    }
};


export const isLoggedOut = (navigate: any) => {
    
    remove("token");
    remove("username");
    remove("email");
    remove("id");

    navigate("/"); 
};