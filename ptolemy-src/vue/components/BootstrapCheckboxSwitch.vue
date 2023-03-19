<template>
<div class="form-check form-switch">
    <input class="form-check-input" type="checkbox" role="switch" v-model="i_checked" :id="uuid">
    <label class="form-check-label" :for="uuid"><slot></slot></label>
</div>
</template>
<script>
import { v4 as uuidv4 } from "uuid";

export default {
    props: {
        checked: { type: Boolean },
    },
    data(){
        return {
            uuid: uuidv4(),
            i_checked: false,
        }
    },
    watch: {
        i_checked(){
            this.$emit("checked", this.i_checked);
        },
        checked(){
            this.i_checked = this.checked;
        }
    }
}
</script>