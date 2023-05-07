const db = require("../../data/dbConfig");

async function getAll(){
    return await db("users");
}
async function getByFilter(filter){
    return await db("users").where(filter).first();
}
async function create(user){
    const [id] = await db("users").insert(user)
    return await getByFilter({id:id});
}
module.exports={
    getAll,
    getByFilter,
    create
}
