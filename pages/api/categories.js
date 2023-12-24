import { mongooseConnect } from "@/lib/mongoose";
import { Category } from "@/models/Category";

export default async function handle(req, res) {
  const { method } = req;
  await mongooseConnect;
  if (method === "GET") {
    res.json(await Category.find().populate('parent'));
  }
  
  if (method === "POST") {
    const { name, parentCategory, properties } = req.body;
    const category = await Category.create({ 
      name,
      parent:parentCategory || undefined, 
      properties:properties });
    res.json(category);
  }

  if (method === "PUT") {
    const { name, parentCategory,properties ,_id } = req.body;
    const category = await Category.updateOne({_id},{ 
      name,
      parent:parentCategory || undefined,
      properties
     });
    res.json(category);
  }

  if(method === "DELETE"){
    const {_id} = req.query
    const category =  await Category.deleteOne({_id})
    res.json(category)
  }
}
