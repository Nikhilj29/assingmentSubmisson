import mongoose from "mongoose";


mongoose.connect("mongodb://localhost:27017/assingment").then((res) => {
    console.log(res, "connected mongo")
}).catch((error) => {
    console.log(error, "mongo error");
})

const loginSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    }
});


const assingmentSchema = new mongoose.Schema({
    student: {
        type: String,
        required: true
    },
    assingment: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true
    }
});

const statusSchema = new mongoose.Schema({
    action: {
        type: String,
        required: true
    },
    student: {
        type: String,
        required: true
    },
    assingment: {
        type: String,
        required: true
    },
    admin: {
        type: String,
        required: true
    }

})

export const userModel = new mongoose.model("userLogin", loginSchema);

export const adminModel = new mongoose.model("adminLogin", loginSchema);

export const assingmentModel = new mongoose.model("assingmnet", assingmentSchema);

export const statusModel = new mongoose.model("status", statusSchema);