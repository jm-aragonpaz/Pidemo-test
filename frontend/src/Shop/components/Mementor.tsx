import {
  Box,
  Button,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import React, { useState } from "react";

export default function Mementor() {
  const [apiResponse, setApiResponse] = useState<string | null>(null);
  const [textInput, setTextInput] = useState("");
  const [meme, setMeme] = useState("");
  const [loading, setLoading] = useState(false);

  const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setTextInput(event.target.value);
  };

  const handleApiRequest = async () => {
    setLoading(true);
    try {
      const apiUrl = "https://fastapi-production-2a5c.up.railway.app/get-meme/";
      const requestData = { texto: textInput, meme: meme };

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
    setLoading(false);
  };

  return (
    <div style={{ textAlign: "center" }}>
      <h1>Mementor</h1>
      <p>
        {/* <textarea
          text="text"
          placeholder="Input text"
          value={textInput}
          onChange={handleInputChange}
        /> */}
        <TextField
          color="secondary"
          label="Input text"
          variant="outlined"
          multiline
          rows={4}
          placeholder="Input text"
          onChange={handleInputChange}
          value={textInput}
        />
      </p>

      {/* <label>Select a meme:</label> */}
      <p>
        <Box sx={{ width: 200, margin: "0 auto" }}>
          <FormControl fullWidth>
            <InputLabel color="secondary" id="select-label">
              Select meme template
            </InputLabel>
            <Select
              color="secondary"
              labelId="select-label"
              value={meme}
              label="Select meme template"
              onChange={(e) => setMeme(e.target.value)}
              placeholder="Select a meme template"
            >
              <MenuItem value="disaster">Disaster girl</MenuItem>
              <MenuItem value="distracted">Distracted boyfriend</MenuItem>
            </Select>
          </FormControl>
        </Box>
        {/* <select value={meme} onChange={(e) => setMeme(e.target.value)}>
          <option value="" disabled>
            Select a meme template
          </option>
          <option value="disaster">Disaster Girl</option>
          <option value="distracted">Distracted Boyfriend</option>
        </select> */}
      </p>
      {/* <button onClick={handleApiRequest}>Get meme!</button> */}
      <Button
        color="secondary"
        onClick={handleApiRequest}
        disabled={loading}
        variant="outlined"
      >
        Get meme
      </Button>
      <p>
        {loading && <CircularProgress color="secondary" />}
        {apiResponse && !loading && (
          <img width="800px" src={apiResponse} alt="Imagen de la API" />
        )}
      </p>
    </div>
  );
}
