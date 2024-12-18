

import React from 'react';
import { Form, Input, Button, Checkbox } from 'antd';
import { UserOutlined, LockOutlined } from '@ant-design/icons';
import { useNavigate } from 'react-router-dom';
import './login.scss';
import { loginUsers } from './apis/LoanCalculator';

const FormItem = Form.Item;

const LoginPage = () => {
  const navigate = useNavigate(); 

  const redirectToRegister = () => {
    navigate('/registerPage');
  };

  const onFinish = (values: any) => {
    console.log('Login values:', values);

    loginUsers(values)
      .then((response: any) => {
        const data = response.data;
        console.log('API response:', data);
       
        

        if (data.statusCode === 200) {
          console.log('Login successful:', data);

        
          localStorage.setItem('model', JSON.stringify(data.value.user));
          localStorage.setItem('accessToken', data.value.user.token);
          localStorage.setItem('rid', data.value.user.id);
          localStorage.setItem('roles', JSON.stringify(data.value.user.roles));  

         
          const roles = data.value.user.roles;
          console.log(roles, "roles");

          if (roles && roles.includes('Admin')) {
            console.log('Navigating to LoanConfigPage');
            navigate('/loanConfigPage');
          } else {
            navigate('/loanCalculatorPage');
          }
        } else if (data.responseCode === 303) {
          FlashMessage('error', data.responseMessage);
        }
      })
      .catch((error: any) => {
        console.error('Error during login:', error);
        FlashMessage('error', 'Login failed. Please try again.');
      });
  };

  return (
    <>
           <header >
        <img src="/logo.jpg" style={{position:'absolute' ,left:'20px'}} alt="Logo" className="logo" />
        <h1 className="header-title">EMI Calculator</h1>
      </header>
    <div className="login-page">
      
      <Form onFinish={onFinish} className="login-form">
        <FormItem
        className='input-box'
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined style={{ fontSize: 13 }} />} placeholder="Username" />
        </FormItem>
        {/* <FormItem
        className='input-box'
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input prefix={<LockOutlined style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
        </FormItem> */}
        <Form.Item
         className='input-box'
         validateFirst
        name="password"
       
        rules={[
        { 
         required: true, 
           message: 'Please input your password!' 
           
         },
         {
      min: 8,
      message: 'Password must be at least 8 characters long!',
    },
    {
      pattern: /[A-Z]/,
      message: 'Password must contain at least one uppercase letter!',
    },
    {
      pattern: /[a-z]/,
      message: 'Password must contain at least one lowercase letter!',
    },
    {
      pattern: /[0-9]/,
      message: 'Password must contain at least one number!',
    },
    {
      pattern: /[!@#$%^&*(),.?":{}|<>]/,
      message: 'Password must contain at least one special character!',
    },
       ]}
       >
      <Input.Password  placeholder="Password"/>
      </Form.Item>




        <FormItem>
         
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <a  className='linkRegister' onClick={redirectToRegister}>Register now!</a>
        </FormItem>
      </Form>
    </div>
    </>
  );
};

export default LoginPage;

function FlashMessage(type: string, message: string) {
  console.log(`${type.toUpperCase()}: ${message}`);
}






















