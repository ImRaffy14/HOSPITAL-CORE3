import React, { useState } from "react";
import { toast } from "react-toastify";

function HrData() {
    // Dummy data for HR systems
    const dummyData = {
        employees: [
            { _id: 1, name: "John Doe", position: "Software Engineer", department: "Engineering", salary: "$80,000" },
            { _id: 2, name: "Jane Smith", position: "HR Manager", department: "Human Resources", salary: "$90,000" },
            { _id: 3, name: "Alice Johnson", position: "Product Manager", department: "Product", salary: "$85,000" },
        ],
        attendance: [
            { _id: 1, employeeId: 1, date: "2023-10-01", status: "Present" },
            { _id: 2, employeeId: 2, date: "2023-10-01", status: "Absent" },
            { _id: 3, employeeId: 3, date: "2023-10-01", status: "Present" },
        ],
        leaveRequests: [
            { _id: 1, employeeId: 1, startDate: "2023-10-05", endDate: "2023-10-07", status: "Pending" },
            { _id: 2, employeeId: 2, startDate: "2023-10-10", endDate: "2023-10-12", status: "Approved" },
            { _id: 3, employeeId: 3, startDate: "2023-10-15", endDate: "2023-10-17", status: "Rejected" },
        ],
        payroll: [
            { _id: 1, employeeId: 1, month: "October 2023", salary: "$80,000", status: "Paid" },
            { _id: 2, employeeId: 2, month: "October 2023", salary: "$90,000", status: "Paid" },
            { _id: 3, employeeId: 3, month: "October 2023", salary: "$85,000", status: "Pending" },
        ],
    };

    const [data, setData] = useState(dummyData);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecoverAllLoading, setIsRecoverAllLoading] = useState(false);
    const [isBackupLoading, setIsBackupLoading] = useState(false);
    const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);
    const [selectedModel, setSelectedModel] = useState("employees");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);

    // Handle manual backup
    const handleManualBackup = () => {
        if (!window.confirm("Are you sure you want to perform a manual backup?")) return;

        setIsBackupLoading(true);
        setTimeout(() => {
            toast.success("Manual backup completed successfully!", { position: "top-right" });
            setIsBackupLoading(false);
        }, 2000); // Simulate a 2-second delay
    };

    // Handle automated backup toggle
    const handleAutomatedBackup = () => {
        if (!window.confirm(`Are you sure you want to ${isAutoBackupEnabled ? "disable" : "enable"} automated backup?`)) return;

        setIsAutoBackupEnabled(!isAutoBackupEnabled);
        toast.success(`Automated backup ${isAutoBackupEnabled ? "disabled" : "enabled"} successfully!`, { position: "top-right" });
    };

    // Handle recovery for a single item
    const handleRecovery = (id, model) => {
        if (!window.confirm("Are you sure you want to recover this data?")) return;

        setIsLoading(true);
        setTimeout(() => {
            toast.success(`Recovered data with ID: ${id} from ${model}`, { position: "top-right" });
            setIsLoading(false);
        }, 1000);
    };

    // Handle recovery for all items in the selected model
    const handleRecoverAll = () => {
        if (!window.confirm("Are you sure you want to recover all data for this model?")) return;

        setIsRecoverAllLoading(true);
        setTimeout(() => {
            toast.success(`Recovered all data from ${selectedModel}`, { position: "top-right" });
            setIsRecoverAllLoading(false);
        }, 2000);
    };

    // Filter data based on search query
    const filteredData = data[selectedModel].filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    // Pagination logic
    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    // Change page
    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render table based on selected model
    const renderTable = () => {
        switch (selectedModel) {
            case "employees":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Name</th>
                                    <th>Position</th>
                                    <th>Department</th>
                                    <th>Salary</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.name}</td>
                                        <td>{item.position}</td>
                                        <td>{item.department}</td>
                                        <td>{item.salary}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                                disabled={isLoading}
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
            case "attendance":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Employee ID</th>
                                    <th>Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.employeeId}</td>
                                        <td>{item.date}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                                disabled={isLoading}
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
            case "leaveRequests":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Employee ID</th>
                                    <th>Start Date</th>
                                    <th>End Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.employeeId}</td>
                                        <td>{item.startDate}</td>
                                        <td>{item.endDate}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                                disabled={isLoading}
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
            case "payroll":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Employee ID</th>
                                    <th>Month</th>
                                    <th>Salary</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.employeeId}</td>
                                        <td>{item.month}</td>
                                        <td>{item.salary}</td>
                                        <td>{item.status}</td>
                                        <td>
                                            <button
                                                onClick={() => handleRecovery(item._id, selectedModel)}
                                                className="btn btn-sm btn-warning"
                                                disabled={isLoading}
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
                <h1 className="text-2xl font-bold mb-4">HR Data Management</h1>
                <div className="flex gap-4 mb-4">
                    {/* Manual Backup Button */}
                    {!isBackupLoading ? (
                        <button onClick={handleManualBackup} className="btn btn-primary">
                            Manual Backup
                        </button>
                    ) : (
                        <button className="btn btn-primary" disabled>
                            Backing Up...
                        </button>
                    )}

                    {/* Automated Backup Button */}
                    <button
                        onClick={handleAutomatedBackup}
                        className={`btn ${isAutoBackupEnabled ? "btn-success" : "btn-secondary"}`}
                    >
                        {isAutoBackupEnabled ? "Disable Auto Backup" : "Enable Auto Backup"}
                    </button>

                    {/* Recover All Data Button */}
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
                    <option value="employees">Employees</option>
                    <option value="attendance">Attendance</option>
                    <option value="leaveRequests">Leave Requests</option>
                    <option value="payroll">Payroll</option>
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

export default HrData;