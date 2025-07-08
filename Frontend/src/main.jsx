import { createRoot } from 'react-dom/client';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css'
import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage';
import AddTransaction from './pages/AddTransaction'
import AllTransactions from './pages/AllTransactions';


function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path='/' element={<HomePage />} />
        <Route path='/addtransaction' element={<AddTransaction />} />
        <Route path='/alltransactions' element={<AllTransactions />} />
      </Route>
    </Routes>
  )
}

createRoot(document.getElementById('root')).render(
  <BrowserRouter>
    <App />
  </BrowserRouter>,
);


