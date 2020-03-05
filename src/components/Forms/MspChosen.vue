<template>
    <div class="form-group">
        <label class="col-md-2 control-label">{{labelText}}</label>
        <div class="col-md-10">
            <i v-if="loading" class='fas fa-spinner fa-spin'
               :style="{'z-index': 20, 'margin-left': labelWidth / 2 + 'px', 'margin-top': multiple ? '7px': '5px', 'position': 'absolute'}" />
            <!--suppress HtmlFormInputWithoutLabel -->
            <select :data-placeholder="dataPlaceholder" :multiple="multiple">
                <option value="" />
                <option v-for="item in items" v-bind:key="item.value" v-bind:value="item.value">{{item.text}}</option>
            </select>
        </div>
    </div>
</template>

<script>
    import 'chosen-js/chosen.min.css';
    import 'chosen-js/chosen.jquery.min.js';

    const itemSelectedEvent = 'item-selected';

    export default {
        name: "MspChosen",
        props: {
            getListData: Function,
            multiple: Boolean,
            dataPlaceholder: String,
            value: [String, Array],
            labelText: String
        },
        data: function() {
            return {
                loading: false,
                selectedItems: null,
                items: []
            }
        },
        computed: {
            selectDomElement: function(){
                // eslint-disable-next-line no-undef
                return $(this.$el).find('select')
            },
            labelWidth: function(){
                // eslint-disable-next-line no-undef
                return $(this.$el).find('div').width();
            }
        },
        mounted: function() {
            let component = this;
            component.selectDomElement
                .chosen({disable_search_threshold: 10, width: "100%"})
                .change(() => {
                component.selectedItems = component.selectDomElement.val();
                component.$emit('input', component.selectedItems);
                component.$emit(itemSelectedEvent, component.selectedItems)
            });

            if (this.getListData) {
                component.loading = true;
                this.getListData()
                .then(items => {
                    component.items = items;
                    component.loading = false;
                })
                .catch(error => {
                    component.items = {value: 0, text: error};
                    component.loading = false
                })
            }
        },
        updated: function() {
            this.selectDomElement.val(this.value);
            this.selectDomElement.trigger("chosen:updated");
        },
        destroyed() {
            this.selectDomElement.chosen('destroy')
        }
    };
</script>

<style scoped>

</style>