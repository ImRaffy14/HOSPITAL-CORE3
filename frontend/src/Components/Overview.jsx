import React, { useState } from "react";
import { toast } from "react-toastify";
import { FiDatabase, FiServer, FiClock, FiAlertTriangle, FiCheckCircle, FiRefreshCw, FiUser } from "react-icons/fi";

const Overview = ({ userData }) => {
    // Sample data - replace with real API calls
    const [stats, setStats] = useState({
        totalBackups: 1243,
        lastBackup: "2023-11-15T14:30:00Z",
        storageUsed: "1.2TB",
        storageCapacity: "5TB",
        recoveryCount: 42,
        failedBackups: 3,
        systems: [
            { name: "Hospital Admin", status: "healthy", lastBackup: "2023-11-15T14:30:00Z" },
            { name: "Core Systems", status: "healthy", lastBackup: "2023-11-15T13:45:00Z" },
            { name: "HR Data", status: "warning", lastBackup: "2023-11-14T22:15:00Z" },
            { name: "Logistics", status: "error", lastBackup: "2023-11-12T08:30:00Z" }
        ]
    });

    const [isLoading, setIsLoading] = useState(false);
    
    // Refresh dashboard data
    const refreshData = () => {
        setIsLoading(true);
        // Simulate API call
        setTimeout(() => {
            toast.success("Dashboard data refreshed");
            setIsLoading(false);
        }, 1000);
    };

    // Get current time of day for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    return (
        <div className="p-4 sm:p-6 bg-gray-50 min-h-screen">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 sm:mb-8 gap-4">
                    <div>
                        <h1 className="text-2xl sm:text-3xl font-bold text-gray-800">Backup & Recovery Dashboard</h1>
                        <p className="text-sm sm:text-base text-gray-600">Overview of your backup systems and status</p>
                    </div>
                    <div className="w-full sm:w-auto flex space-x-2 sm:space-x-3">
                        <button
                            onClick={refreshData}
                            className="flex items-center px-3 py-1 sm:px-4 sm:py-2 bg-white border border-gray-300 rounded-lg shadow-sm hover:bg-gray-50 text-sm sm:text-base"
                            disabled={isLoading}
                        >
                            <FiRefreshCw className={`mr-1 sm:mr-2 ${isLoading ? "animate-spin" : ""}`} />
                            {isLoading ? "Refreshing..." : "Refresh"}
                        </button>
                    </div>
                </div>

                {/* User Greeting Card */}
                <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100 mb-6 sm:mb-8">
                    <div className="flex items-center justify-between">
                        <div>
                            <p className="text-xl sm:text-2xl font-bold text-gray-800">
                                {getGreeting()}, {userData.fullname}
                            </p>
                            <p className="text-sm sm:text-base text-gray-600 mt-1">
                                {userData.role}
                            </p>
                        </div>
                        <div className="p-2 sm:p-3 bg-indigo-100 rounded-lg">
                            <FiUser className="text-indigo-600 text-lg sm:text-xl" />
                        </div>
                    </div>
                </div>

                {/* Stats Cards */}
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-6 mb-6 sm:mb-8">
                    {/* Total Backups Card */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Total Backups</p>
                                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.totalBackups.toLocaleString()}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-blue-100 rounded-lg">
                                <FiDatabase className="text-blue-600 text-lg sm:text-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Last Backup Card */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Last Backup</p>
                                <p className="text-xl sm:text-2xl font-bold mt-1">
                                    {new Date(stats.lastBackup).toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {new Date(stats.lastBackup).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' })}
                                </p>
                            </div>
                            <div className="p-2 sm:p-3 bg-green-100 rounded-lg">
                                <FiClock className="text-green-600 text-lg sm:text-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Recoveries Card */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Recoveries</p>
                                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.recoveryCount}</p>
                                <p className="text-xs mt-1 flex items-center">
                                    <FiAlertTriangle className="text-yellow-500 mr-1" />
                                    <span className="text-gray-500">{stats.failedBackups} failed</span>
                                </p>
                            </div>
                            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                                <FiCheckCircle className="text-yellow-600 text-lg sm:text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recent Backups</h2>
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { id: 1, system: "Hospital Admin", type: "Full", time: "2023-11-15T14:30:00Z", status: "success" },
                                { id: 2, system: "Core Systems", type: "Incremental", time: "2023-11-15T13:45:00Z", status: "success" },
                                { id: 3, system: "HR Data", type: "Full", time: "2023-11-14T22:15:00Z", status: "warning" },
                                { id: 4, system: "Logistics", type: "Incremental", time: "2023-11-12T08:30:00Z", status: "error" }
                            ].map((item) => (
                                <div key={item.id} className="flex items-start pb-3 sm:pb-4 border-b border-gray-100 last:border-0">
                                    <div className={`p-1 sm:p-2 rounded-lg mr-2 sm:mr-4 ${
                                        item.status === "success" ? "bg-green-100" :
                                        item.status === "warning" ? "bg-yellow-100" : "bg-red-100"
                                    }`}>
                                        <FiDatabase className={
                                            item.status === "success" ? "text-green-600" :
                                            item.status === "warning" ? "text-yellow-600" : "text-red-600"
                                        } size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{item.system}</h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                {new Date(item.time).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                                            {item.type} backup • {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recovery Activity</h2>
                        <div className="space-y-3 sm:space-y-4">
                            {[
                                { id: 1, system: "HR Data", item: "Employee #4521", time: "2023-11-14T09:15:00Z", status: "success" },
                                { id: 2, system: "Logistics", item: "Shipment #SH67890", time: "2023-11-12T16:30:00Z", status: "success" },
                                { id: 3, system: "Core Systems", item: "Server Metrics", time: "2023-11-10T11:45:00Z", status: "success" },
                                { id: 4, system: "Hospital Admin", item: "Patient #PT-5001", time: "2023-11-08T14:20:00Z", status: "success" }
                            ].map((item) => (
                                <div key={item.id} className="flex items-start pb-3 sm:pb-4 border-b border-gray-100 last:border-0">
                                    <div className="p-1 sm:p-2 rounded-lg mr-2 sm:mr-4 bg-blue-100">
                                        <FiCheckCircle className="text-blue-600" size={16} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex justify-between">
                                            <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{item.system}</h3>
                                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                {new Date(item.time).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                            </span>
                                        </div>
                                        <p className="text-xs sm:text-sm text-gray-500 truncate">
                                            Recovered {item.item} • {new Date(item.time).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                        </p>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;