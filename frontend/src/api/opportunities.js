const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3000";

export class ApiError extends Error {
    constructor(message, status, data){
        super(message);
        this.status = status;
        this.data = data;
    }
}

async function request(path = "", options = {}){
    let res;
    try{
        res = await fetch(`${BASE_URL}/api/opportunities${path}`, {
            headers: {"Content-Type": "application/json"},
            ...options
        });
    } catch (error){
        throw new ApiError("Cannot reach the server. Check that the backend is running.", 0, []);
    }
    const json = await res.json().catch(() => null);
    if(!res.ok || !json){
        throw new ApiError(json?.message || "Something went wrong. Please try again.", res.status, json?.data || []);
    }
    return json;
}

export async function getAllOpportunities({status, search} = {}){
    const params = new URLSearchParams();
    if(status && status !== "All"){
        params.set("status", status);
    }
    if(search){
        params.set("search", search);
    }
    const query = params.toString();
    const json = await request(query ? `?${query}` : "");
    return json.data;
}

export async function getOpportunity(id){
    const json = await request(`/${id}`);
    return json.data;
}

export async function createOpportunity(body){
    return request("", {method: "POST", body: JSON.stringify(body)});
}

export async function updateOpportunity(id, body){
    return request(`/${id}`, {method: "PUT", body: JSON.stringify(body)});
}

export async function deleteOpportunity(id){
    return request(`/${id}`, {method: "DELETE"});
}
