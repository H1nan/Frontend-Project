
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import api from "@/api";
import { ChangeEvent, FormEvent, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import SignupHero from "../hero/signup.png"

export default function Signup() {
    const navigate = useNavigate()
    const [user, setUser] = useState({
        fullName: "",
        email: "",
        password: "",
        countryCode: "",
        phone: ""
    })

    const handleSignup = async () => {
        try {
            const res = await api.post(`/users/signup`, user)
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
        const response = await handleSignup()
        if (response) {
            navigate("/login")
        }
    }


    return (

        <div className=" w-full flex items-center justify-center mb-9 bg-cover"
            style={{ backgroundImage: `url(${SignupHero})` }}>

            <div className="relative text-center space-y-6 px-4 md:px-6 mt-24 pb-20 font-mono">
                <div className="space-y-2 text-center">
                    <h1 className="text-3xl font-bold">Create an Account</h1>
                    <p className="text-gray-500 dark:text-gray-400">Join our community and feel alive 🌿</p>
                </div>
                <form action="POST" className="space-y-6 text-left w-96" onSubmit={handleSubmit}>
                    <div className="space-y-2">
                        <Label className="font-medium" htmlFor="name">
                            Full Name
                        </Label>
                        <Input
                            className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                            name="name"
                            placeholder="Abdullah Saad"
                            required
                            onChange={handleChange}
                        />
                    </div>
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
                    <div className="space-y-2">
                        <Label className="font-medium" htmlFor="email">
                            Country Code
                        </Label>
                        <Input
                            className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                            name="conunrtyCode"
                            placeholder="ex:00966"
                            required
                            type="text"
                            onChange={handleChange}
                        />
                    </div>
                    <div className="space-y-2">
                        <Label className="font-medium" htmlFor="email">
                            Phone Number
                        </Label>
                        <Input
                            className="border-gray-300 dark:border-gray-700 focus:border-primary focus:ring-primary"
                            name="phone"
                            placeholder="ex:123456789"
                            required
                            type="text"
                            onChange={handleChange}
                        />
                    </div>
                    <Button onSubmit={handleSubmit} className="w-full bg-primary text-white hover:bg-primary/90 focus:ring-primary" type="submit">
                        Create Account
                    </Button>
                </form>
                <div className="text-center text-gray-500 dark:text-gray-400">
                    <p className=" inline gap-3"> Already have an account? </p>
                    <Link className="font-medium text-primary hover:underline" to={"/login"}>
                        Sign In
                    </Link>
                </div>
            </div>
        </div>
    )
}