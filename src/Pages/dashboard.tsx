import { NavBar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Category, CreateStock, ProductWithStock, ProductWithoutId, Stock, User } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChangeEvent, FormEvent, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import CategoryService from "../api/category"
import ProductService from '../api/products'
import StockService from '../api/stocks'

import UserService from '../api/users'
import { EditDialog } from "@/components/editDialog"; "@/components/editStock";




export function Dashboard() {
    const queryClient = useQueryClient()

    const [product, setProduct] = useState<ProductWithoutId>({
        categoryId: "",
        image: "",
        name: "",
        description: "",
    })

    const [stock, setStock] = useState<CreateStock>({
        productId: "",
        stockQuantity: 0,
        price: 0,
        color: "",
        size: ""
    })

    const [user, setUser] = useState({
        id: "",
        fullName: "",
        email: "",
        password: "",
        countryCode: "",
        phone: "",
        role: ""
    })


    const { data: products, error } = useQuery<ProductWithStock[]>({
        queryKey: ["products"],
        queryFn: ProductService.getAll
    })

    const { data: categories, error: catError } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: CategoryService.getAll
    })

    const { data: stocks, error: stockError } = useQuery<Stock[]>({
        queryKey: ["stocks"],
        queryFn: StockService.getAll
    })

    const { data: users, error: userError } = useQuery<User[]>({
        queryKey: ["users"],
        queryFn: UserService.getAll
    })

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setProduct({
            ...product,
            [name]: value
        })
    }
    const handleChangeStock = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value, valueAsNumber } = e.target
        if (name === 'stockQuantity' || name === 'price') {
            setStock({
                ...stock,
                [name]: valueAsNumber
            })
            return
        }
        setStock({
            ...stock,
            [name]: value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        await ProductService.createOne(product)

        queryClient.invalidateQueries({ queryKey: ["products"] })
    }

    const handleSubmitStock = async (e: FormEvent) => {
        e.preventDefault()
        await StockService.createOne(stock)

        queryClient.invalidateQueries({ queryKey: ["products"] })
    }

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setProduct({
            ...product,
            categoryId: e.target.value
        })
    }

    const handleSelectProduct = (e: ChangeEvent<HTMLSelectElement>) => {
        setStock({
            ...stock,
            productId: e.target.value
        })
    }

    const handleDeleteProduct = async (id: string) => {
        await ProductService.deleteOne(id)
        queryClient.invalidateQueries({ queryKey: ["products"] })
    }

    const handleDeleteStock = async (id: string) => {
        await StockService.deleteOne(id)
        queryClient.invalidateQueries({ queryKey: ["stocks"] })
    }

    const productWithCat = products?.map(product => {
        const category = categories?.find(cat => cat.id === product.categoryId)

        if (category) {
            return {
                ...product,
                categoryName: category.name
            }
        }
        return product
    })


    const productWithStock = stocks?.map(stock => {
        const product = products?.find(product => product.id === stock.productId)

        if (product) {
            return {
                ...stock,
                productName: product.name,
                image: product.image
            }
        }
        return stock
    })



    return (
        <div className=" font-mono">
            <NavBar />
            < form className="mt-20 w-1/3 mx-auto" onSubmit={handleSubmit}>
                <h3 className="scroll-m-20 font-semibold tracking-tight">ADD PRODUCT</h3>

                <select className="mt-4" onChange={handleSelect} name="categoryId" value={product.categoryId}>
                    <option selected>Select a choice</option>
                    {categories?.map((cat) => {
                        return (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        )
                    })}
                </select>

                <Input name="image" className="mt-4" type="text" placeholder="Image Link" onChange={handleChange} />
                <Input name="name" className="mt-4" type="text" placeholder="Name" onChange={handleChange} />
                <Input name="description" className="mt-4" type="text" placeholder="Description" onChange={handleChange} />

                <div className="mt-4 space-x-4">
                    <Button type="submit" onSubmit={handleSubmit}>Submit</Button>
                    <Button type="reset" onSubmit={handleSubmit}>Reset</Button>
                </div>
            </form >


            <div>
                <h1 className="scroll-m-20 mt-10 text-4x1 font-semibold tracking-tight">Products</h1>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Image</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                            <TableHead>Delete</TableHead>
                            <TableHead>Edit</TableHead>

                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productWithCat?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="text-left w-3 h-3"><img src={product.image} /></TableCell>
                                <TableCell className="text-left">{product.name}</TableCell>
                                <TableCell className="text-left">{product.categoryName}</TableCell>
                                <TableCell className="text-left">{product.description}</TableCell>

                                <TableCell className="text-left">
                                    <Button variant="destructive" onClick={() => handleDeleteProduct(product.id)}>X</Button>
                                </TableCell>

                                <TableCell className=" text-left">
                                    <EditDialog product={product} ></EditDialog>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>

            {/* TABLE 2 STOCK */}

            <form className="mt-20 w-1/3 mx-auto" onSubmit={handleSubmitStock}>
                <h3 className="scroll-m-20 font-semibold tracking-tight">ADD STOCK</h3>

                <select className="mt-4" onChange={handleSelectProduct} name="productId">
                    <option selected>Select a choice</option>
                    {products?.map((product) => {
                        return (
                            <option key={product.id} value={product.id}>
                                {product.name}
                            </option>
                        )
                    })}
                </select>

                <Input name="color" className="mt-4" type="text" placeholder="Color" onChange={handleChangeStock} />
                <Input name="size" className="mt-4" type="text" placeholder="Size" onChange={handleChangeStock} />
                <Input name="stockQuantity" className="mt-4" type="number" placeholder="Quantity" onChange={handleChangeStock} />
                <Input name="price" className="mt-4" type="number" placeholder="Price" onChange={handleChangeStock} />

                <div className="mt-4 space-x-4">
                    <Button type="submit" onSubmit={handleSubmitStock}>Submit</Button>
                    <Button type="reset">Reset</Button>
                </div>
            </form >
            <div>
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead>Product Image</TableHead>
                            <TableHead>Product Name</TableHead>
                            <TableHead>Color</TableHead>
                            <TableHead>Size</TableHead>
                            <TableHead>Quantity</TableHead>
                            <TableHead>Price</TableHead>
                            <TableHead>Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody>
                        {productWithStock?.map((stock) => (
                            <TableRow key={stock.id}>
                                <TableCell className="text-left w-3 h-3"><img src={stock.image} alt="" /></TableCell>
                                <TableCell className="text-left">{stock.productName}</TableCell>
                                <TableCell className="text-left">{stock.color}</TableCell>
                                <TableCell className="text-left">{stock.size}</TableCell>
                                <TableCell className="text-left">{stock.stockQuantity}</TableCell>
                                <TableCell className="text-left">{stock.price}</TableCell>

                                <TableCell className="text-left">
                                    <Button variant="destructive" onClick={() => handleDeleteStock(stock.id)}>X</Button>
                                </TableCell>

                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}