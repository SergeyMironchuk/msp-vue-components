<script>
    export default {
        name: "MspColumnTemplate",
        render: function (createElement) {
            return createElement(
                'span',
                {
                    style: {
                        display: 'none'
                    }
                },
                this.$slots.default
            )
        },
        created: function() {
            this.$parent.template = this;
        }
    }
</script>
