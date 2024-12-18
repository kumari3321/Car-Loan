
import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoanCalculatorPage from './LoanCalculatorPage';
import LoanConfigPage from './LoanConfigPage';
import Register from './Register';
import LoginPage from './LoginPage';
import UserInfo from './UserInfo';
import UserDetails from './UserDetails';
import { Constants } from './CommonConstant';
import NewRegister from './NewRegister';




interface PrivateRouteProps {
  element: React.ElementType; 
  userRole: string;  
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, userRole }) => {
  const token = localStorage.getItem('accessToken');
  const rolesFromStorage = localStorage.getItem('roles');
  
  if (!token) { 
    return <Navigate to="/loginPage" />;
  }
  
  if (!rolesFromStorage || !rolesFromStorage.includes(userRole)) {
    return <Navigate to="/unauthorized" />;
  }

  return React.createElement(element);
};

const App = () => {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/registerPage" element={<Register />} />
        <Route path="/" element={<LoginPage />} />
        <Route path="/newRegister" element={<NewRegister/>}/>
        
        <Route
  path="/loanCalculatorPage"
  element={<PrivateRoute element={LoanCalculatorPage}  userRole='[]' />}
/>

        
        <Route
          path="/loanConfigPage"
          element={<PrivateRoute element={LoanConfigPage}  userRole={Constants.roles.admin} />}
        />

        
        <Route
          path="/userInfo"
          element={<PrivateRoute element={UserInfo} userRole={Constants.roles.admin}/>}
        />
        
        <Route
          path="/userDetails"
          element={<PrivateRoute element={UserDetails} userRole='[]'/>}
        />
        
      
        {/* <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} /> */}
        
      </Routes>
    </BrowserRouter>
  );
};

export default App;






















