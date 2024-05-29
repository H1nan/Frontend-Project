import { InstagramIcon, TwitterIcon, Youtube } from "lucide-react"
import { Link } from "react-router-dom"
import { Button } from "./ui/button"

export default function Footer() {

    return (
        <footer className="bg-[#F5EFE6] mt-10 p-6 md:py-6 w-full dark:bg-gray-800 font-mono">
            <div className="container max-w-7xl flex flex-col items-center justify-between gap-4 md:flex-row">
                <p className="text-sm text-gray-500 dark:text-gray-400">© Planty 2024 | All rights reserved.</p>
                <div >
                    <Button className=" text-gray-500" variant="link">Order Policy</Button>
                    <Button className=" text-gray-500" variant="link">Common questions?</Button>

                </div>
                <div className="flex items-center gap-4">
                    <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" to="https://x.com">
                        <TwitterIcon className="h-5 w-5 " />
                        <span className="sr-only">Twitter</span>
                    </Link>
                    <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" to="https://www.instagram.com">
                        <InstagramIcon className="h-5 w-5" />
                        <span className="sr-only">Instagram</span>
                    </Link>
                    <Link className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-gray-50" to="https://www.youtube.com">
                        <Youtube className="h-6 w-6" />
                        <span className="sr-only">YouTube</span>
                    </Link>
                </div>

            </div>
        </footer >
    )
}
