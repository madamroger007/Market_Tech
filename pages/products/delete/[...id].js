import Layout from "@/components/Layout";
import { useRouter } from "next/router";
import { useEffect, useState } from "react";
import axios from "axios";

export default function DeleteProductpage() {
  const router = useRouter();
  const [productInfo, setproductInfo] = useState();
  const { id } = router.query;

  useEffect(() => {
    if (!id) return;

    axios
      .get("/api/products?id=" + id)
      .then((response) => {
        setproductInfo(response.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, [id]);

  function goBack() {
    router.push("/products");
  }
  async function deleteproduct(){
    await axios.delete('/api/products?id='+id)
    goBack()
  }

  return (
    <Layout>
      <h1 className="text-center">
        
        Do you really want to delete &nbsp; "{productInfo?.title}"?
      </h1>

      <div className="flex gap-2 justify-center">
        <button className="btn-red" onClick={deleteproduct}>Yes</button>
        <button className="btn-blue" onClick={goBack}>
          NO
        </button>
      </div>
    </Layout>
  );
}
