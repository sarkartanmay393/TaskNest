import React from "react";
import { useNavigate } from "react-router-dom";
import { headers } from "../worker/WebWorker";
import { baseUrl } from "../lib/network";

export default function SignupPage() {
  const navigate = useNavigate();
  const [email, setEmail] = React.useState("");
  const [password, setPassword] = React.useState("");
  const [error, setError] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);

  const handleSubmit = async () => {
    setError("");
    setIsLoading(true);

    const credentials = JSON.stringify({
      email: email,
      password: password,
    });

    try {
      const resp = await fetch(baseUrl + '/api/signup', {
        method: 'POST',
        headers: headers,
        body: credentials,
      });

      const newUser = await resp.json();
      if (resp.status === 401) {
        setError(newUser);
      } else {
        setEmail("");
        setPassword("");
        navigate('/')
      }

      setIsLoading(false);
    }
    catch (error) {
      setError(`${error}`)
      console.log(`Error appeared: ${error}`)
    };

  }


  const handleOnChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    switch (e.target.name) {
      case "email": {
        setEmail(() => e.target.value);
        break;
      }
      case "password": {
        setPassword(() => e.target.value);
        break;
      }
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[100vh]">
      <div className="grid p-4 w-full md:w-[50%] lg:w-[30%] rounded-[2px] border-[1px] border-solid border-black gap-2 bg-green-100 mt-[-2rem]">
        <h2 className="text-[3rem] font-[500] mt-[-0.6rem]">
          Signup
        </h2>
        <p className="text-[1rem] font-[400] ">
          Alreay got one! <a className="inline font-[500]" href="/login">Login here</a>
        </p>
        <div className="grid gap-2">
          <input className="h-[36px] px-2 rounded-[2px] border-[1px] border-solid border-black"
            name="email" type="text" value={email} onChange={handleOnChange} placeholder="Type your Email" />
          <input className="h-[36px] px-2 rounded-[2px] border-[1px] border-solid border-black"
            name="password" type="password" value={password} onChange={handleOnChange} placeholder="A Strong Password" />
          <button className="h-[28px] px-2 rounded-[2px] border-[1px] border-solid border-black cursor-pointer font-[500] bg-pink-100 hover:bg-pink-200"
            type="button" onClick={handleSubmit}>{isLoading ? '⏳' : "Submit"}</button>
          <div style={{ display: error ? 'flex' : 'none' }} className="min-h-[28px] items-center px-2 rounded-[2px] cursor-pointer text-md bg-red-300 hover:bg-pink-200">
            {error && error}
          </div>
        </div>
      </div>
    </div>
  );
}