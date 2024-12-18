

import React, { useState } from "react";
import { Button, Col, Form, Input, Row, Select, Upload, UploadFile, UploadProps, notification } from "antd";
import './register.scss';
import { PlusOutlined, UploadOutlined } from "@ant-design/icons"; 
import { addUsers } from "./apis/LoanCalculator";
import { useNavigate } from 'react-router-dom'; 

const { Option } = Select;

const formItemLayout = {
  labelCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
  wrapperCol: {
    xs: { span: 24 },
    sm: { span: 24 },
  },
};

const tailFormItemLayout = {
  wrapperCol: {
    xs: { span: 24, offset: 0 },
    sm: { span: 16, offset: 8 },
  },
};

const Register = () => {
    const [form] = Form.useForm();
    const [file, setFile] = useState<UploadFile | null>(null);
    const [imageBase64, setImageBase64] = useState<string | null>(null);
    const navigate = useNavigate(); 
   
    const validateEmail = (rule: any, value: string): Promise<void> => {
      return new Promise((resolve, reject) => {
        const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
        if (!emailRegex.test(value)) {
          reject('Invalid email address');
        } else {
          resolve();
        }
      });
    };

    const handleSubmit = async (values: any) => {
      try {
        const uploadedFile = values.profilePhoto?.fileList[0];
        let base64Data = uploadedFile?.thumbUrl?.split(",")[1] ?? null; 
        let extension = uploadedFile?.thumbUrl?.split(';')[0].split("/")[1] ?? "";

        if (base64Data && extension) {
          values["profilePhoto"] = base64Data;
          values["extension"] = "." + extension;
        } else {
          values["profilePhoto"] = null;  
          values["extension"] = "";
        }

        const payload = {
          userName: values.userName,
          email: values.email,
          address: values.address,
          password: values.password,
          confirmPassword: values.confirmPassword,
          profilePhoto: values.profilePhoto, 
          extension: values.extension, 
          phoneNumber: values.phoneNumber
        };
        
        console.log("Prepared Payload:", payload);

       
        await addUsers(payload);

        notification.success({
          message: 'Registration Successful',
          description: 'You have successfully registered.',
        });

        
        setTimeout(() => {
          navigate('/loginPage');  
        }, 2000);  
        
        form.resetFields();
      } catch (error) {
        console.error("Error in submission:", error);
        notification.error({
          message: 'Registration Failed',
          description: 'There was an error during registration. Please try again.',
        });
      }
    };

    

  const handlePhotoChange: UploadProps['onChange'] = ({ fileList }) => {
    if (fileList.length > 0) {
      const newFile = fileList[0];
      setFile(newFile);
      const reader = new FileReader();
      reader.onloadend = () => {
        const base64Image = reader.result as string;
        setImageBase64(base64Image);
      };
      reader.readAsDataURL(newFile.originFileObj as Blob);  
    } else {
      setFile(null);
      setImageBase64(null);  
    }
  };

  const prefixSelector = (
    <Form.Item name="prefix" noStyle>
      <Select style={{ width: 70 }}>
        <Option value="86">+86</Option>
        <Option value="87">+87</Option>
      </Select>
    </Form.Item>
  );

  return (
    <div className="page-container3">
      <header className="header3">
        <img src="/logo.jpg" alt="Logo" className="logo" />
        <h1 className="header-title3">EMI Calculator</h1>
      </header>
      
      <div className="register-container">
        <h2 className="register-title">Register Form</h2>
        
        <Form
          form={form}
          name="register"
          onFinish={handleSubmit}  
          layout="vertical"
          {...formItemLayout}
          scrollToFirstError
        >

          <Form.Item
            name="userName"
            label="UserName"
            rules={[{ required: true, message: 'Please input your username!' }]}
          >
            <Input />
          </Form.Item>

          <Form.Item
          
           name="email"
           label="Email"
           rules={[
             { required: true, message: 'Email is required' },
             { validator: validateEmail },
           ]}
         >
            <Input />
          </Form.Item>

            <Form.Item
                  
                  name="password"
                  validateFirst
                 label='Password'
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
                <Input.Password style={{ width: '92%' }}/>
                </Form.Item>

          <Form.Item
            name="confirmPassword"
            label="Confirm Password"
            dependencies={['password']}
            rules={[
              { required: true, message: 'Please confirm your password!' },
              ({ getFieldValue }) => ({
                validator(_, value) {
                  if (!value || getFieldValue('password') === value) {
                    return Promise.resolve();
                  }
                  return Promise.reject(new Error('The two passwords that you entered do not match!'));
                },
              }),
            ]}
          >
            <Input.Password  style={{ width: '92%' }}/>
          </Form.Item> 

          <Form.Item
            name="address"
            label="Address"
            rules={[{ required: true, message: 'Please input your address!' }]}
          >
            <Input  style={{ width: '103%' }}/>
          </Form.Item>

          <Form.Item
           name="phoneNumber"
           label="Phone Number"
           rules={[{ required: true, message: 'Please input your phone number!' }, { pattern: /^[0-9]{10}$/, message: 'Please input a valid 10-digit phone number!' }]}
          >
            {/* addonBefore={prefixSelector} */}
            <Input  maxLength={10} style={{ width: '103%' }} />
          </Form.Item>

          <Form.Item name="profilePhoto" label="Photo">
            <Upload
              listType="picture"
             
              maxCount={1}
              fileList={file ? [file] : []}  
              onChange={handlePhotoChange}
              beforeUpload={() => false} 
            >
              {!file && (
                <Button   style={{width:'137%'}} icon={<UploadOutlined />}>Upload Photo</Button>
              )}
            </Upload>
          </Form.Item>




          <Form.Item {...tailFormItemLayout}>
            <Button type="primary" className='submit' htmlType="submit">
              Register
            </Button>
          </Form.Item>
        
        </Form>
          
         
      </div>
    </div>
  );
};

