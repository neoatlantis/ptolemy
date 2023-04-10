import get_keyring_db from "./keyring_db";
import update_record from "./update_record";

class Keyring {

    #cache;

    #keyring_db;
    constructor(keyring_db){
        this.#cache = new Map();
        this.#keyring_db = keyring_db;
        this.#keyring_db.on("storage", (e)=>this.on_storage(e));
    }

    create(password){
        return this.#keyring_db.create(password);
    }

    unlock(password){
        return this.#keyring_db.unlock(password);
    }

    lock(){
        return this.#keyring_db.lock();
    }

    on_storage(e){
        // e := { add: [...], remove: [...]}
        // - where `add` is an array of item IDs added to storage, and
        //   `remove` the contray. 
        // - modification on value of given id, is also contained in `add`.
        console.log("'storage' event received.", e);
        let removed = _.get(e, "remove", []),
            added = _.get(e, "add", []);
        removed.forEach((id)=>this.#cache.remove(id));
        added.forEach(async (id)=>{
            let result = update_record.call(this, this.#keyring_db, id);
            if(result != null){
                this.#cache.set(id, result);
            }
        });
    }

    list(){
        let ret = new Map();

    }

    add(key){

    }

    fetch(id){

    }

    modify(id){

    }

    remove(id){
        
    }

}






let exported = null;
export default function get_or_init_keyring(){
    if(exported == null){
        let keyring_db = get_keyring_db();
        exported = new Keyring(keyring_db);
    }
    return exported;
}