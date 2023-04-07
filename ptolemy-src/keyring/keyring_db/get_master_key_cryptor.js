/*
 * Verify the password and returns a `entry_key_generator`.
 */
import _ from "lodash";
import * as openpgp from "openpgp";
import { scrypt } from "scrypt-js";
import buffer from "buffer";


import {
    KeyringNotInitializedError,
    KeyringMasterKeyError,
    KeyringLockedError,
} from "./errors";


export default async function get_master_key_cryptor({
    db,
    password,
    create=true, 
    progress_callback=()=>{},
}){
    if(!_.isFunction(progress_callback)) progress_callback = ()=>{};
    if(!_.isString(password)) throw Error("Password must be string.");
    
    // read master private key

    let master_private_key_str = await db.getItem("$master");
    if(!_.isString(master_private_key_str)){
        if(!create){
            throw KeyringNotInitializedError();
        } else {
            // initialize a new master key
            let keypair = await openpgp.generateKey({
                curve: "curve25519",
                userIDs: [{
                    name: "Ptolemy Master Key",
                    email: "test@ptolemy.neoatlantis.org",
                }],
                passphrase: password,
                format: "armored",
            });
            master_private_key_str = keypair.privateKey;
            await db.setItem("$master", master_private_key_str);
        }
    }

    // load master private key

    let keypair = new Map();
    keypair.set("private", null);
    keypair.set("public", null);

    try{
        let master_private_key_obj = await openpgp.readKey({
            armoredKey: master_private_key_str,
        });
        let master_private_key_unlocked_obj = await openpgp.decryptKey({
            privateKey: master_private_key_obj,
            passphrase: password,
        });

        keypair.set("private", master_private_key_unlocked_obj);
        keypair.set("public", master_private_key_unlocked_obj.toPublic());
    } catch(e){
        throw KeyringMasterKeyError();
    }


    return {

        // Change master key password, and write to localStorage

        change_password: async (newpassword) => {
            let private_key = keypair.get("private");
            if(!private_key) throw KeyringLockedError();
            let encrypted = await openpgp.encryptKey({
                privateKey: private_key,
                passphrase: newpassword,
            });
            let encrypted_armored = encrypted.armor();
            await db.setItem("$master", encrypted_armored);
            return true;
        },

        // Encrypt an OpenPGP message object

        encrypt: (message)=>{
            let public_key = keypair.get("public");
            if(!public_key) throw KeyringLockedError();
            return openpgp.encrypt({
                message,
                encryptionKeys: public_key,
                format: 'armored',
            });
        },

        // Decrypt an OpenPGP message object

        decrypt: async (message)=>{
            let private_key = keypair.get("private");
            if(!private_key) throw KeyringLockedError();
            let decrypted = await openpgp.decrypt({
                message,
                decryptionKeys: private_key,
                format: 'binary',
            });
            // TODO verify signatures
            return decrypted.data;
        },

        // Removes in-memory decrypted keypair immediately.

        lock(){
            keypair.clear();
        }
    }

}