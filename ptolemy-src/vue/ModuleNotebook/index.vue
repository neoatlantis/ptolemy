<template>
<div>
    <div class="d-flex gap-1 mb-3">
        <button 
            class="btn btn-outline-primary" type="button"
            :disabled="!opt_sign && !opt_encrypt"
        >
            {{
                !(opt_sign ^ opt_encrypt)? "加密/签名" :
                 (opt_sign ? '签名' : '加密')
            }}记事本内容
        </button>
        <button 
            class="btn btn-outline-primary"
            type="button"
            :disabled="text==''"
        >
            解密/验证记事本内容
        </button>
        <button class="btn btn-outline-primary" type="button">
            导入记事本
        </button>
        <button class="btn btn-outline-primary" type="button" v-if="false">
            还原
        </button>
    </div>


    <div>

        <ul class="nav nav-tabs" role="tablist">
            <li class="nav-item">
                <button class="nav-link" :class="{active:tab_current==1}" type="button" @click="tab_current=1">记事本</button>
            </li>
            <li class="nav-item">
                <button class="nav-link" :class="{active:tab_current==2}" type="button" @click="tab_current=2">收件人</button>
            </li>
        </ul>
        <div class="tab-content">
            <div class="tab-pane fade p-3" :class="{'show active':tab_current==1}">
                <textarea
                    class="form-control font-monospace"
                    style="height: 33vh"
                    v-model="text"
                    placeholder="输入要加密或者解密的消息..."
                ></textarea>
            </div>
            <div class="tab-pane fade p-3" :class="{'show active': tab_current==2}">
                <EncryptAndSigningSettings
                    @settings="encrypt_signing_settings=$event"
                ></EncryptAndSigningSettings>
            </div>
        </div>

    </div>

    




</div>
</template>
<script>
import EncryptAndSigningSettings from "sfc/components/EncryptAndSigningSettings.vue";

export default {
    data(){ return {
        tab_current: 1,
        encrypt_signing_settings: {},
        text: "",
    }},

    computed: {
        opt_encrypt(){
            return (
                this.encrypt_signing_settings.opt_encrypt_self ||
                this.encrypt_signing_settings.opt_encrypt_other ||
                this.encrypt_signing_settings.opt_encrypt_password
            );
        },
        opt_sign(){
            return this.encrypt_signing_settings.opt_sign;
        },

    },

    components: {
        EncryptAndSigningSettings,
    }
}



</script>
