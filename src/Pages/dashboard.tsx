import api from "@/api"
import { NavBar } from "@/components/navbar"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Category, Product, ProductWithoutId, User } from "@/types"
import { useQuery, useQueryClient } from "@tanstack/react-query"
import { ChangeEvent, FormEvent, useState } from "react"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"

import CategoryService from "../api/category"
import ProductService from '../api/products'
import UserService from '../api/users'



export function Dashboard() {
    const queryClient = useQueryClient()

    const [product, setProduct] = useState<ProductWithoutId>({
        categoryId: "",
        image: "",
        name: "",
        description: ""
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


    const { data: products, error } = useQuery<Product[]>({
        queryKey: ["products"],
        queryFn: ProductService.getAll
    })

    const { data: categories, error: catError } = useQuery<Category[]>({
        queryKey: ["categories"],
        queryFn: CategoryService.getAll
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

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        console.log(product)
        await ProductService.createOne(product)

        queryClient.invalidateQueries({ queryKey: ["products"] })
    }

    const handleSelect = (e: ChangeEvent<HTMLSelectElement>) => {
        setProduct({
            ...product,
            categoryId: e.target.value
        })
    }

    const productWithCat = products?.map(product => {
        const category = categories?.find(cat => cat.id === product.categoryId)

        if (category) {
            return {
                ...product,
                categoryId: category.name
            }
        }
        return product
    })

    return (
        <>
            <NavBar />
            < form className="mt-20 w-1/3 mx-auto" onSubmit={handleSubmit}>
                <h3 className="scroll-m-20 font-semibold tracking-tight">ADD NEW PRODUCT</h3>

                <select className="mt-4" onChange={handleSelect} name="categoryId" value={product.categoryId}>
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
                            <TableHead>blaaa</TableHead>
                            <TableHead>Name</TableHead>
                            <TableHead>Category</TableHead>
                            <TableHead>Description</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {productWithCat?.map((product) => (
                            <TableRow key={product.id}>
                                <TableCell className="text-left">blaaaa</TableCell>
                                <TableCell className="text-left">{product.name}</TableCell>
                                <TableCell className="text-left">{product.categoryId}</TableCell>
                                <TableCell className="text-left">{product.description}</TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
        </>
    )
}