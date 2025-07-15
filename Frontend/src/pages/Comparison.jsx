import { BASE_URL } from '../constants/constants';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetTrendLineChart from "../components/BudgetTrendLineChart";
import BudgetVsExpenseBarChart from '../components/BudgetVsExpenseBarChart';
import CategoryComparisonChart from '../components/CategoryComparisonChart';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

export default function Comparison() {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");

    const [fromMonth, setFromMonth] = useState("");
    const [fromYear, setFromYear] = useState("");
    const [toMonth, setToMonth] = useState("");
    const [toYear, setToYear] = useState("");

    // Filters for Bar Chart
    const [barMonthFilter, setBarMonthFilter] = useState("");
    const [barYearFilter, setBarYearFilter] = useState("");

    // Filters for Category Chart
    const today = new Date();
    const currentMonth = today.toLocaleString("default", { month: "short" });
    const currentYear = today.getFullYear().toString();

    const [comparisonType, setComparisonType] = useState("Monthly");
    const [categoryMonthFilter, setCategoryMonthFilter] = useState(currentMonth);
    const [categoryYearFilter, setCategoryYearFilter] = useState(currentYear);

    // Fetch all data
    useEffect(() => {
        const fetchData = async () => {
            try {
                const txnRes = await axios.get(`${BASE_URL}/allTransactions`);
                const budgetRes = await axios.get(`${BASE_URL}/showbudget`);
                setTransactions(txnRes.data.reverse());
                setBudgets(budgetRes.data.reverse());
                setError("");
            } catch (err) {
                console.error("Error fetching data:", err);
                setError("Failed to load data.");
            }
        };
        fetchData();
    }, []);

    // Filter for Bar Chart
    const filteredTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        const txnMonth = txnDate.toLocaleString("default", { month: "short" });
        const txnYear = txnDate.getFullYear().toString();
        return (
            (!barMonthFilter || txnMonth === barMonthFilter) &&
            (!barYearFilter || txnYear === barYearFilter)
        );
    });

    const selectedBudget =
        comparisonType === "Monthly"
            ? budgets.find(
                b =>
                    b.month?.toLowerCase() === categoryMonthFilter?.toLowerCase() &&
                    b.year?.toString() === categoryYearFilter?.toString()
            )
            : mergeYearlyBudgets();

    function mergeYearlyBudgets() {
        const yearly = budgets.filter(b => b.year?.toString() === categoryYearFilter?.toString());

        console.log("Yearly Budgets for", categoryYearFilter, yearly);

        const merged = {};
        yearly.forEach(b => {
            for (let cat in b.categories) {
                merged[cat] = (merged[cat] || 0) + Number(b.categories[cat]);
            }
        });

        return {
            month: "All",
            year: categoryYearFilter,
            categories: merged
        };
    }

    // Filter transactions for Category Chart
    const filteredCategoryTransactions = transactions.filter(txn => {
        const txnDate = new Date(txn.date);
        const txnMonth = txnDate.toLocaleString("default", { month: "short" });
        const txnYear = txnDate.getFullYear().toString();
        if (comparisonType === "Monthly") {
            return txnMonth === categoryMonthFilter && txnYear === categoryYearFilter;
        } else {
            return txnYear === categoryYearFilter;
        }
    });

    return (
        <div className="max-w-5xl mx-auto p-4">
            <h2 className="text-2xl font-bold text-center mb-6">Budget vs Expense Comparison</h2>

            {/* Bar Chart Filters */}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <select value={barMonthFilter} onChange={e => setBarMonthFilter(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="">All Months</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>

                <select value={barYearFilter} onChange={e => setBarYearFilter(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="">All Years</option>
                    {["2023", "2024", "2025", "2026"].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            {/* Bar Chart */}
            <BudgetVsExpenseBarChart transactions={filteredTransactions} budgets={budgets} />

            {/* Category Chart Filters */}
            <h2 className="text-2xl font-bold text-center mt-12 mb-6">Category-wise Budget vs Expense</h2>
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <select value={comparisonType} onChange={e => setComparisonType(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="Monthly">Monthly</option>
                    <option value="Yearly">Yearly</option>
                </select>

                {comparisonType === "Monthly" && (
                    <select value={categoryMonthFilter} onChange={e => setCategoryMonthFilter(e.target.value)} className="px-4 py-2 border rounded-md">
                        {months.map(m => <option key={m} value={m}>{m}</option>)}
                    </select>
                )}

                <input
                    type="number"
                    value={categoryYearFilter}
                    onChange={e => setCategoryYearFilter(e.target.value)}
                    className="px-4 py-2 border rounded-md w-28"
                    placeholder="Year"
                />
            </div>

            {/* Category Chart */}
            {error ? (
                <p className="text-red-500 text-center mt-4">{error}</p>
            ) : (
                <CategoryComparisonChart
                    budget={selectedBudget}
                    transactions={filteredCategoryTransactions}
                />
            )}
            <div className="flex flex-wrap justify-center gap-4 mb-6">
                <select value={fromMonth} onChange={e => setFromMonth(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="">From Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={fromYear} onChange={e => setFromYear(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="">From Year</option>
                    {["2023", "2024", "2025", "2026"].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
                <select value={toMonth} onChange={e => setToMonth(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="">To Month</option>
                    {months.map(m => <option key={m} value={m}>{m}</option>)}
                </select>
                <select value={toYear} onChange={e => setToYear(e.target.value)} className="px-4 py-2 border rounded-md">
                    <option value="">To Year</option>
                    {["2023", "2024", "2025", "2026"].map(y => <option key={y} value={y}>{y}</option>)}
                </select>
            </div>

            <BudgetTrendLineChart
                budgets={budgets}
                transactions={transactions}
                fromMonth={fromMonth}
                fromYear={fromYear}
                toMonth={toMonth}
                toYear={toYear}
            />
        </div>
    );
}
