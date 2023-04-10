<template><div>







</div></template>
<script>
import { register } from "app/globalfunc";

/*
This is a special screen that is dedicated to Keyring. When this UI fired up,
it must be on top over everything else, something similar to the UAC screen
in Windows.
*/
export default {

    mounted(){
        register("ksm.unlock", ()=>this.show_unlock());
    },

    data(){ return {

    } },

    methods: {
        show_unlock(){
            this.$emit("show");


            return new Promise((resolve, reject)=>{

            });
        }
    }

}
</script>
