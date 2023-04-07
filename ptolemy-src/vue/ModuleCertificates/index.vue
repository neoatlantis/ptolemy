<template>
<div>

a



</div>
</template>
<script>

import keyring from "app/keyring/keyring_db";

(async function(){
    await keyring.create("test");
    await keyring.set("test", "alkdfjsaklfajsdklj;f");
    console.log(await keyring.get("test"));
})();



export default {

}
    
</script>