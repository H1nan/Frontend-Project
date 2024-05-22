import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { Dashboard } from "./Pages/dashboard"
import { Home } from "./Pages/home"
import "./App.css"
import { createContext, useEffect, useState } from "react";
import { DecodedUser, Product } from "./types";
import { ProductDetails } from "./Pages/productDetails";
import { Login } from "./Pages/login";
import { Signup } from "./Pages/signup";
import { WithAuth } from "./components/WithAuth";

const router = createBrowserRouter([
  {
    path: "/",
    element: <Home />,
  },
  {
    path: "/dashboard",
    element: (<WithAuth>
      <Dashboard />
    </WithAuth>
    )
  },
  {
    path: "/products/:productId",
    element: <ProductDetails />,
  },
  {
    path: "/login",
    element: <Login />,
  },
  {
    path: "/signup",
    element: <Signup />,
  }
])

type GlobalContextType = {
  state: GlobalState,
  handleAddToCart: (product: Product) => void
  handleDelCart: (id: string) => void
  handleStoreUser: (user: DecodedUser) => void
  handleAfterCheckout: () => void
  handleOut: () => void
}

type GlobalState = {
  cart: Product[]
  user: DecodedUser | null
}
export const GlobalContext = createContext<GlobalContextType | null>(null)

function App() {
  const [state, setState] = useState<GlobalState>({
    cart: [],
    user: null
  })

  useEffect(() => {
    const user = localStorage.getItem("user")
    if (user) {
      const decodedUser = JSON.parse(user)
      setState({
        ...state,
        user: decodedUser
      })
    }
  }, [])

  const handleAddToCart = (product: Product) => {
    // const isDublicated = state.cart.find(cartItem => cartItem.id === product.id)

    // if (isDublicated) return
    setState({
      ...state,
      cart: [...state.cart, product]
    })
  }

  const handleStoreUser = (user: DecodedUser) => {
    setState({
      ...state,
      user
    })
  }

  const handleDelCart = (id: string) => {
    const cart = state.cart
    const index = state.cart.findIndex(item => item.id === id)
    cart.splice(index, 1)

    setState({
      ...state,
      cart: cart
      // const filteredCart = state.cart.filter(item => item.id !== id)
    })
  }

  const handleAfterCheckout = () => {
    setState({
      ...state,
      cart: []
    })
  }

  const handleOut = () => {
    setState({
      ...state,
      // cart: [],
      user: null
    })
  }

  return (
    <div>
      <GlobalContext.Provider value={{ state, handleAddToCart, handleDelCart, handleStoreUser, handleAfterCheckout, handleOut }}>
        <RouterProvider router={router} />
      </GlobalContext.Provider>
    </div>
  )
}

export default App
