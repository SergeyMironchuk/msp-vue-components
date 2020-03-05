<script>
    export default {
        name: "MspColumnAction",
        props: {
            onAction: Function,
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
