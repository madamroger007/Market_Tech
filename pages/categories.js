import Layout from "@/components/Layout";
import { useEffect, useState } from "react";
import { withSwal } from 'react-sweetalert2';
import axios from "axios";


function Categories({ swal }) {
  const [name, setName] = useState("");
  const [parentCategory, setParentCategory] = useState('');
  const [categories, setCategories] = useState([]);
  const [editedCategory, setEditedCategory] = useState(null)
  const [properties,setproperties] = useState([]);
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
    const data = { 
      name, 
      parentCategory, 
      properties:properties.map(p => ({
        name:p.name, 
        values:p.values.split(',')
      })) };
    if (editedCategory) {
      data._id = editedCategory._id;
      await axios.put("/api/categories", data);
      setEditedCategory(null)
    } else {
      await axios.post("/api/categories", data);
    }

    setName("");
    setParentCategory("");
    setproperties([])
    FetchCategoriest();
  }

  function EditCategory(category) {
    setEditedCategory(category);
    setName(category.name);
    setParentCategory(category.parent?._id)
    setproperties(category.properties.map(({name, values})=>({
      name,
      values:values.join(',')
    })))
  }

  function DeleteCategory(category) {
    swal.fire({
      title: 'Are you sure?',
      text: `Do you want to delete ${category.name}?`,
      showCancelButton: true,
      cancelButtonTitle: "Cancel",
      confirmButtonText: "Yes,Delete!",
      confirmButtonColor: "#d55",
      reverseButtons: true,
    }).then(async result => {
      // when confirmed and promise resolved...
      const { _id } = category
      if (result.isConfirmed) {
        await axios.delete("/api/categories?_id=" + _id);
        FetchCategoriest();
      }
    }).catch(error => {
      // when promise rejected...
    });
  }

  function addProperty(){
    setproperties(prev=> {
      return [...prev,{name:'',value:''}]
    })
  }

  function handlePropertyNameChange(index,property,newName){
   setproperties(prev => {
    const properties = [...prev]
    properties[index].name = newName
    return properties
   })
  }

  function handlePropertyValuesChange(index,property,newValues){
    setproperties(prev => {
     const properties = [...prev]
     properties[index].values = newValues
     return properties
    })
   }

   function removeProperty(index){
    setproperties(prev => {
      return [...prev].filter((p,i) => {return i !== index} );
     
    })
   }

  // console.log(DeleteCategory(category));
  return (
    <Layout>
      <h1 className="title-page">Categories</h1>
      <label>{editedCategory ? `Edit Category Name ${editedCategory.name}` : 'New Category Name'}</label>
      <form onSubmit={SaveCategory}>
        <div className="flex gap-1">
          <input
            type="text"
            placeholder={"Category name"}

            value={name}
            onChange={(ev) => setName(ev.target.value)}
          />

          <select onChange={ev => setParentCategory(ev.target.value)} value={parentCategory}>
            <option value="">No option</option>
            {categories.length > 0 &&
              categories.map((category) => (
                <option key={category._id} value={category._id}>{category.name}</option>
              ))}
          </select>
        </div>

        <div>
          <label className="block"> Properties</label>
          <button type="button" onClick={addProperty} className="btn-element text-sm mb-2">
            Add new property
          </button>
          {properties.length > 0 && properties.map((property,index) =>(
            <div className="flex gap-1 mb-2">
              <input type="text" 
              className="mb-0"
              value={property.name}
              onChange={ev => handlePropertyNameChange(index,property,ev.target.value)} 
              placeholder="Property name (example: color)" />
              
              <input type="text" 
              className="mb-0"
              value={property.values} 
              onChange={ev => handlePropertyValuesChange(index,property,ev.target.value)} 
              placeholder="Value, seprated" />

              <button 
              onClick={() => removeProperty(index)}
              className="btn-danger"
              type='button'
              >
                <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                Remove</button>
            
            </div>
          ))}
        </div>
        <div className="flex gap-1">
        {editedCategory && (
          <button 
          type="button"
          onClick={() =>{ 
            setEditedCategory(null)
            setName('')
            setParentCategory('')
            setproperties([])
          }}
          className="btn-element">Cancel</button>

        )}
        <button type="submit"

          className="btn-primary mx-2">
          Save
        </button>
        </div>
        
      </form>
      {!editedCategory && (
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
                  <button className="btn-white mr-1"
                    onClick={() => EditCategory(category)}>
                       <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                      Edit</button>
                  <button className="btn-danger"
                    onClick={() => DeleteCategory(category)}
                  >
                    <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth="1.5"
                    stroke="currentColor"
                    className="w-4 h-4"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M14.74 9l-.346 9m-4.788 0L9.26 9m9.968-3.21c.342.052.682.107 1.022.166m-1.022-.165L18.16 19.673a2.25 2.25 0 01-2.244 2.077H8.084a2.25 2.25 0 01-2.244-2.077L4.772 5.79m14.456 0a48.108 48.108 0 00-3.478-.397m-12 .562c.34-.059.68-.114 1.022-.165m0 0a48.11 48.11 0 013.478-.397m7.5 0v-.916c0-1.18-.91-2.164-2.09-2.201a51.964 51.964 0 00-3.32 0c-1.18.037-2.09 1.022-2.09 2.201v.916m7.5 0a48.667 48.667 0 00-7.5 0"
                    />
                  </svg>
                    Delete</button>
                </td>
              </tr>
            )}
        </tbody>
      </table>
      )}
      
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
))