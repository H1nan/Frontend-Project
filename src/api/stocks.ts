import { CreateStock } from "@/types"
import api from "."

export default {
    getAll: async () => {
        try {
            const res = await api.get("/stocks")
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    },
    createOne: async (stock: CreateStock) => {
        try {
            console.log(stock)
            const token = localStorage.getItem("token")
            const res = await api.post("/stocks", stock, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            return Promise.reject(new Error("Something went wrong"))
        }
    },
    deleteOne: async (id: string) => {
        try {
            const token = localStorage.getItem("token")
            const res = await api.delete(`/stocks/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            return res.data
        } catch (error) {
            return Promise.reject(new Error("Something went wrong"))
        }
    }
}