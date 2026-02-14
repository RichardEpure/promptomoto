import Cookies from "js-cookie";

export interface AccessToken {
    access_token: string;
    token_type: string;
}

interface Payload {
    sub: string;
    exp: number;
}

export function setAccessToken(token: AccessToken) {
    const base64Url = token.access_token.split(".")[1];
    const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
    const payload: Payload = JSON.parse(atob(base64));
    Cookies.set("access_token", JSON.stringify(token), {
        expires: new Date(payload.exp * 1000),
        secure: process.env.NODE_ENV === "production",
        sameSite: "strict",
    });
}

export function getAccessToken(): AccessToken | null {
    const tokenString = Cookies.get("access_token");
    if (!tokenString) {
        return null;
    }
    try {
        const token: AccessToken = JSON.parse(tokenString);
        return token;
    } catch (error) {
        console.error("Failed to parse access token from cookies:", error);
        return null;
    }
}
