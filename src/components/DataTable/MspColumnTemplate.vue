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
        inject: ['setColumnTemplate'],
        created: function() {
            this.setColumnTemplate(this);
        }
    }
</script>
