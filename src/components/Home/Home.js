import React from "react";
import LoginForm from "../LoginForm/LoginForm";
import "./Home.css";

function Home() {
  return (
    <div className="Home">
      <div className="Home-left">
            <div style={{ marginLeft: "30%", width: "100%" }}>
              <img
                width="40%"
                src="https://www.linkpicture.com/q/uoh-logo.png"
              />
            </div>
      <div
          style={{
            fontSize: "38px",
            color: "green",
            textAlign: "center",
            margin: "auto",
            borderBottom: "5px solid green",
            padding: "5px",
            borderRadius: "20px",
            width: "fit-content",
            marginTop: "50px",
            fontFamily: "monospace",
          }}
        >
          School of Computer and Information Sciences<br/>Recuriting Website
        </div>
        
        
      </div>
      <div className="Home-right">
        <LoginForm />
      </div>
    </div>
  );
}

export default Home;
