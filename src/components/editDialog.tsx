import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Product } from "@/types"
import { EditIcon } from "lucide-react"
import { ChangeEvent, useState } from "react"
import { useQueryClient } from "@tanstack/react-query"
import api from "@/api"


export function EditDialog({ product }: { product: Product }) {
    const queryClient = useQueryClient()

    const [updatedProduct, setUpdatedProduct] = useState(product)

    const updateProduct = async () => {
        try {
            const res = await api.patch(`/products/${updatedProduct.id}`, updatedProduct)
            return res.data
        } catch (error) {
            return Promise.reject(new Error("Something went wrong"))
        }
    }

    const handleUpdateProduct = async () => {
        await updateProduct()
        queryClient.invalidateQueries({ queryKey: ["products"] })
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { value, name } = e.target
        setUpdatedProduct({
            ...updatedProduct,
            [name]: value,
        })
    }
    console.log("updatedProduct ", updatedProduct)
    return (
        <Dialog>
            <DialogTrigger asChild>
                <Button variant="outline"><EditIcon /></Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Edit Product</DialogTitle>
                    <DialogDescription>
                        Make changes to your product here. Click save when you're done.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input
                            id="name"
                            name="name"
                            defaultValue={updatedProduct.name}
                            className="col-span-3"
                            onChange={handleChange}
                        />
                    </div>

                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="description" className="text-right">
                            Description
                        </Label>
                        <Input
                            id="description"
                            name="description"
                            defaultValue={updatedProduct.description}
                            className="col-span-3"
                            onChange={handleChange}
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button type="submit" onClick={handleUpdateProduct}>Save changes</Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
