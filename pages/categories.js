import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';
import axios from "axios";


function Categories({swal}) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [ editedCategory, setEditedCategory] = useState(null)

  useEffect(() => {
    FetchCategoriest();
  }, []);

  const FetchCategoriest = () => {
    axios.get("/api/categories").then((result) => {
      setCategories(result.data);
    });
  };

  async function SaveCategory(ev) {
    ev.preventDefault();
    const data = {name,parentCategory};
    if(editedCategory){
      data._id = editedCategory._id;
      await axios.put("/api/categories",data);
      setEditedCategory(null)
    }else{
      await axios.post("/api/categories", data);
    }
    
    setName("");
    setParentCategory("");
    FetchCategoriest();
  }

  function EditCategory(category){
   setEditedCategory(category);
   setName(category.name);
   setParentCategory(category.parent?._id)
  }

 function DeleteCategory(category){

    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton:true,
      cancelButtonTitle: "Cancel",
      confirmButtonText: "Yes,Delete!",
      confirmButtonColor:"#d55",
      reverseButtons:true,
  }).then(async result => {
      // when confirmed and promise resolved...
      const {_id} = category
     if(result.isConfirmed){
     await axios.delete("/api/categories?_id="+_id);
     FetchCategoriest();
     }
  }).catch(error => {
      // when promise rejected...
  });
  }

  // console.log(DeleteCategory(category));
  return (
    <Layout>
      <h1 className="title-page">Categories</h1>
      <label>{editedCategory ? `Edit Category Name ${editedCategory.name}`: 'New Category Name'}</label>
      <form onSubmit={SaveCategory} className="flex">
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
                onClick={() => EditCategory(category)}>Edit</button>
                <button className="btn-delete-form"
                onClick={() => DeleteCategory(category)}
                >Delete</button>
           
            </td>
            </tr>
           
            
            )}
        </tbody>
      </table>
    </Layout>
  );
}

export default withSwal(({swal}, ref) => (
  <Categories swal={swal}/>
))