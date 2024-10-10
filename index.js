import express from "express";
import path from "path"
import { fileURLToPath } from "url";
import bodyParser from "body-parser";
import cors from "cors";
import { adminModel, userModel, assingmentModel, statusModel } from "./mongodb.js";

const app = express();

const port = 4000;
app.use(cors());
app.use(express.json());



app.use(bodyParser.urlencoded({ extended: true }))


const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


app.set('view engine', 'ejs');


app.set('views', path.join(__dirname, 'views'));

app.use(express.static(path.join(__dirname, 'public')));

app.get("/", (req, res) => {
    res.render("login.ejs");
});

app.get("/register", (req, res) => {
    res.render("register.ejs");
});


// app.get("/user", (req, res) => {
//     res.render("user.ejs");
// });

// app.get("/admin", (req, res) => {
//     res.render("admin.ejs");
// })

app.post("/login/user", async (req, res) => {
    console.log(req.body.username, req.body.password);
    const username = req.body.username;
    const password = req.body.password;

    // if (username === "User" && password === "Pass") {
    //     res.redirect("/user");
    // } else {
    //     res.redirect("/");
    // }

    try {
        const get = await userModel.findOne({ username });
        if (get.password === password) {
            res.render("user.ejs", { username: username });
        } else {
            window.alert("Incorrect Password");
            res.redirect("/")
        }
    } catch (err) {
        console.log(err);
        // alert("Got An Error");
        res.redirect("/");
    }

})

app.post("/login/admin", async (req, res) => {
    console.log(req.body.username, req.body.password);
    const username = req.body.username;
    const password = req.body.password;

    // if (username === "Admin" && password === "Pass") {
    //     res.redirect("/admin");
    // } else {
    //     res.redirect("/");
    // }
    try {
        const get = await adminModel.findOne({ username });
        if (get.password === password) {

            const adminData = await assingmentModel.find({ admin: username });
            // console.log(adminData);
            res.render("admin.ejs", { username: username, datas: adminData });
        } else {
            res.send("Incorrect Password");
        }
    } catch (err) {
        console.log(err);
        res.redirect("/");
    }

})

app.post("/register/user", async (req, res) => {
    console.log(req.body.username, req.body.password);

    const username = req.body.username;
    const password = req.body.password;
    const confirm = req.body.passwordc;

    if (password === confirm) {
        try {
            const data = { username, password };
            const response = await userModel.insertMany([data]);
            console.log(response, "Register Login");
            res.redirect("/user");
        } catch (err) {
            console.log(err);
            res.redirect("/register");
        }

    } else {
        res.send("Please Enter correct Password");
    }

    // if (password === confirm) {
    //     res.redirect("/user");
    // } else {
    //     res.redirect("/");
    // }

})

app.post("/register/admin", async (req, res) => {
    console.log(req.body.username, req.body.password);
    const username = req.body.username;
    const password = req.body.password;
    const confirm = req.body.passwordc;

    // if (password === confirm) {
    //     res.redirect("/admin");
    // } else {
    //     res.redirect("/register");
    // }

    if (password === confirm) {
        const data = { username, password };
        try {
            const response = await adminModel.insertMany([data]);
            console.log(response, "Register Login");
            res.redirect("/admin");
        } catch (err) {
            console.log(err);
            res.redirect("/register");
        }
    } else {
        res.send("Please Enter correct Password");
    }
});


app.post("/assingment", async (req, res) => {
    const assingment = req.body.assingment;
    const admin = req.body.admin;
    const username = req.body.user;
    console.log(assingment, admin, username);

    const data = {
        student: username,
        assingment: assingment,
        admin: admin,
    }
    await assingmentModel.insertMany([data]).then((e) => {
        console.log("Done Assingment");
        res.render("user.ejs");
    }).catch((err) => {
        console.log("Error Assoingment");
        res.render("user.ejs");
    });

})

app.post("/assingment/:id/accept", async (req, res) => {
    const data = req.params.id;
    console.log(data);

    const assingmentData = await assingmentModel.find({ _id: data });
    if (!assingmentData) {
        window.alert("ERRor in Getting Assingment");
    } else {
        console.log(assingmentData[0].student);
        const newData = {
            action: "APPROVE",
            student: assingmentData[0].student,
            assingment: assingmentData[0].assingment,
            admin: assingmentData[0].admin,
        }

        await statusModel.insertMany([newData]).then(async (e) => {
            await assingmentModel.deleteOne({ _id: data });
            const dataiwant = await assingmentModel.find({ admin: assingmentData[0].admin });
            console.log(dataiwant[0], "update");

            res.render("admin.ejs", { username: assingmentData[0].admin, datas: await assingmentModel.find({ admin: assingmentData[0].admin }) });
        })
    }
});

app.post("/assingment/:id/reject", async (req, res) => {
    const data = req.params.id;
    console.log(data);

    const assingmentData = await assingmentModel.find({ _id: data });
    if (!assingmentData) {
        window.alert("ERRor in Getting Assingment");
    } else {
        console.log(assingmentData[0].student);
        const newData = {
            action: "REJECT",
            student: assingmentData[0].student,
            assingment: assingmentData[0].assingment,
            admin: assingmentData[0].admin,
        }

        await statusModel.insertMany([newData]).then(async (e) => {
            await assingmentModel.deleteOne({ _id: data });
            const dataiwant = await assingmentModel.find({ admin: assingmentData[0].admin });
            res.render("admin.ejs", { username: assingmentData[0].admin, datas: dataiwant });
        })
    }
});

app.get("/getAdmin", async (req, res) => {

    const admin = await adminModel.find();
    res.render("getAdmin.ejs", { admins: admin });
})

app.get("/getStatus", async (req, res) => {
    const dataAssingment = await statusModel.find();
    console.log(dataAssingment);
    res.render("status.ejs", { admins: dataAssingment })
})
app.listen(port, (req, res) => {
    console.log(`Listening on the ${port}`);
});