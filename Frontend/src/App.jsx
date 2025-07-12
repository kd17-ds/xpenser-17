import MainLayout from './layout/MainLayout'
import HomePage from './pages/HomePage';
import AllTransactions from './pages/AllTransactions';
import TransactionForm from './pages/TransactionForm';
import UpdateTransaction from './pages/UpdateTransaction';
import Analytics from './pages/Analytics';
import BudgetForm from './pages/BudgetForm';
import UpdateBudget from './pages/UpdateBudget';
import Budget from './pages/Budget';
import { Routes, Route } from 'react-router-dom';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/analytics' element={<Analytics />} />
                <Route path='/addtransaction' element={<TransactionForm />} />
                <Route path='/alltransactions' element={<AllTransactions />} />
                <Route path='/updatetransaction/:id' element={<UpdateTransaction />} />
                <Route path='/setbudget' element={<BudgetForm />} />
                <Route path='/budget' element={<Budget />} />
                <Route path='/updatebudget/:id' element={<UpdateBudget />} />
            </Route>
        </Routes>
    )
}

export default App;