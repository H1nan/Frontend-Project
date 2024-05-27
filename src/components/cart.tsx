import { useContext } from "react";
import { Button } from "./ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "./ui/popover";
import { GlobalContext } from "@/App";
import { ShoppingCartIcon } from "lucide-react";
import { ProductWithStock } from "@/types";
import api from "@/api";

type OrderItem = {
    quantity: number,
    productId: string,
}
type OrderCheckout = {
    color: string,
    size: string,
    items: OrderItem[]
}
export function Cart() {
    const context = useContext(GlobalContext)
    if (!context) throw Error("Context is missing")

    const { state, handleDelCart, handleAddToCart, handleAfterCheckout } = context

    const groups = state.cart.reduce((acc, obj) => {
        const key = obj.id
        const curGroup = acc[key] ?? []
        return {
            ...acc,
            [key]: [
                ...curGroup,
                obj
            ]
        }
    }, {} as { [key: string]: ProductWithStock[] })

    const total = state.cart.reduce((acc, curr) => {
        return acc + curr.price
    }, 0)

    const checkoutOrder: OrderCheckout = []

    Object.keys(groups).forEach(key => {
        const products = groups[key]
        const product = products[0]


        checkoutOrder.push({
            color: product.color,
            size: product.size,
            quantity: products.length,
            productId: key
        })
    })

    const handleCheckout = async () => {
        try {
            const token = localStorage.getItem("token")
            const res = await api.post("/orders/checkout", checkoutOrder, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            })
            if (res.status === 201) {
                handleAfterCheckout()
            }
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    }

    return (
        <Popover>
            <PopoverTrigger asChild>
                <Button variant="ghost" className=" gap-2 flex font-mono"> <ShoppingCartIcon /> {(state.cart.length)}</Button>
            </PopoverTrigger>
            <PopoverContent style={{ width: '500px' }}>
                <div >
                    {state.cart.length === 0 && <p className="font-mono">No Items</p>}
                    {Object.keys(groups).map((key) => {
                        const products = groups[key]
                        const product = products[0]

                        return (
                            <>
                                <div className="mb-4 flex gap-3 items-center font-mono" key={product.id}>
                                    <img src={product.image} alt={product.name} className="w-12 h-12 object-contain" />
                                    <h4 className="flex-auto ">{product.name}</h4>

                                    <span>({product.price}SR)</span>
                                    <Button className="w-1 h-6" variant="secondary" onClick={() => handleDelCart(product.id)}>-</Button>
                                    <h4>{products.length}</h4>
                                    <Button className="w-1 h-6" variant="secondary" onClick={() => handleAddToCart(product)}>+</Button>

                                </div>
                            </>
                        )
                    })}
                </div>
                <div className="flex justify-between items-center font-mono">
                    <span className=" font-bold">Total amount= {total} SR</span>
                    <Button onClick={handleCheckout}>Checkout</Button>
                </div>
            </PopoverContent>
        </Popover>
    )
}