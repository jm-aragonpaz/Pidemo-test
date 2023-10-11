// import { useState } from "react";
// import axios from "axios";

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
// interface WindowWithEnv extends Window {
//   __ENV?: {
//     backendURL: string; // REACT_APP_BACKEND_URL environment variable
//     sandbox: "true" | "false"; // REACT_APP_SANDBOX_SDK environment variable - string, not boolean!
//   };
// }
// const _window: WindowWithEnv = window;
// const backendURL = _window.__ENV && _window.__ENV.backendURL;
// const axiosClient = axios.create({
//   baseURL: `${backendURL}`,
//   timeout: 20000,
//   withCredentials: true,
// });

const onIncompletePaymentFound = (payment: PaymentDTO) => {
  console.log("onIncompletePaymentFound", payment);
  // return axiosClient.post("/payments/incomplete", { payment });
};

async function AuthenticateOnPageLoad() {
  try {
    const scopes = ["username", "payments"];
    const authResult: AuthResult = await window.Pi.authenticate(
      scopes,
      onIncompletePaymentFound
    );
    return authResult.user;
  } catch (error) {
    console.error("Error en la autenticación automática:", error);
    return null;
  }
}
export default AuthenticateOnPageLoad;
