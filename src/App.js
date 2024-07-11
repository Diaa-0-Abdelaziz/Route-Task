import { useEffect, useState } from 'react';
import './App.css';
import axios from 'axios';

function App() {
const [customer, setCustomer] = useState([])
const [transaction, setTransactions] = useState([])
const [FilterByName, setFilterByName] = useState('')
const [FilterByAmount, setFilterByAmount] = useState('')

  async function getcustomers(){
    try {
        const {data} = await axios.get(`http://localhost:9000/customers?name=${FilterByName}`)
        if(data){
          setCustomer(data)
        }
    } catch (err) {
        console.log(err);
    }
}

  async function getTransactions(){
    try {
        const {data} = await axios.get(`http://localhost:9000/transactions?amount=${FilterByAmount}`)
        if(data){
          setTransactions(data)
          if (FilterByAmount) {
            const customerIds = data.map(transaction => transaction.customer_id);
            const uniqueCustomerIds = [...new Set(customerIds)];
            const filteredCustomers = await Promise.all(uniqueCustomerIds.map(id => axios.get(`http://localhost:9000/customers?id=${id}`)));
            setCustomer(filteredCustomers.map(response => response.data).flat());
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




  return (
    <section className=" bg-zinc-900 p-10">
     <h1 className=' text-center text-7xl font-extrabold	text-orange-600'>Route Task</h1>
     <h3 className=' mt-2 text-center text-3xl font-extrabold	text-orange-700 tracking-[2px] border-b-2 border-orange-900 border-dashed w-fit m-auto pb-2'>This Page was Developed by Diaa Abdelaziz</h3>
      <div className=' flex justify-between mt-10'>
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
      <th>Select</th>
    </tr>
  </thead>
  <tbody className=' text-center'>
  
  
  {customer.length > 0? customer.map((cust) => {
            const customerTransactions = transaction.filter(transaction => transaction.customer_id == cust.id);

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
                </td>



                <td>
                  <input type="radio" name='select' className="rounded-full w-4 h-4 cursor-pointer" />
                </td>
              </tr>
            );
          }):
         <tr>
          <td colSpan={4}>
            <p className=' text-red-700 py-5 font-bold text-3xl'>Sorry!!!!! No Data Match This Name</p>
          </td>
         </tr>
          
          }


  </tbody>
</table>
    
    
    

    
    
    
    
    
    </section>
  );
}

export default App;
