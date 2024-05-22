import { GlobalContext } from "@/App"
import api from "@/api"
import { NavBar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Product } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PlusIcon, Search } from "lucide-react"
import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"

export function Home() {
    const context = useContext(GlobalContext)
    if (!context) throw Error("Context is missing")
    const { handleAddToCart } = context

    const getProducts = async () => {
        try {
            const res = await api.get(`/products?searchBy=${searchBy}`)
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    }
    // Queries
    const { data, error } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: getProducts
    })

    const [searchParams, setSearchParams] = useSearchParams()

    const defaultSearch = searchParams.get("searchBy") || ""

    const [searchBy, setSearchBy] = useState(defaultSearch)
    const queryClient = useQueryClient()

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value } = e.target
        setSearchBy(value)
        queryClient.invalidateQueries({ queryKey: ["products"] })
    }

    const handleSearch = (e: FormEvent) => {
        e.preventDefault()
        queryClient.invalidateQueries({ queryKey: ["products"] })
        setSearchParams({
            ...searchParams,
            searchBy: searchBy
        })
    }

    return (
        <div>
            <NavBar />
            <div>

                <form onSubmit={handleSearch} className="flex gap-4 w-full md:w-1/2 mx-auto mb-10">
                    <Input type="search" placeholder="Search" onChange={handleChange} value={searchBy} />
                    <Button type="submit"> <Search /> </Button>
                </form>

                {data?.length === 0 && <p className=" mt-20 font-medium">No Product Found!</p>}
                <section className="flex flex-col flex-wrap md:flex-row gap-4 justify-between max-w-6xl mx-auto">
                    {data?.map((product) => (
                        <Card key={product.id} className="w-[350px]">
                            <CardHeader>
                                <img src={product.image} alt={product.name} />
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription>{product.description}</CardDescription>
                            </CardHeader>
                            <CardContent>
                                <p>Card Content Here</p>
                            </CardContent>
                            <CardFooter className=" justify-between">
                                <Button variant="default">
                                    <Link to={`/products/${product.id}`}>Details</Link>
                                </Button>
                                <Button variant="outline" onClick={() => handleAddToCart(product)}>
                                    <PlusIcon /></Button>
                            </CardFooter>
                        </Card>
                    ))}
                </section>
                {error && <p className="text-red-500">{error.message}</p>}
            </div>
        </div>
    )
}