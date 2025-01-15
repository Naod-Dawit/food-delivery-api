import dotenv from "dotenv";
import cors from 'cors'

dotenv.config()
import express,{ } from "express"
import { ConnectDb } from "./config/db";
import  UserRoutes  from "./routes/MainRouter";
import { webhook } from "./controllers/Food Order/Checkout";
const app =express()

app.use(
    "/api/webhook",
    express.raw({ type: 'application/json' }),
    webhook
  );
  
app.use(express.json());

app.post(
  "/api/webhook",
  webhook
);
app.use(cors())

ConnectDb()
const PORT=process.env.PORT


app.use("/api",UserRoutes)


app.listen(PORT,()=>{
    console.log(`RESTAURANT API RUNNING ON ${PORT}`);
    

})