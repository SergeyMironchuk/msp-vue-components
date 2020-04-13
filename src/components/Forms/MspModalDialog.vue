<template>
    <div class="modal fade" id="default-example-modal" tabindex="-1" role="dialog" aria-hidden="true">
        <div class="modal-dialog" role="document" :style="{'max-width': width}">
            <div class="modal-content">
                <div class="modal-header">
                    <h4 class="modal-title">
                        {{caption}}
                    </h4>
                    <button type="button" class="close" data-dismiss="modal" aria-label="Close">
                        <span aria-hidden="true"><i class="fal fa-times"></i></span>
                    </button>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger" role="alert" v-if="errorMessage">
                        <strong>Error!</strong> {{errorMessage}}
                    </div>
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <button type="button" class="btn btn-secondary" data-dismiss="modal">Cancel</button>
                    <button type="button" class="btn btn-primary" v-on:click="onOkButtonClick">{{okButtonCaption}}</button>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
    export default {
        name: "MspModalDialog",
        props: {
            caption: String,
            okButtonCaption: {type: String, default: "OK"},
            width: {type: String, default: "600px"}
        },
        data: function() {
            return {
                errorMessage: ""
            }
        },
        methods: {
            setErrorMessage: function(message){
                this.errorMessage = message
            },
            onOkButtonClick: function() {
                this.$emit('ok');
            },
            close: function(){
                // eslint-disable-next-line no-undef
                $(this.$el).find('.close').click();
            }
        }
    }
</script>
