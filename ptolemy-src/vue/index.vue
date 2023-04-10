<template><div style="width:100%; height:100%">

<KeyringSessionManager
    v-show="session_manager_shown"
    @show="session_manager_shown=true"
    @hide="session_manager_shown=false"
></KeyringSessionManager>

<div class="container" v-show="!session_manager_shown">

    <div class="d-grid gap-3">
        
        <div></div>
        <div class="d-flex justify-content-center align-items-baseline">
            <h1>{{PROGRAM_NAME}}</h1>
            <span>&nbsp;&nbsp;v{{VERSION}}</span>
        </div>

        <div>
             <ul class="nav nav-pills justify-content-center gap-1">
                <li class="nav-item bg-light" v-for="nav in navs">
                    <a 
                        class="nav-link"
                        :class="{active:nav.id==nav_current}"
                        href="#"
                        @click="nav_current=nav.id; $event.stopPropagation()"
                    >
                        {{nav.text}}
                    </a>
                </li>
            </ul>
        </div>

        <hr />

        <div>
            <ModuleCertificates v-if="'certificates'==nav_current"></ModuleCertificates>
            <ModuleNotebook v-if="'notebook'==nav_current"></ModuleNotebook>
        </div>
        
    </div>
    




</div>
</div></template>
<script>

import KeyringSessionManager from "sfc/KeyringSessionManager/index.vue";
import ModuleCertificates from "sfc/ModuleCertificates/index.vue";
import ModuleNotebook from "sfc/ModuleNotebook/index.vue";



export default {
    data(){ return {
        PROGRAM_NAME: PROGRAM_NAME,
        VERSION: VERSION,

        session_manager_shown: false,

        nav_current: "sign_encrypt",
        /// #if DEV
        nav_current: "certificates",
        /// #endif

        navs: [
            { text: '记事本', id: 'notebook' },
            { text: '签名/加密', id: 'sign_encrypt' },
            { text: '解密/校验', id: 'decrypt_verify' },
            { text: '证书管理', id: 'certificates' },
            { text: '在服务器上查找', id: 'search_from_server' },
        ]
    }},

    components: {
        KeyringSessionManager,
        ModuleCertificates,
        ModuleNotebook,
    }
}


</script>