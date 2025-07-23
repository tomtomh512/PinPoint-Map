import { useEffect } from "react";
import httpClient from "../httpClient";
import { getToken, removeToken } from "../utils/tokenUtils";

export function useVerifyToken(setUser) {
    useEffect(() => {
        const verifyToken = async () => {
            const token = getToken();
            if (!token) {
                setUser({ id: null, username: null });
                return;
            }
            try {
                const response = await httpClient.get(
                    `${process.env.REACT_APP_SERVER_API_URL}/auth/verify-token/${token}`
                );
                setUser({ id: response.data.id, username: response.data.username });
            } catch {
                removeToken();
                setUser({ id: null, username: null });
            }
        };
        verifyToken();
    }, [setUser]);
}
