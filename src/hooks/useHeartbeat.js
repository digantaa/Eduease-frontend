import { useEffect, useRef } from "react";
import axios from "axios";

const useHeartbeat = (interval = 30000, onLogout) => {
    const intervalRef = useRef(null);

    useEffect(() => {
        const sendHeartbeat = async () => {
            try {
                await axios.post(
                    `https://localhost:7013/api/Session/Heartbeat?Id=${localStorage.getItem(
                        "userid"
                    )}`
                );
                console.log("✅ Heartbeat sent successfully");
            } catch (error) {
                console.error(
                    "❌ Heartbeat error:",
                    error.response?.data?.message || error.message
                );
                if (error.response?.status === 401) {
                    console.warn("🔴 User session expired, logging out...");
                    onLogout();
                }
            }
        };

        intervalRef.current = setInterval(sendHeartbeat, interval);

        return () => {
            clearInterval(intervalRef.current);
        };
    }, [interval, onLogout]);

    return null;
};

export default useHeartbeat;
