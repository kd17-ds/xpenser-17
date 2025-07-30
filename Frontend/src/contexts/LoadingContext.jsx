import { createContext, useContext, useState } from "react";

const LoadingContext = createContext();

export const LoadingProvider = ({ children }) => {
    const [loading, setLoading] = useState(false);

    const showLoader = () => setLoading(true);
    const hideLoader = () => setLoading(false);

    return (
        <LoadingContext.Provider value={{ loading, showLoader, hideLoader }}>
            {children}
            {loading && (
                <div className="fixed inset-0 z-[999] flex items-center justify-center bg-white/50">
                    <div className="w-8 h-8 border-4 border-sec border-t-transparent rounded-full animate-spin" />
                </div>
            )}
        </LoadingContext.Provider>
    );
};

export const useLoader = () => useContext(LoadingContext);
