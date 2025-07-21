"use client";
import Image from "next/image";

import React, { useState } from 'react';
import './LoginForm.css';

const LoginForm: React.FC = () => {
  const [userName, setUserName] = useState<string>('');

  const handleSubmit = () => {

  };

  return (
    <div className="login-container">
      <Image
        src="/logo.png"
        alt="maplestory logo"
        width={100}
        height={100}
      />

      <form className="login-form" onSubmit={handleSubmit}>
        <div className="form-group">
          <input
            id="userName"
            value={userName}
            onChange={(e) => setUserName(e.target.value)}
            required
          />
        </div>
        <button type="submit" className="login-button">시작하기</button>
      </form>
    </div>
  );
};

export default LoginForm;
