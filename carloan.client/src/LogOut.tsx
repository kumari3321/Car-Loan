import React from 'react'
import { signOutUser } from './apis/LoanCalculator';
import { get, remove } from './Utils';
import { useNavigate } from 'react-router-dom';
import { Button } from 'antd';

const LogOut = () => {

    const navigate = useNavigate();

    const signOutUserApi = () => {
        signOutUser()
            .then((response: any) => { })
            .catch((Error: any) => { });
       
        remove("token");
        remove("username");
        remove("email");
        remove("id");
        navigate("/");
    };

    const roleInStorage = JSON.parse(get("model")).userRoles[0];
    return (
        <>
        gdtss</>
        // <div className='col-md-4 d-flex align-items-center justify-content-end'>
        //     <Button
        //         className=' mb-0 cursorPointer'
        //         // onClick={()=>signOutUserApi}
        //     >
        //         LOG OUT
        //     </Button></div>
    )
}

export default LogOut