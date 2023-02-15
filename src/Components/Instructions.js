import { padding, textAlign } from "@mui/system";
import { useNavigate } from "react-router-dom";

export default()=>{

    const navigate = useNavigate();

    return(
        <div dir="rtl"  style={{textAlign:"right", margin: "5%"}} >
        <h1>שלום {sessionStorage.getItem('firstName')} {sessionStorage.getItem('lastName')},</h1>
        <br/> <p style={{fontSize:20}}> <u>  הוראות המערכת:</u>
      <br/><br/>
         יש להזין את פרטי המשתמש
         <br/>
         אם קיימים ילדים - יש להזין גם את פרטיהם<br/>
         כל השדות (של המשתמש וילדיו) הם שדות חובה<br/>
         רק כאשר כל השדות יהיו מלאים ניתן לשמור את הפרטים<br/>

         כרגע בעבודה: בזמן השמירה הפרטים יועברו לקובץ אקסל<br/>


      </p>
      <br/>
        <button class="btn btn-primary" onClick={()=>{navigate(`/form`)}}>חזרה למערכת</button>
        </div>

    )
}