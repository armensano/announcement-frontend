import axios, { AxiosError, AxiosResponse } from 'axios';
import Router from 'next/router'
import React from 'react';
const URL: string = process.env.SERVER_URL || 'http://localhost:8080';

function LoginPage() {
  const [errorMessage, setErrorMessage] = React.useState('');
  const handleSubmit  = async (e: any)=> {
    let response: AxiosResponse<any>
    e.preventDefault();
    const loginForm = e.target.form;
    const email = loginForm.elements.email.value;
    const password = loginForm.elements.password.value;
    try {
      response = await axios.post(`${URL}/auth/login`, {email, password})
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
  return (
    <div>
      <h1>Login</h1>
        <p>{errorMessage}</p>
      <form method="post" action="/" id="loginForm">
        <input type="text" placeholder="Email" name="email"/>
        <input type="password" placeholder="Password" name="password"/>
        <button type="submit" onClick={handleSubmit}>Login</button>
      </form>
    </div>
  );
}

export default LoginPage;