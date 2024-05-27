import { ProductWithoutId } from "@/types"
import api from "."

export default {
    getAll: async () => {
        try {
            const res = await api.get("/products")
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    },
    createOne: async (product: ProductWithoutId) => {
        try {
            const res = await api.post("/products", product)
            return res.data
        } catch (error) {
            return Promise.reject(new Error("Something went wrong"))
        }
    },
    deleteOne: async (id: string) => {
        try {
            const res = await api.delete(`/products/${id}`)
            return res.data
        } catch (error) {
            return Promise.reject(new Error("Something went wrong"))
        }
    }
}