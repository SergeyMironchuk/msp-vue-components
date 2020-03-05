<template>
    <div class="form-group">
        <label class="col-md-2 control-label">{{labelText}}</label>
        <div class="col-md-10">
            <div class="btn-group">
                <button type="button" v-bind:class="`btn btn-${type ? type : 'default'}`">{{getText()}}</button>
                <button type="button" v-bind:class="`btn btn-${type ? type : 'default'} dropdown-toggle`"
                        data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                    <span v-if="!loading" class="caret"></span>
                    <i v-if="loading" class='fa fa-spinner fa-spin'></i>
                </button>
                <ul v-if="!loading" class="dropdown-menu">
                    <li v-for="item in items" v-bind:key="item.value">
                        <!--suppress HtmlUnknownAttribute -->
                        <a v-on:click="changeSelected(item)" href="#" value="item.value">{{ item.text }}</a>
                    </li>
                </ul>
                <slot/>
            </div>
        </div>
    </div>
</template>

<script>
    const itemSelectedEvent = 'item-selected';

    export default {
        name: "MspDropdownList",
        props: {
            'textHolder': String,
            'getListData': Function,
            'type': String,
            'value': String,
            labelText: String
        },
        data: function() {
            return {
                loading: true,
                selectedItem: null,
                items: []
            }
        },
        methods: {
            getText: function() {
                return this.loading
                    ? "Loading..."
                    : this.selectedItem
                        ? this.selectedItem.text
                        : this.textHolder
                            ? this.textHolder
                            : "Select ..."
            },
            changeSelected: function(item) {
                this.selectedItem = item;
                this.$emit('input', item.value);
                this.$emit(itemSelectedEvent, item)
            }
        },
        mounted: function() {
            let ddlComponent = this;
            ddlComponent.loading = true;

            if (this.getListData) {
                this.getListData()
                    .then(items => {
                        ddlComponent.loading = false;
                        ddlComponent.items = items;
                        ddlComponent.selectedItem = items.find(item => item.value === ddlComponent.value)
                    })
                    .catch(error => {
                        ddlComponent.loading = false;
                        ddlComponent.selectedItem = { 'value': "", 'text': error }});
            }
        }
    };
</script>

<style scoped>

</style>