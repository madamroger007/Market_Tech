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
          <button type="button" onClick={addProperty} className="btn-blue text-sm mb-2">
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
              className="btn-red"
              type='button'
              >Remove</button>
            
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

          className="btn-element mx-2">
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
      )}
      
    </Layout>
  );
}

export default withSwal(({ swal }, ref) => (
  <Categories swal={swal} />
))