const User = require("../models/User");
const bcrypt = require("bcrypt");

const authController = {
    registerUser: (async (req, res) => {
        try{
            const { name, email, password } = req.body;
            const existingUser = await User.findOne({ email });
            if (existingUser) {
                res.status(400).json({ message: "User already exists" });
                return;
            }

            const hashedPassword = await bcrypt.hash(password, 10);

            const newUser = new User({
                name,
                email,
                password: hashedPassword
            });

            await newUser.save();
            res.status(201).json({ message: "User created successfully" });

        } catch (error) {
            res.status(500).json({ message: "Server error" });
        }
    })
}

module.exports = authController;