const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const UserApi = {
validateToken : async () => {
        const response = await fetch(`${API_BASE_URL}/api/auth/validate-token`, {
            credentials: "include",
        });
    
        if (!response.ok) {
            throw new Error("Token invalid");
        }
    
        return response.json();
},
register: async() => {
    cons
}
}

export default  UserApi;
