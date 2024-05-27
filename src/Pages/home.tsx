import { GlobalContext } from "@/App"
import api from "@/api"
import { NavBar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { ProductWithStock } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { PlusIcon, Search } from "lucide-react"
import { ChangeEvent, FormEvent, useContext, useState } from "react"
import { Link, useSearchParams } from "react-router-dom"
import hero from "../hero/Green Photographic Environment Charity Bio-Link Website.png"

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

    const { data, error } = useQuery<ProductWithStock[]>({
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

        <div >
            < NavBar />
            <img src={hero} alt="logo" className=" rounded-md w-11/12 mt-14 mx-auto" />
            <div>
                <p className="text-2xl mt-10 font-mono">Our Greens 🌱</p>

                <form onSubmit={handleSearch} className="flex gap-4 w-full md:w-1/2 mx-auto mt-10">
                    <Input type="search" placeholder="Search" onChange={handleChange} value={searchBy} />
                    <Button type="submit"> <Search /> </Button>

                </form>
                {data?.length === 0 && <p className="mt-10 font-mono">No Product Found!</p>}

                <section className="flex flex-col flex-wrap md:flex-row gap-4 justify-between max-w-6xl mx-auto mt-10 font-mono">
                    {data?.map((product) => (
                        <Card key={product.id} className="w-[330px]">
                            <CardHeader>
                                <img src={product.image} alt={product.name} className=" w-80 h-80 object-fit rounded-lg mb-3" />
                                <CardTitle>{product.name}</CardTitle>
                                <CardDescription className="h-14">{product.description.slice(0, 100)}...</CardDescription>
                            </CardHeader>
                            <CardContent>
                            </CardContent>


                            <CardFooter className=" justify-between">
                                <Button variant="default">
                                    <Link to={`/products/${product.id}`}>Details</Link>
                                </Button>
                                <p>{product.price} SR</p>
                                {
                                    product.quantity ? (
                                        <Button variant="outline" onClick={() => handleAddToCart(product)}>
                                            <PlusIcon />
                                        </Button>)
                                        : <p className=" text-xs text-red-600">Out of stock</p>
                                }

                            </CardFooter>
                        </Card>
                    ))}
                </section>
                {error && <p className="text-red-500">{error.message}</p>}
            </div>
        </div >
    )
}