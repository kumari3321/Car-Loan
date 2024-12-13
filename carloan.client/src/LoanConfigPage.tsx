
import React, { useState, useEffect } from 'react';
import { Input, Button, Form, notification, Modal, Tooltip, Table } from 'antd';
import { FormInstance } from 'antd/es/form';
import { AddLoanCalulator, GetLoanMaxMin, GetLoanMaxMinById, UpdateAdminValue } from './actions/LoanCalculator';
import { getLoanMaxMinById } from './apis/LoanCalculator';

interface Config {
    id: number;
    maxLoanAmount: string;
    minLoanAmount: string;
    maxRateOfInterest: string;
    minRateOfInterest: string;
    maxLoanTenure: string;
    minLoanTenure: string;
}

const LoanConfigPage: React.FC = () => {
    const [config, setConfig] = useState<Config>({
        id: 0,
        maxLoanAmount: '',
        minLoanAmount: '',
        maxRateOfInterest: '',
        minRateOfInterest: '',
        maxLoanTenure: '',
        minLoanTenure: ''
    });

    const [isModalVisible, setIsModalVisible] = useState(false);
    const [form] = Form.useForm<Config>();
    const [open, setOpen] = useState(false);

    const handleGetLoanMin = async () => {
        
        try {
            const res: any = await GetLoanMaxMin();

            if (res) {
                
                const { id, maxLoanAmount, minLoanAmount, maxRateOfInterest, minRateOfInterest, maxLoanTenure, minLoanTenure } = res.data || {}
                setConfig({
                    id: id,
                    maxLoanAmount: maxLoanAmount,
                    minLoanAmount: minLoanAmount,
                    maxRateOfInterest: maxRateOfInterest,
                    minRateOfInterest: minRateOfInterest,
                    maxLoanTenure: maxLoanTenure,
                    minLoanTenure: minLoanTenure
                });

            }
        } catch (error) {
            console.log(error)
        }
    };



    const getLoanMinMaxByIdApi = (id: number) => {
        console.log(id, 'Fetching data for ID');
        getLoanMaxMinById(id).then((res: { data: any; }) => {
            const ed = res.data;
            console.log(ed, 'Fetched data');
            form.setFieldsValue(ed);
            setIsModalVisible(true);
        }).catch((error: any) => {
            console.error('Error fetching data by ID', error);
        });
    };

    const handleChangeId = (e: any) => {
       
        e.preventDefault();
        getLoanMinMaxByIdApi(config.id);
        setIsModalVisible(true);
        // setDataApp(dataApp);
    };


    const handleChanges = (values: Config) => {
        const payload = {
            id: config.id,
            maxLoanTenure: values.maxLoanTenure,
            minLoanTenure: values.minLoanTenure,
            maxLoanAmount: values.maxLoanAmount,
            minLoanAmount: values.minLoanAmount,
            minRateOfInterest: values.minRateOfInterest,
            maxRateOfInterest: values.maxRateOfInterest
        };

        UpdateAdminValue(payload)
            .then((res) => {
                const { status } = res?.data || {}
                if (status === 200) {
                    notification.success({
                        message: 'Configuration Updated',
                        description: 'Loan configuration updated successfully.'
                    });

                    setConfig(values);
                    setIsModalVisible(false);                   
                }
            })
            .catch((error: any) => {
                notification.error({
                    message: 'Update Failed',
                    description: 'There was an error updating the loan configuration.'
                });
                console.error('Error updating configuration', error);
            });
    };


    const handleCancel = () => {
        setIsModalVisible(false);
    };


    /////////////// useEffect ////////////////////////

    useEffect(() => {
        handleGetLoanMin();
    }, []);

    return (
        <div style={{ padding: '20px' }}>
            <h2>Loan Configuration</h2>
            <div style={{ marginBottom: '20px' }}>
                <p><strong>Min Loan Amount:</strong> {config.minLoanAmount}</p>
                <p><strong>Max Loan Amount:</strong> {config.maxLoanAmount}</p>
                <p><strong>Min Interest Rate:</strong> {config.minRateOfInterest}</p>
                <p><strong>Max Interest Rate:</strong> {config.maxRateOfInterest}</p>
                <p><strong>Min Loan Tenure:</strong> {config.minLoanTenure}</p>
                <p><strong>Max Loan Tenure:</strong> {config.maxLoanTenure}</p>
            </div>

            <Button type="primary" onClick={(e)=>handleChangeId(e)}>
                Edit
            </Button>
            {
                isModalVisible &&

                <Modal
                    title="Update Loan Configuration"
                    visible={isModalVisible}
                    onCancel={handleCancel}
                    footer={null}
                >
                    <Form
                        form={form}
                        layout="vertical"
                        initialValues={config}
                        onFinish={handleChanges}
                    >
                        <Form.Item label="Min Loan Amount" name="minLoanAmount">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Max Loan Amount" name="maxLoanAmount">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Min Interest Rate" name="minRateOfInterest">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Max Interest Rate" name="maxRateOfInterest">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Min Loan Tenure" name="minLoanTenure">
                            <Input />
                        </Form.Item>

                        <Form.Item label="Max Loan Tenure" name="maxLoanTenure">
                            <Input />
                        </Form.Item>
                        <Form.Item>
                            <Tooltip title="update">
                                <Button type="link" htmlType='submit'>
                                    Update
                                </Button>
                            </Tooltip>
                        </Form.Item>
                    </Form>
                </Modal>
            }

        </div>
    );
};

export default LoanConfigPage;