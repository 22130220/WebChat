import { useEffect, useState } from "react";
import { useEvent } from "../../hooks/useEvent";
import wSocket from "../../utils/wSocket";

function CheckConnection() {
    const rs = wSocket.readyState();
    const [connecting, setConnecting] = useState(rs === WebSocket.CONNECTING);
    const [_, setConnected] = useState(rs === WebSocket.OPEN);

    useEffect(() => {
        const currentState = wSocket.readyState();
        setConnecting(currentState === WebSocket.CONNECTING);
        setConnected(currentState === WebSocket.OPEN);
    }, []);

    function checkConnection() {
        useEvent("wsOpen", () => {
            setConnecting(false);
            setConnected(true);
        });

        useEvent("wsClose", () => {
            setConnecting(false);
            setConnected(false);
        });

        useEvent("wsError", () => {
            setConnecting(false);
            setConnected(false);
        });
    }

    checkConnection();

    return connecting && (<div className="fixed inset-0 bg-white/70 bg-opacity-80 flex items-center justify-center z-50">
        <div className="flex gap-2">
            <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
            <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
            <div className="w-5 h-5 rounded-full animate-pulse bg-blue-600"></div>
        </div>
    </div>);
}
export default CheckConnection;