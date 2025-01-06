import dotenv from "dotenv";
import cors from 'cors'

dotenv.config()
import express,{ Request,Response} from "express"
import { ConnectDb } from "./config/db";
import  UserRoutes  from "./routes/MainRouter";
const app =express()


app.use(express.json());
app.use(cors())

ConnectDb()
const PORT=process.env.PORT



app.use("/api",UserRoutes)


app.listen(PORT,()=>{
    console.log(`RESTAURANT API RUNNING ON ${PORT}`);
    

})