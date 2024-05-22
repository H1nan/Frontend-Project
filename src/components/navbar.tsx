import { Link } from "react-router-dom";
import { NavigationMenu, NavigationMenuItem, NavigationMenuLink, NavigationMenuList } from "./ui/navigation-menu";
import { Cart } from "./cart";
import { useContext } from "react";
import { GlobalContext } from "@/App";
import { ROLE } from "@/types";
import { Button } from "./ui/button";



export function NavBar() {
    const context = useContext(GlobalContext)
    if (!context) throw Error("Context is missing")
    const { state, handleOut } = context

    const handleLogout = () => {
        localStorage.removeItem('token')
        localStorage.removeItem('user')

        handleOut()
    }

    return (
        <div>

            <div className="flex justify-between mb-10">
                <h3>LOGO</h3>
                <NavigationMenu>
                    <NavigationMenuList className="gap-4">

                        <Link to="/" >
                            Home
                        </Link>

                        {state.user?.role === ROLE.Admin && (<Link to="/Dashboard" >
                            Dashboard
                        </Link>)}

                        {!state.user && (<Link to="/login" >
                            Login
                        </Link>)}

                        {!state.user && (<Link to="/signup" >
                            Signup
                        </Link>)}

                        {state.user && (<Link to="/" >
                            <Button onClick={handleLogout} variant="ghost">Logout</Button>
                        </Link>
                        )}

                    </NavigationMenuList>
                </NavigationMenu>
                <Cart />
            </div>

        </div>
    )

}