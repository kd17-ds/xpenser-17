import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout'
import HomePage from './pages/commonPages/HomePage';
import AllTransactions from './pages/transactionPages/AllTransactions';
import AddTransactionForm from './pages/transactionPages/AddTransactionForm';
import UpdateTransactionForm from './pages/transactionPages/UpdateTransactionForm';
import TransactionAnalytics from './pages/transactionPages/TransactionAnalytics';
import AddBudgetForm from './pages/budgetPages/AddBudgetForm';
import UpdateBudgetForm from './pages/budgetPages/UpdateBudgetForm';
import AllBudgets from './pages/budgetPages/AllBudgets';
import BudgetVsExpenseComparison from './pages/CommonPages/BudgetVsExpenseComparison';

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path='/transactionanalytics' element={<TransactionAnalytics />} />
                <Route path='/addtransaction' element={<AddTransactionForm />} />
                <Route path='/alltransactions' element={<AllTransactions />} />
                <Route path='/updatetransaction/:id' element={<UpdateTransactionForm />} />
                <Route path='/setbudget' element={<AddBudgetForm />} />
                <Route path='/allbudgets' element={<AllBudgets />} />
                <Route path='/updatebudget/:id' element={<UpdateBudgetForm />} />
                <Route path='/budgetvsexpensecomparison' element={<BudgetVsExpenseComparison />} />
            </Route>
        </Routes>
    )
}

export default App;