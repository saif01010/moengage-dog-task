import CredntialsProvider from 'next-auth/providers/credentials';
import User from '@/models/user.model';
import bycrypt from 'bcryptjs';
import connectDB from '@/db/db';
export const authOptions = {
    providers:[
        CredntialsProvider({
            id: "credentials",
            name: "Credentials",
            credentials: {
                email: { label: "email", type: "text", placeholder: "Enter Your Email" },
                password: { label: "Password", type: "password" }
              },
              async  authorize(credentials) {
                await connectDB();
                try {
                    const user = await User.findOne({
                        email: credentials.email
                    })
                    if(!user){
                        throw new Error("No user found");
                    }
                    // console.log(user)
                    
                    const isValid = await bycrypt.compare(credentials.password, user.password);
                    if(isValid){
                        return user;
                    }else{
                        throw new Error("Password is incorrect");
                    
                    }
                } catch (err) {
                    console.log(err);
                    
                    throw new Error("Something went wrong",);
                }
            }
        })
    ],
    callbacks:{
        async jwt({token,user}){
            if(user){
                token._id = user._id?.toString(),
                token.fullName = user.fullName;
                token.email = user.email;
            }
            return token;
        },
        async session({session,token}){
            session.user = token;
            return session;
        }
    },
    pages:{
        signIn: "/sign-in"
    },
    secret: process.env.NEXTAUTH_SECRET,

}