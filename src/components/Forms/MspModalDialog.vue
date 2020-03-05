<template>
    <div class="modal fade" tabindex="-1" role="dialog" aria-labelledby="myModalLabel" aria-hidden="true">
        <div class="modal-dialog" :style="{'width': width}">
            <div class="modal-content">
                <div class="modal-header">
                    <button type="button" class="close" data-dismiss="modal" aria-hidden="true">
                        &times;
                    </button>
                    <h4 class="modal-title">{{caption}}</h4>
                </div>
                <div class="modal-body">
                    <div class="alert alert-danger fade in" v-if="errorMessage">
                        <i class="fa-fw fa fa-times"></i>
                        {{errorMessage}}
                    </div>
                    <slot></slot>
                </div>
                <div class="modal-footer">
                    <msp-button button-type="danger" icon-class="fa fa-times" data-dismiss="modal">
                        Cancel
                    </msp-button>
                    <msp-button button-type="primary" icon-class="fa fa-check" v-on:click="onOkButtonClick">
                        {{okButtonCaption}}
                    </msp-button>
                </div>
            </div><!-- /.modal-content -->
        </div><!-- /.modal-dialog -->
    </div><!-- /.modal -->
</template>

<script>
    import MspButton from "./MspButton";
    export default {
        name: "MspModalDialog",
        components: {
            'msp-button': MspButton
        },
        props: {
            caption: String,
            okButtonCaption: String,
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
