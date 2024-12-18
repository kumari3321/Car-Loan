
import React, { useEffect, useState } from "react";
import { Table, Button, Modal, Form, Input, Upload, UploadProps, UploadFile, notification } from "antd";
import { EditFilled, UploadOutlined } from "@ant-design/icons";
import { getAllUsers, getUserById, updateUsers } from "./apis/LoanCalculator";
import form from "antd/es/form";
import LogOut from "./LogOut";
import { Header } from "antd/es/layout/layout";
interface LogOutProps {
  onSignOut: () => void; 
}
interface Confi {
  id: number;
  userName: string;
  address: string;
  profilePhoto: any;
  extension: string;
  email: string;
  //: string;
}


const UserInfo = () => {
  const [form] = Form.useForm();
  const [data, setData] = useState([]);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

  // const validateEmail = (rule: any, value: string, callback: (arg0: string | undefined) => void) => {
  //   const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
  //   if (!emailRegex.test(value)) {
  //     callback('Invalid email address');
  //   }
  // };


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

  const handleCancel = () => {
    setIsModalVisible(false);

  };



  const getAllUsersInfo = async () => {

    try {
      const res = await getAllUsers();
      console.log("data", res.data);
      setData(res.data);
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };


  const getUserInfoById = async (id: any) => {
    try {
      setIsModalVisible(true);

      const res = await getUserById(id);
      const userData = res.data;

      console.log(userData, "User data retrieved");
      form.setFieldsValue({
        id: userData.id,
        userName: userData.userName,
        email: userData.email,
        address: userData.address,
        profilePhoto: userData.profilePhoto,
      });

      if (userData.profilePhoto) {
        setFile({
          uid: "1",
          name: "existing_image.png",
          status: "done",
          url: userData.profilePhoto,
        });
      } else {
        setFile(null);
      }
    } catch (error) {
      console.error("Error fetching user details:", error);
      setIsModalVisible(false);
    }
  };

  // const handleUserUpdate = async (values: Confi) => {
  //   console.log(values)
  //  //var re=data.status;
  //   try {
  //     console.log(values)
  //     if(values.profilePhoto?.fileList)
  //     {
  //       const uploadedFile = values?.profilePhoto?.fileList?.[0];
  //       let base64Data = uploadedFile?.thumbUrl?.split(",")[1] ?? null;
  //       let extension = uploadedFile?.thumbUrl?.split(';')[0]?.split("/")[1] ?? "";
  //       if (base64Data && extension) {
  //         values["profilePhoto"] = base64Data;
  //         values["extension"] = "." + extension;
  //       } else {
  //         values["profilePhoto"] = null;
  //         values["extension"] = "";
  //       }
  //     }
  //     const payload = {
  //       id: form.getFieldValue("id"),
  //       userName: values.userName,
  //       address: values.address,
  //       email: values.email,
  //       profilePhoto: values.profilePhoto,
  //       extension: values.extension,
  //     };

  //     console.log("Payload being sent:", payload);
      
  //     updateUsers(payload).then((res)=>{
  //       const { status  } = res?.data || {};
    
  //               if (res.status  === 200) {
  //                   notification.success({
  //                       message: 'Configuration Updated',
  //                       description: 'Loan configuration updated successfully.',
  //                   })
  //                   setIsModalVisible(false); 
  //                   getAllUsersInfo();
  //                 }
  //                 else {
  //                                     notification.error({
  //                                         message: 'Update Failed',
  //                                         description: 'Unexpected response from the server.',
  //                                     });
  //                                   }
  //     })

  //     // await updateUsers(payload);
  //     // getAllUsersInfo();

  //     // console.log("API response:", values);
       
  //     // if (data.status === 200) {
  //     //   alert("User information updated successfully.");
  //     //   getAllUsersInfo(); 
  //     //   handleCancel();
  //     // } else {
  //     //   alert("Failed to update user information.");
  //     // }
  //   } catch (error) {
  //     console.error("Error updating user:", error);
  //   }
  // };



  const handleUserUpdate = async (values: Confi) => {
    try {
      // if (values.profilePhoto?.fileList && values.profilePhoto?.fileList.length > 0) {
      //   const uploadedFile = values.profilePhoto.fileList[0];
      //   if (uploadedFile.originFileObj) {
      //     const reader = new FileReader();
      //     reader.onloadend = () => {
      //       const base64Data = reader.result as string;
      //       const extension = uploadedFile.type.split("/")[1];
      //       values["profilePhoto"] = base64Data.split(",")[1]; 
      //       values["extension"] = `.${extension}`; 
      //     };
      //    // reader.readAsDataURL(uploadedFile.originFileObj); 
      //   }

      if(values.profilePhoto)
        {
          const uploadedFile = values?.profilePhoto?.fileList?.[0];
          let base64Data = uploadedFile?.thumbUrl?.split(",")[1] ?? null;
          let extension = uploadedFile?.thumbUrl?.split(';')[0]?.split("/")[1] ?? "";
          if (base64Data && extension) {
            values["profilePhoto"] = base64Data;
            values["extension"] = "." + extension;
          } else {
            values["profilePhoto"] = null;
            values["extension"] = "";
          }
        }
      

      const payload = {
        id: form.getFieldValue("id"),
        userName: values.userName,
        address: values.address,
        email: values.email,
        profilePhoto: values.profilePhoto,
        extension: values.extension,
      };

      const res = await updateUsers(payload);
      if (res?.status === 200) {
        notification.success({
          message: 'Configuration Updated',
          description: 'Loan configuration updated successfully.',
        });
       
       // getUserInfoById(values.id);
        setIsModalVisible(false);
        handleCancel();
        getAllUsersInfo();
      } else {
        notification.error({
          message: 'Update Failed',
          description: 'Unexpected response from the server.',
        });
      }
    } catch (error) {
      console.error("Error updating user:", error);
      notification.error({
        message: 'Error',
        description: 'Something went wrong while updating user information.',
      });
    }
  };

  const handlePhotoChange: UploadProps["onChange"] = ({ fileList }) => {
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


  useEffect(() => {
    getAllUsersInfo();
  }, []);

  const columns = [
    {
      title: "Username",
      dataIndex: "userName",
      key: "userName",
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Photo",
      dataIndex: "profilePhoto",
      key: "profilePhoto",
      render: (text: any) => <img src={text} alt="photo" width={50} />,
    },



    {
      title: "Action",
      key: "id",
      dataIndex: "id",
      render: (id: any, record: any) => (
        <Button type="link" onClick={() => getUserInfoById(id)}>
          Update
        </Button>
      ),
    },
  ];

  return (
    <>

    <Header>
      <h2 style={{backgroundColor:"white" , display:'flex',justifyContent:"center"}}>Users Details</h2>
      {/* <div className='col-md-4 d-flex align-items-center justify-content-end'>
      <LogOut/>
      <h5
        className='mb-0 cursorPointer'
        onClick={onSignOut} 
      >
        LOG OUT
      </h5>
    </div> */}
 
  <div>
     </div>
    </Header>
      <Table dataSource={data} columns={columns} rowKey="id" />

      {isModalVisible && (
        <Modal
          title="Update Record"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >


          <Form
            // initialValues={getData}
            onFinish={handleUserUpdate}
            layout="vertical"
            form={form}
          >
            <Form.Item name="id" hidden>
              {/* <Input /> */}
            </Form.Item>

            <Form.Item
              name="userName"
              label="Username"
              rules={[{ required: true, message: "Please input the username!" }]}
            >
              <Input
              />
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
              name="address"
              label="Address"
              rules={[{ required: true, message: "Please input the address!" }]}
            >
              <Input />
            </Form.Item>
        
            <Form.Item name="profilePhoto" label="Photo">
              <Upload
                listType="picture"
                maxCount={1}
                fileList={
                  file
                    ? [file]
                    : existingImageUrl
                      ? [
                        {
                          uid: "-1", 
                          name: "existing_image.png", 
                          status: "done", 
                          url: existingImageUrl, 
                        },
                      ]
                      : []
                }
                onChange={handlePhotoChange}
                beforeUpload={() => false} 
              >
                {!file && !existingImageUrl && (
                  <Button icon={<UploadOutlined />}>Upload Photo</Button>
                )}
              </Upload>
            </Form.Item>
            
            <Form.Item>
              <Button type="primary" htmlType="submit">
                Save
              </Button>
            </Form.Item>
          </Form>
        </Modal>
      )}
    </>
  );
};

export default UserInfo;




// import React, { useEffect, useState } from "react";
// import { Table, Button, Modal, Form, Input, Upload, UploadFile, notification, UploadProps } from "antd";
// import { EditFilled, UploadOutlined } from "@ant-design/icons";
// import { getAllUsers, getUserById, updateUsers } from "./apis/LoanCalculator";
// import form from "antd/es/form";

// interface Confi {
//   id: number;
//   userName: string;
//   address: string;
//   profilePhoto: any;
//   extension: string;
//   email: string;
// }

// const UserInfo = () => {
//   const [form] = Form.useForm();
//   const [data, setData] = useState([]);
//   const [file, setFile] = useState<UploadFile | null>(null);
//   const [isModalVisible, setIsModalVisible] = useState(false);
//   const [imageBase64, setImageBase64] = useState<string | null>(null);
//   const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);

//   // Updated email validation
//   const validateEmail = (rule: any, value: string): Promise<void> => {
//     return new Promise((resolve, reject) => {
//       const emailRegex = /^[A-Za-z0-9+_.-]+@(.+)$/;
//       if (!emailRegex.test(value)) {
//         reject('Invalid email address');
//       } else {
//         resolve();
//       }
//     });
//   };

//   const handleCancel = () => {
//     setIsModalVisible(false);
//   };

//   const getAllUsersInfo = async () => {
//     try {
//       const res = await getAllUsers();
//       console.log("data", res.data);
//       setData(res.data);
//     } catch (error) {
//       console.error("Failed to fetch users", error);
//     }
//   };

//   const getUserInfoById = async (id: any) => {
//     try {
//       setIsModalVisible(true);
//       const res = await getUserById(id);
//       const userData = res.data;
//       console.log(userData, "User data retrieved");
//       form.setFieldsValue({
//         id: userData.id,
//         userName: userData.userName,
//         email: userData.email,
//         address: userData.address,
//       });

//       if (userData.profilePhoto) {
//         setFile({
//           uid: "1",
//           name: "existing_image.png",
//           status: "done",
//           url: userData.profilePhoto,
//         });
//         setExistingImageUrl(userData.profilePhoto); // Set existing image URL if exists
//       } else {
//         setFile(null);
//         setExistingImageUrl(null); // Reset image if none exists
//       }
//     } catch (error) {
//       console.error("Error fetching user details:", error);
//       setIsModalVisible(false);
//     }
//   };

//   const handleUserUpdate = async (values: Confi) => {
//     try {
//       if (values.profilePhoto?.fileList && values.profilePhoto?.fileList.length > 0) {
//         const uploadedFile = values.profilePhoto.fileList[0];
//         if (uploadedFile.originFileObj) {
//           const reader = new FileReader();
//           reader.onloadend = () => {
//             const base64Data = reader.result as string;
//             const extension = uploadedFile.type.split("/")[1];
//             values["profilePhoto"] = base64Data.split(",")[1]; // Only the base64 data, excluding metadata
//             values["extension"] = `.${extension}`; // Add file extension for saving
//           };
//           reader.readAsDataURL(uploadedFile.originFileObj); // Convert file to base64 string
//         }
//       }

//       const payload = {
//         id: form.getFieldValue("id"),
//         userName: values.userName,
//         address: values.address,
//         email: values.email,
//         profilePhoto: values.profilePhoto,
//         extension: values.extension,
//       };

//       const res = await updateUsers(payload);
//       if (res?.status === 200) {
//         notification.success({
//           message: 'Configuration Updated',
//           description: 'Loan configuration updated successfully.',
//         });
//         setIsModalVisible(false);
//         getAllUsersInfo();
//       } else {
//         notification.error({
//           message: 'Update Failed',
//           description: 'Unexpected response from the server.',
//         });
//       }
//     } catch (error) {
//       console.error("Error updating user:", error);
//       notification.error({
//         message: 'Error',
//         description: 'Something went wrong while updating user information.',
//       });
//     }
//   };

//   const handlePhotoChange: UploadProps["onChange"] = ({ fileList }) => {
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

//   useEffect(() => {
//     getAllUsersInfo();
//   }, []);

//   const columns = [
//     {
//       title: "Username",
//       dataIndex: "userName",
//       key: "userName",
//     },
//     {
//       title: "Email",
//       dataIndex: "email",
//       key: "email",
//     },
//     {
//       title: "Address",
//       dataIndex: "address",
//       key: "address",
//     },
//     {
//       title: "Photo",
//       dataIndex: "profilePhoto",
//       key: "profilePhoto",
//       render: (text: any) => <img src={text} alt="photo" width={50} />,
//     },
//     {
//       title: "Action",
//       key: "id",
//       dataIndex: "id",
//       render: (id: any) => (
//         <Button type="link" onClick={() => getUserInfoById(id)}>
//           Update
//         </Button>
//       ),
//     },
//   ];

//   return (
//     <>
//       <Table dataSource={data} columns={columns} rowKey="id" />

//       {isModalVisible && (
//         <Modal
//           title="Update Record"
//           visible={isModalVisible}
//           onCancel={handleCancel}
//           footer={null}
//         >
//           <Form
//             onFinish={handleUserUpdate}
//             layout="vertical"
//             form={form}
//           >
//             <Form.Item name="id" hidden>
//               {/* <Input /> */}
//             </Form.Item>

//             <Form.Item
//               name="userName"
//               label="Username"
//               rules={[{ required: true, message: "Please input the username!" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="email"
//               label="Email"
//               rules={[
//                 { required: true, message: "Email is required" },
//                 { validator: validateEmail }, // Updated validation
//               ]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item
//               name="address"
//               label="Address"
//               rules={[{ required: true, message: "Please input the address!" }]}
//             >
//               <Input />
//             </Form.Item>

//             <Form.Item name="profilePhoto" label="Photo">
//               <Upload
//                 listType="picture"
//                 maxCount={1}
//                 fileList={file
//                   ? [file] // For new file
//                   : existingImageUrl
//                     ? [{
//                         uid: "-1", // Unique ID for existing file
//                         name: "existing_image.png", 
//                         status: "done", 
//                         url: existingImageUrl, // URL of the existing image
//                       }]
//                     : [] // No image
//                 }
//                 onChange={handlePhotoChange}
//                 beforeUpload={() => false} 
//               >
//                 {!file && !existingImageUrl && (
//                   <Button icon={<UploadOutlined />}>Upload Photo</Button>
//                 )}
//               </Upload>
//             </Form.Item>

//             <Form.Item>
//               <Button type="primary" htmlType="submit">
//                 Save
//               </Button>
//             </Form.Item>
//           </Form>
//         </Modal>
//       )}
//     </>
//   );
// };

// export default UserInfo;

