import mongoose, {Schema} from "mongoose";
import aggregatePaginate from 'mongoose-aggregate-paginate-v2';
import bcrypt from 'bcryptjs';
const userShcema = new Schema({
    fullName:{
        type: String,
        required: true
    },
    email:{
        type: String,
        required: true,
        unique: true
    },
    password:{
        type: String,
        required: true
    },

}, {timestamps: true});

userShcema.plugin(aggregatePaginate);
userShcema.methods.isPasswordMatch = async function(enteredPassword){
    return await bcrypt.compare(enteredPassword, this.password);
}
userShcema.pre('save', async function(next){
    if(!this.isModified('password')){
        next();
    }
    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);
    next();
});

let User = mongoose.models.User || mongoose.model('User', userShcema);

export default User;