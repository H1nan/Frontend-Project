import api from "."

export default {
    getAll: async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await api.get("/users", {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    }

}