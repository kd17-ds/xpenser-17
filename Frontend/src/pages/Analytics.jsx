import { useState, useEffect } from 'react';
import axios from 'axios';
import { BASE_URL } from '../constants/constants';
import MonthlyExpensesChart from '../components/MonthlyExpenseChart';
import CategoryPieChart from '../components/CategoryPieChart';
import StackedCategoryBarChart from '../components/StackedCategoryBarChart';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const years = ["2015", "2016", "2017", "2018", "2019", "2020", "2021",
    "2022", "2023", "2024", "2025", "2026", "2027", "2028",
    "2029", "2030", "2031", "2032", "2033", "2034", "2035",
    "2036", "2037", "2038", "2039", "2040"];

export default function Analytics() {
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

    return (
        <div className="max-w-5xl mx-auto p-4 space-y-16">
            <h2 className="text-2xl font-bold text-center mb-6">Analytics</h2>

            {/* MonthlyExpensesChart Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Monthly Expenses</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                    <select value={year1} onChange={e => setYear1(e.target.value)} className="px-4 py-2 border rounded-md">
                        <option value="">All Years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <MonthlyExpensesChart transactions={filterTxns("", year1)} />
            </div>

            {/* CategoryPieChart Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Category-wise Pie</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                    <select value={month} onChange={e => setMonth(e.target.value)} className="px-4 py-2 border rounded-md">
                        <option value="">All Months</option>
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                    <select value={year2} onChange={e => setYear2(e.target.value)} className="px-4 py-2 border rounded-md">
                        <option value="">All Years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <CategoryPieChart transactions={filterTxns(month, year2)} />
            </div>

            {/* StackedCategoryBarChart Section */}
            <div>
                <h3 className="text-xl font-semibold mb-2">Stacked Category Bar</h3>
                <div className="flex flex-wrap gap-4 mb-4">
                    <select value={year3} onChange={e => setYear3(e.target.value)} className="px-4 py-2 border rounded-md">
                        <option value="">All Years</option>
                        {years.map(y => <option key={y} value={y}>{y}</option>)}
                    </select>
                </div>
                <StackedCategoryBarChart transactions={filterTxns("", year3)} />
            </div>

            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
}
