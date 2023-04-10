/*
 * KeyringDB is the storage middleware for Keyring.
 *
 * It supports following functions:
 *  - create and unlock a database
 *  - lock it again
 *  - save, retrieve and remove data as key-value storage
 *
 * By default, all data is stored in localStorage of browser. By providing
 * another asynchronous API similar to localStorage, it's possible to migrate
 * the storage to other mechanisms.
 */

import _ from "lodash";
import get_master_key_cryptor from "./get_master_key_cryptor";
import AsyncLocalStorage from '@createnextapp/async-local-storage';
import { pack, unpack } from "msgpackr";
import * as openpgp from "openpgp";
import errors from "./errors";


const events = require("events");

class KeyringDB extends events.EventEmitter {

    #db_provider = null;
    constructor(db_provider){
        super();
        this.#db_provider = db_provider;
    }

    // #master_key_cryptor := { encrypt(message), decrypt(message), lock() }
    //
    // where encrypt() and decrypt() are just mapped to calls in openpgp.js
    // with preloaded public/private keys

    #master_key_cryptor = null;

    async #unlock_with_create(password, { create=false }){
        try{
            this.#master_key_cryptor = 
                await get_master_key_cryptor.call(this, {
                    db: this.#db_provider,
                    password,
                    create: true,
                });
            let keys = await this.keys();
            this.emit("storage", {
                add: keys,
            });
        } catch(e){
            throw e;
        }
    }

    create(password){
        return this.#unlock_with_create(password, { create: true });
    }

    unlock(password){
        return this.#unlock_with_create(password, { create: false });
    }

    async lock(){
        // The closure function itself has a method called "lock". We call
        // this method to ask it clean the memory explictly.
        let lock_caller = _.get(this.#master_key_cryptor, "lock");
        if(_.isFunction(lock_caller)) lock_caller();
        this.#master_key_cryptor = null;
    }

    #assure_unlocked(){
        if(!this.#master_key_cryptor){
            throw errors.KeyringLockedError();
        }
    }

    // Exposed useful set/get function.

    #assure_id(id){
        if(_.startsWith(id, "$")){
            throw Error("Cannot set special key to storage.");
        }
    }

    async keys(){
        this.#assure_unlocked();
        let keys = await this.#db_provider.getKeys();
        return keys.filter((k)=>{
            return !_.startsWith(k, "$");
        });
    }

    async set(id, data){
        this.#assure_unlocked();
        this.#assure_id(id);  

        // Stores some random data.
        let message = await openpgp.createMessage({
            binary: pack(data),
        });
        let encrypted = await this.#master_key_cryptor.encrypt(message);

        let ret = await this.#db_provider.setItem(id, encrypted);
        this.emit("storage", { add: [id] });
        return ret;
    }

    async get(id){
        this.#assure_unlocked();
        this.#assure_id(id);

        let encrypted = await this.#db_provider.getItem(id);
        if(!encrypted) return null;

        let message = await openpgp.readMessage({
            armoredMessage: encrypted,
        });
        let decrypted = await this.#master_key_cryptor.decrypt(message);

        return unpack(decrypted);
    }

    async remove(id){
        this.#assure_unlocked();
        this.#assure_id(id);
        let ret = this.#db_provider.removeItem(id);
        this.emit("storage", { remove: [id]});
        return ret;
    }


}

let exported = null;

export default function get_or_init(){
    if(exported == null){
        exported = new KeyringDB(AsyncLocalStorage);
    }
    return exported;
}