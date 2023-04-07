class KeyringNotInitializedError extends Error{
    constructor(){
        super(); this.name = this.constructor.name;
    }
}

class KeyringMasterKeyError extends Error {
    constructor(){
        super(); this.name = this.constructor.name;
    }
}

class KeyringLockedError extends Error {
    constructor(){
        super(); this.name = this.constructor.name;
    }
}

export {
    KeyringNotInitializedError,
    KeyringMasterKeyError,
    KeyringLockedError,
}