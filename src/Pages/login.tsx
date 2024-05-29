import { GlobalContext } from "@/App";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reshapeUser } from "@/lib/utils";
import { Label } from "@radix-ui/react-label";
import jwtDecode from "jwt-decode";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";

export function Login() {
    const navigate = useNavigate()
    const context = useContext(GlobalContext)
    if (!context) throw Error("Context is missing")
    const { handleStoreUser } = context

    const [user, setUser] = useState({
        email: "",
        password: "",
    })

    const handleLogin = async () => {
        try {
            const res = await api.post(`/users/login`, user)
            return res.data
        } catch (error) {
            console.error(error)
            return Promise.reject(new Error("Something went wrong"))
        }
    }

    const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target
        setUser({
            ...user,
            [name]: value
        })
    }

    const handleSubmit = async (e: FormEvent) => {
        e.preventDefault()
        const token = await handleLogin()
        if (token) {
            const decodedToken = jwtDecode(token)
            const user = reshapeUser(decodedToken)
            localStorage.setItem("token", token)
            localStorage.setItem("user", JSON.stringify(user))

            handleStoreUser(user)
            navigate("/")
        }
    }

    return (
        <div className=" w-full flex items-center justify-center mb-9 bg-[url('src/hero/signup.png')] bg-cover">
            <div className=" inline-block max-w-sm space-y-6 pt-24 pb-32 w-auto font-mono" >
                < div className="space-y-2 text-center" >
                    <h1 className="text-3xl font-bold">Welcome back 🤍</h1>
                </div >
                <form action="POST" className="space-y-6 text-left w-96" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label className="font-medium" htmlFor="email">
                            Email Address
                        </Label>
                        <Input
                            className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                            name="email"
                            placeholder="m@example.com"
                            required
                            type="email"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-medium" htmlFor="password">
                            Password
                        </Label>
                        <Input
                            className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                            name="password"
                            required
                            type="password"
                            onChange={handleChange}
                        />
                    </div>
                    <Button onSubmit={handleSubmit} className="w-full bg-primary text-white hover:bg-primary/90 focus:ring-primary" type="submit">
                        Sign In
                    </Button>
                </form>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p className=" inline gap-3"> New? </p>
                    <Link className="font-medium text-primary hover:underline" to={"/signup"}>
                        Sign Up now
                    </Link>
                </div>
            </div >
        </div >
    )
}