export default Register;
































































































































































































































































































































































































// import React, { useState } from "react";
// import { Button, Form, Input, Select, Upload, UploadFile, UploadProps, message } from "antd";
// import './register.scss'
// import { PlusOutlined, UploadOutlined } from "@ant-design/icons"; 
// import { addUsers } from "./apis/LoanCalculator";
// import { useNavigate } from "react-router-dom";

// const { Option } = Select;

// const formItemLayout = {
//   labelCol: {
//     xs: { span: 24 },
//     sm: { span: 8 },
//   },
//   wrapperCol: {
//     xs: { span: 44 },
//     sm: { span: 16 },
//   },
// };

// const tailFormItemLayout = {
//   wrapperCol: {
//     xs: { span: 24, offset: 0 },
//     sm: { span: 16, offset: 8 },
//   },
// };

// const Register = () => {
//   const [form] = Form.useForm();
//   const [file, setFile] = useState<UploadFile | null>(null);
//   const [imageBase64, setImageBase64] = useState<string | null>(null);
//   const navigate = useNavigate(); 

 
//     const validateEmail = (rule: any, value: string, callback: (arg0: string | undefined) => void) => {
//       const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
//       if (!emailRegex.test(value)) {
//         callback('Invalid email address');
//       }
//     };
//     const beforeUpload = (file:any) => {
//       const isImage = file.type === 'image/jpeg' || file.type === 'image/jpg' || file.type === 'image/png';
      
//       if (!isImage) {
//         message.error('You can only upload JPEG, JPG, or PNG files!');
//         return false; 
//       }  
//       return true;
//     };
  

//   const handleSubmit = async (values: any) => {
//     try {
//       const uploadedFile = values.profilePhoto?.fileList[0];
//       let base64Data = uploadedFile?.thumbUrl?.split(",")[1] ?? null; 
//       let extension = uploadedFile?.thumbUrl?.split(';')[0].split("/")[1] ?? "";

//       if (base64Data && extension) {
//         values["profilePhoto"] = base64Data;
//         values["extension"] = "." + extension;
//       } else {
//         values["profilePhoto"] = null;  
//         values["extension"] = "";
//       }
       
//       const payload = {
//         userName: values.userName,
//         email: values.email,
//         address: values.address,
//         password: values.password,
//         confirmPassword: values.confirmPassword,
//         profilePhoto: values.profilePhoto, 
//         extension: values.extension, 
//         phoneNumber:values.phoneNumber
//       };

