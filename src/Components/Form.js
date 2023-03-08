import { useForm } from "react-hook-form";
import React, { useEffect, useState, useContext } from "react";
import axios from 'axios'
import ChildInputs from "./ChildInputs";
import { useNavigate } from 'react-router-dom';
import exportToExcel from "./ExportToExcel";

export default () => {

    const navigate = useNavigate();
    const [childrenForForm, setChildrenForForm] = useState([]);
    const [isValid, setIsValid] = useState(true);

    const { register, handleSubmit, formState: { errors } } = useForm({
        mode: "onBlur"
    });
    const postUser = async (e) => {
        let userFromServer
        const user = {
            firstName: e.firstName, lastName: e.lastName, idNumber: e.idNumber, dateOfBirth: e.dateOfBirth,
            gender: parseInt(e.gender), HMO: parseInt(e.HMO)
        }
        await axios.get(`https://localhost:44381/api/Users/${e.idNumber}`)//check if this user is exists
            .then((d) => {
                console.log("data from get:", d)
                userFromServer = d.data
                console.log("user from server:", userFromServer)
            })
            .catch((error) => console.log("error from get", error))

        if (userFromServer === undefined || userFromServer === "") {//add the user if he is not exists
            await axios.post('https://localhost:44381/api/Users', user)
                .then((d) => console.log("data from post :", d))
                .catch((error) => console.log("error from get", error))
        }
        else {
            await axios.put(`https://localhost:44381/api/Users/${userFromServer.id}`, user)//update the user if he exists
                .then((d) => console.log("data from put :", d))
                .catch((error) => console.log("error from get", error))
        }
        return userFromServer
    }
    const postChild = async (e, userFromServer, i) => {
        let childFromServer
        const child = {
            name: sessionStorage.getItem(`child${i}Name`), idNumber: sessionStorage.getItem(`child${i}idNumber`), dateOfBirth:
                sessionStorage.getItem(`child${i}DateOfBirth`), idFather: null, idMother: null
        }

        await axios.get(`https://localhost:44381/api/Children/${sessionStorage.getItem(`child${i}idNumber`)}`)//check if this child is exists
            .then((d) => {
                console.log("data from get child number :", i, "  ", d)
                childFromServer = d.data
                console.log("child from server:", childFromServer)
            })
            .catch((error) => console.log("error from get", error))
        //set the child's parents
        if (e.gender === "1") {
            child.idFather = userFromServer.id
            if (!childFromServer === "")
                child.idMother = childFromServer.idMother
        }
        else {
            child.idMother = userFromServer.id
            if (!childFromServer === "")
                child.idFather = childFromServer.idFather
        }

        if (childFromServer === "") {//add the child if he is not exists
            console.log("child:", child)
            await axios.post('https://localhost:44381/api/Children', child)
                .then((d) => console.log("data from post child:", d))
                .catch((error) => console.log("error from get", error))
        }
        else {
            await axios.put(`https://localhost:44381/api/Children/${childFromServer.id}`, child)//update the child if he exists
                .then((d) => console.log("data from put :", d))
                .catch((error) => console.log("error from get", error))
        }
    }
    const checkCildInputs = (i) => {
        if (sessionStorage.getItem(`child${i}Name`) === null || sessionStorage.getItem(`child${i}idNumber`) === null ||
            sessionStorage.getItem(`child${i}DateOfBirth`) === null) {
            setIsValid(false)
            // var myDiv = document.createElement('label');
            // document.body.appendChild(myDiv);
            // myDiv.innerHTML='   *  '+ 'חסר מידע על ילד מספר ' + i  ;
            // myDiv.style.color = "red";
        }
    }
    const emptyInputs = () => {
        for (let i = 1; i <=  sessionStorage.getItem(`numOfChildren`); i++) {
            sessionStorage.setItem(`child${i}Name`,"")
            sessionStorage.setItem(`child${i}idNumber`,"")
            sessionStorage.setItem(`child${i}DateOfBirth`, "") 
        }
        sessionStorage.setItem(`firstName`,"")
        sessionStorage.setItem(`lastName`,"")
        sessionStorage.setItem(`idNumber`,"")
        sessionStorage.setItem(`date`,"")
        sessionStorage.setItem(`gender`,"")
        sessionStorage.setItem(`HMO`,"")
        sessionStorage.setItem(`numOfChildren`,"")
    }
    const onFormSubmit = async (e) => {
        exportToExcel()
        //check if all the inputs of the children are full
        for (let i = 1; i <= e.numOfChildren; i++) {
            checkCildInputs(i)
        }
        if (isValid) {//if the inputs are valid save the details in the server
            const userFromServer = await postUser(e)
            for (let i = 1; i <= e.numOfChildren; i++) {
                postChild(e, userFromServer, i)
            }
        }
        emptyInputs ()//empty the session storsge
        navigate(`/instructions`)//go to instructions
    }
    useEffect(() => {
        changeNumOfChildren()
      
    }, [])
    const changeNumOfChildren = (e) => {
        const c = [];
        for (let i = 1; i <= sessionStorage.getItem('numOfChildren'); i++) {
            c.push(<ChildInputs index={i} key={i} ></ChildInputs>)
        }
        setChildrenForForm(c)
    }
    const onErrors = errors => console.error(errors);

    const registerOptions = {

        firstName: { required: "שדה חובה" },
        gender: { required: "שדה חובה" },
        lastName: { required: "שדה חובה" },
        numOfChildren: {
            required: "שדה חובה",
            min: {
                value: 0,
                message: " יש להזין מספר חיובי"
            }
        },
        idNumber: {
            required: " שדה חובה",
            minLength: {
                value: 9,
                message: "יש להזין 9 ספרות"
            },
            maxLength: {
                value: 9,
                message: "יש להזין 9 ספרות"
            }
        },
        dateOfBirth: { required: "שדה חובה" },

    };

    return (
        <div dir="rtl" style={{ margin: "5%" }}  >

            <div>
                <h1 text-align="center" className="control-label col-md-8" style={{ display: "inline-block" }}> קליטת משתמשים וילדיהם</h1>
                <button className="btn btn-primary" onClick={() => { navigate(`/instructions`) }}> להוראות</button>
            </div>

            <form className="form-horizontal " onSubmit={handleSubmit(onFormSubmit, onErrors)}>


                <div className=" form-row form-group row">
                    <div className="col control-label col-sm-4 ">
                        <label className="control-label col-md-6">שם פרטי</label>
                        <div className="col-sm-10">
                            <input type="text" name="firstName" className="form-control"
                                defaultValue={sessionStorage.getItem('firstName')} onInput={(e) => {
                                    sessionStorage.setItem('firstName', e.target.value)
                                }}
                                {...register('firstName', registerOptions.firstName)} />
                            <small style={{ color: 'red' }}>  {errors?.firstName && errors.firstName.message}</small>

                        </div>
                    </div>

                    <div className="form-group col-md-4">
                        <label className="col control-label col-sm-6 ">  שם משפחה</label>
                        <div className="col-sm-10">
                            <input type="text" name="lastName" className="form-control "
                                defaultValue={sessionStorage.getItem('lastName')} onInput={(e) => {
                                    sessionStorage.setItem('lastName', e.target.value)
                                }}
                                {...register('lastName', registerOptions.lastName)} />
                            <small style={{ color: 'red' }}>  {errors?.lastName && errors.lastName.message}</small>


                        </div>

                    </div>
                </div>
                <div className=" form-row form-group row">
                    <div className="form-group col-md-4 ">
                        <label className="control-label col-sm-6">מספר זהות</label>
                        <div className="col-sm-10">
                            <input type="text" name="idNumber" className="form-control" pattern="[0-9]*"
                                defaultValue={sessionStorage.getItem('idNumber')} onInput={(e) => {
                                    sessionStorage.setItem('idNumber', e.target.value)
                                }}
                                {...register('idNumber', registerOptions.lastName)} />
                            <small style={{ color: 'red' }}>  {errors?.idNumber && errors.idNumber.message}</small>
                        </div>
                    </div>


                    <div className="form-group col-md-4">
                        <label className="control-label col-sm-6">תאריך לידה</label>
                        <div className="col-sm-10">
                            <input type="date" name="dateOfBirth" className="form-control" defaultValue={sessionStorage.getItem('date')} onInput={(e) => {
                                sessionStorage.setItem('date', e.target.value)
                            }}
                                {...register('dateOfBirth', registerOptions.dateOfBirth)} />
                            <small style={{ color: 'red' }}>  {errors?.dateOfBirth && errors.dateOfBirth.message}</small>
                        </div>
                    </div>
                </div>



                <div className="form-row form-group row">
                    <div className="form-group col-md-4">
                        <label className="control-label col-sm-2">מין</label>
                        <div className="col-sm-10">
                            <select id="gender" name="gender" className="form-select" onInput={(e) => {
                                sessionStorage.setItem('gender', e.target.value)
                            }}
                                {...register('gender', registerOptions.gender)} >
                                <option value="1">זכר</option>
                                <option value="2">נקבה</option>
                            </select>
                        </div>
                    </div>

                    <div className="form-group col-md-4">
                        <label className="col control-label col-sm-6">קופת חולים</label>
                        <div className="col-sm-10">
                            <select id="HMO" name="HMO" className="form-select"
                                onInput={(e) => {
                                    sessionStorage.setItem('HMO', e.target.value)
                                }}
                                {...register('HMO', registerOptions.HMO)}>
                                <option value="1">מכבי</option>
                                <option value="2">כללית</option>
                                <option value="3">מאוחדת</option>
                            </select>
                        </div>
                    </div>
                </div>

                <div className="form-group ">
                    <label className="control-label col-sm-2">מספר ילדים</label>
                    <div className="col-sm-8">
                        <input type="number" name="numOfChildren" className="form-control" defaultValue={sessionStorage.getItem('numOfChildren')}
                            onInput={(e) => {
                                sessionStorage.setItem('numOfChildren', e.target.value)
                                changeNumOfChildren()
                            }}
                            {...register('numOfChildren', registerOptions.numOfChildren)} />
                        <small style={{ color: 'red' }}>  {errors?.numOfChildren && errors.numOfChildren.message}</small>
                    </div>
                </div>
                {childrenForForm}
                <br />
                <br />




                <button className="btn btn-primary">אישור</button>

            </form>




        </div>
    )


}
