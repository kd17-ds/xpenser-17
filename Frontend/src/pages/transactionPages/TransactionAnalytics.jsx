import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../../constants/constants';
import MonthlyExpensesChart from '../../components/charts/MonthlyExpenseChart';
import CategoryPieChart from '../../components/charts/CategoryPieChart';
import StackedCategoryBarChart from '../../components/charts/StackedCategoryBarChart';
import { Link } from 'react-router-dom';
import { FaChartPie, FaClock } from 'react-icons/fa';
import { FiTrendingUp, FiTrendingDown } from 'react-icons/fi';
import { TbScale } from 'react-icons/tb';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const years = ["2015", "2016", "2017", "2018", "2019", "2020", "2021",
    "2022", "2023", "2024", "2025", "2026", "2027", "2028",
    "2029", "2030", "2031", "2032", "2033", "2034", "2035",
    "2036", "2037", "2038", "2039", "2040"];

export default function TransactionAnalytics() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");
    const [year1, setYear1] = useState("");
    const [month, setMonth] = useState("");
    const [year2, setYear2] = useState("");
    const [year3, setYear3] = useState("");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const res = await axios.get(`${BASE_URL}/allTransactions`);
                setTransactions(res.data.reverse());
            } catch (err) {
                console.error("Error fetching transactions:", err);
                setError("Failed to load transactions.");
            }
        };
        fetchData();
    }, []);

    const filterTxns = (monthFilter, yearFilter) => {
        return transactions.filter(txn => {
            const txnDate = new Date(txn.date);
            const txnMonth = txnDate.toLocaleString("default", { month: "short" });
            const txnYear = txnDate.getFullYear().toString();
            return (
                (!monthFilter || txnMonth === monthFilter) &&
                (!yearFilter || txnYear === yearFilter)
            );
        });
    };

    const filteredTxnsForDashboard = filterTxns(month, year2);

    const incomeTxns = filteredTxnsForDashboard.filter(t => t.type === "income");
    const expenseTxns = filteredTxnsForDashboard.filter(t => t.type === "expense");

    const totalIncome = incomeTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalExpense = expenseTxns.reduce((sum, t) => sum + t.amount, 0);
    const totalBalance = totalIncome - totalExpense;

    const categoryTotals = {};
    expenseTxns.forEach(txn => {
        categoryTotals[txn.category] = (categoryTotals[txn.category] || 0) + txn.amount;
    });

    const sortedCategories = Object.entries(categoryTotals).sort((a, b) => b[1] - a[1]);
    const mostSpentCat = sortedCategories[0]?.[0];
    const latestTransaction = filteredTxnsForDashboard[0];


    return (
        <div className="max-w-8xl mt-12 mx-auto px-4 lg:px-20">
            <h2 className="text-3xl lg:text-4xl text-center text-gray-800 mb-12">
                Transaction Analytics
            </h2>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-14 lg:gap-8">
                {/* LEFT: Financial Dashboard */}
                <div className="lg:col-span-4 space-y-6 px-6 lg:px-0">
                    <div className="text-3xl text-secondary">Financial Dashboard</div>

                    {/* Summary Cards */}
                    <div className="grid gap-4">
                        <div className="py-4 px-6 rounded-2xl shadow-md bg-yellow-100">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Balance</h3>
                                    <p className="text-lg font-bold text-gray-800">₹ {totalBalance}</p>
                                </div>
                                <TbScale className="text-3xl text-yellow-600" />
                            </div>
                        </div>
                        <div className="py-4 px-6 rounded-2xl shadow-md bg-green-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Total Income</h3>
                                    <p className="text-lg font-bold text-green-700">₹ {totalIncome}</p>
                                </div>
                                <FiTrendingUp className="text-3xl text-green-600" />
                            </div>
                        </div>
                        <div className="py-4 px-6 rounded-2xl shadow-md bg-red-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h3 className="text-xl font-semibold mb-1">Total Expense</h3>
                                    <p className="text-lg font-bold text-red-700">₹ {totalExpense}</p>
                                </div>
                                <FiTrendingDown className="text-3xl text-red-600" />
                            </div>
                        </div>
                    </div>

                    {/* Categorical Ledger */}
                    <div className="py-4 px-6 rounded-xl shadow-md border border-dashed border-secondary">
                        <h3 className="text-lg font-semibold text-center mb-4">Categorical Ledger</h3>
                        <div className="space-y-3">
                            {sortedCategories.map(([cat, amt], index) => {
                                const colors = [
                                    "bg-red-500", "bg-blue-500", "bg-green-500",
                                    "bg-yellow-500", "bg-purple-500", "bg-pink-500",
                                    "bg-indigo-500", "bg-teal-500",
                                ];
                                const color = colors[index % colors.length];
                                return (
                                    <div key={cat} className="flex justify-between items-center text-sm text-gray-600">
                                        <div className="flex items-center gap-2">
                                            <span className={`w-3 h-3 rounded-full ${color}`}></span>
                                            <span className="capitalize font-medium">{cat}</span>
                                        </div>
                                        <span className="font-semibold">₹ {amt}</span>
                                    </div>
                                );
                            })}
                        </div>
                    </div>

                    {/* Highlights */}
                    <div className="space-y-4">
                        <div className="p-6 rounded-2xl shadow-md bg-orange-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg font-semibold text-orange-700">Most Spent Category</h4>
                                    <p className="text-base text-orange-800 capitalize">
                                        {mostSpentCat || "N/A"}: ₹{categoryTotals[mostSpentCat] || 0}
                                    </p>
                                </div>
                                <FaChartPie className="text-3xl text-orange-500" />
                            </div>
                        </div>
                        <div className="p-6 rounded-2xl shadow-md bg-blue-50">
                            <div className="flex justify-between items-center">
                                <div>
                                    <h4 className="text-lg font-semibold text-blue-700">Latest Transaction</h4>
                                    <p className="text-base text-blue-800">
                                        {latestTransaction?.name || "N/A"}: ₹{latestTransaction?.amount || 0}
                                    </p>
                                </div>
                                <FaClock className="text-3xl text-blue-500" />
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Link
                            to="/alltransactions"
                            className="inline-flex items-center gap-2 px-6 py-3 border-2 border-txt text-txt font-semibold rounded-2xl hover:bg-txt hover:text-white transition"
                        >
                            <FaChartPie className="text-xl" />
                            <span>Go back to Transactions</span>
                        </Link>
                    </div>
                </div>

                {/* RIGHT: Charts */}
                <div className="lg:col-span-8 space-y-6 px-6 lg:px-0">
                    {/* Category-wise Pie */}
                    <div className="text-center p-6">
                        <h3 className="text-3xl  mb-6">Category-wise Distribution</h3>
                        <div className="flex justify-center flex-wrap gap-4 mb-6">
                            <select
                                value={month}
                                onChange={e => setMonth(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Months</option>
                                {months.map(m => <option key={m} value={m}>{m}</option>)}
                            </select>
                            <select
                                value={year2}
                                onChange={e => setYear2(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Years</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <CategoryPieChart transactions={filterTxns(month, year2)} />
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 mt-12 px-6 lg:px-0">
                {/* Monthly Expenses (Left) */}
                <div className="lg:col-span-6">
                    <div className=" rounded-2xl p-6 ">
                        <h3 className="text-xl font-semibold mb-4">Monthly Expenses</h3>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                value={year1}
                                onChange={e => setYear1(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Years</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <MonthlyExpensesChart transactions={filterTxns("", year1)} />
                    </div>
                </div>

                {/* Stacked Category Bar (Right) */}
                <div className="lg:col-span-6">
                    <div className=" rounded-2xl p-6 ">
                        <h3 className="text-xl font-semibold mb-4">Stacked Category Bar</h3>
                        <div className="flex flex-wrap gap-4 mb-6">
                            <select
                                value={year3}
                                onChange={e => setYear3(e.target.value)}
                                className="px-4 py-2 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            >
                                <option value="">All Years</option>
                                {years.map(y => <option key={y} value={y}>{y}</option>)}
                            </select>
                        </div>
                        <StackedCategoryBarChart transactions={filterTxns("", year3)} />
                    </div>
                </div>
            </div>
            {error && <p className="text-center text-red-600 mt-8 font-medium">{error}</p>}
        </div>
    );
}
