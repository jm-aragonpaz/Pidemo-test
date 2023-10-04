import React, { useState, useEffect } from "react";
import axios from "axios";
import ProductCard from "./components/ProductCard";
import Header from "./components/Header";
import AuthenticateOnPageLoad from './utils/LogIn';

type MyPaymentMetadata = {};

type AuthResult = {
  accessToken: string;
  user: {
    uid: string;
    username: string;
  };
};

export type User = AuthResult["user"];

interface PaymentDTO {
  amount: number;
  user_uid: string;
  created_at: string;
  identifier: string;
  metadata: Object;
  memo: string;
  status: {
    developer_approved: boolean;
    transaction_verified: boolean;
    developer_completed: boolean;
    cancelled: boolean;
    user_cancelled: boolean;
  };
  to_address: string;
  transaction: null | {
    txid: string;
    verified: boolean;
    _link: string;
  };
}

// Make TS accept the existence of our window.__ENV object - defined in index.html:
interface WindowWithEnv extends Window {
  __ENV?: {
    backendURL: string; // REACT_APP_BACKEND_URL environment variable
    sandbox: "true" | "false"; // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
  };
}

const _window: WindowWithEnv = window;
const backendURL = _window.__ENV && _window.__ENV.backendURL;

const axiosClient = axios.create({
  baseURL: `${backendURL}`,
  timeout: 20000,
  withCredentials: true,
});
const config = {
  headers: {
    "Content-Type": "application/json",
    "Access-Control-Allow-Origin": "*",
  },
};

export default function Shop() {
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    async function fetchData() {
      try {
        const usuarioAutenticado = await AuthenticateOnPageLoad();
        setUser(usuarioAutenticado);
      } catch (error) {
        console.error("Error al cargar el usuario:", error);
      }
    }

    fetchData();
  }, []);


  const orderProduct = async (
    memo: string,
    amount: number,
    paymentMetadata: MyPaymentMetadata
  ) => {
    const paymentData = { amount, memo, metadata: paymentMetadata };
    const callbacks = {
      onReadyForServerApproval,
      onReadyForServerCompletion,
      onCancel,
      onError,
    };
    const payment = await window.Pi.createPayment(paymentData, callbacks);
    console.log(payment);
  };

  const onReadyForServerApproval = (paymentId: string) => {
    console.log("onReadyForServerApproval", paymentId);
    axiosClient.post("/payments/approve", { paymentId }, config);
  };

  const onReadyForServerCompletion = (paymentId: string, txid: string) => {
    console.log("onReadyForServerCompletion", paymentId, txid);
    axiosClient.post("/payments/complete", { paymentId, txid }, config);
  };

  const onCancel = (paymentId: string) => {
    console.log("onCancel", paymentId);
    return axiosClient.post("/payments/cancelled_payment", { paymentId });
  };

  const onError = (error: Error, payment?: PaymentDTO) => {
    console.log("onError", error);
    if (payment) {
      console.log(payment);
      // handle the error accordingly
    }
  };

  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  const handleInputChange = (event: any) => {
    setTextInput(event.target.value);
  };
  const handleApiRequest = async () => {
    try {
      const apiUrl = "https://fastapi-production-2a5c.up.railway.app/get-meme/";
      const requestData = { texto: textInput };

      const response = await fetch(apiUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(requestData),
      });
      console.log(response);
      if (response.ok) {
        const blob = await response.blob();
        const imageUrl = URL.createObjectURL(blob);
        setApiResponse(imageUrl);
      } else {
        console.error("Error en la solicitud a la API.");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };
  return (
    <>
        <Header user={user} />
      <h1>Mementor</h1>
      <input
        type="text"
        placeholder="Ingrese el texto"
        value={textInput}
        onChange={handleInputChange}
      />
      <button onClick={handleApiRequest}>Get meme!</button>
      {apiResponse && <img src={apiResponse} alt="Imagen de la API" />}

    </>
  );
}
