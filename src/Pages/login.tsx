import { GlobalContext } from "@/App";
import api from "@/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { reshapeUser } from "@/lib/utils";
import jwtDecode from "jwt-decode";
import { ChangeEvent, FormEvent, useContext, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { json } from "stream/consumers";

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
        <div>
            <h3>LOGIN</h3>
            <form action="POST" onSubmit={handleSubmit} className="w-full md:w-1/2 mx-auto">
                <Input name="email" className="mt-4" type="text" placeholder="Email" onChange={handleChange} />
                <Input name="password" className="mt-4" type="password" placeholder="Password" onChange={handleChange} />
                <Button onSubmit={handleSubmit} className=" mt-4">Login</Button>

                <div className="mt-7">
                    <Button variant="link">
                        <Link to="/signup" > New? Join now</Link>
                    </Button>
                </div>
            </form>
        </div>
    )
}