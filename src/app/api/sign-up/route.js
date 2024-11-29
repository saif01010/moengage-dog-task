import connectDB from '@/db/db';
import User from '@/models/user.model';



export async function POST (req){
    await connectDB();
    try {
        const {fullName, email, password} =  await req.json()
        console.log(fullName, email, password)
        if(!fullName || !email || !password){
            return Response.json({message:'Please fill all fields'},{status:400})
        }
        const user = await User.findOne({email})
        if(user){
            return Response.json({message:'User already exists'}, {status:400})
    }
    console.log(user)
    const newUser = await User.create({
        fullName,
        email,
        password
    })
    const data = await User.findOne({email}).select('-password')

    return Response.json({message:'User created successfully',data:data},{status:201})

    }catch(error){
        console.log("Error in SignUp", error)
        return Response.json({error:error.message},{status:500})
    }
}