class Singleton {
    constructor() {
        if (!Singleton.instance) {
            this.roomInfo = {};
            Singleton.instance = this;
        }
        return Singleton.instance;
    }
}

export default new Singleton();