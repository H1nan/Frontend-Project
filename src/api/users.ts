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

    // createOne: async (product: Product) => {
    //     try {
    //         const res = await api.post("/products", product)
    //         return res.data
    //     } catch (error) {
    //         return Promise.reject(new Error("Something went wrong"))
    //     }
    // },
    // deleteOne: async (id: string) => {
    //     try {
    //         const res = await api.delete(`/products/${id}`)
    //         return res.data
    //     } catch (error) {
    //         return Promise.reject(new Error("Something went wrong"))
    //     }
    // }
}