// import React from 'react'
// import LoanCalculatorPage from './LoanCalculatorPage'
// import LoanConfigPage from './LoanConfigPage'
// import { BrowserRouter, Route, Router, Routes } from 'react-router-dom'
// import Register from './Register'
// import LoginPage from './LoginPage'
// import UserInfo from './UserInfo'
// import UserPropfile from './UserPropfile'
// import UserDetailsPage from './UserDetails'
// import UserDetails from './UserDetails'

// const App = () => {
//   return (
//     <>
//     < BrowserRouter >
//       <Routes>
//         <Route path='/loanCalculatorPage' element={<LoanCalculatorPage/>}/>
//         <Route path='/loanConfigPage' element={<LoanConfigPage/>}/>
//         <Route path='/registerPage' element={<Register/>}/>
//         <Route path='/loginPage' element={<LoginPage/>}/>
//         <Route path='/userInfo' element={<UserInfo/>}/>
//        {/* <Route path='/userProfile' element={<UserPropfile/>}/> */}
//        <Route path="/userDetails" element={<UserDetails />} />
     
        
//       </Routes>
      
//     </BrowserRouter>
//      {/* <LoanCalculatorPage/>
//      <LoanConfigPage/> */}
//     </>
//   )
// }

// export default App



import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import LoanCalculatorPage from './LoanCalculatorPage';
import LoanConfigPage from './LoanConfigPage';
import Register from './Register';
import LoginPage from './LoginPage';
import UserInfo from './UserInfo';
import UserDetails from './UserDetails';

// Define types for the props in PrivateRoute
interface PrivateRouteProps {
  element: React.ElementType;  // The React component to render
  roles: string[];             // Allowed roles (e.g., ['user', 'admin'])
}

const PrivateRoute: React.FC<PrivateRouteProps> = ({ element, roles }) => {
  const token = localStorage.getItem('accessToken');
  const userRole = localStorage.getItem('roles');
  
  if (!token) { 
    return <Navigate to="/loginPage" />;
  }
  
 
  return React.createElement(element);
};

const App: React.FC = () => {
  return (
    <BrowserRouter>
      <Routes>
        {/* Public Routes */}
        <Route path="/registerPage" element={<Register />} />
        <Route path="/loginPage" element={<LoginPage />} />
        
        {/* Private Routes */}
        <Route
          path="/loanCalculatorPage"
          element={<PrivateRoute element={LoanCalculatorPage} roles={['user', 'admin']} />}
        />
        
        <Route
          path="/loanConfigPage"
          element={<PrivateRoute element={LoanConfigPage} roles={['admin']} />}
        />
        
        <Route
          path="/userInfo"
          element={<PrivateRoute element={UserInfo} roles={['admin']} />}
        />
        
        <Route
          path="/userDetails"
          element={<PrivateRoute element={UserDetails} roles={['user', 'admin']} />}
        />
        
        {/* Unauthorized Access Route */}
        <Route path="/unauthorized" element={<h1>Unauthorized Access</h1>} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;






















