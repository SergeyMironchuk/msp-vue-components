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
        created: function() {
            this.$parent.actions.push(this);
        }
    };
</script>
