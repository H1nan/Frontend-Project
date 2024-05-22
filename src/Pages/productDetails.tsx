import api from "@/api"
import { NavBar } from "@/components/navbar"
import { Product } from "@/types"
import { useQuery } from "@tanstack/react-query"
import { useParams } from "react-router-dom"

export function ProductDetails() {
    const params = useParams()

    const getProduct = async () => {
        try {
            const res = await api.get(`/products/${params.productId}`)
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    }

    // Queries
    const { data: product, error, isLoading } = useQuery<Product>({
        queryKey: ["product"],
        queryFn: getProduct
    })
    if (isLoading) {
        return <p>Loading...</p>
    }

    if (!product) {
        return <p>Product Not Fount</p>
    }

    return (
        <>
            <NavBar />
            <div>
                <img className="mx-auto mb-4" src={product.image} alt={product.name} />
                <h3>{product.name}</h3>
                <h3>{product.description}</h3>
            </div>
        </>
    )
}