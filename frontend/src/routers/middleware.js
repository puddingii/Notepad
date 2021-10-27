import jwt from "jsonwebtoken";
import fetch from "node-fetch";
import { SECURE_INFO } from "../../config/env.js";

export const loginStatus = (req, res, next) => {
    if (req.session.userToken) {
        jwt.verify(req.session.userToken, SECURE_INFO.JWT_SECRET, (err, decoded) => {
            if (decoded) {
                req.session.userId = decoded.email;
                next();
            } else {
                fetch("https://localhost:8050/api/users/logout", {
                    method: "post",
                    headers: {
                        "Content-type": "application/json"
                    },
                    body: JSON.stringify({ email: req.session.userId })
                });
                req.session.userId = false;
                return res.redirect("/login");
            }
        });
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