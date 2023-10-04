import React, { useState } from "react";

export default function Mementor() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
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
    <div>
      <h1>Mementor</h1>
      <input
        type="text"
        placeholder="Ingrese el texto"
        value={textInput}
        onChange={handleInputChange}
      />
      <button onClick={handleApiRequest}>Get meme!</button>
      {apiResponse && <img src={apiResponse} alt="Imagen de la API" />}
    </div>
  );
}
