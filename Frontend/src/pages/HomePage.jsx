import { Link } from 'react-router-dom';

export default function HomePage() {
    return (
        <div>
            <Link
                to={`/alltransactions`}
                className="text-black hover:text-blue-600"
            >
                Go to transactions
            </Link>
            <br />
            <Link
                to={`/addtransaction`}
                className="text-black hover:text-blue-600"
            >
                Add a transaction
            </Link>
        </div>
    );
}
