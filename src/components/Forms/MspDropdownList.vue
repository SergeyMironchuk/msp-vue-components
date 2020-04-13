<template>
    <div class="form-group">
        <label class="col-md-2 control-label">{{labelText}}</label>
        <div class="col-md-10">
            <div class="btn-group">
                <button type="button" v-bind:class="`btn btn-${type ? type : 'default'} dropdown-toggle`" data-toggle="dropdown"
                        aria-haspopup="true" aria-expanded="false" v-on:click="showMenu">
                    <span v-if="!loading" style="padding-right: 5px;">{{getText()}}</span>
                    <i v-if="loading" class='fa fa-spinner fa-spin' style="margin-right: 5px;"></i>
                </button>
                <div class="dropdown-menu">
                    <a v-for="item in items" v-bind:key="item.value" class="dropdown-item" v-on:click="changeSelected(item)"
                       href="#" value="item.value">{{ item.text }}</a>
                </div>
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
            'labelText': {type: String, default: "Dropdown" }
        },
        data: function() {
            return {
                loading: true,
                selectedItem: null,
                opened: false,
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
                // eslint-disable-next-line no-undef
                $(this.$el).find('.dropdown-menu').hide();
                this.selectedItem = item;
                this.$emit('input', item.value);
                this.$emit(itemSelectedEvent, item)
            },
            showMenu: function(){
                // eslint-disable-next-line no-undef
                $(this.$el).find('.dropdown-menu').show();
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