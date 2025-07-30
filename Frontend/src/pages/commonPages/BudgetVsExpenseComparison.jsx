import { BASE_URL } from '../../constants/constants';
import { useState, useEffect } from 'react';
import axios from 'axios';
import BudgetTrendLineChart from "../../components/charts/BudgetTrendLineChart";
import BudgetVsExpenseBarChart from '../../components/charts/BudgetVsExpenseBarChart';
import CategoryComparisonChart from '../../components/charts/CategoryComparisonChart';

const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
const years = ["2015", "2016", "2017", "2018", "2019", "2020", "2021",
    "2022", "2023", "2024", "2025", "2026", "2027", "2028",
    "2029", "2030", "2031", "2032", "2033", "2034", "2035",
    "2036", "2037", "2038", "2039", "2040"];

export default function BudgetVsExpenseComparison() {
    const [transactions, setTransactions] = useState([]);
    const [budgets, setBudgets] = useState([]);
    const [error, setError] = useState("");

    // Line Chart filters
    const [fromMonth, setFromMonth] = useState("Jan");
    const [fromYear, setFromYear] = useState("2025");
    const [toMonth, setToMonth] = useState("Dec");
    const [toYear, setToYear] = useState("2025");

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
                const txnRes = await axios.get(`${BASE_URL}/allTransactions`, {
                    withCredentials: true,
                });
                const budgetRes = await axios.get(`${BASE_URL}/showbudget`, {
                    withCredentials: true,
                });
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

    const selectedBudget = comparisonType === "Monthly"
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

    return (
        <div className="max-w-8xl mt-12 mx-auto px-4 lg:px-16">
            {/* Heading */}
            <h2 className="text-3xl lg:text-4xl text-center text-gray-800 mb-16">
                Budget & Expense Analytics
            </h2>

            {/* Section 1: Budget vs Expense + Line Chart */}
            <div className="flex flex-col lg:flex-row gap-8 mb-16 text-center">
                {/* Budget vs Expense (Bar) */}
                <div className="lg:w-1/2 w-full">
                    <div className="text-3xl text-secondary text-center mb-6">
                        Budget vs Expenses
                    </div>

                    {/* Filters Box */}
                    <div className="flex flex-wrap justify-center gap-4">
                        {/* Month */}
                        <div className="relative">
                            <select
                                value={barMonthFilter}
                                onChange={(e) => setBarMonthFilter(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-lg pl-4 pr-10 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition cursor-pointer"
                            >
                                <option value="">All Months</option>
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Year */}
                        <div className="relative">
                            <select
                                value={barYearFilter}
                                onChange={(e) => setBarYearFilter(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-lg pl-4 pr-10 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition cursor-pointer"
                            >
                                <option value="">All Years</option>
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <BudgetVsExpenseBarChart
                        transactions={filteredTransactions}
                        budgets={budgets}
                    />
                </div>

                {/* Line Chart Section */}
                <div className="lg:w-1/2 w-full">
                    <h3 className="text-2xl sm:text-3xl text-center text-txt mb-6">
                        Category-wise Distribution
                    </h3>

                    {/* Filters Box */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {/* From Month */}
                        <div className="relative">
                            <select
                                value={fromMonth}
                                onChange={(e) => setFromMonth(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-500"
                            >
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* From Year */}
                        <div className="relative">
                            <select
                                value={fromYear}
                                onChange={(e) => setFromYear(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-500"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* To Month */}
                        <div className="relative">
                            <select
                                value={toMonth}
                                onChange={(e) => setToMonth(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-500"
                            >
                                {months.map((m) => (
                                    <option key={m} value={m}>{m}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* To Year */}
                        <div className="relative">
                            <select
                                value={toYear}
                                onChange={(e) => setToYear(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-md pl-3 pr-8 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-1 focus:ring-purple-400 focus:border-purple-500"
                            >
                                {years.map((y) => (
                                    <option key={y} value={y}>{y}</option>
                                ))}
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-2 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>
                    </div>

                    {/* Chart */}
                    <BudgetTrendLineChart
                        budgets={budgets}
                        transactions={transactions}
                        fromMonth={fromMonth}
                        fromYear={fromYear}
                        toMonth={toMonth}
                        toYear={toYear}
                    />
                </div>
            </div>

            {/* Section 2: Category Chart + Filters */}
            <div className="w-full mb-16">
                {/* Heading and Filters Row */}
                <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between mb-6 gap-6">
                    <h3 className="text-3xl lg:text-4xl text-txt text-center lg:text-left">
                        Category-wise Budget vs Expense
                    </h3>

                    {/* Filters Section */}
                    <div className="flex flex-wrap justify-center gap-6">
                        {/* Comparison Type */}
                        <div className="relative">
                            <select
                                value={comparisonType}
                                onChange={(e) => setComparisonType(e.target.value)}
                                className="w-full appearance-none border border-purple-300 rounded-lg pl-4 pr-10 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition cursor-pointer"
                            >
                                <option value="Monthly">Monthly</option>
                                <option value="Yearly">Yearly</option>
                            </select>
                            <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-purple-500">
                                <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                    <path
                                        fillRule="evenodd"
                                        d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                        clipRule="evenodd"
                                    />
                                </svg>
                            </div>
                        </div>

                        {/* Month Dropdown (Only for Monthly) */}
                        {comparisonType === "Monthly" && (
                            <div className="relative">
                                <select
                                    value={categoryMonthFilter}
                                    onChange={(e) => setCategoryMonthFilter(e.target.value)}
                                    className="w-full appearance-none border border-purple-300 rounded-lg pl-4 pr-10 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition cursor-pointer"
                                >
                                    {months.map((m) => (
                                        <option key={m} value={m}>
                                            {m}
                                        </option>
                                    ))}
                                </select>
                                <div className="pointer-events-none absolute inset-y-0 right-3 flex items-center text-purple-500">
                                    <svg className="w-4 h-4" viewBox="0 0 20 20" fill="currentColor">
                                        <path
                                            fillRule="evenodd"
                                            d="M5.23 7.21a.75.75 0 011.06.02L10 11.293l3.71-4.06a.75.75 0 111.1 1.02l-4.25 4.65a.75.75 0 01-1.1 0l-4.25-4.65a.75.75 0 01.02-1.06z"
                                            clipRule="evenodd"
                                        />
                                    </svg>
                                </div>
                            </div>
                        )}

                        {/* Year Input */}
                        <div className="relative">
                            <input
                                type="number"
                                value={categoryYearFilter}
                                onChange={(e) => setCategoryYearFilter(e.target.value)}
                                className="w-[120px] appearance-none border border-purple-300 rounded-lg pl-4 pr-10 py-2 text-sm bg-white text-gray-800 shadow-sm focus:outline-none focus:ring-2 focus:ring-purple-400 focus:border-purple-500 transition"
                                placeholder="Year"
                            />
                        </div>
                    </div>
                </div>

                {error ? (
                    <p className="text-red-500 text-center mt-4">{error}</p>
                ) : (
                    <CategoryComparisonChart
                        budget={selectedBudget}
                        transactions={filteredCategoryTransactions}
                    />
                )}
            </div>

        </div>
    );
}
