import React, { useState } from "react";
import { toast } from "react-toastify";

function HospitalAdminData({ userData }) {
    // Hospital-specific dummy data
    const hospitalData = {
        staff: [
            { 
                _id: 1, 
                employeeId: "EMP-1001",
                name: "Dr. Sarah Johnson",
                role: "Chief Medical Officer",
                department: "Administration",
                licenseNumber: "MD12345678",
                hireDate: "2020-05-15",
                status: "Active",
                lastLogin: "2023-06-15T08:45:00Z"
            },
            { 
                _id: 2, 
                employeeId: "EMP-1002",
                name: "Nurse Mark Williams",
                role: "Head Nurse",
                department: "Emergency",
                licenseNumber: "RN87654321",
                hireDate: "2019-11-20",
                status: "Active",
                lastLogin: "2023-06-14T16:30:00Z"
            }
        ],
        auditLogs: [
            { 
                _id: 1, 
                action: "Patient Record Access", 
                timestamp: "2023-06-15T09:30:00Z", 
                user: "EMP-1001",
                patientId: "PT-5001",
                ipAddress: "192.168.1.100",
                status: "Success"
            },
            { 
                _id: 2, 
                action: "Prescription Update", 
                timestamp: "2023-06-14T14:45:00Z", 
                user: "EMP-1002",
                patientId: "PT-5002",
                ipAddress: "192.168.1.101",
                status: "Success"
            }
        ],
        systemSettings: [
            { 
                _id: 1, 
                key: "ehr_access_level", 
                value: "Role-Based", 
                description: "Electronic Health Records access control",
                lastModified: "2023-05-20T11:20:00Z"
            },
            { 
                _id: 2, 
                key: "patient_data_retention", 
                value: "10 years", 
                description: "Duration for storing patient records",
                lastModified: "2023-05-15T08:10:00Z"
            }
        ],
        legalCases: [
            {
                _id: 1,
                caseNumber: "HLC-2023-001",
                title: "Malpractice Claim",
                status: "Pending",
                patientInvolved: "PT-5001",
                jurisdiction: "State Medical Board",
                assignedTo: "Hospital Legal Team",
                incidentDate: "2023-01-15",
                lastAction: "Response submitted",
                nextHearing: "2023-07-10"
            },
            {
                _id: 2,
                caseNumber: "HLC-2023-002",
                title: "HIPAA Compliance Review",
                status: "Active",
                patientInvolved: "N/A",
                jurisdiction: "Federal",
                assignedTo: "Compliance Officer",
                incidentDate: "2023-03-22",
                lastAction: "Audit completed",
                nextHearing: "2023-08-05"
            }
        ],
        medicalDocuments: [
            {
                _id: 1,
                documentId: "MED-001-2023",
                title: "Patient Consent Form",
                type: "Legal Form",
                patientId: "PT-5001",
                status: "Archived",
                createdBy: "EMP-1001",
                creationDate: "2023-02-10",
                lastModified: "2023-02-10T14:30:00Z",
                fileSize: "1.2 MB",
                retentionPeriod: "10 years"
            },
            {
                _id: 2,
                documentId: "MED-002-2023",
                title: "Surgical Procedure Report",
                type: "Medical Record",
                patientId: "PT-5002",
                status: "Active",
                createdBy: "EMP-1002",
                creationDate: "2023-04-05",
                lastModified: "2023-04-15T10:45:00Z",
                fileSize: "3.5 MB",
                retentionPeriod: "Permanent"
            }
        ],
        equipment: [
            {
                _id: 1,
                equipmentId: "EQ-1001",
                name: "MRI Machine",
                type: "Diagnostic Imaging",
                status: "Operational",
                lastMaintenance: "2023-05-15",
                nextMaintenance: "2023-08-15",
                location: "Radiology Dept."
            },
            {
                _id: 2,
                equipmentId: "EQ-1002",
                name: "Ventilator",
                type: "Life Support",
                status: "In Maintenance",
                lastMaintenance: "2023-04-20",
                nextMaintenance: "2023-07-20",
                location: "ICU"
            }
        ]
    };

    const [data, setData] = useState(hospitalData);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecoverAllLoading, setIsRecoverAllLoading] = useState(false);
    const [isBackupLoading, setIsBackupLoading] = useState(false);
    const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);
    const [selectedModel, setSelectedModel] = useState("staff");
    const [searchQuery, setSearchQuery] = useState("");
    const [currentPage, setCurrentPage] = useState(1);
    const [itemsPerPage] = useState(5);
    
    // Authorization and blur states
    const [canViewData, setCanViewData] = useState(true);
    const [canBackupRecover, setCanBackupRecover] = useState(true);
    const [unblurredRows, setUnblurredRows] = useState({});
    const [role, setRole] = useState(userData.role)

    // Backup and recovery functions
    const handleManualBackup = () => {
        if (!window.confirm("Backup all hospital data systems?")) return;
        setIsBackupLoading(true);
        setTimeout(() => {
            toast.success("Hospital data backup complete!", { position: "top-right" });
            setIsBackupLoading(false);
        }, 2000);
    };

    const handleAutomatedBackup = () => {
        const action = isAutoBackupEnabled ? "disable" : "enable";
        if (!window.confirm(`${action} automated nightly backups?`)) return;
        setIsAutoBackupEnabled(!isAutoBackupEnabled);
        toast.success(`Auto backup ${action}d`, { position: "top-right" });
    };

    const handleRecovery = (id, model) => {
        if (!window.confirm(`Recover this ${model} record?`)) return;
        setIsLoading(true);
        setTimeout(() => {
            toast.success(`${model} record recovered`, { position: "top-right" });
            setIsLoading(false);
        }, 1000);
    };

    const handleRecoverAll = () => {
        if (!window.confirm(`Recover ALL ${selectedModel} records?`)) return;
        setIsRecoverAllLoading(true);
        setTimeout(() => {
            toast.success(`All ${selectedModel} data recovered`, { position: "top-right" });
            setIsRecoverAllLoading(false);
        }, 2000);
    };

    // Blur functionality
    const toggleRowBlur = (rowId) => {
        setUnblurredRows(prev => ({
            ...prev,
            [rowId]: !prev[rowId]
        }));
    };

    const renderBlurredCell = (value, rowId) => (
        <span className={`transition-all duration-200 ${canViewData && unblurredRows[rowId] ? '' : 'filter blur-sm'}`}>
            {value}
        </span>
    );

    // Filter and pagination logic
    const filteredData = data[selectedModel].filter((item) =>
        Object.values(item).some((value) =>
            String(value).toLowerCase().includes(searchQuery.toLowerCase())
        )
    );

    const indexOfLastItem = currentPage * itemsPerPage;
    const indexOfFirstItem = indexOfLastItem - itemsPerPage;
    const currentItems = filteredData.slice(indexOfFirstItem, indexOfLastItem);

    const paginate = (pageNumber) => setCurrentPage(pageNumber);

    // Render table with blur functionality
    const renderTable = () => {
        if (!canViewData) {
            return (
                <div className="flex flex-col items-center justify-center p-8">
                    <div className="alert alert-warning max-w-md mb-4">
                        You don't have permission to view sensitive hospital data.
                    </div>
                    <div className="bg-white bg-opacity-90 rounded-lg p-8 filter blur-lg w-full">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Data</th>
                                    <th>Data</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {[1, 2, 3].map((i) => (
                                    <tr key={i}>
                                        <td className="blur-sm">########</td>
                                        <td className="blur-sm">########</td>
                                        <td className="blur-sm">########</td>
                                        <td>
                                            <button className="btn btn-sm btn-disabled blur-sm">
                                                ########
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            );
        }

        switch (selectedModel) {
            case "staff":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Employee ID</th>
                                    <th>Name</th>
                                    <th>Role</th>
                                    <th>Department</th>
                                    <th>License</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.employeeId}</td>
                                        <td>{renderBlurredCell(item.name, item._id)}</td>
                                        <td>{renderBlurredCell(item.role, item._id)}</td>
                                        <td>{renderBlurredCell(item.department, item._id)}</td>
                                        <td>{renderBlurredCell(item.licenseNumber, item._id)}</td>
                                        <td>
                                            <span className={`badge ${item.status === "Active" ? "badge-success" : "badge-error"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, "staff record")}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isLoading || !canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {role === 'Superadmin' && 
                                                <button
                                                onClick={() => toggleRowBlur(item._id)}
                                                className="btn btn-sm btn-info"
                                                >
                                                    {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                
            case "auditLogs":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Action</th>
                                    <th>Timestamp</th>
                                    <th>Staff ID</th>
                                    <th>Patient ID</th>
                                    <th>Status</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.action}</td>
                                        <td>{new Date(item.timestamp).toLocaleString()}</td>
                                        <td>{renderBlurredCell(item.user, item._id)}</td>
                                        <td>{renderBlurredCell(item.patientId, item._id)}</td>
                                        <td>
                                            <span className={`badge ${item.status === "Success" ? "badge-success" : "badge-error"}`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, "audit log")}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isLoading || !canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {role === 'Superadmin' && 
                                                <button
                                                onClick={() => toggleRowBlur(item._id)}
                                                className="btn btn-sm btn-info"
                                                >
                                                    {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                
            case "systemSettings":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Setting</th>
                                    <th>Value</th>
                                    <th>Description</th>
                                    <th>Last Modified</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.key}</td>
                                        <td>{renderBlurredCell(item.value, item._id)}</td>
                                        <td>{renderBlurredCell(item.description, item._id)}</td>
                                        <td>{new Date(item.lastModified).toLocaleString()}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, "system setting")}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isLoading || !canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {role === 'Superadmin' && 
                                                <button
                                                onClick={() => toggleRowBlur(item._id)}
                                                className="btn btn-sm btn-info"
                                                >
                                                    {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                
            case "legalCases":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Case #</th>
                                    <th>Title</th>
                                    <th>Status</th>
                                    <th>Patient ID</th>
                                    <th>Jurisdiction</th>
                                    <th>Incident Date</th>
                                    <th>Next Hearing</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.caseNumber}</td>
                                        <td>{renderBlurredCell(item.title, item._id)}</td>
                                        <td>
                                            <span className={`badge ${
                                                item.status === "Active" ? "badge-error" : 
                                                "badge-warning"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{renderBlurredCell(item.patientInvolved, item._id)}</td>
                                        <td>{renderBlurredCell(item.jurisdiction, item._id)}</td>
                                        <td>{new Date(item.incidentDate).toLocaleDateString()}</td>
                                        <td>{new Date(item.nextHearing).toLocaleDateString()}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, "legal case")}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isLoading || !canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {role === 'Superadmin' && 
                                                <button
                                                onClick={() => toggleRowBlur(item._id)}
                                                className="btn btn-sm btn-info"
                                                >
                                                    {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
                
            case "medicalDocuments":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Document ID</th>
                                    <th>Title</th>
                                    <th>Type</th>
                                    <th>Patient ID</th>
                                    <th>Status</th>
                                    <th>Retention</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.documentId}</td>
                                        <td>{renderBlurredCell(item.title, item._id)}</td>
                                        <td>{renderBlurredCell(item.type, item._id)}</td>
                                        <td>{renderBlurredCell(item.patientId, item._id)}</td>
                                        <td>
                                            <span className={`badge ${
                                                item.status === "Active" ? "badge-success" : 
                                                "badge-warning"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{renderBlurredCell(item.retentionPeriod, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, "medical document")}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isLoading || !canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {role === 'Superadmin' && 
                                                <button
                                                onClick={() => toggleRowBlur(item._id)}
                                                className="btn btn-sm btn-info"
                                                >
                                                    {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                </button>
                                                }
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                );
        
            case "equipment":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>Equipment ID</th>
                                    <th>Name</th>
                                    <th>Type</th>
                                    <th>Status</th>
                                    <th>Last Maintenance</th>
                                    <th>Next Maintenance</th>
                                    <th>Location</th>
                                    <th>Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item.equipmentId}</td>
                                        <td>{renderBlurredCell(item.name, item._id)}</td>
                                        <td>{renderBlurredCell(item.type, item._id)}</td>
                                        <td>
                                            <span className={`badge ${
                                                item.status === "Operational" ? "badge-success" : 
                                                "badge-error"
                                            }`}>
                                                {item.status}
                                            </span>
                                        </td>
                                        <td>{new Date(item.lastMaintenance).toLocaleDateString()}</td>
                                        <td>{new Date(item.nextMaintenance).toLocaleDateString()}</td>
                                        <td>{renderBlurredCell(item.location, item._id)}</td>
                                        <td>
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={() => handleRecovery(item._id, "equipment record")}
                                                    className="btn btn-sm btn-warning"
                                                    disabled={isLoading || !canBackupRecover}
                                                >
                                                    Recover
                                                </button>
                                                {role === 'Superadmin' && 
                                                <button
                                                onClick={() => toggleRowBlur(item._id)}
                                                className="btn btn-sm btn-info"
                                                >
                                                    {unblurredRows[item._id] ? 'Blur' : 'Show'}
                                                </button>
                                                }
                                            </div>
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
                <h1 className="text-2xl font-bold mb-4">Hospital Administration System</h1>
                
                {role === "Admin" ? (
                    <div className="alert alert-warning mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <span>You have limited access. Sensitive data is blurred by default.</span>
                    </div>
                ) : (
                    <div className="alert alert-info mb-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="stroke-current shrink-0 h-6 w-6" fill="none" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                        </svg>
                        <span>Click "Show" on each row to reveal details. Data is blurred by default.</span>
                    </div>
                )}
                
                <div className="flex gap-4 mb-4">
                    {!isBackupLoading ? (
                        <button 
                            onClick={handleManualBackup} 
                            className="btn btn-primary"
                            disabled={!canBackupRecover}
                        >
                            Backup Hospital Data
                        </button>
                    ) : (
                        <button className="btn btn-primary" disabled>
                            Backing Up...
                        </button>
                    )}

                    <button
                        onClick={handleAutomatedBackup}
                        className={`btn ${isAutoBackupEnabled ? "btn-success" : "btn-secondary"}`}
                        disabled={!canBackupRecover}
                    >
                        {isAutoBackupEnabled ? "Disable Auto Backup" : "Enable Auto Backup"}
                    </button>

                    <button
                        onClick={handleRecoverAll}
                        className="btn btn-warning"
                        disabled={isRecoverAllLoading || !canBackupRecover}
                    >
                        {isRecoverAllLoading ? "Recovering..." : "Recover All Data"}
                    </button>
                    
                </div>

                <div className="relative">
                    <select
                        value={selectedModel}
                        onChange={(e) => setSelectedModel(e.target.value)}
                        className="select select-bordered w-full max-w-xs mb-4"
                    >
                        <option value="staff">Medical Staff</option>
                        <option value="auditLogs">Access Logs</option>
                        <option value="systemSettings">Hospital Settings</option>
                        <option value="legalCases">Legal Cases</option>
                        <option value="medicalDocuments">Medical Records</option>
                        <option value="equipment">Medical Equipment</option>
                    </select>
                    
                    <input
                        type="text"
                        placeholder="Search hospital records..."
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

export default HospitalAdminData;