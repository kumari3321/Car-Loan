
import { Button, Col, Form, Input, InputNumber, Row, Slider, Tooltip } from 'antd';
import React, { useEffect, useState } from 'react';
import { addLoanCalculator, getLoanMaxMin, signOutUser } from './apis/LoanCalculator';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import './Design.scss'
import { useNavigate } from 'react-router-dom';
import { isLoggedOut } from './localStorage';
import { Color } from 'antd/es/color-picker';
import { Value } from 'sass';

const LoanCalculatorPage = () => {
  const [data, setData] = useState({
    emi: "",
    principalAmount: "",
    totalAmount: "",
    totalInterest: ""
  });

  const [sliderData, setSliderData] = useState({
    loanAmount: 0,
    annualRate: 0,
    termInMonths: 0
  });

  const [inputValue, setInputValue] = useState(0);
  const [loAmount, setLoAmount] = useState(0);
  const [tenure, setTenure] = useState(0);
  const navigate = useNavigate();
  const [getData, setGetData] = useState({
    maxLoanAmount: 0,
    maxLoanTenure: 0,
    minLoanTenure: 0,
    minLoanAmount: 0,
    maxRateOfInterest: 0,
    minRateOfInterest: 0
  });

  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [form] = Form.useForm();

  // const handleLogOut=()=>{
  //   isLoggedOut();
  // }
  const RADIAN = Math.PI / 180;
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index }: any) => {
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * RADIAN);
    const y = cy + radius * Math.sin(-midAngle * RADIAN);

    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  const handleRedirect = () => {

    navigate('/userDetails');
  };
  const handleChange = (value: any) => {
    setInputValue(value);
  };

  const handleLoAmount = (value: any) => {
    setLoAmount(value);
  };

  const handleTenure = (value: any) => {
    setTenure(value);
  };

  const chartData = [
    { "name": 'Principal', value: parseFloat(data.principalAmount)|| 0 },
    { "name": 'Interest', value: parseFloat(data.emi) || 0 }
  ];

  const handleSubmit = async () => {
    const payload = {
      principalAmount: loAmount || getData.minLoanAmount,
      annualRate: inputValue || getData.minRateOfInterest,
      termInMonths: tenure || getData.minLoanTenure
    };

    try {
      const res = await addLoanCalculator(payload);
      setData(res.data);
      setSliderData(res.data);
      setError("");
    } catch (err) {
      setError("Failed to calculate loan details. Please try again.");
    }
  };

  const dataGet = async () => {
    try {
      const res = await getLoanMaxMin();
      setGetData({
        maxLoanAmount: res.data.maxLoanAmount,
        maxRateOfInterest: res.data.maxRateOfInterest,
        minLoanAmount: res.data.minLoanAmount,
        minLoanTenure: res.data.minLoanTenure,
        minRateOfInterest: res.data.minRateOfInterest,
        maxLoanTenure: res.data.maxLoanTenure
      });
    } catch (err) {
      setError("Failed to fetch loan limits. Please try again.");
    }
  };

  useEffect(() => {
    dataGet();
  }, []);

  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <>
      <div className="page-container">


        <div style={{ position: 'absolute', top: '70px', right: '15px', marginRight: '25px' }}>
          <Button type="primary" style={{ height: '40px' }} onClick={() => isLoggedOut(navigate)}>
            LOGOUT
          </Button>
        </div>

        <Row>
          <Col span={24}>
            <Form
              className="mt-4"
              form={form}
              name="LoanCalculator"
              labelCol={{ span: 24 }}
              wrapperCol={{ span: 24 }}
              autoComplete="off"
              onFinish={handleSubmit}
              layout='vertical'
              style={{ backgroundColor: "snow" }}
            >

              <h1 className="h1">CAR LOAN EMI-CALCULATOR</h1>

              <div className="LoanAmount">
                <Form.Item label="Loan Amount" name="loanAmount">
                  <div className="input-container">
                    <InputNumber
                      min={getData.minLoanAmount}
                      max={getData.maxLoanAmount}
                      maxLength={getData.maxLoanAmount}
                      className="input1"
                      placeholder='Loan Amount'
                      onChange={handleLoAmount}
                      value={loAmount || getData.minLoanAmount}
                    />
                    <Slider
                      className="slider"
                      min={getData.minLoanAmount}
                      max={getData.maxLoanAmount}
                      onChange={handleLoAmount}
                      value={loAmount || getData.minLoanAmount}
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="LoanAmount">
                <Form.Item label="Rate of Interest" name="annualRate">
                  <div className="input-container">
                    <InputNumber
                      min={getData.minRateOfInterest}
                      max={getData.maxRateOfInterest}
                      maxLength={getData.maxRateOfInterest}
                      className="input1"
                      placeholder='Annual RateOfInterest'
                      onChange={handleChange}
                      value={inputValue || getData.minRateOfInterest}
                    />
                    <Slider
                      className="slider"
                      min={getData.minRateOfInterest}
                      max={getData.maxRateOfInterest}
                      value={inputValue || getData.minRateOfInterest}
                      onChange={handleChange}
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="LoanAmount">
                <Form.Item label="Loan Tenure" name="termInMonths">
                  <div className="input-container">
                    <InputNumber
                      min={getData.minLoanTenure}
                      max={getData.maxLoanTenure}
                      className="input1"
                      placeholder='TermInMonths'
                      onChange={handleTenure}
                      value={tenure || getData.minLoanTenure}

                    />
                    <Slider
                      className="slider"
                      onChange={handleTenure}
                      value={tenure || getData.minLoanTenure}
                      max={getData.maxLoanTenure}
                      min={getData.minLoanTenure}
                    />
                  </div>
                </Form.Item>
              </div>

              <div className="buttonC" >
                <Button type="primary"

                  className="submit" htmlType="submit">
                  Calculate EMI
                </Button>
              </div>
            </Form>
          </Col>
        </Row>

        <div className="result" style={{ marginLeft: '10px' }}>
          {data ? (
            <>
              <p><strong>EMI:</strong> ${data.emi}</p>
              <p><strong>Principal Amount:</strong> ${data.principalAmount}</p>
              <p><strong>Total Interest:</strong> ${data.totalInterest}</p>
              <p><strong>Total Amount:</strong> ${data.totalAmount}</p>
            </>
          ) : (
            <p>Loading...</p>
          )}
        </div>

        <div className='header7'>
          {data && data.principalAmount && data.emi && (
            <div className="content-container ">
              <h2 style={{ margin: "20px" }}>Principal vs EMI</h2>
              <div style={{ marginLeft: '20px' }}>
                Principle <span style={{ padding: '5px', background: '#0088FE', borderRadius: '100%', marginLeft: '1px', marginRight: '10px' }}></span>
                EMI <span style={{ padding: '5px', background: '#00C49F', borderRadius: '100%', marginLeft: '5px' }}></span>
              </div>
              <div className="chart-container" style={{ marginLeft: '5px' }}>
                <ResponsiveContainer width='100%' height={300}>
                  <PieChart >
                    <Pie
                      data={chartData}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={renderCustomizedLabel}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"

                    >
                      {chartData.map((entry, index) => (
                        <Cell
                          key={`cell-${index}`}
                          fill={COLORS[index % COLORS.length]}

                        />
                      )
                      )}

                    </Pie>
                  </PieChart>

                </ResponsiveContainer>

              </div>
            </div>
          )}
        </div>
        <div className="redirect-button" style={{ position: 'absolute', top: '20px', right: '15px' }}>
          <Button type="primary" style={{ height: '40px' }} onClick={handleRedirect}>
            Go to User Details
          </Button>
        </div>

      </div>
    </>
  );
};

export default LoanCalculatorPage;



















