import api from "."

export default {
    getAll: async () => {
        try {
            const res = await api.get("/categorys")
            return res.data
        }
        catch (error) {
            return Promise.reject(new Error("Spmething went wrong"))
        }
    }
}