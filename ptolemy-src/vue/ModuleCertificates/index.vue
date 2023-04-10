<template>
<div>

a



</div>
</template>
<script>

import get_keyring from "app/keyring";

(async function(){
    let keyring = get_keyring();

    await keyring.unlock("test");

    
    
    
})();



export default {

}
    
</script>