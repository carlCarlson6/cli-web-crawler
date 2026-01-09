import "dotenv/config";
import express from 'express';
import cors from "cors";
import { mapSaveCliEndpoint } from "./saveCliEndpoint";

let app = express()
const PORT = 3000;

app.use(cors({
  origin: true,
  credentials: true
}));
app.use(express.json());

app = mapSaveCliEndpoint(app);

app.listen(PORT, () => {
  console.log(`Example app listening at http://localhost:${PORT}`)
});