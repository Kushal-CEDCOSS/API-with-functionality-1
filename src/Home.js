import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import HomeStyle from "./Home.module.css";
import { TextField, Button } from "@shopify/polaris";

const Home = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [status, setStatus] = useState([]);
  const [isClicked, setIsClicked] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const validate = () => {
    setIsClicked(true);
    var username = name;
    var userPassword = password;
    callAPI(username, userPassword);
  };

  const callAPI = async (username, userPassword) => {
    var options = {
      method: "POST",
      headers: {
        Authorization:
          "eyJ0eXAiOiJKV1QiLCJhbGciOiJSUzI1NiJ9.eyJ1c2VyX2lkIjoiMSIsInJvbGUiOiJhcHAiLCJpYXQiOjE1MzkwNTk5NzgsImlzcyI6Imh0dHBzOlwvXC9hcHBzLmNlZGNvbW1lcmNlLmNvbSIsImF1ZCI6ImV4YW1wbGUuY29tIiwibmJmIjoxNTM5MDU5OTc4LCJ0b2tlbl9pZCI6MTUzOTA1OTk3OH0.GRSNBwvFrYe4H7FBkDISVee27fNfd1LiocugSntzxAUq_PIioj4-fDnuKYh-WHsTdIFMHIbtyt-uNI1uStVPJQ4K2oYrR_OmVe5_zW4fetHyFmoOuoulR1htZlX8pDXHeybRMYlkk95nKZZAYQDB0Lpq8gxnTCOSITTDES0Jbs9MENwZWVLfyZk6vkMhMoIAtETDXdElIdWjP6W_Q1kdzhwqatnUyzOBTdjd_pt9ZkbHHYnv6gUWiQV1bifWpMO5BYsSGR-MW3VzLqsH4QetZ-DC_AuF4W2FvdjMRpHrsCgqlDL4I4ZgHJVp-iXGfpug3sJKx_2AJ_2aT1k5sQYOMA",
      },
    };

    fetch(
      `https://fbapi.sellernext.com/user/login?username=${username}&password=${userPassword}`,
      options
    )
      .then((res) => res.json())
      .then((result) => setStatus(result));
  };

  useEffect(() => {
    if (status.length === 0) {
      return;
    } 
    else 
    {
      setIsClicked(false);
      if(status.success) {
        sessionStorage.setItem("User", status.data.token);
        setError("");
        navigate("/dashboard");
      }
      else
      {
        setError(status.message);
      }
    }
  }, [status]);

  return (
    <div className={HomeStyle.Home}>
      <div className={HomeStyle.formArea}>
        <TextField
          label="Username"
          type="text"
          value={name}
          placeholder="Username"
          onChange={(e) => setName(e)}
          helpText={<span>We’ll show this Username to your profile.</span>}
        />

        <TextField
          label="Password"
          type="password"
          value={password}
          placeholder="Password"
          onChange={(e) => setPassword(e)}
          helpText={<span>Never disclose your password to anyone.</span>}
        />
        {isClicked ? (
          <Button loading primary size="large">
            Log In
          </Button>
        ) : (
          <Button onClick={validate} primary>
            Log In
          </Button>
        )}
        {error.length === 0 ? "" : <h1>{error}</h1>}
      </div>
    </div>
  );
};

export default Home;
