import { Link, Route,Routes } from "react-router-dom"
import ExportToExcel from "./ExportToExcel"

import Form from "./Form"
import Instructions from "./Instructions"



export default()=>{
   return( <div>
      

{/* <Link to="/form" className="list-group-item list-group-item-action link-success btn-success">form</Link>
<Link to="/instructions" className="list-group-item list-group-item-action link-success btn-success">page</Link> */}
     


<Routes>
    <Route path="/form" element={<Form></Form>}/>
    <Route path="/" element={<Form></Form>}/>
    <Route path="/instructions" element={<Instructions></Instructions>}/>
    
</Routes>


   </div>)
}