//       console.log("Prepared Payload:", payload);

//       await addUsers(payload);
//       message.success('Registration successful!');
      
//       setTimeout(() => navigate('/loginPage'), 1500);
      
//     } catch (error) {
//       console.error("Error in submission:", error);
//       message.error('Registration failed. Please try again.');
//     }
//   };

//   const handlePhotoChange: UploadProps['onChange'] = ({ fileList }) => {
//     if (fileList.length > 0) {
//       const newFile = fileList[0];
//       setFile(newFile);

//       const reader = new FileReader();
//       reader.onloadend = () => {
//         const base64Image = reader.result as string;
//         setImageBase64(base64Image);
//       };
//       reader.readAsDataURL(newFile.originFileObj as Blob);  
//     } else {
//       setFile(null);
//       setImageBase64(null);  
//     }
//   };

//   const prefixSelector = (
//     <Form.Item name="prefix" noStyle>
//       <Select style={{ width: 70 }}>
//         <Option value="86">+86</Option>
//         <Option value="87">+87</Option>
//       </Select>
//     </Form.Item>
//   );

//   return (
//     <div className="page-container">
//       <header className="header">
//         <img src="/logo.jpg" alt="Logo" className="logo" />
//         <h1 className="header-title">EMI Calculator</h1>
//       </header>
      
//       <div className="register-container">
//         <h2 className="register-title">Register Form</h2>
//         <Form
//           {...formItemLayout}
//           form={form}
//           name="register"
//           onFinish={handleSubmit}  
//           initialValues={{ prefix: '86' }}
//           scrollToFirstError
        
//         >

//           <Form.Item
//             name="userName"
//             label="UserName"
//             rules={[{ required: true, message: 'Please input your username!' }]}
//           >
//             <Input />
//           </Form.Item>
 
//           <Form.Item
          
//            name="email"
//            label="Email"
//            rules={[
//              { required: true, message: 'Email is required' },
//              { validator: validateEmail },
//            ]}
//          >
//             <Input />
//           </Form.Item>

//           <Form.Item
//             name="password"
//             label="Password"
//             rules={[{ required: true, message: 'Please input your password!' }]}
//           >
//             <Input.Password />
//           </Form.Item>

//           <Form.Item
//             name="confirmPassword"
//             label="Confirm Password"
//             dependencies={['password']}
//             rules={[
//               { required: true, message: 'Please confirm your password!' },
//               ({ getFieldValue }) => ({
//                 validator(_, value) {
//                   if (!value || getFieldValue('password') === value) {
//                     return Promise.resolve();
//                   }
//                   return Promise.reject(new Error('The two passwords that you entered do not match!'));
//                 },
//               }),
//             ]}
//           >
//             <Input.Password />
//           </Form.Item>

//           <Form.Item
//             name="address"
//             label="Address"
//             rules={[{ required: true, message: 'Please input your address!' }]}
//           >
//             <Input />
//           </Form.Item>

//           <Form.Item
//            name="phoneNumber"
//            label="Phone Number"
//            rules={[
//            { required: true, message: 'Please input your phone number!' },
//             {
//               pattern: /^[0-9]{10}$/, 
//                message: 'Please input a valid 10-digit phone number!',
//             }
//             ]}
//              >
//             <Input addonBefore={prefixSelector} maxLength={10} style={{ width: '100%' }} />
//             </Form.Item>

//           <Form.Item name="profilePhoto" label="Photo">
//             <Upload
//               listType="picture"
//               maxCount={1}
//               fileList={file ? [file] : []}  
//               onChange={handlePhotoChange}
//               beforeUpload={beforeUpload} 
//             >
//               {!file && (
//                 <Button icon={<UploadOutlined />}>Upload Photo</Button>
//               )}
//             </Upload>
//           </Form.Item>

//           <Form.Item {...tailFormItemLayout}>
//             <Button type="primary" className='submit' htmlType="submit">
//               Register
//             </Button>
//           </Form.Item> 
//         </Form>
//       </div>
//     </div>
//   );
// };

// export default Register;



