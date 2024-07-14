import mongoose from "mongoose";
import 'dotenv/config'
const dbName =process.env.DB_NAME;

const  dnUserName = process.env.DB_USERNAME || "";

const  dbPassword = process.env.DB_PASSWORD || "";
const dbCluster = process.env.DB_CLUSTER || "localhost:27017";

const cloudUri =`mongodb+srv://${dnUserName}:${dbPassword}@${dbCluster}/${dbName}?retryWrites=true&w=majority&appName=Cluster0`;
const mongooseDb = async () => {
    try{
        await mongoose.connect(cloudUri);
        
        console.log("mongodb:connect success")
    }
    catch(err){
        console.log("mongodb:connect failed");
        process.exit(1);
    }
}

export default mongooseDb;