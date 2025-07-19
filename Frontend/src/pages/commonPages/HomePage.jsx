import { Link } from "react-router-dom";
import { FaWallet, FaChartPie, FaBullseye } from "react-icons/fa6";

export default function HomePage() {
    return (
        <div className="text-txt ml-0 md:ml-10 lg:ml-0">
            <div className="flex flex-col md:flex-row items-center justify-between px-6 pt-12 pb-0 md:pb-20 gap-4 max-w-7xl mx-auto">
                <div className="flex-1 text-center md:text-left" >
                    <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold mb-8 leading-16">
                        <span className="text-secondary">Trace your money.</span> <br />{" "}
                        <span className="text-sectxt">Own your flow.</span> <br />{" "}
                        <span>Build your life.</span>
                    </h1>
                    <p className="md:text-right text-lg mb-4 mx-auto md:mx-0 leading-8">
                        “What gets measured gets managed.” <br />
                        <span className="text-sm text-sectxt">— Peter Drucker &nbsp;</span>
                    </p>
                    <p className="text-base mb-7 md:mb-4 mx-auto md:mx-0 leading-7">
                        Xpenser turns your spending into insights — helping you stay ahead,
                        save better, and live smarter.
                        <br />
                        Take control of your money with clarity and confidence.
                        <br />With powerful insights and clean visuals, managing finances finally feels effortless.
                        Track less. Live more.
                    </p>
                    <div className="flex justify-center md:justify-end gap-4">
                        <Link
                            to="/alltransactions"
                            className="border-2 border-secondary text-secondary font-semibold px-6 py-2 rounded-2xl hover:bg-secondary hover:text-primary transition-colors duration-200"
                        >
                            Get Started
                        </Link>
                    </div>
                </div>
                <div className="flex-1 flex justify-center md:justify-end">
                    <Link to={"/transactionanalytics"}>
                        <img
                            src="/assets/heroImg.png"
                            alt="Growth Graph"
                            className="w-100 lg:w-120 object-contain mb-10"
                        />
                    </Link>
                </div>
            </div>

            <div className="bg-primary py-16 px-6">
                <h2 className="text-2xl sm:text-3xl font-bold text-center mb-14">
                    Why Choose Xpenser?
                </h2>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-12 max-w-6xl mx-auto">

                    <Link to={"/alltransactions"}>
                        <div className="p-6 rounded-2xl shadow-md hover:shadow-xl hover:cursor-pointer transition duration-500">
                            <FaWallet className="text-3xl text-secondary mb-3" />
                            <h3 className="text-xl font-semibold mb-2">Track Every Expense</h3>
                            <p className="text-sm leading-6">
                                Log your transactions easily and never lose sight of your money.
                            </p>
                        </div>
                    </Link>

                    <Link to={"/allbudgets"}>
                        <div className=" p-6 rounded-2xl shadow-md hover:shadow-xl hover:cursor-pointer transition duration-500">
                            <FaBullseye className="text-3xl text-secondary mb-3" />
                            <h3 className="text-xl font-semibold mb-2">Set Smart Budgets</h3>
                            <p className="text-sm leading-6">
                                Categorize your spending and set limits to stay financially fit.
                            </p>
                        </div>
                    </Link>

                    <Link to={"/budgetvsexpensecomparison"}>
                        <div className=" p-6 rounded-2xl shadow-md hover:shadow-xl hover:cursor-pointer transition duration-500">
                            <FaChartPie className="text-3xl text-secondary mb-3" />
                            <h3 className="text-xl font-semibold mb-2">
                                Visual Financial Summary
                            </h3>
                            <p className="text-sm leading-6">
                                Understand your spending patterns with beautifully summarized
                                data.
                            </p>
                        </div>
                    </Link>
                </div>
            </div>
        </div >
    );
}
