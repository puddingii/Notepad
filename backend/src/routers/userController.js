import express from "express";
import bcrypt from "bcrypt";
import Users from "../models/user";
import Notepads from "../models/notepad";
import JsonManage from "./util/jsonManage";
const jsonManage = new JsonManage();

const userApi = express.Router();

userApi.post("/login", async (req, res) => {
    const {
        body: { loginId: email, loginPassword: passwd }
    } = req;
    try {
        const userInfo = await Users.findOne({ where: { email } });
        const storedPasswd = userInfo.getPassword();
        if (!userInfo) {
            return res.sendStatus(404);
        }
        const isSame = await bcrypt.compare(passwd, storedPasswd);
        if (isSame && userInfo.getStatus()) {
            await Users.update({ loginStatus: 0 }, { where: { email } });
            return res.status(202).json({ result: false });
        }
        else if (isSame) {
            await Users.update({ loginStatus: 1 }, { where: { email } });
        }
        return res.status(200).json({ result: isSame });
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

userApi.post("/logout", async (req, res) => {
    const {
        body: { email }
    } = req;
    try {
        const userInfo = await Users.findOne({ where: { email } });
        if (!userInfo) {
            return res.sendStatus(404);
        }
        await Users.update({ loginStatus: 0 }, { where: { email } });
        return res.sendStatus(201);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

userApi.post("/loginStatus", async (req, res) => {
    const { body: { email } } = req;
    try {
        const userInfo = await Users.findOne({ email });
        if (!userInfo) {
            return res.sendStatus(404);
        }
        return res.status(200).json({ loginStatus: userInfo.getStatus() });
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
})

userApi.post("/saveOpenNote", async (req, res) => {
    let {
        body: { email, opentab, lasttab }
    } = req;
    try {
        const queryResult = await Notepads.findAll({ where: { email } });
        const notepads = jsonManage.classToTextToJson(queryResult);
        const opentabArr = opentab.split(',').filter((tab) => {
            return notepads.find((note) => note.title === tab);
        });
        if (!notepads.find((note) => note.title === lasttab)) {
            lasttab = "";
        }

        await Users.update({ opentab: opentabArr.join(), lasttab }, { where: { email } });
        return res.sendStatus(201);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }
});

userApi.post("/join", async (req, res) => {
    let {
        body: { loginId, password }
    } = req;
    try {
        const isExisted = await Users.findOne({ where: { email: loginId } });
        if (isExisted) {
            return res.sendStatus(400);
        }
        const hashPassword = await bcrypt.hash(password, 10);
        await Users.create({ email: loginId, password: hashPassword });
        return res.sendStatus(201);
    } catch (e) {
        console.log(e);
        return res.sendStatus(400);
    }

});

export default userApi;