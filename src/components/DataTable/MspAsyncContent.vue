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
        inject: ['columnAsyncContents'],
        created: function() {
            this.columnAsyncContents.push(this);
        }
    }
</script>
