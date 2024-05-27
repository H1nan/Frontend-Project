import { NavBar } from "@/components/navbar"
import aboutUs from "../hero/aboutUs.png"
export function AboutUs() {
    return (
        <>
            <NavBar />
            <img src={aboutUs} className=""></img>
        </>
    )
}