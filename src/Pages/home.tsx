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
import hero from "../hero/heroPH.png"
import Footer from "@/components/footer"

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
            <div className="container mx-auto p-6">
                {/* Hero Image */}
                <img src={hero} alt="logo" className="rounded-md w-full lg:w-11/12 mt-14 mx-auto shadow-lg" />
                <div className="text-center mt-10">
                    <p className="text-3xl font-bold font-mono text-gray-800">Our Greens 🌱</p>

                    {/* Search Form */}
                    <form onSubmit={handleSearch} className="flex gap-4 w-full md:w-1/2 lg:w-1/3 mx-auto mt-8">
                        <Input
                            type="search"
                            placeholder="Search"
                            onChange={handleChange}
                            value={searchBy}
                            className="flex-grow p-3 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500 shadow-sm"
                        />
                        <Button
                            type="submit"
                            className="p-3 flex items-center justify-center shadow-sm"
                        >
                            <Search className="w-5 h-5" />
                        </Button>
                    </form>

                    {data?.length === 0 && <p className="mt-10 font-mono text-lg text-gray-600">No Product Found!</p>}

                    {/* Product Cards Section */}
                    <section className="flex flex-col flex-wrap md:flex-row gap-8 justify-center max-w-6xl mx-auto mt-10 font-mono">
                        {data?.map((product) => (
                            <Card key={product.id} className="w-[330px] bg-white rounded-lg shadow-lg hover:shadow-xl transform hover:scale-105 transition-transform duration-300">
                                <CardHeader className="p-4">
                                    <img
                                        src={product.image}
                                        alt={product.name}
                                        className="w-full h-60 object-cover rounded-lg mb-3"
                                    />
                                    <CardTitle className="text-xl font-semibold text-center text-gray-800">{product.name}</CardTitle>
                                    <CardDescription className="h-14 text-gray-600 text-center">{product.description.slice(0, 100)}...</CardDescription>
                                </CardHeader>
                                <CardContent className="p-4">
                                    {/* Additional content can go here */}
                                </CardContent>
                                <CardFooter className="p-4 flex justify-between items-center">
                                    <Button
                                        variant="default"
                                        className="ounded-md"
                                    >
                                        <Link to={`/products/${product.id}`} className="text-white">Details</Link>
                                    </Button>
                                    <p className="text-lg font-semibold text-gray-800">{product.price} SR</p>
                                    {product.quantity ? (
                                        <Button
                                            variant="outline"
                                            onClick={() => handleAddToCart(product)}
                                            className=" rounded-md hover:bg-indigo-50"
                                        >
                                            <PlusIcon className="w-5 h-5" />
                                        </Button>
                                    ) : (
                                        <p className="text-xs text-red-600">Out of stock</p>
                                    )}
                                </CardFooter>
                            </Card>
                        ))}
                    </section>

                    {error && <p className="text-red-500 text-center mt-4">{error.message}</p>}
                </div>
                <Footer />
            </div>
            {/* <img src={hero} alt="logo" className=" rounded-md w-11/12 mt-14 mx-auto" />
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
            <Footer /> */}
        </div >
    )
}