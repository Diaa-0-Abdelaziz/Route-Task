import { useEffect, useRef, useState } from 'react';
import './App.css';
import axios from 'axios';
import { Category, ChartComponent, DataLabel, LineSeries, Legend, Tooltip, Inject, SeriesCollectionDirective, SeriesDirective } from '@syncfusion/ej2-react-charts';
import { FaChartLine } from "react-icons/fa6";

function App() {
const [customer, setCustomer] = useState([])
const [transaction, setTransactions] = useState([])
const [FilterByName, setFilterByName] = useState('')
const [FilterByAmount, setFilterByAmount] = useState('')
const [selectedCustomerTransactions, setSelectedCustomerTransactions] = useState([]); 
//******catch customer ID********* */
const [selectedCustomer, setSelectedCustomer] = useState(null);
//******catch customer name********* */
const [customerName, setCustomerName] = useState('')
//******using useRef to smooth scroll when show chart of a customer********* */
const transactionsRef = useRef(null);

const api_Link = 'https://diaa-0-abdelaziz.github.io/task-route-api/db.json'


  async function getcustomers(){
    try {
        const {data} = await axios.get(`${api_Link}`)
        if(data){
          setCustomer(data.customers)
          if (FilterByName) {
            const filteredCustomers = customer.filter(cust => cust.name.toLowerCase().includes(FilterByName.toLowerCase()));
            setCustomer(filteredCustomers);
          } 
        }
    } catch (err) {
        console.log(err);
    }
}
//*******get transation data and filter by amount by total amount*************
  async function getTransactions(){
    try {
        const {data} = await axios.get(`${api_Link}`)
        if(data){
          setTransactions(data.transactions)
          if (FilterByAmount) {
            //*******concat total amounts that customer do it******** */
            const customerAmounts = data.transactions.reduce((acc, transaction) => {
              acc[transaction.customer_id] = (acc[transaction.customer_id] || 0) + transaction.amount;
              return acc;
            }, {});
            
            const filteredCustomers = data.customers.filter(cust => customerAmounts[cust.id] === parseFloat(FilterByAmount));
            setCustomer(filteredCustomers);
          }
        }
    } catch (err) {
        console.log(err);
    }
}

useEffect(() => {
  getcustomers(FilterByName);
  getTransactions(FilterByAmount)
}, [FilterByName, FilterByAmount]);


const searchName = (e) => {
setFilterByName(e.target.value)
setFilterByAmount('')
}

const searchAmount = (e) => {
  setFilterByAmount(e.target.value)
  setFilterByName('')
}


const handleCustomerSelection = (customerId, custName) => {
  setCustomerName(custName)
  setSelectedCustomer(customerId);
  const customerTransactions = transaction.filter(transaction => transaction.customer_id == customerId);
  setSelectedCustomerTransactions(customerTransactions);
  setTimeout(() => {
    if (transactionsRef.current) {
      transactionsRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, 100);
};

  return (
    <section className=" bg-zinc-900 p-10">
     <h1 className=' text-center text-7xl font-extrabold	text-orange-600'>Route Task</h1>
     <h3 className=' mt-2 text-center text-3xl font-extrabold	text-orange-700 tracking-[2px] border-b-2 border-orange-900 border-dashed w-fit m-auto pb-2'>This Page was Developed by Diaa Abdelaziz</h3>
      <div className=' flex flex-wrap gap-5 w-auto justify-around mt-10'>
        <div>
        <input type="text" name="Name" value={FilterByName} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-orane-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="Filter By Name" onChange={searchName}/>
        </div>
        <div>
        <input type="number" name="Name" value={FilterByAmount} className="block w-full rounded-md border-0 py-1.5 pl-7 pr-20 text-gray-900 ring-1 ring-inset ring-orane-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-orange-600 sm:text-sm sm:leading-6" placeholder="Filter By Amount" onChange={searchAmount}/>
        </div>
      </div>
    <table className=" w-full my-5">
      <thead className=' text-center text-2xl bg-orange-600'>
        <tr>
          <th>id</th>
          <th>name</th>
          <th>transactions</th>
          <th>Charts</th>
        </tr>
      </thead>
      <tbody className=' text-center'>
      {customer.length > 0? customer.map((cust) => {
                const customerTransactions = transaction.filter(transaction => transaction.customer_id == cust.id);
                const totalAmount = customerTransactions.reduce((prev, next) => prev + next.amount, 0);
                return (
                  <tr key={cust.id} className='border-b'>
                    <td className='text-white font-medium text-lg'>{cust.id}</td>
                    <td className='text-white font-medium text-lg'>{cust.name}</td>
                    <td>


                      {customerTransactions.length > 0 ? (
                        customerTransactions.map((transaction) => (
                          <article key={transaction.id} className='bg-white rounded-2xl py-2 px-5 my-5 w-fit m-auto'>
                            <ul className='text-orange-600 font-medium text-lg text-left'>
                              <li>date: {transaction.date}</li>
                              <li>amount: {transaction.amount}</li>
                            </ul>
                          </article>
                        ))
                        
                      ) : (
                        <p className='text-white font-medium text-lg'>No transactions found</p>
                      )}
                      <p className='text-orange-600 font-medium text-lg text-center'>Total amount : <span className=' text-white'>{totalAmount}</span></p>
                    </td>



                    <td>
                    
                    <i className='w-fit p-3 ml-8 text-3xl rounded-full bg-orange-900 cursor-pointer hover:bg-orange-700 hover:text-neutral-800 transition-all duration-700  text-white flex items-center justify-center' onClick={() => handleCustomerSelection(cust.id, cust.name)}><FaChartLine /></i>
                      
                      {/* <input type="radio" name='select' className="rounded-full w-4 h-4 cursor-pointer" checked={selectedCustomer === cust.id} onChange={} /> */}
                    </td>
                  </tr>
                );
              }):
            <tr>
              <td colSpan={4}>
                <p className=' text-red-700 py-5 font-bold text-3xl'>Sorry!!!!! No Data Matches Your Write</p>
              </td>
            </tr>
              }
      </tbody>
    </table>
    <div className=' p-5 w-full h-96 bg-neutral-800  relative'  ref={transactionsRef}>
{selectedCustomerTransactions.length > 0 ? 
   <>
   <p className='text-white text-center font-medium text-lg'> This Chart belongs to customer: <span className=' font-extrabold text-orange-600'>{customerName}</span></p>
    <ChartComponent title='Customer Amount Analysis' primaryYAxis={{title:"Amount"}} primaryXAxis={{valueType:"Category", title:'Date'}} legendSettings={{visible: true}}
    tooltip={{enable:true}}
    >
    <Inject services={[LineSeries, Legend, Tooltip, DataLabel, Category]}/>
    <SeriesCollectionDirective>
      <SeriesDirective type='Line' dataSource={selectedCustomerTransactions} xName='date' yName='amount' name='Amount' marker={{dataLabel:{visible: true}, visible: true}}>

      </SeriesDirective>
    </SeriesCollectionDirective>
  </ChartComponent>
   </>
  :
  <p className=' text-orange-700 py-5 font-bold text-5xl absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 text-center'>You Should Select a customer to show his chart</p>
  }
    </div>
    </section>
  );
}

export default App;
