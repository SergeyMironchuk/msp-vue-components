<script>
    export default {
        name: "MspAsyncContent",
        props: {
            getAsyncContent: Function,
            spinTemplate: String
        },
        render: function (createElement) {
            return createElement(
                'span'
            )
        },
        created: function() {
            this.$parent.asyncContents.push(this);
        }
    }
</script>
