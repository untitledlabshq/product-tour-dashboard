import Navbar from "@/components/Navbar"
import Head from "next/head"

export default function Dashboard(){
    return (
        <main>
            <Head>
                <title>Dashboard</title>
            </Head>
            <Navbar />
            <h1>Alright then</h1>
        </main>
    )
}
