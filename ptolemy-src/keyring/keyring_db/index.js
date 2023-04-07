/*
 * Keyring Database Access
 *
 * Provides password protected keyring access. Keyring is a key-value based
 * database, each entry is protected (encrypted) with its individual key, which
 * are being derived from the master key. The master key is stored encrypted
 * with user password.
 *
 * Private PGP keys, when being imported into keyring, must be decrypted with
 * their own passphrase (if set). The unencrypted private key is stored using
 * keyring's own encryption unless being exported (again), upon which the user
 * must set an individual passphrase for the exported private key. In this way,
 * the system does not require the user to decrypt each private key when
 * receiving or signing messages, once the keyring is unlocked.
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

    async create(password){
        try{
            this.#master_key_cryptor = 
                await get_master_key_cryptor.call(this, {
                    db: this.#db_provider,
                    password,
                    create: true,
                });
        } catch(e){
            throw e;
        }
    }

    async unlock(password){
        try{
            this.#master_key_cryptor = 
                await get_master_key_cryptor.call(this, {
                    db: this.#db_provider,
                    password,
                });
        } catch(e){
            throw e;
        }
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

    async set(id, data){
        this.#assure_unlocked();
        this.#assure_id(id);       

        // Stores some random data.
        let message = await openpgp.createMessage({
            binary: pack(data),
        });
        let encrypted = await this.#master_key_cryptor.encrypt(message);

        return await this.#db_provider.setItem(id, encrypted);
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
        return this.#db_provider.removeItem(id);
    }


}


export default new KeyringDB(AsyncLocalStorage);