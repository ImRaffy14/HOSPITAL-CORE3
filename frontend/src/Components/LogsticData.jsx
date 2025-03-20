import React, { useState } from "react";
import { toast } from "react-toastify";

function LogsticData() {
    // Dummy data for logistics systems
    const dummyData = {
        shipments: [
            { _id: 1, shipmentId: "SH12345", origin: "New York", destination: "Los Angeles", status: "In Transit" },
            { _id: 2, shipmentId: "SH67890", origin: "Chicago", destination: "Miami", status: "Delivered" },
            { _id: 3, shipmentId: "SH54321", origin: "Houston", destination: "Seattle", status: "Pending" },
        ],
        inventory: [
            { _id: 1, productId: "P1001", productName: "Laptop", quantity: 50, location: "Warehouse A" },
            { _id: 2, productId: "P1002", productName: "Smartphone", quantity: 100, location: "Warehouse B" },
            { _id: 3, productId: "P1003", productName: "Tablet", quantity: 75, location: "Warehouse C" },
        ],
        suppliers: [
            { _id: 1, supplierId: "S1001", name: "Tech Supplies Inc.", contact: "contact@techsupplies.com" },
            { _id: 2, supplierId: "S1002", name: "Gadget World", contact: "info@gadgetworld.com" },
            { _id: 3, supplierId: "S1003", name: "ElectroMart", contact: "support@electromart.com" },
        ],
        deliveries: [
            { _id: 1, deliveryId: "DL12345", shipmentId: "SH12345", scheduledDate: "2023-10-05", status: "Scheduled" },
            { _id: 2, deliveryId: "DL67890", shipmentId: "SH67890", scheduledDate: "2023-10-10", status: "Completed" },
            { _id: 3, deliveryId: "DL54321", shipmentId: "SH54321", scheduledDate: "2023-10-15", status: "Pending" },
        ],
    };

    const [data, setData] = useState(dummyData);
    const [isLoading, setIsLoading] = useState(false);
    const [isRecoverAllLoading, setIsRecoverAllLoading] = useState(false);
    const [isBackupLoading, setIsBackupLoading] = useState(false);
    const [isAutoBackupEnabled, setIsAutoBackupEnabled] = useState(false);
    const [selectedModel, setSelectedModel] = useState("shipments");
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
            case "shipments":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Shipment ID</th>
                                    <th>Origin</th>
                                    <th>Destination</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.shipmentId}</td>
                                        <td>{item.origin}</td>
                                        <td>{item.destination}</td>
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
            case "inventory":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Product ID</th>
                                    <th>Product Name</th>
                                    <th>Quantity</th>
                                    <th>Location</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.productId}</td>
                                        <td>{item.productName}</td>
                                        <td>{item.quantity}</td>
                                        <td>{item.location}</td>
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
            case "suppliers":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Supplier ID</th>
                                    <th>Name</th>
                                    <th>Contact</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.supplierId}</td>
                                        <td>{item.name}</td>
                                        <td>{item.contact}</td>
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
            case "deliveries":
                return (
                    <div className="overflow-x-auto">
                        <table className="table w-full">
                            <thead>
                                <tr>
                                    <th>ID</th>
                                    <th>Delivery ID</th>
                                    <th>Shipment ID</th>
                                    <th>Scheduled Date</th>
                                    <th>Status</th>
                                    <th>Action</th>
                                </tr>
                            </thead>
                            <tbody>
                                {currentItems.map((item) => (
                                    <tr key={item._id}>
                                        <td>{item._id}</td>
                                        <td>{item.deliveryId}</td>
                                        <td>{item.shipmentId}</td>
                                        <td>{item.scheduledDate}</td>
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
                <h1 className="text-2xl font-bold mb-4">Logistics Data Management</h1>
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
                    <option value="shipments">Shipments</option>
                    <option value="inventory">Inventory</option>
                    <option value="suppliers">Suppliers</option>
                    <option value="deliveries">Deliveries</option>
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

export default LogsticData;