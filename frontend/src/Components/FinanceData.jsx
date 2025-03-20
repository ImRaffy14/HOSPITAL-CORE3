import React, { useState, useEffect } from "react";
import { toast } from 'react-toastify';
import axios from "axios";

function FinanceData() {
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
            } catch (error) {
                console.error("Error fetching data:", error);
            }
        };

        fetchData();

        const result = localStorage.getItem('auto');
        setIsClicked(result === "true");
    }, []);

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

    const handleAutomatedBackup = async () => {
        if (!window.confirm("Are you sure you want to schedule an automated backup?")) return;

        try {
            await axios.post(`${urlAPI}/api/backup`, { type: "automated" });
            alert("Automated backup scheduled successfully!");
        } catch (error) {
            console.error("Error scheduling automated backup:", error);
            alert("Failed to schedule automated backup.");
        }
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.patientName}</td>
                                        <td>{item.patientAge}</td>
                                        <td>{item.totalAmount}</td>
                                        <td>{item.paymentStatus}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Recover
                                            </button>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.officer}</td>
                                        <td>{item.budgetType}</td>
                                        <td>{item.amount}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Recover
                                            </button>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.department}</td>
                                        <td>{item.amount}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Recover
                                            </button>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.date}</td>
                                        <td>{item.revenue}</td>
                                        <td>{JSON.stringify(item.expenses)}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Recover
                                            </button>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.claimDate}</td>
                                        <td>{item.claimAmount}</td>
                                        <td>{item.claimType}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Recover
                                            </button>
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
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.username}</td>
                                        <td>{item.role}</td>
                                        <td>{item.fullName}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                            >
                                                Recover
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
            default:
                return null;
        }
    };

    return (
        <div className="h-screen w-full p-8 bg-base-200">
            <div className="max-w-screen-4xl mx-auto">
                <h1 className="text-2xl font-bold mb-4">Finance Data Management</h1>
                <div className="flex gap-4 mb-4">
                    {!isLoading ? (
                        <button onClick={handleManualBackup} className="btn btn-primary">
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
                    >
                        {isClicked ? "Disable Auto Backup" : "Enable Auto Backup"}
                    </button>
                    
                    <button
                        onClick={handleRecoverAll}
                        className="btn btn-warning"
                        disabled={isRecoverAllLoading}
                    >
                        {isRecoverAllLoading ? "Recovering All Data..." : "Recover All Data"}
                    </button>
                </div>
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
    );
}

export default FinanceData;