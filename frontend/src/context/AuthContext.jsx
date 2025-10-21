import React, { createContext, useEffect, useMemo, useState } from "react";

const TOKEN_KEY = "token";
const ADMIN_KEY = "isAdmin";

const AuthContext = createContext({ token: null, login: () => {}, logout: () => {} });

export { AuthContext };

export function AuthProvider({ children }) {
	const [token, setToken] = useState(() => {
		try {
			return localStorage.getItem(TOKEN_KEY);
		} catch {
			return null;
		}
	});
	const [isAdmin, setIsAdmin] = useState(() => {
		try {
			return localStorage.getItem(ADMIN_KEY) === "true";
		} catch {
			return false;
		}
	});

	useEffect(() => {
		try {
			if (token) {
				localStorage.setItem(TOKEN_KEY, token);
			} else {
				localStorage.removeItem(TOKEN_KEY);
			}
		} catch {
			// ignore storage errors
		}
	}, [token]);

	useEffect(() => {
		try {
			if (isAdmin) {
				localStorage.setItem(ADMIN_KEY, "true");
			} else {
				localStorage.removeItem(ADMIN_KEY);
			}
		} catch {
			// ignore storage errors
		}
	}, [isAdmin]);

	const login = (newToken, options = {}) => {
		setToken(newToken);
		if (typeof options.isAdmin === "boolean") {
			setIsAdmin(options.isAdmin);
		}
	};

	const logout = () => {
		setToken(null);
		setIsAdmin(false);
	};

	const value = useMemo(() => ({ token, isAdmin, login, logout }), [token, isAdmin]);

	return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}


