import { Button, Form, InputNumber, Slider } from 'antd';
import React, { useEffect, useState } from 'react';
import { addLoanCalculator, getLoanMaxMin } from './apis/LoanCalculator';
import { Cell, Pie, PieChart, ResponsiveContainer } from 'recharts';
import { useNavigate } from 'react-router-dom';
import UserPropfile from './UserPropfile';
import './Design.scss'

const LoanCalculatorPage = () => {
  const [data,setData] = useState({
    emi:"",
    principalAmount:"",
    totalAmount:"",
    totalInterest:""
  });
  const [sliderData,setSliderData]=useState({
    loanAmount:"",
    annualRate:"",
    termInMonths:""
  })

  //const navigate = useNavigate(); 
const [inputValue,setInputValue] = useState({});
const [loAmount,setLoAmount]=useState ({});
const [tenure,setTenure]=useState({});
const [getData,setGetData] = useState({
  maxLoanAmount:0,
  maxLoanTenure:0,
  minLoanTenure:0,
  minLoanAmount:0,
  maxRateOfInterest:0,
 minRateOfInterest:0
});


const [showProfile, setShowProfile] = useState(false);




  const [result, setResult] = useState(null);
  const [error, setError] = useState("");
  const [form] = Form.useForm();
  const handleChange = (e:any) => {
    // if(e && e.length()<=(getData.maxRateOfInterest)){
    console.log(e,'e data') 
   
    setInputValue(e) ;
    
  };
 
  const handlelo=(e:any)=>{
    setLoAmount(e);
   
  }
  const handleTenure=(e:any)=>{
    setTenure(e);
   
  }
  const chartData = [
    { name: 'Principal', value: parseFloat(data.principalAmount) || 0 },
    { name: 'Interest', value: parseFloat(data.emi) || 0 }
  ];
 
  const handleSubmit = async (e:any) => {
    addDataApi(e);
   form.submit();
    e.preventDefault();
    setError("");
    setResult(null);
  };
 
const addDataApi=(e:any)=>{
  console.log(e ,'kkjeije')
  var payload={
    principalAmount:e.loanAmount,
    annualRate:e.annualRate,
    termInMonths:e.termInMonths,

    // principalAmount: e.loanAmount || getData.minLoanAmount,  
    // annualRate: e.annualRate || getData.minRateOfInterest,  
    // termInMonths: e.termInMonths || getData.minLoanTenure, 
  };
  addLoanCalculator(payload).then((res)=>{
    console.log(res.data,'data checking')
    setData(res.data)
    setSliderData(res.data)
  });
};



  
const dataGet = ()=>{
  getLoanMaxMin().then((res)=>{
    console.log(res.data.maxLoanAmount,'kajal')
   setGetData({
    maxLoanAmount:res.data.maxLoanAmount,
    maxRateOfInterest:res.data.maxRateOfInterest,
    minLoanAmount:res.data.minLoanAmount,
    minLoanTenure:res.data.minLoanTenure,
    minRateOfInterest:res.data.minRateOfInterest,
    maxLoanTenure:res.data.maxLoanTenure
  })
  })
}
  

useEffect(() => {
  dataGet();
  console.log(getData)
  }, []);
  const COLORS = ['#0088FE', '#00C49F'];

  return (
    <>
    
    <Form
    className='mt-4'
    form={form}
    name='LoanCalCulate'
    labelCol={{ span: 24 }}
    wrapperCol={{ span: 24 }}
    autoComplete='off'
    onFinish={handleSubmit}
    >  
      <h1 className='h1'>
        CAR LOAN EMI-CALCULATOR
      </h1>
      <div className='LoanAmount'>
        <Form.Item label="Loan Amount" 
        name='loanAmount'
        
        >
          <div className='input-container'>
          <InputNumber 
              className='input1'
              onChange={handlelo}
              value={typeof loAmount === 'number' ? loAmount : getData.minLoanAmount}  
              
            />
            <Slider 
              className='slider'
              min={getData.minLoanAmount}
              max={getData.maxLoanAmount}
              onChange={handlelo} 
             value={typeof loAmount === 'number' ? loAmount : getData.minLoanAmount}          
            />            
          </div>       
        </Form.Item>
      </div>

      <div className='LoanAmount'>
        <Form.Item label="Rate of Interest"
        name='annualRate'
        >
          <div className='input-container'>
            <InputNumber 
              className='input1'
             // maxLength={getData.maxRateOfInterest}
              onChange={handleChange}
              value={typeof inputValue === 'number' ? inputValue : getData.minRateOfInterest}
            />
            <Slider 
              className='slider'
             
               min={getData.minRateOfInterest}
              max={getData.maxRateOfInterest}
              value={typeof inputValue === 'number' ? inputValue : getData.minRateOfInterest}
              onChange={handleChange}
            />
          </div>
        </Form.Item>
      </div>


      <div className='LoanAmount'>
        <Form.Item label="Loan Tenure"
        name='termInMonths'
        >
          <div className='input-container'>
            <InputNumber className='input1'
             onChange={handleTenure}
             value={typeof tenure === 'number' ? tenure : getData.minLoanTenure}
            />
            <Slider className='slider'
            onChange={handleTenure}
            value={typeof tenure === 'number' ? tenure : getData.minLoanTenure}
             max={getData.maxLoanTenure}
             min={getData.minLoanTenure}
            />
          </div>
        </Form.Item>
      </div>
      <div  className='buttonC'>
      <Button  type="primary" className='submit'  onClick={handleSubmit}>
        Calculate EMI
      </Button>
      </div>
      
      </Form>
   <div className='result'>
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

   {data && data.principalAmount && data.emi && (
        <div className='chart-container'>
          <h2>Principal vs Emi</h2>
          <ResponsiveContainer width="100%" height={300}>
            <PieChart>
            <Pie
                data={chartData}
                dataKey="value"
                nameKey="name"
                outerRadius={100}
                fill="#8884d8"
              >
                {chartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={index === 0 ? '#82ca9d' : '#d0ed57'} />
                ))}
              </Pie>
            </PieChart>
          </ResponsiveContainer>
        </div>
       
      )}
    </>
  );
};

export default LoanCalculatorPage;
function FlashMessage(arg0: string, arg1: string) {
  throw new Error('Function not implemented.');
}





















