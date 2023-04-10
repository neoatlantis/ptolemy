/*
 * Scans and updates a stored key.
 *
 * This is the most important part in managing keyring - to check if the stored
 * item is consistent with private key.
 */

export default async function(db, id){

    console.log("update record for:", id);

    let decrypted = await db.get(id);
    if(!decrypted) return;

    

}