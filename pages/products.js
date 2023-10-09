import Layout from "@/components/layout";
import Link from "next/link";

export default function Products(){
    return (
        <Layout>
            <Link className="btn-element "  href={'/products/new'}>Add new product</Link>
        </Layout>
    )
}