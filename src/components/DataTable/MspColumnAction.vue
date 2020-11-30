<script>
    export default {
        name: "MspColumnAction",
        props: {
            onAction: Function,
            isVisible: {type: Function, default: function(){return true;}},
            template: String,
            confirmMessage: String
        },
        render: function (createElement) {
            return createElement(
                'span'
            )
        },
        inject: ['columnActions'],
        created: function() {
            this.columnActions.push(this);
        }
    };
</script>
