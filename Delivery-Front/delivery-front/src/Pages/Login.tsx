import React, { useState } from 'react'
import { inputHelper, toastNotify } from '../Helper';
import { useLoginUserMutation } from '../apis/authApi';
import { apiResponse, userModel } from '../Interfaces';
import jwt_decode from "jwt-decode";
import { useDispatch } from 'react-redux';
import { setLoggedInUser } from '../Storage/Redux/userAuthSlice';
import { useNavigate } from 'react-router-dom';
import { MainLoader } from '../Components/Page/Common';

function Login() {
  const [error, setError] = useState("");
  const [loginUser] = useLoginUserMutation();
  const [loading, setLoading] = useState(false);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [userInput, setUserInput] = useState({
    userName: "",
    password: "",
  });

  const handleUserInput = (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const tempData = inputHelper(e, userInput);
    setUserInput(tempData);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setLoading(true);

    const response: apiResponse = await loginUser({
      userName: userInput.userName,
      password: userInput.password,
    });

    if (response.data) {
      //console.log(response.data);
      const { token } = response.data.result;
      const { fullName, id, email, role } : userModel = jwt_decode(token);
      localStorage.setItem("token", token);

      dispatch(setLoggedInUser({ fullName, id, email, role }));

      toastNotify("Uspešna prijava!");

      navigate("/");
    }
    else if(response.error){
      toastNotify(response.error.data.errorMessages[0], "error");
      setError(response.error.data.errorMessages[0]);
    }

    setLoading(false);
  }

  return (
    <div className="container text-center">
      {loading && <MainLoader />}
    <form method="post" onSubmit={handleSubmit}>
      <h1 className="mt-5">Prijava</h1>
      <div className="mt-5">
        <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
          <input
            type="text"
            className="form-control"
            placeholder="Unesite Korisničko Ime"
            required
            name = "userName"
            value = {userInput.userName}
            onChange={handleUserInput}
          />
        </div>

        <div className="col-sm-6 offset-sm-3 col-xs-12 mt-4">
          <input
            type="password"
            className="form-control"
            placeholder="Unesite Lozinku"
            required
            name = "password"
            value = {userInput.password}
            onChange={handleUserInput}
          />
        </div>
      </div>

        <div className="mt-2">
          {error && <p className='text-danger'>{error}</p>}
        <button
          type="submit"
          className="btn btn-outlined rounded-pill text-white mx-2"
          style={{ width: "200px", backgroundColor:"#8d3d5b" }}
        >
          Login
        </button>
      </div>
    </form>
    </div>
  )
}

export default Login
