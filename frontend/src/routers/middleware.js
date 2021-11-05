import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { SECURE_INFO } from "../../config/env.js";

export const loginStatus = async (req, res, next) => {
    if (req.session.userToken) {
        try {
            const response = await fetch("https://localhost:8050/api/users/loginStatus", {
                method: "post",
                headers: {
                    "Content-type": "application/json"
                },
                body: JSON.stringify({ email: req.session.userId })
            });
            const responseJson = await response.json();
            if (responseJson.loginStatus !== req.session.userToken) {
                throw new Error("Log out another browser");
            }

            jwt.verify(req.session.userToken, SECURE_INFO.JWT_SECRET, (err, decoded) => {
                if (decoded) {
                    next();
                }
                if (err) {
                    throw new Error("JWT Session Verify Error");
                }
            });
        } catch (e) {
            if (e.message === "JWT Session Verify Error") {
                await fetch("https://localhost:8050/api/users/logout", {
                    method: "post",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ email: req.session.userId })
                });
            }
            console.log(e);
            req.session.userId = false;
            return res.redirect("/login");
        }
    } else {
        return res.redirect("/login");
    }
};

export const logoutStatus = (req, res, next) => {
    if (!req.session.userId) {
        next();
    } else {
        return res.redirect("/");
    }
};