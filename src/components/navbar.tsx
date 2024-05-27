import { Link } from "react-router-dom";
import { HoverCard, HoverCardContent, HoverCardTrigger } from "@/components/ui/hover-card";
import { Cart } from "./cart";
import { useContext, useEffect, useState } from "react";
import { GlobalContext } from "@/App";
import { ROLE } from "@/types";
import { Button } from "./ui/button";
import logo from "../hero/palnty3.png"
import { LogIn, LogOut, Menu, UserPlus } from "lucide-react";



export function NavBar() {
    const context = useContext(GlobalContext)
    if (!context) throw Error("Context is missing")
    const { state, handleOut } = context

    const [isOpen, setIsOpen] = useState(false)

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        handleOut()
    }

    const handleMenu = () => {
        setIsOpen((prev) => !prev)
    }

    useEffect(() => {
        () => {
            setIsOpen(false)
        }
    }, [])
    return (
        <div className="font-mono bg-[#F5EFE6]">

            <div className="flex gap-10 px-4">
                <img src={logo} alt="logo" className="w-1/6" />

                <nav className="flex justify-between w-full items-center">

                    <div className=" space-x-10 hidden md:block ">
                        <Link to="/" >
                            Home
                        </Link>

                        <Link to="/aboutUs" >
                            About us
                        </Link>

                        <Link to="/categories" >
                            Categories
                        </Link>

                        {state.user?.role === ROLE.Admin && (<Link to="/Dashboard" >
                            Dashboard
                        </Link>)}
                    </div>
                    <Button variant="ghost" className="block md:hidden" onClick={handleMenu}><Menu /></Button>
                    {isOpen && <div className="flex flex-col bg-secondary gap-10 pt-10 md:hidden absolute h-1/2 w-full top-0 bottom-0 left-0 right-0">
                        <Button variant="ghost" className="block md:hidden ml-auto" onClick={handleMenu}>X</Button>
                        <Link to="/" >
                            Home
                        </Link>

                        <Link to="/aboutUs" >
                            About us
                        </Link>

                        <Link to="/categories" >
                            Categories
                        </Link>

                        {state.user?.role === ROLE.Admin && (<Link to="/Dashboard" >
                            Dashboard
                        </Link>)}
                    </div>}


                    <div className=" flex">
                        {!state.user && (<Link to="/login">
                            <HoverCard >
                                <HoverCardTrigger asChild>
                                    <Button variant="ghost"> <LogIn /></Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-40 bg-transparent">
                                    <p className="text-sm font-bold  font-mono">Signin now!</p>
                                </HoverCardContent>
                            </HoverCard>
                        </Link>)}

                        {!state.user && (<Link to="/signup">
                            <HoverCard >
                                <HoverCardTrigger asChild>
                                    <Button variant="ghost"><UserPlus /></Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-44 bg-transparent">
                                    <p className="text-sm font-bold font-mono">Creat new account!</p>
                                </HoverCardContent>
                            </HoverCard>
                        </Link>)}

                        {state.user && (<Link to="/" onClick={handleLogout}>
                            <HoverCard >
                                <HoverCardTrigger asChild>
                                    <Button variant="ghost"><LogOut /></Button>
                                </HoverCardTrigger>
                                <HoverCardContent className="w-40 bg-transparent">
                                    <p className="text-sm font-bold font-mono">Logout</p>
                                </HoverCardContent>
                            </HoverCard>
                        </Link>
                        )}
                        <Cart />
                    </div>
                </nav>
            </div>

        </div>
    )

}