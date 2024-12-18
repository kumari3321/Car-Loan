

interface Confi {
  id: number;
  userId: string;
  phoneNumber: string
  userName: string;
  address: string;
  profilePhoto: any;
  extension: any;
  email: string;
}

const UserDetails = () => {
  const [user, setUser] = useState<Confi | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [file, setFile] = useState<UploadFile | null>(null);
  const [imageBase64, setImageBase64] = useState<string | null>(null);
  const [existingImageUrl, setExistingImageUrl] = useState<string | null>(null);
  const [form] = Form.useForm();
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

  const fetchUserDetails = async () => {
    try {
      const userIdL = localStorage.getItem('rid');
      if (!userIdL) {
        setError('No user ID found in localStorage');
        setLoading(false);
        return;
      }

      const response = await getUserByUserId(userIdL);
      const userData = response.data;

      if (userData.userId === userIdL) {
        setUser(userData);
      } else {
        setError('User data mismatch');
      }
    } catch (error: any) {
      console.error('Error fetching user details:', error.response?.data || error.message);
      setError('Failed to fetch user data');
    } finally {
      setLoading(false);
    }
  };

  const handleEditClick = () => {
    console.log(user)
    if (user?.profilePhoto) {
      setFile({
        uid: "1",
        name: "existing_image.png",
        status: "done",
        url: user.profilePhoto,
      });


    }
    if (user) {
      form.setFieldsValue(user);
      setIsModalVisible(true);
    }
  };

  const handleCancel = () => {
    setIsModalVisible(false);
    form.resetFields();
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


  const handleFormSubmit = async (values: Confi) => {
    try {
      console.log('Form Values:', values);
      if (values.profilePhoto) {
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
        id: user?.id,
        userName: values.userName,
        address: values.address,
        email: values.email,
        phoneNumber: values.phoneNumber,
        profilePhoto: values.profilePhoto,
        extension: values.extension,
      };

      console.log('Payload being sent:', payload);


      updateUsers(payload).then((res) => {
        if (res.status === 200) {
          notification.success({
            message: 'Configuration Updated',
            description: 'Loan configuration updated successfully.',
          });

          //setUser(user?.profilePhoto);
          setUser(values);
          setIsModalVisible(false);
          fetchUserDetails();

        } else {
          notification.error({
            message: 'Update Failed',
            description: 'Unexpected response from the server.',
          });
        }
      })
      // await updateUsers(payload);
      // setUser( user); 
      // setIsModalVisible(false);
      // getUserByUserId(values.id);
    } catch (error) {
      console.error('Error updating user:', error);
    }
  };


  useEffect(() => {
    fetchUserDetails();
  }, []);

  if (loading) {
    return <div>Loading...</div>;
  }

  if (error) {
    return <div>{error}</div>;
  }

  if (!user) {
    return <div>No user data available</div>;
  }

  return (
    <>
   
    <div className="user-profile-page">

      <div className="profile-container">

        <div className="profile-photo">
          {user.profilePhoto ? (
            <img src={user.profilePhoto} alt="Profile" />
          ) : (
            <p>No profile photo available</p>
          )}
        </div>


        <Form form={form} layout="vertical" initialValues={user}>
          {/* <Form.Item label="Username">
            <span>{user.userName}</span>
          </Form.Item>
          <Form.Item label="Email">
            <span>{user.email}</span>
          </Form.Item>
          <Form.Item label="Address">
            <span>{user.address}</span>
          </Form.Item> */}


          <Form form={form} layout="vertical" initialValues={user}>
            <Form.Item label="Username">
              <div className="user-detail">
                <span>{user.userName}</span>
              </div>
            </Form.Item>
            <Form.Item label="Email">
              <div className="user-detail">
                <span>{user.email}</span>
              </div>
            </Form.Item>
            <Form.Item label="Address">
              <div className="user-detail">
                <span>{user.address}</span>
              </div>
            </Form.Item>
            <Form.Item label="PhoneNumber">
              <div className="user-detail">
                <span>{user.phoneNumber}</span>
              </div>
            </Form.Item>
          </Form>



          <Button className="edit-button" type="primary" onClick={handleEditClick}>
            Edit
          </Button>
        </Form>


        <Modal
          title="Edit User Details"
          visible={isModalVisible}
          onCancel={handleCancel}
          footer={null}
        >
          <Form form={form} layout="vertical" onFinish={handleFormSubmit}>
            <Form.Item name="id" hidden>

              {/* <Input /> */}
            </Form.Item>

            <Form.Item
              label="Username"
              name="userName"
              rules={[{ required: true, message: 'Please enter the username' }]}
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
              label="Address"
              name="address"
              rules={[{ required: true, message: 'Please enter the address' }]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              name="phoneNumber"
              label="Phone Number"
              rules={[{ required: true, message: 'Please input your phone number!' }, { pattern: /^[0-9]{10}$/, message: 'Please input a valid 10-digit phone number!' }]}
            >
              <Input maxLength={10} style={{ width: '100%' }} />
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
              <Tooltip title="Update">
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
              </Tooltip>
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </div>
    </>

  );
};

export default UserDetails;

















