<template>
    <div class="modal fade" tabindex="-1" role="dialog" :class="{ 'show': showModal }" aria-modal="true" style="display: block;">
        <div class="modal-dialog" role="document">
            <div class="modal-content">
                <div class="modal-header">
                    <h5 class="modal-title">{{title}}</h5>
                    <button type="button" class="close" @click="showModal = false" aria-label="Close">
                        <span aria-hidden="true">&times;</span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">第一行</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" v-model="form.firstRow">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">第二行</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" v-model="form.secondRow">
                        </div>
                    </div>
                    <div class="form-group row">
                        <label class="col-sm-2 col-form-label">第三行</label>
                        <div class="col-sm-10">
                            <input type="text" class="form-control" v-model="form.thirdRow">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" @click="showModal = false">关闭</button>
                    <button type="button" class="btn btn-primary" @click="submitForm">保存</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props: {
        title: {
            type: String,
            required: true,
        }
    },

    data() {
        return {
            showModal: false,
            form: {
                firstRow: '',
                secondRow: '',
                thirdRow: ''
            }
        };
    },
    methods: {
    }
};
</script>

