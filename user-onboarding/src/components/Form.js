import React, {useState, useEffect} from 'react';
import axios from 'axios';
import * as Yup from 'yup';
// import {BrowswerRouter as Redirect} from 'react-router-dom';
import './App.css';
import { Redirect } from 'react-router-dom';

const formSchema = Yup.object().shape({
    name: Yup.string(),
    email: Yup.string().email("required field").required("this is a required field"),
    password: Yup.string().min(8, "must be 8 characters long").required("this is a required field"),
    terms: Yup.boolean().oneOf([true], "you must accept terms and conditions to continue")
});

function Form() {
   const [formState, setFormState] = useState({
       name: "",
       email: "", 
       password: "", 
       terms: false
   });

   const [postState, setPostState] = useState ({});
   const [errorState, setErrorState] = useState({
        name: "",
        email: "", 
        password: "", 
        terms: ""

   })

   useEffect(()=> {
       formSchema.isValid(formState).then(valid=> {
           setButtonDisabled(!valid);
       });
   }, [formState])

   

   const inputChange= (e) => {
       e.persist();
       Yup
      .reach(formSchema, e.target.name)
      .validate(e.target.value)
      .then(valid => {
        setErrorState({
          ...errorState,
          [e.target.name]: ""
        });
      })
      .catch(err => {
        setErrorState({
          ...errorState,
          [e.target.name]: err.errors[0]
        });
      });

       setFormState({
       ...formState,
       [e.target.name]: e.target.value
    });

    };

    const formSubmit=(e) => {
       e.preventDefault();
       console.log("this is submitted");
       axios
        .post("https://reqres.in/api/users", formState)
        .then (res=>{
            setPostState(res.data);
            console.log("success", res);
        })
        .catch(err => console.log(err.response));
    };

  return (
    <div className="App">
   
   
    <form>
        <label htmlFor="name">
            <input type="text"name="name" id="name" value={formState.name} onChange={inputChange}/>
            {/* errors placeholder */}
        </label>
        <label htmlFor="email">
            <input type="email"name="email" id="email" value={formState.email} onChange={inputChange}/>
            {/* errors placeholder */}
        </label>
        <label htmlFor="password">
            <input type="password"name="password" id="password" value={formState.password} onChange={inputChange}/>
            {/* errors placeholder */}
        </label>
        <label htmlFor="terms">
            <input type="checkbox"name="terms" id="terms" checked={formState.terms}  onChange={inputChange}/>
            {/* errors placeholder  */}
        </label>

        <button onSubmit={formSubmit}>Submit!</button>
    </form>
    </div>
  );
};

export default Form;
