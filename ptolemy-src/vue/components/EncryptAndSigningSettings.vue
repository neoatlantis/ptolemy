<template>
<div>
    <h5>签名</h5>

    <div class="row mb-2">
        <div class="col-3">
            <CheckboxSwitch
                :checked="opt_sign"
                @checked="report(opt_sign=$event)"
            >签名身份</CheckboxSwitch>
        </div>
        <div class="col-9">
            <input type="text" class="form-control" id="input1" placeholder="" :disabled="!opt_sign">
        </div>
    </div>

    <h5>加密</h5>

    <div class="row mb-2">
        <div class="col-3">
            <CheckboxSwitch
                :checked="opt_encrypt_self"
                @checked="report(opt_encrypt_self=$event)"
            >为我加密</CheckboxSwitch>
        </div>
        <div class="col-9">
            <input type="text" class="form-control" id="input1" placeholder="" :disabled="!opt_encrypt_self">
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-3">
            <CheckboxSwitch
                :checked="opt_encrypt_other"
                @checked="report(opt_encrypt_other=$event)"
            >为其他人加密</CheckboxSwitch>
        </div>
        <div class="col-9">
            <input type="text" class="form-control" id="input1" placeholder="" :disabled="!opt_encrypt_other">
        </div>
    </div>

    <div class="row mb-2">
        <div class="col-12">
            <CheckboxSwitch
                :checked="opt_encrypt_password"
                @checked="report(opt_encrypt_password=$event)"
            >
                使用密码加密。任何知道密码的人都可以读取数据。
            </CheckboxSwitch>
        </div>
    </div>
    
</div>
</template>
<script>
import CheckboxSwitch from "sfc/components/BootstrapCheckboxSwitch.vue";
export default {

    data(){ return {
        opt_sign: false,
        opt_encrypt_self: false,
        opt_encrypt_other: false,
        opt_encrypt_password: false,
    } },

    methods: {
        report(){
            this.$emit("settings", {
                opt_sign: this.opt_sign,
                opt_encrypt_self: this.opt_encrypt_self,
                opt_encrypt_other: this.opt_encrypt_other,
                opt_encrypt_password: this.opt_encrypt_password,
            });
        }
    },

    components: {
        CheckboxSwitch,
    }

}
</script>