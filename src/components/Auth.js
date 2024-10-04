/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable jsx-a11y/anchor-is-valid */
// src/components/Auth.js
import React, { useState } from 'react';
import axios from 'axios';
import styled from 'styled-components';
import EmailInput from './EmailInput';
import PasswordInput from './PasswordInput';
import OTPInput from './OtpInput';
import RegisterInput from './RegisterInput';

const AuthContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 100vh;
  background: linear-gradient(to right, #6a11cb, #2575fc);
  color: white;
  font-family: 'Arial', sans-serif;
`;

const Title = styled.h1`
  margin-bottom: 20px;
  font-size: 2.5em;
  text-align: center;
`;

const Button = styled.button`
  background: #ffffff;
  color: #6a11cb;
  border: none;
  border-radius: 5px;
  padding: 10px 20px;
  font-size: 1em;
  cursor: pointer;
  transition: background 0.3s, transform 0.3s;

  &:hover {
    background: #f0f0f0;
    transform: scale(1.05);
  }
`;

const Auth = () => {
    const [userEmail, setUserEmail] = useState('');
    const [isUserRegistered, setIsUserRegistered] = useState(false);
    const [isUserLoggedIn, setIsUserLoggedIn] = useState(false);
    const [authToken, setAuthToken] = useState('')
    const [password, setPassword] = useState('');
    const [otp, setOtp] = useState('');
    const [name, setName] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isOtpSent, setIsOtpSent] = useState(false);
    const [collectOtp, setCollectOtp] = useState(false);
    const [isOtpVerified, setIsOtpVerified] = useState(true);

    const handleEmailSubmit = async () => {
        try {
            const response = await axios.post("http://localhost:3001/user/verify/email", 
                {email : userEmail}
             );
             console.log("response :: ", response.data)
             if (response.data) {
                console.log("done ")
                 setIsUserRegistered(true);
             } else {
                setIsUserRegistered(false)
                await handleSendOtp()
             }
        } catch(err) {
            setIsUserRegistered(false)
            await handleSendOtp()
        }
       
    };

    const handleLogin = async () => {
        try {
            const response = await axios.post("http://localhost:3001/user/login", 
                {email : userEmail, password: password}
             );
             if (response.data.code === "user_login_success") {
                setIsUserLoggedIn(true)
                setAuthToken(response.data.token)
                fetchUserData()
             } else {
                setIsUserLoggedIn(false)
             }
        } catch(err) {
            setIsUserLoggedIn(false)
        }
    };

    const fetchUserData = async () => {
        try {
            console.log("user data :: ", authToken)
            const headers = {
                'Content-Type': 'application/json',
                'Authorization': authToken
              }
            const response = await axios.post("http://localhost:3001/user/verify", 
                {email : userEmail, password: password}, {headers}
             );
             if (response.data.code === "user_verification_success") {
                setName(response.data.name)
             }
        } catch(err) {
            setIsUserLoggedIn(false)
        }
    }
    const handleSendOtp = async () => {
        setIsLoading(true)
        try {
            const response = await axios.post("http://localhost:3001/user/sendotp", 
                {email : userEmail},
             );
             if (response.data.message === "OTP sent successfully") {
                setCollectOtp(true)
                setIsLoading(false)
             }
        } catch(err) {
            setIsLoading(false)
            console.log("err", err)
        }
    };

    React.useEffect(() => {
        fetchUserData();
      }, [authToken]);

    const handleVerifyOtp = async () => {
        console.log("verifying otp :: ", otp)
        const response = await axios.post('http://localhost:3001/user/verify/otp', { email:userEmail, otp });
        if (response.data.code === 'otp_verification_success') {
            setIsOtpVerified(response.data.isVerified)
        }
    };

    const handleRegister = async () => {
        const response = await axios.post('http://localhost:3001/user/register', { email:userEmail, otp, name, password });
        if (response.data.code === 'user_registration_success') {
            setIsUserLoggedIn(true)
            setAuthToken(response.data.token)
        }
    };

    return (
        <div>
            {isUserLoggedIn && 
                <>
                    <div class="bg-white">
                        <header class="absolute inset-x-0 top-0 z-50">
                            <nav class="flex items-center justify-between p-6 lg:px-8" aria-label="Global">
                            <div class="flex lg:flex-1">
                                <a href="#" class="-m-1.5 p-1.5">
                                <img class="h-8 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="" />
                                </a>
                                <a href="#" class="text-sm font-semibold leading-6 text-green-700 pl-5 pt-1">Slot Booker</a>
                            </div>
                            <div class="hidden lg:flex lg:gap-x-12">
                                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Book Slot</a>
                                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Available Rooms</a>
                            </div>
                            </nav>
                        </header>

                        <div class="relative isolate lg:px-8">
                            <div class="mx-auto max-w-2xl py-32 sm:py-48 lg:py-56">
                            <div class="text-center">
                                <h1 class="text-balance text-4xl font-bold tracking-tight text-gray-900 sm:text-6xl">Book Through Slot Booker</h1>
                                <p class="mt-6 text-lg leading-8 text-gray-600">Hi <p class="text-green-600 inline-block">{name}</p>, please proceed to book slots</p>
                                <div class="mt-10 flex items-center justify-center gap-x-6">
                                <a href="#" class="rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600">Proceed</a>
                                <a href="#" class="text-sm font-semibold leading-6 text-gray-900">Learn more <span aria-hidden="true">→</span></a>
                                </div>
                            </div>
                            </div>
                            <div class="absolute inset-x-0 top-[calc(100%-13rem)] -z-10 transform-gpu overflow-hidden blur-3xl sm:top-[calc(100%-30rem)]" aria-hidden="true">
                            </div>
                        </div>
                    </div>
                </>
            }
            {!isUserLoggedIn && 
                <>
                    <div class="flex min-h-full flex-col justify-center px-6 py-12 lg:px-8">
        
        <div class="sm:mx-auto sm:w-full sm:max-w-sm">
            <img class="mx-auto h-10 w-auto" src="https://tailwindui.com/plus/img/logos/mark.svg?color=indigo&shade=600" alt="Your Company" />
            <h2 class="mt-10 text-center text-2xl font-bold leading-9 tracking-tight text-gray-900">Register / SignIn in to <h2 class="text-green-500">Slot Booker</h2></h2>
        </div>

        <div class="mt-10 sm:mx-auto sm:w-full sm:max-w-sm">
            <div>
                <label for="email" class="block text-sm font-medium leading-6 text-gray-900">Email address</label>
                <div class="mt-2">
                <input 
                    id="email"
                    name="email" 
                    type="email" 
                    value={userEmail}
                    onChange={(e) => setUserEmail(e.target.value)}
                    autocomplete="email" 
                    required 
                    class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-600 sm:text-sm sm:leading-6" 
                />
                </div>
            </div>
            {isUserRegistered && 
            <>
                <div>
                    <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Password</label>
                    <div class="text-sm">
                        <a href="#" class="font-semibold text-indigo-600 hover:text-indigo-500">Forgot password?</a>
                    </div>
                    </div>
                    <div class="mt-2">
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        autocomplete="current-password" 
                        required 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                    </div>
                </div>
            </>
            }
            {isLoading && 
                <>
                    Loading ...
                </>
            }
            {!isUserRegistered && collectOtp &&
            <>
                <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">New Password</label>
                </div>
                <div class="mt-2">
                    <input 
                        id="password" 
                        name="password" 
                        type="password" 
                        autocomplete="current-password" 
                        required 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6" 
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">OTP</label>
                    </div>
                    <div class="mt-2">
                    <input 
                        id="otp" 
                        name="otp" 
                        type="password" 
                        required 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6" 
                        value={otp}
                        onChange={(e) => setOtp(e.target.value)}/>
                    </div>
                </div>
                <div>
                    <div class="flex items-center justify-between">
                    <label for="password" class="block text-sm font-medium leading-6 text-gray-900">Name</label>
                    </div>
                    <div class="mt-2">
                    <input 
                        id="name" 
                        name="name" 
                        type="name" 
                        required 
                        class="block w-full rounded-md border-0 py-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-green-500 sm:text-sm sm:leading-6" 
                        value={name}
                        onChange={(e) => setName(e.target.value)}/>
                    </div>
                </div>
            </>
            }
            <div>
                {isUserRegistered && 
                    <>
                        <button type="submit" class="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600" onClick={handleLogin}>
                            Login
                        </button>
                    </>
                }
                {!isUserRegistered && collectOtp &&
                    <>
                        <button type="submit" class="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600" onClick={handleRegister}>
                            Register
                        </button>
                    </>
                }
                {!isUserRegistered && !collectOtp &&
                    <>
                        <button type="submit" class="mt-5 flex w-full justify-center rounded-md bg-indigo-600 px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:bg-green-600" onClick={handleEmailSubmit}>
                            Register
                        </button>
                    </>
                }
        
            </div>
            {isUserRegistered && 
                <>
                    <p class="mt-10 text-center text-sm text-gray-500">
                        Forgot Password?
                        <a href="#" class="font-semibold leading-6 text-indigo-600 hover:text-indigo-500">Reset Password</a>
                    </p>
                </>
            }
           
        </div>
    </div>
                
                </>
            }
        </div>
        
    
    );
};

export default Auth;
