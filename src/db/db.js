import mongoose from 'mongoose';

const connection={};

const connectDB = async()=>{
    if(connection.isConnected){
        console.log('Using existing connection');
        return;
    }
    try {
        const connect = await mongoose.connect(process.env.MONGO_URI)
        connection.isConnected=connect.connections[0].readyState;
        console.log(connection.isConnected);
        console.log('DB Connected');

        
    } catch (error) {
        console.log('DB Connection Error:', error);
        process.exit(1);
        
    }
}

export default connectDB;