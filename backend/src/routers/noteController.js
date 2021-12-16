import express from "express";
import Users from "../models/user.js";
import Notepads from "../models/notepad.js";
import JsonManage from "./util/jsonManage.js";
import validator from "validator";
const apiRouter = express.Router();
const jsonManage = new JsonManage();

// 저장 눌렀을 때 서버에 데이터 저장
apiRouter.post("/save", async (req, res) => {
    const {
        body: { id, email, title, text }
    } = req;

    try {
        if (!validator.isEmail(email)) {
            throw new Error("This email is not validated");
        }
        const user = await Users.findOne({ where: { email } });
        const note = await Notepads.findOne({ where: { email, title } });
        if (!user) {
            throw new Error("User is not existed");
        } else if (note && user) {
            await Notepads.update({ content: text }, { where: { id: note.id } });
        } else {
            await Notepads.create({ email, title, content: text });
        }
        return res.status(201).json({ isSucceed: true, msg: "Succeed!!" });
    } catch (e) {
        console.log(e);
        return res.status(201).json({ isSucceed: false, msg: e.message });
    }
});

// 삭제버튼을 눌렀을 때
apiRouter.delete("/delete", async (req, res) => {
    const {
        body: { noteId, email }
    } = req;
    try {
        if (!validator.isEmail(email)) {
            throw new Error("This email is not validated");
        }
        await Notepads.destroy({ where: { id: noteId, email } });
        return res.status(201).json({ isSucceed: true, msg: "Succeed!!" });
    } catch (e) {
        console.log(e);
        return res.status(201).json({ isSucceed: false, msg: e.message });
    }
});

// 다른이름으로 저장을 눌렀을 때
apiRouter.post("/saveAs", async (req, res) => {
    const {
        body: { email, title, text }
    } = req;

    try {
        if (!validator.isEmail(email)) {
            throw new Error("This email is not validated");
        }
        const item = await Notepads.findOne({ where: { email, title } });
        if (item) {
            throw new Error("Note's title is existed");
        }
        const newNote = await Notepads.create({ email, title, content: text });
        return res.status(201).json({ id: newNote.dataValues.id, isSucceed: true, msg: "Succeed!!" });
    } catch (e) {
        console.log(e);
        return res.status(201).json({ isSucceed: false, msg: e.message });
    }
});

// 모든 데이터 불러오기
apiRouter.post("/loadAllData", async (req, res) => {
    try {
        const {
            body: { email }
        } = req;
        if (!validator.isEmail(email)) {
            throw new Error("This email is not validated");
        }
        const userInfo = await Users.findOne({ where: { email } });
        const notepadInfo = await Notepads.findAll({ where: { email } });
        notepadInfo.push({ endTitle: userInfo.getLasttab(), openTab: userInfo.getOpentab() });
        const data = jsonManage.classToTextToJson(notepadInfo);

        return res.status(200).json({ noteList: data, isSucceed: true });
    } catch (e) {
        console.log(e);
        return res.status(200).json({ isSucceed: false, msg: e.message});
    }
});

apiRouter.get("/getLastId", async (req, res) => {
    try {
        let id = await Notepads.max("id");
        return res.status(200).json({ id })
    } catch (e) {
        return res.sendStatus(400);
    }
})

export default apiRouter;
