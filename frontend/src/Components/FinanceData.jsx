import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

function FinanceData({ userData }) {
    const [data, setData] = useState({
        billing: [],
        budgetHistory: [],
        budget: [],
        financialReport: [],
        insuranceClaim: [],
        userData: [],
    });

    const [isLoading, setIsLoading] = useState(false);
    const [isRecoverAllLoading, setIsRecoverAllLoading] = useState(false);
    const [isClicked, setIsClicked] = useState(false);
    const [canViewData, setCanViewData] = useState(false);
    const [canBackupRecover, setCanBackupRecover] = useState(false);
    const [unblurredRows, setUnblurredRows] = useState({});

    const urlAPI = import.meta.env.VITE_API_URL;

    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(10);
    const [searchQuery, setSearchQuery] = useState("");
    const [selectedModel, setSelectedModel] = useState("billing");

    useEffect(() => {
        const fetchData = async () => {
            try {
                const response = await axios.get(`${urlAPI}/api/get-finance-data-core`);
                setData(response.data);
                if(userData.role === "Superadmin"){
                    setCanViewData(true)
                    setCanBackupRecover(true)
                }else{
                    setCanViewData(false)
                    setCanBackupRecover(true)
                }
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const result = localStorage.getItem('auto');
        setIsClicked(result === "true");
    }, []);

    const toggleRowBlur = (rowId) => {
        setUnblurredRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    const automatedBackup = () => {
        if (!window.confirm("Are you sure you want to automatically backup data?")) return;

        const result = localStorage.getItem('auto');
        const newValue = result === "true" ? "false" : "true";
        localStorage.setItem('auto', newValue);
        setIsClicked(newValue === "true");
    };

    const handleManualBackup = async () => {
        if (!window.confirm("Are you sure you want to perform a manual backup?")) return;

        setIsLoading(true);
        try {
            const result = await axios.get(`${urlAPI}/api/get-finance-data`);
            toast.success(result.data.message, { position: "top-right" });
            const response = await axios.get(`${urlAPI}/api/get-finance-data-core`);
            setData(response.data);
        } catch (error) {
            console.error("Error during manual backup:", error);
            toast.error("Failed to perform manual backup", { position: 'top-right' });
        }
        setIsLoading(false);
    };

    const handleRecovery = async (id, model) => {
        if (!window.confirm("Are you sure you want to recover this data?")) return;

        try {
            const response = await axios.post(`${urlAPI}/api/recovery/recover-data`, { id, model });
            toast.success(response.data.message, { position: "top-right" });
            const fetchResponse = await axios.get(`${urlAPI}/api/get-finance-data-core`);
            setData(fetchResponse.data);
        } catch (error) {
            console.error("Error during recovery:", error);
            toast.error("Failed to recover data", { position: "top-right" });
        }
    };

    const handleRecoverAll = async () => {
        if (!window.confirm("Are you sure you want to recover all data for this model?")) return;

        setIsRecoverAllLoading(true);
        try {
            const response = await axios.post(`${urlAPI}/api/recovery/recover-all`, { model: selectedModel });
            toast.success(response.data.message, { position: "top-right" });
            const fetchResponse = await axios.get(`${urlAPI}/api/get-finance-data-core`);
            setData(fetchResponse.data);
        } catch (error) {
            console.error("Error during recover all:", error);
            toast.error("Failed to recover all data", { position: "top-right" });
        }
        setIsRecoverAllLoading(false);
    };

    const filteredData = data[selectedModel].filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    const renderBlurredCell = (value, rowId) => (
        <span className={`transition-all duration-200 ${canViewData && unblurredRows[rowId] ? '' : 'filter blur-sm'}`}>
            {value}
        </span>
    );

    const renderTable = () => {
        switch (selectedModel) {
            case "billing":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Patient Name</th>
                                    <th>Patient Age</th>
                                    <th>Total Amount</th>
                                    <th>Payment Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{renderBlurredCell(item.patientName, item._id)}</td>
                                        <td>{renderBlurredCell(item.patientAge, item._id)}</td>
                                        <td>{renderBlurredCell(item.totalAmount, item._id)}</td>
                                        <td>{renderBlurredCell(item.paymentStatus, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, selectedModel)}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={!canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {canViewData && (
                                                    <button
                                                        onClick={() => toggleRowBlur(item._id)}
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "budgetHistory":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Officer</th>
                                    <th>Budget Type</th>
                                    <th>Amount</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{renderBlurredCell(item.officer, item._id)}</td>
                                        <td>{renderBlurredCell(item.budgetType, item._id)}</td>
                                        <td>{renderBlurredCell(item.amount, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, selectedModel)}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={!canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {canViewData && (
                                                    <button
                                                        onClick={() => toggleRowBlur(item._id)}
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "budget":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Department</th>
                                    <th>Amount</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{renderBlurredCell(item.department, item._id)}</td>
                                        <td>{renderBlurredCell(item.amount, item._id)}</td>
                                        <td>{renderBlurredCell(item.status, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, selectedModel)}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={!canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {canViewData && (
                                                    <button
                                                        onClick={() => toggleRowBlur(item._id)}
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "financialReport":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Date</th>
                                    <th>Revenue</th>
                                    <th>Expenses</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{renderBlurredCell(item.date, item._id)}</td>
                                        <td>{renderBlurredCell(item.revenue, item._id)}</td>
                                        <td>{renderBlurredCell(JSON.stringify(item.expenses), item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, selectedModel)}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={!canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {canViewData && (
                                                    <button
                                                        onClick={() => toggleRowBlur(item._id)}
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "insuranceClaim":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Claim Date</th>
                                    <th>Claim Amount</th>
                                    <th>Claim Type</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{renderBlurredCell(item.claimDate, item._id)}</td>
                                        <td>{renderBlurredCell(item.claimAmount, item._id)}</td>
                                        <td>{renderBlurredCell(item.claimType, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, selectedModel)}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={!canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {canViewData && (
                                                    <button
                                                        onClick={() => toggleRowBlur(item._id)}
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            case "userData":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Username</th>
                                    <th>Role</th>
                                    <th>Full Name</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{renderBlurredCell(item.username, item._id)}</td>
                                        <td>{renderBlurredCell(item.role, item._id)}</td>
                                        <td>{renderBlurredCell(item.fullName, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, selectedModel)}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={!canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {canViewData && (
                                                    <button
                                                        onClick={() => toggleRowBlur(item._id)}
                                                        className="btn btn-sm btn-info"
                                                    >
                                                        {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                    </button>
                                                )}
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );

            default:
                return (
                    <div className="alert alert-info">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Please select a data model to view records</span>
                    </div>
                );
        }
    };

    return (
        <div className="h-screen w-full p-8 bg-base-200">
            <div className="max-w-screen-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Finance Data Management</h1>
                
                <div className="flex gap-4 mb-4">
                    {!isLoading ? (
                        <button 
                            onClick={handleManualBackup} 
                            className="btn btn-primary"
                            disabled={!canBackupRecover}
                        >
                            Manual Backup
                        </button>
                    ) : (
                        <button className="btn btn-primary" disabled>
                            Backing Up...
                        </button>
                    )}
                    <button
                        onClick={automatedBackup}
                        className={`btn ${isClicked ? "btn-success" : "btn-secondary"}`}
                        disabled={!canBackupRecover}
                    >
                        {isClicked ? "Disable Auto Backup" : "Enable Auto Backup"}
                    </button>
                    
                    <button
                        onClick={handleRecoverAll}
                        className="btn btn-warning"
                        disabled={isRecoverAllLoading || !canBackupRecover}
                    >
                        {isRecoverAllLoading ? "Recovering All Data..." : "Recover All Data"}
                    </button>
                </div>

                {!canViewData ? (
                    <div className="alert alert-warning mb-4">
                        You don't have permission to view this data, but can perform backup/recovery operations.
                    </div>
                ) : (
                    <div className="alert alert-info mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" className="stroke-current shrink-0 w-6 h-6"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
                        <span>Data is blurred by default. Click "Show" on each row to reveal details.</span>
                    </div>
                )}

                <div className="relative">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="select select-bordered w-full max-w-xs mb-4"
                    >
                        <option value="billing">Billing</option>
                        <option value="budgetHistory">Budget History</option>
                        <option value="budget">Budget</option>
                        <option value="financialReport">Financial Report</option>
                        <option value="insuranceClaim">Insurance Claim</option>
                        <option value="userData">User Data</option>
                    </select>
                    
                    <input
                        type="text"
                        placeholder="Search..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="input input-bordered w-full mb-4"
                    />
                    
                    {renderTable()}
                    
                    <div className="flex justify-center mt-4">
                        {Array.from(
                            { length: Math.ceil(filteredData.length / itemsPerPage) },
                            (_, i) => (
                                <button
                                    key={i + 1}
                                    onClick={() => paginate(i + 1)}
                                    className={`btn btn-sm mx-1 ${currentPage === i + 1 ? "btn-active" : ""}`}
                                >
                                    {i + 1}
                                </button>
                            )
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}

export default FinanceData;