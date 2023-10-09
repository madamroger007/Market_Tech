import Layout from "@/components/layout";

export default function NewProducts(){
    return (
        <Layout>
            <h1 className="title-page">New Product</h1>
            <label>Product name</label>
            <input type="text" placeholder="product name" />
            <label>Description</label>
            <textarea placeholder="description"></textarea>
            <label>Price (in USD)</label>
            <input type="number" placeholder="price" />
            <button className="btn-element ">Save</button>
        </Layout>
    )
}