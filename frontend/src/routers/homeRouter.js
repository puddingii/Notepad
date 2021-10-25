import express from "express";
import fetch from "node-fetch";
import { loginStatus, logoutStatus } from "./middleware.js";
import axios from 'axios';
import https from 'https';

const homeRouter = express.Router();

homeRouter.get("/", loginStatus, async (req, res) => {
    try {
        const response = await fetch("https://localhost:8050/api/users/loginStatus", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email: req.session.userId })
        });
        const responseJson = await response.json();
        if (responseJson.loginStatus) {
            return res.render("home", { userId: req.session.userId });
        } else {
            req.session.userId = false;
            return res.redirect("/login");
        }
    } catch (e) {
        console.log(e);
        return res.redirect("/login");
    }
});

homeRouter.get("/login", logoutStatus, (req, res) => {
    return res.render("login");
});
process.env.NODE_TLS_REJECT_UNAUTHORIZED = '0';
homeRouter.post("/login", logoutStatus, async (req, res) => {
    const { loginId, loginPassword } = req.body;
    try {
        const agent = new https.Agent({
            rejectUnauthorized: false
        });
        const response = await axios.post("https://localhost:8050/api/users/login", {
            headers: {
                "Content-type": "application/json"
            },
            data: JSON.stringify({ loginId, loginPassword }),
            httpsAgent: agent
        });
        console.log(response);
        const responseJson = await response.json();
        if (responseJson.result) { // 아이디가 있고 비밀번호가 맞을시
            req.session.userId = loginId;
            return res.redirect("/");
        }
        // 비밀번호가 틀렸을 때
        return res.status(400).render("login", { errorMsg: "Incorrect password" });
    } catch (e) { // DB에서 오류가 났거나 id가 없을시.
        console.log(e);
        return res.status(400).render("login", { errorMsg: "ID is not existed / DB error" });
    }
});

homeRouter.get("/join", logoutStatus, (req, res) => {
    return res.render("join");
});

homeRouter.post("/join", logoutStatus, async (req, res) => {
    const {
        body: { loginId, password, chkPassword }
    } = req;
    try {
        if (password !== chkPassword) {
            throw "비밀번호가 서로 다릅니다.";
        }
        const response = await fetch("https://localhost:8050/api/users/join", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ loginId, password, chkPassword })
        });
        if (response.status === 201) {
            return res.redirect("/");
        } else throw "DB error";
    } catch (e) {
        return res.status(400).render("join", { errorMsg: e });
    }
});

// Logout을 하면 세션에 사용자아이디 삭제
homeRouter.get("/logout", loginStatus, async (req, res) => {
    try {
        const response = await fetch("https://localhost:8050/api/users/logout", {
            method: "post",
            headers: {
                "Content-type": "application/json"
            },
            body: JSON.stringify({ email: req.session.userId })
        });
        if (response === 201) {
            req.session.userId = false;
            return res.redirect("/login");
        } else {
            return res.redirect("/");
        }

    } catch (e) {
        console.log(e);
    }

});

export default homeRouter;