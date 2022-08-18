import axios, { AxiosError, AxiosResponse } from "axios";
import Router from "next/router";
import React from "react";
import styles from '../../styles/Home.module.css'
const URL = process.env.SERVER_URL || 'http://ec2-18-215-176-40.compute-1.amazonaws.com:3000';

function SignUp () {
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleSubmit  = async (e: any)=> {
    let response: AxiosResponse<any>
    e.preventDefault();
    const signUpForm = e.target.form;
    const email = signUpForm.elements.email.value;
    const password = signUpForm.elements.password.value;
    const name = signUpForm.elements.name.value;
    try {
      response = await axios.post(`${URL}/auth/signup`, {email, password, name});
      const token: string = response.data.accessToken;
      if(!token) setErrorMessage('Please try again');
      localStorage.setItem('Authorization', token);
      
      Router.push('/')
    } catch (error: unknown) {
      if (error instanceof AxiosError) {
        const axiosError = error as AxiosError<any>;
        if (axiosError.response) {
          setErrorMessage(axiosError.response.data.message);
        }
      }
    }
  }

  const handleLogin = async (e: any) => {
    Router.push('/auth/login');
  }
  return (
    <div>
      <button onClick={handleLogin}>Log In</button>
      <h1>Sign Up</h1>
      <form method="post" className={styles.flexBox} action="http://ec2-18-215-176-40.compute-1.amazonaws.com:3000/auth/signup">
        <input type="text" placeholder="Name" name="name"/>
        <input type="email" placeholder="Email" name="email"/>
        <input type="password" placeholder="Password" name="password"/>
        <button type="submit" onClick={handleSubmit}>Sign Up</button>
      </form>
    </div>
  )
}

export default SignUp;