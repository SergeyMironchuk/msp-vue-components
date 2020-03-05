<script>
    import MspColumnTemplate from "./MspColumnTemplate";
    import MspColumnAction from "./MspColumnAction";
    import MspAsyncContent from "./MspAsyncContent";

    export default {
        name: "MspColumn",
        props: {'header': String, 'modelProperty': String, 'sortable': Boolean, 'className': String},
        render: function (createElement) {
            return createElement(
                'span',
                this.$slots.default
            )
        },
        components: {
            'msp-column-template': MspColumnTemplate,
            'msp-column-action': MspColumnAction,
            "msp-async-content": MspAsyncContent
        },
        data: function() {
            return {
                template: "",
                actions: [],
                asyncContents: []
            }
        },
        methods: {
            setColumnTemplate: function(t) {
                this.template = t;
            }
        },
        provide: function () {
            return {
                columnActions: this.actions,
                columnAsyncContents: this.asyncContents,
                setColumnTemplate: this.setColumnTemplate
            }
        },
        inject: ['tableColumns'],
        created: function() {
            this.tableColumns.push(this);
        }
    };
</script>
