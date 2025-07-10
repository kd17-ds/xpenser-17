import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage';
import AllTransactions from './pages/AllTransactions';
import TransactionForm from './pages/TransactionForm';
import UpdateTransaction from './pages/UpdateTransaction';
import Analytics from './pages/Analytics';


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/analytics' element={<Analytics />} />
        <Route path='/addtransaction' element={<TransactionForm />} />
        <Route path='/alltransactions' element={<AllTransactions />} />
        <Route path='/updatetransaction/:id' element={<UpdateTransaction />} />
      </Route>
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);


