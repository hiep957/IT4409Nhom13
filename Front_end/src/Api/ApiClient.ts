import { RegisterForm} from '../Pages/Register';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "";

const UserApi = {
validateToken : async () => {
        const response = await fetch(`${API_BASE_URL}/user/validate-token`, {
            credentials: "include",
        });
    
        if (!response.ok) {
            throw new Error("Token invalid");
        }
    
        return response.json();
},
register: async(formData: RegisterForm) => {
    const response = await fetch(`${API_BASE_URL}/user/register`, {
        method: "POST",
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),

    });
    const body = await response.json();
    if (!response.ok) {
        throw new Error(body.message);
    }
    return body;
},

}

export default  UserApi;
