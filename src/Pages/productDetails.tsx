
import { Button } from "@/components/ui/button"
import { ProductWithStock } from "@/types"
import { useQuery } from "@tanstack/react-query"
import Footer from "@/components/footer"
import { NavBar } from "@/components/navbar"
import { useParams } from "react-router-dom"
import api from "@/api"
import { CloudSun, Droplet } from "lucide-react"
import { useContext } from "react"
import { GlobalContext } from "@/App"



export function ProductDetails() {
    const context = useContext(GlobalContext)
    if (!context) throw Error("Context is missing")
    const { handleAddToCart } = context
    const params = useParams()

    const getProducts = async () => {
        try {
            const res = await api.get(`/products`)
            if (res.data) {
                const products = res.data as ProductWithStock[]
                return products.find(product => product.id === params.productId)
            }
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    }

    const { data: product, error: proError, isLoading } = useQuery<ProductWithStock>({
        queryKey: ["product"],
        queryFn: getProducts
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
            <section className=" mt-14 grid md:grid-cols-2 gap-8 lg:gap-16 items-start max-w-6xl px-6 mx-auto py-14 md:py-18 lg:py-26 font-mono bg-gradient-to-r rounded-lg shadow-lg">
                <div key={product.id} className="flex-col items-start gap-6">
                    <img
                        alt={product?.name}
                        className="aspect-square object-cover border-4 border-gray-200 w-4/5 rounded-lg overflow-hidden dark:border-gray-800 transition-transform duration-300 ease-in-out hover:scale-105 items-center"
                        height={500}
                        src={product?.image}
                        width={500}
                    />
                </div>
                <div className="grid gap-8 md:gap-12">
                    <div className="space-y-3">
                        <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-gray-900 dark:text-white tracking-wider">{product.name}</h1>
                        <p className="text-left text-gray-700 dark:text-gray-300 text-lg md:text-xl leading-relaxed">
                            {product.description}
                        </p>
                    </div>
                    <div className="grid gap-6">
                        <div>
                            <h2 className="text-xl font-semibold text-gray-800 dark:text-white">Features</h2>
                            <ul className="mt-3 space-y-2 text-gray-600 dark:text-gray-400">
                                <li className="flex items-center">
                                    <Droplet color="#3a88fe" className="mr-2 h-6 w-6 text-primary" />
                                    <span>{product.color}</span>
                                </li>
                                {/* <li className="flex items-center">
                                    <CloudSun className="mr-2 h-6 w-6 text-primary" />
                                    <span>{product.size}</span>
                                </li> */}
                            </ul>
                        </div>
                        <div className="flex justify-center gap-6 items-center mt-6">
                            <p className="text-2xl text-gray-800 dark:text-white">{product.price} SR</p>
                            <Button onClick={() => handleAddToCart(product)} size="lg" className=" text-white transition duration-300 ease-in-out transform hover:scale-105 shadow-lg">
                                Add to cart
                            </Button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer />

            {/* <NavBar />
            <section className="grid md:grid-cols-2 gap-6 lg:gap-12 items-start max-w-6xl px-4 mx-auto py-12 md:py-16 lg:py-24 font-mono">

                <div key={product.id} className=" flex-col items-start gap-6">
                    <img
                        alt={product?.name}
                        className="aspect-square object-cover border border-gray-200 w-full rounded-lg overflow-hidden dark:border-gray-800"
                        height={500}
                        src={product?.image}
                        width={500}
                    />
                </div>

                <div className="grid gap-6 md:gap-10">
                    <div className="space-y-2">
                        <h1 className="text-xl sm:text-2xl md:text-3xl">{product.name}</h1>
                        <p className="text-left text-gray-500 dark:text-gray-400 text-lg md:text-xl">
                            {product.description}</p>
                    </div>

                    <div className="grid gap-4">

                        <div>
                            <h2 className="text-xl font-semibold">Features</h2>
                            <ul className="mt-2 space-y-2 text-gray-500 dark:text-gray-400">
                                <li className="w-28 mx-auto flex justify-between">

                                    <Droplet color="#3a88fe" className="mr-2 inline-block h-6 w-6 text-primary" />
                                    <span className="w-full text-left"> {product.color}</span>
                                </li>
                                <li className="w-28 mx-auto flex justify-between">
                                    <CheckIcon className="mr-2 inline-block h-5 w-5 text-primary" />
                                    <span className="w-full text-left"> {product.size}</span>
                                </li>
                            </ul>
                        </div>

                        <div className="flex justify-center gap-5  items-center mt-5">
                            <p className="text-2xl">{product.price} SR</p>
                            <Button onClick={() => handleAddToCart(product)} size="lg">Add to cart</Button>
                        </div>
                    </div>
                </div>
            </section>
            <Footer /> */}
        </>
    )
}