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
            <form className="mt-20 w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handleSubmit}>
                <h3 className="font-semibold text-lg tracking-tight mb-4">ADD PRODUCT</h3>

                <select className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" onChange={handleSelect} name="categoryId" value={product.categoryId}>
                    <option value="" disabled>Select a choice</option>
                    {categories?.map((cat) => (
                        <option key={cat.id} value={cat.id}>
                            {cat.name}
                        </option>
                    ))}
                </select>

                <Input name="image" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="text" placeholder="Image Link" onChange={handleChange} />
                <Input name="name" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="text" placeholder="Name" onChange={handleChange} />
                <Input name="description" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="text" placeholder="Description" onChange={handleChange} />

                <div className="mt-4 flex justify-between">
                    <Button type="submit" className="px-4 py-2 text-white rounded-md">Submit</Button>
                    <Button type="reset" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Reset</Button>
                </div>
            </form>

            <div className="mt-10">
                <h1 className="text-4xl font-semibold tracking-tight mb-4">Products</h1>
                <div className="">
                    <Table className="min-w-full divide-y divide-gray-200">
                        <TableHeader className="bg-gray-50">
                            <TableRow>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Image</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Name</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Category</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Description</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Delete</TableHead>
                                <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Edit</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody className="bg-white divide-y divide-gray-200 text-left">
                            {productWithCat?.map((product) => (
                                <TableRow key={product.id} className="hover:bg-gray-100">
                                    <TableCell className="px-6 py-4 whitespace-nowrap">
                                        <img src={product.image} alt={product.name} className="w-14 h-14 object-cover rounded-md" />
                                    </TableCell>
                                    <TableCell className="px-6 py-4 ">{product.name}</TableCell>
                                    <TableCell className="px-6 py-4 ">{product.categoryName}</TableCell>
                                    <TableCell className="px-6 py-4 ">{product.description}</TableCell>
                                    <TableCell className="px-6 py-4 ">
                                        <Button variant="destructive" className="px-2 py-1 w-7 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => handleDeleteProduct(product.id)}>X</Button>
                                    </TableCell>
                                    <TableCell className="px-6 py-4 ">
                                        <EditDialog product={product} />
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </div>
            </div>

            {/* TABLE 2 STOCK */}

            <form className="mt-20 w-11/12 md:w-2/3 lg:w-1/2 xl:w-1/3 mx-auto p-6 bg-white rounded-lg shadow-lg" onSubmit={handleSubmitStock}>
                <h3 className="font-semibold text-lg tracking-tight mb-4">ADD STOCK</h3>

                <select className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" onChange={handleSelectProduct} name="productId" value="">
                    <option value="" disabled>Select a choice</option>
                    {products?.map((product) => (
                        <option key={product.id} value={product.id}>
                            {product.name}
                        </option>
                    ))}
                </select>

                <Input name="color" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="text" placeholder="Color" onChange={handleChangeStock} />
                <Input name="size" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="text" placeholder="Size" onChange={handleChangeStock} />
                <Input name="stockQuantity" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="number" placeholder="Quantity" onChange={handleChangeStock} />
                <Input name="price" className="mt-4 block w-full p-2 border border-gray-300 rounded-md focus:ring-indigo-500 focus:border-indigo-500" type="number" placeholder="Price" onChange={handleChangeStock} />

                <div className="mt-4 flex justify-between">
                    <Button type="submit" className="px-4 py-2 text-white rounded-md">Submit</Button>
                    <Button type="reset" className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700">Reset</Button>
                </div>
            </form>

            <div className="mt-10">
                <Table className="min-w-full divide-y divide-gray-200 text-left">
                    <TableHeader className="bg-gray-50">
                        <TableRow>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Image</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product Name</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Color</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Size</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Quantity</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Price</TableHead>
                            <TableHead className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Action</TableHead>
                        </TableRow>
                    </TableHeader>

                    <TableBody className="bg-white divide-y divide-gray-200">
                        {productWithStock?.map((stock) => (
                            <TableRow key={stock.id} className="hover:bg-gray-100">
                                <TableCell className="px-6 py-4"><img src={stock.image} alt={stock.productName} className="w-10 h-10 object-cover rounded-md" /></TableCell>
                                <TableCell className="px-6 py-4">{stock.productName}</TableCell>
                                <TableCell className="px-6 py-4">{stock.color}</TableCell>
                                <TableCell className="px-6 py-4">{stock.size}</TableCell>
                                <TableCell className="px-6 py-4">{stock.stockQuantity}</TableCell>
                                <TableCell className="px-6 py-4">{stock.price}</TableCell>
                                <TableCell className="px-6 py-4 align-middle">
                                    <Button variant="destructive" className="px-2 py-1 bg-red-600 text-white rounded-md hover:bg-red-700" onClick={() => handleDeleteStock(stock.id)}>X</Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </div>
    )
}