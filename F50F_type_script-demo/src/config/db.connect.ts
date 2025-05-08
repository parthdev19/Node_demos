import mongoose from "mongoose";
mongoose.set("strictQuery", true);
const url = process.env.MONGODB_DATABASE_URL as string;

const mongodbConnect = async () =>{
    try {
        await mongoose.connect(url, {});
        console.log("Successfully connected to database...");
    } catch (error) {
        console.log("Error to connected with mongodb : ",error);
        process.exit(1);
    }
};

mongoose.connection.on("error", (err) => {
  console.error("MongoDB connection error:", err);
});

export default mongodbConnect;