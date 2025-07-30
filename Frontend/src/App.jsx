import { Routes, Route } from 'react-router-dom';
import MainLayout from './layout/MainLayout';
import Authentication from './pages/commonPages/Authentication';
import VerifyEmail from './pages/commonPages/VerifyEmail';
import ForgotPass from './pages/commonPages/ForgotPass';
import HomePage from './pages/commonPages/HomePage';
import AllTransactions from './pages/transactionPages/AllTransactions';
import AddTransactionForm from './pages/transactionPages/AddTransactionForm';
import UpdateTransactionForm from './pages/transactionPages/UpdateTransactionForm';
import TransactionAnalytics from './pages/transactionPages/TransactionAnalytics';
import AddBudgetForm from './pages/budgetPages/AddBudgetForm';
import UpdateBudgetForm from './pages/budgetPages/UpdateBudgetForm';
import AllBudgets from './pages/budgetPages/AllBudgets';
import BudgetVsExpenseComparison from './pages/CommonPages/BudgetVsExpenseComparison';
import UserProtectedRoute from './routes/UserProtectedRoutes';
import NotFoundPage from "./pages/commonPages/NotFound";

function App() {
    return (
        <Routes>
            <Route element={<MainLayout />}>
                <Route path='/' element={<HomePage />} />
                <Route path="/login" element={<Authentication formType="login" />} />
                <Route path="/signup" element={<Authentication formType="signup" />} />
                <Route path="/verifyemail" element={<VerifyEmail />} />
                <Route path="/forgotpass" element={<ForgotPass />} />

                <Route
                    path="/transactionanalytics"
                    element={
                        <UserProtectedRoute>
                            <TransactionAnalytics />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/budgetvsexpensecomparison"
                    element={
                        <UserProtectedRoute>
                            <BudgetVsExpenseComparison />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/updatebudget/:id"
                    element={
                        <UserProtectedRoute>
                            <UpdateBudgetForm />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/allbudgets"
                    element={
                        <UserProtectedRoute>
                            <AllBudgets />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/setbudget"
                    element={
                        <UserProtectedRoute>
                            <AddBudgetForm />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/updatetransaction/:id"
                    element={
                        <UserProtectedRoute>
                            <UpdateTransactionForm />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/alltransactions"
                    element={
                        <UserProtectedRoute>
                            <AllTransactions />
                        </UserProtectedRoute>
                    }
                />
                <Route
                    path="/addtransaction"
                    element={
                        <UserProtectedRoute>
                            <AddTransactionForm />
                        </UserProtectedRoute>
                    }
                />
                <Route path="*" element={<NotFoundPage />} />
            </Route>
        </Routes>
    )
}

export default App;