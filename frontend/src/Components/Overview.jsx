import React, { useState, useEffect } from "react";
import { toast } from "react-toastify";
import { 
  FiDatabase, 
  FiServer, 
  FiClock, 
  FiAlertTriangle, 
  FiCheckCircle, 
  FiRefreshCw, 
  FiUser 
} from "react-icons/fi";
import axios from "axios";

const Overview = ({ userData }) => {
    const [stats, setStats] = useState({
        totalBackups: 0,
        lastBackup: null,
        storageUsed: "0TB",
        storageCapacity: "0TB",
        recoveryCount: 0,
        failedBackups: 0,
        failedRecoveries: 0,
        systems: []
    });
    
    const urlAPI = import.meta.env.VITE_API_URL;

    const [recentBackups, setRecentBackups] = useState([]);
    const [recoveryActivity, setRecoveryActivity] = useState([]);
    const [isLoading, setIsLoading] = useState(false);

    // Process backup data to extract success/failure counts
    const processBackupData = (backups) => {
        let successCount = 0;
        let failedCount = 0;
        let lastBackupDate = null;

        backups.forEach(backup => {
            if (backup.action === 'backup') {
                if (backup.details.errors === 0) {
                    successCount++;
                } else {
                    failedCount++;
                }
                const backupDate = new Date(backup.date);
                if (!lastBackupDate || backupDate > lastBackupDate) {
                    lastBackupDate = backupDate;
                }
            }
        });

        return {
            successCount,
            failedCount,
            lastBackupDate
        };
    };

    // Process recovery data to extract success/failure counts
    const processRecoveryData = (recoveries) => {
        let successCount = 0;
        let failedCount = 0;

        recoveries.forEach(recovery => {
            if (recovery.details.status === 'completed') {
                successCount++;
            } else if (recovery.details.status === 'failed') {
                failedCount++;
            }
        });

        return {
            successCount,
            failedCount
        };
    };

    // Fetch dashboard data from API
    const fetchDashboardData = async () => {
        setIsLoading(true);
        try {
            // Fetch all data in parallel
            const [backupStats, recentBackups, recoveries] = await Promise.all([
                axios.get(`${urlAPI}/api/dashboard/stats`),
                axios.get(`${urlAPI}/api/dashboard/backups/recent?limit=4`),
                axios.get(`${urlAPI}/api/dashboard/recoveries/recent?limit=4`)
            ]);

            // Process backup data
            const { successCount: backupSuccess, failedCount: backupFailed, lastBackupDate } = 
                processBackupData(recentBackups.data);
            
            // Process recovery data
            const { successCount: recoverySuccess, failedCount: recoveryFailed } = 
                processRecoveryData(recoveries.data);

            setStats({
                totalBackups: backupStats.data.totalBackups || backupSuccess,
                lastBackup: lastBackupDate || backupStats.data.lastBackup,
                storageUsed: backupStats.data.storageUsed || "0TB",
                storageCapacity: backupStats.data.storageCapacity || "0TB",
                recoveryCount: recoverySuccess,
                failedBackups: backupFailed,
                failedRecoveries: recoveryFailed,
                systems: backupStats.data.systems || []
            });

            setRecentBackups(recentBackups.data);
            setRecoveryActivity(recoveries.data);

        } catch (error) {
            toast.error("Failed to load dashboard data");
            console.error("Dashboard data error:", error);
        } finally {
            setIsLoading(false);
        }
    };

    // Initial data load
    useEffect(() => {
        fetchDashboardData();
    }, []);

    // Refresh dashboard data
    const refreshData = async () => {
        setIsLoading(true);
        try {
            await fetchDashboardData();
            toast.success("Dashboard data refreshed");
        } catch (error) {
            toast.error("Refresh failed");
        }
    };

    // Get current time of day for greeting
    const getGreeting = () => {
        const hour = new Date().getHours();
        if (hour < 12) return "Good morning";
        if (hour < 18) return "Good afternoon";
        return "Good evening";
    };

    // Status badge component
    const StatusBadge = ({ status }) => {
        const statusConfig = {
            completed: { color: "bg-green-500", text: "Success" },
            failed: { color: "bg-red-500", text: "Failed" },
            success: { color: "bg-green-500", text: "Success" },
            warning: { color: "bg-yellow-500", text: "Warning" },
            error: { color: "bg-red-500", text: "Error" }
        };

        return (
            <span className={`px-2 py-1 rounded-full text-xs text-white ${statusConfig[status]?.color || 'bg-gray-500'}`}>
                {statusConfig[status]?.text || status}
            </span>
        );
    };

    // Format backup details for display
    const formatBackupDetails = (backup) => {
        if (backup.action === 'backup-summary') {
            return `${backup.details.totalRecords} records processed`;
        }
        return `${backup.details.totalRecords} records (${backup.details.saved} saved, ${backup.details.skipped} skipped)`;
    };

    // Format recovery details for display
    const formatRecoveryDetails = (recovery) => {
        if (recovery.details.status === 'completed') {
            return `Recovered ${recovery.details.recordId || recovery.entity}`;
        }
        return `Failed to recover ${recovery.entity}: ${recovery.details.error || 'Unknown error'}`;
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
                <div className="grid grid-cols-1 xs:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 mb-6 sm:mb-8">
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
                                    {stats.lastBackup ? new Date(stats.lastBackup).toLocaleDateString(undefined, { month: 'short', day: 'numeric' }) : 'N/A'}
                                </p>
                                <p className="text-xs text-gray-500 mt-1">
                                    {stats.lastBackup ? new Date(stats.lastBackup).toLocaleTimeString(undefined, { hour: '2-digit', minute: '2-digit' }) : ''}
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
                                    <span className="text-gray-500">{stats.failedRecoveries} failed</span>
                                </p>
                            </div>
                            <div className="p-2 sm:p-3 bg-yellow-100 rounded-lg">
                                <FiCheckCircle className="text-yellow-600 text-lg sm:text-xl" />
                            </div>
                        </div>
                    </div>

                    {/* Failed Backups Card */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="text-xs sm:text-sm font-medium text-gray-500">Failed Backups</p>
                                <p className="text-2xl sm:text-3xl font-bold mt-1">{stats.failedBackups}</p>
                            </div>
                            <div className="p-2 sm:p-3 bg-red-100 rounded-lg">
                                <FiAlertTriangle className="text-red-600 text-lg sm:text-xl" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Recent Activity */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
                    {/* Recent Backups */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recent Backups</h2>
                        {recentBackups.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {recentBackups.map((backup) => (
                                    <div key={backup._id} className="flex items-start pb-3 sm:pb-4 border-b border-gray-100 last:border-0">
                                        <div className={`p-1 sm:p-2 rounded-lg mr-2 sm:mr-4 ${
                                            backup.details.errors === 0 ? "bg-green-100" : "bg-red-100"
                                        }`}>
                                            <FiDatabase className={
                                                backup.details.errors === 0 ? "text-green-600" : "text-red-600"
                                            } size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">
                                                    {backup.entity} {backup.action === 'backup-summary' ? '(Summary)' : ''}
                                                </h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {new Date(backup.date).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                {formatBackupDetails(backup)} • {new Date(backup.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 py-4">No recent backups found</p>
                        )}
                    </div>

                    {/* Recovery Activity */}
                    <div className="bg-white p-4 sm:p-6 rounded-xl shadow-sm border border-gray-100">
                        <h2 className="text-lg sm:text-xl font-semibold text-gray-800 mb-3 sm:mb-4">Recovery Activity</h2>
                        {recoveryActivity.length > 0 ? (
                            <div className="space-y-3 sm:space-y-4">
                                {recoveryActivity.map((recovery) => (
                                    <div key={recovery._id} className="flex items-start pb-3 sm:pb-4 border-b border-gray-100 last:border-0">
                                        <div className={`p-1 sm:p-2 rounded-lg mr-2 sm:mr-4 ${
                                            recovery.details.status === 'completed' ? "bg-green-100" : "bg-red-100"
                                        }`}>
                                            <FiCheckCircle className={
                                                recovery.details.status === 'completed' ? "text-green-600" : "text-red-600"
                                            } size={16} />
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <div className="flex justify-between">
                                                <h3 className="text-sm sm:text-base font-medium text-gray-900 truncate">{recovery.entity}</h3>
                                                <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                                                    {new Date(recovery.date).toLocaleDateString([], {month: 'short', day: 'numeric'})}
                                                </span>
                                            </div>
                                            <p className="text-xs sm:text-sm text-gray-500 truncate">
                                                {formatRecoveryDetails(recovery)} • {new Date(recovery.date).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-sm text-gray-500 py-4">No recovery activity found</p>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Overview;