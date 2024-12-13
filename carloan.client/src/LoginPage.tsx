

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
    <div className="login-page">
      <Form onFinish={onFinish} className="login-form">
        <FormItem
          name="username"
          rules={[{ required: true, message: 'Please input your username!' }]}
        >
          <Input prefix={<UserOutlined style={{ fontSize: 13 }} />} placeholder="Username" />
        </FormItem>
        <FormItem
          name="password"
          rules={[{ required: true, message: 'Please input your password!' }]}
        >
          <Input prefix={<LockOutlined style={{ fontSize: 13 }} />} type="password" placeholder="Password" />
        </FormItem>
        <FormItem>
          <Checkbox defaultChecked>Remember me</Checkbox>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          <a onClick={redirectToRegister}>Register now!</a>
        </FormItem>
      </Form>
    </div>
  );
};

export default LoginPage;

function FlashMessage(type: string, message: string) {
  console.log(`${type.toUpperCase()}: ${message}`);
}






















