<template>
<div class="container">

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
</template>
<script>

import ModuleCertificates from "sfc/ModuleCertificates/index.vue";
import ModuleNotebook from "sfc/ModuleNotebook/index.vue";



export default {
    data(){ return {
        PROGRAM_NAME: PROGRAM_NAME,
        VERSION: VERSION,

        nav_current: "sign_encrypt",
        /// #if DEV
        nav_current: "notebook",
        /// #endif

        navs: [
            { text: '全部证书', id: 'certificates' },
            { text: '记事本', id: 'notebook' },
            { text: '签名/加密', id: 'sign_encrypt' },
            { text: '解密/校验', id: 'decrypt_verify' },
            { text: '导入', id: 'import' },
            { text: '导出', id: 'export' },
            { text: '认证', id: 'certify' },
            { text: '在服务器上查找', id: 'search_from_server' },
        ]
    }},

    components: {
        ModuleCertificates,
        ModuleNotebook,
    }
}


</script>