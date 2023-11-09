import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import axios from "axios";

export default function Categories() {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [ editedCategory, setEditedCategory] = useState(null)

  useEffect(() => {
    fetchCategoriest();
  }, []);

  const fetchCategoriest = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  async function saveCategory(ev) {
    ev.preventDefault();
    const data = {name,parentCategory};
    if(editCategory){
      data._id = editCategory._id;
      await axios.put("/api/categories",data);
    }else{
      await axios.post("/api/categories", data);
    }
    
    setName("");
    fetchCategoriest();
  }

  function editCategory(category){
   setEditedCategory(category);
   setName(category.name);
   setParentCategory(category.parent?._id)
  }

  return (
    <Layout>
      <h1 className="title-page">Categories</h1>
      <label>{editedCategory ? `Edit Category Name ${editedCategory.name}`: 'New Category Name'}</label>
      <form onSubmit={saveCategory} className="flex">
        <input
          type="text"
          placeholder={"Category name"}
          className="mb-0"
          value={name}
          onChange={(ev) => setName(ev.target.value)}
        />

        <select className="mb-0" onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
          <option value="">No option</option>
          {categories.length > 0 &&
            categories.map((category) => (
              <option key={category._id} value={category._id}>{category.name}</option>
            ))}
        </select>

        <button type="submit" className="btn-element mx-2">
          Save
        </button>
      </form>
      <table className="basic mt-5">
        <thead>
          <tr>
            <td>Category name</td>
            <td>Parent category</td>
            <td></td>
          </tr>
        </thead>
        <tbody>
          {categories.length > 0 &&
            categories.map((category) => 
            <tr key={category._id}>
                <td>{category.name}</td>
                <td>{category?.parent?.name}</td>
            <td>
                <button className="btn-edit-form mr-1" 
                onClick={() => editCategory(category)}>Edit</button>
                <button className="btn-delete-form">Delete</button>
           
            </td>
            </tr>
           
            
            )}
        </tbody>
      </table>
    </Layout>
  );
}
