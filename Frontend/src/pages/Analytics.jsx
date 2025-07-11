import MonthlyExpensesChart from '../components/MonthlyExpenseChart';
import { BASE_URL } from '../constants/constants';
import { useState, useEffect } from 'react';
import axios from 'axios';
import CategoryPieChart from '../components/CategoryPieChart';
import StackedCategoryBarChart from '../components/StackedCategoryBarChart';

export default function Analytics() {
    const [transactions, setTransactions] = useState([]);
    const [error, setError] = useState("");

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

    return (
        <div>
            <MonthlyExpensesChart transactions={transactions} />
            <CategoryPieChart transactions={transactions} />
            <StackedCategoryBarChart transactions={transactions} />
            {error && <p className="text-red-500 text-center">{error}</p>}
        </div>
    );
}
