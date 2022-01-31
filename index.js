import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import bcrypt from "bcrypt";
import { config } from "dotenv";
import path from "path";
import { dirname } from "path";
import { fileURLToPath } from "url";
const __fileName = fileURLToPath(import.meta.url);
const __dirname = dirname(__fileName);

const app = express();
app.use(express.static("public"));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json());
app.use(bodyParser.json());
config();
mongoose.connect(
	process.env.MONGO_STRING,
	{ useNewUrlParser: true, useUnifiedTopology: true },
	(err) => {
		if (err) console.log(err);
		else console.log("MongoDB connection successful");
	}
);
const userSchema = new mongoose.Schema({
	username: {
		type: String,
		required: [true, "No username found"],
	},
	password: {
		type: String,
		required: [true, "Please enter a password"],
	},
	email: String,
	fname: String,
	lname: String,
});
const User = mongoose.model("User", userSchema);

app.get("/", (req, res) => {
	User.find({}, (err, data) => {
		if (err) console.log(err);
		else {
			if (data) console.log(data);
			else
				console.log({
					status: 300,
					message: "No data found",
				});
		}
	});
	res.sendFile(path.join(__dirname, "index.html"));
});

app.get("/posts", (req, res) => {
	res.sendFile(path.join(__dirname, "public", "posts.html"));
});

app.route("/register")
	.get((req, res) => {
		res.sendFile(path.join(__dirname, "public", "register.html"));
	})
	.post((req, res) => {
		const newUser = new User({
			username: req.body.username,
			password: req.body.password,
			email: req.body.email,
			fname: req.body.fname,
			lname: req.body.lname,
		});
		// console.log(newUser);
		const savedUser = newUser.save();
		console.log(savedUser);
		/* newUser.save((err) => {
			if (err) console.log(err);
			else
				res.send({
					status: 400,
					message: "user registered successfuly",
				});
		}); */
	});

app.route("/login")
	.get((req, res) => {
		res.sendFile(path.join(__dirname, "public", "login.html"));
	})
	.post((req, res) => {
		let newUser = req.body;
		console.log(newUser);
		res.redirect("/");
	});

app.get("/verify", (req, res) => {
	res.send({
		status: 200,
		message: "user is logged in",
	});
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server started at port ${PORT}`));
