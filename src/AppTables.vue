<template>
  <div id="app" style="padding: 5px;">
    <msp-data-table ref="dataTable" data-source-url="data/objects.txt"
                    processing-enable
                    class-name="table table-striped table-bordered table-hover "
                    selectable-rows not-select-field="position" not-select-value="Accountant"
                    v-on:row-selected="onRowSelected">
      <msp-column header="name" model-property="name" sortable>
        <msp-column-template>
          [[if(model.id)?]]<i class="fas fa-user-circle fa-1x"/> [[model.name]] (<b> [[model.id]] </b>)[[:]]
        </msp-column-template>
      </msp-column>
      <msp-column header="position" model-property="position" sortable />
      <msp-column header="office" model-property="office" sortable>
        <msp-async-content
                :get-async-content="getAsyncContent"
                spin-template=" <i class='fas fa-spinner fa-spin'></i>">
        </msp-async-content>
      </msp-column>
      <msp-column header="salary" model-property="salary" sortable class-name="text-right"/>
      <msp-column header="start_date" model-property="start_date" sortable class-name="text-right"/>
      <msp-column header="extn" model-property="extn" sortable class-name="text-right"/>
      <msp-column header="" class-name="text-right">
        <msp-column-template>
          <span style="margin-right: 3px;"><i class="fas fa-user-circle fa-1x"/></span>
        </msp-column-template>
        <msp-column-action
                :on-action="onEmail"
                template="<i class='fas fa-envelope'></i>">
        </msp-column-action>
        <msp-column-action
                :on-action="onDelete"
                confirm-message="Are you sure for delete?"
                template="<i data-toggle='tooltip' title data-original-title='Delete' class='fas fa-trash-alt has-tooltip'></i>">
        </msp-column-action>
        <msp-async-content
                :get-async-content="getAsyncContent1"
                spin-template="<i class='fas fa-spinner fa-spin'></i>&nbsp;&nbsp;">
        </msp-async-content>
        <msp-async-content
                :get-async-content="getAsyncContent2"
                spin-template="<i class='fas fa-spinner fa-spin'></i>&nbsp;&nbsp;">
        </msp-async-content>
      </msp-column>
    </msp-data-table>

    <hr/>
    <p>
      <msp-button button-type="default" icon-class="fas fa-sync" v-on:click="showSelectedItems">
        Show Selected Items
      </msp-button>
    </p>
    <p>
      <label>External things:</label>
      <br/>
      <span>Selected Ids: {{selectedIds}}</span>
    </p>

    <msp-button id="refreshButton" button-type="default" icon-class="fas fa-sync" v-on:click="refresh">
      Refresh (this button is configured externally)
    </msp-button>
  </div>
</template>

<script>
  //import '@fortawesome/fontawesome-free/css/all.css'
  import MspColumnTemplate from "./components/DataTable/MspColumnTemplate.vue";
  import MspColumnAction from "./components/DataTable/MspColumnAction.vue";
  import MspAsyncContent from "./components/DataTable/MspAsyncContent.vue";
  import MspColumn from "./components/DataTable/MspColumn.vue";
  import MspDataTable from "./components/DataTable/MspDataTable.vue";
  import MspButton from "./components/Forms/MspButton.vue";

  export default {
    name: 'app',
    components: {
      MspColumnTemplate,
      MspColumnAction,
      MspAsyncContent,
      MspColumn,
      MspDataTable,
      MspButton
    },
    data: function() {
        return {
          selectedIds: '',
          selectedCities: ["2"],
          selectedCity: "3",
          selectedItem: "7",
          messageText: "message",
          messageType: "info"
        }
      },
    mounted: function(){
      // eslint-disable-next-line no-undef
      if (this.$refs.dataTable) this.$refs.dataTable.addActionElement($("#refreshButton"));
    },
    methods: {
      refresh: function(){
        this.$refs.dataTable.refresh();
      },
      saveFormData: function(){
        this.$refs.modalDialog.setErrorMessage("error error error error");
      },
      onRowSelected: function(items){
        this.selectedIds = items.map(i => i.id).join(',');
      },
      showSelectedItems: function() {
        let items = this.$refs.dataTable.getSelectedItems();
        // eslint-disable-next-line no-console
        console.log(items);
        if (items.length === 0)
          alert("empty");
        else
          alert(items.map(i => i.id).join(','));
      },
      getListData: function() {
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve([
              { 'value': "5", 'text': "Item5Item5Item5" },
              { 'value': "6", 'text': "Item6" },
              { 'value': "7", 'text': "Item7" },
              { 'value': "8", 'text': "Item8" }
            ]);
          }, 3000);
        });
      },
      getCities: function() {
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve([
              {value: "0", text: "Toronto"},
              {value: "1", text: "Orleans"},
              {value: "2", text: "Denver"},
              {value: "3", text:"London"}
            ]);
          }, 3000);
        });
      },
      onItemSelected: function(item) {
        alert(item.text)
      },
      onEmail: function (model) {
        alert('EMailed to ' + model.id);
      },
      onDelete: function (model) {
        alert('Deleted ' + model.id);
      },
      getAsyncContent1: function (model, element) {
        // Should be returned Promise of object with structure as below (for both resolve and reject).
        // In practice network request to web api contains inside.
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              content: '<i data-toggle="tooltip" title data-original-title="Windows" class="fab fa-windows fa-1x has-tooltip"></i>&nbsp;',
              element: element
            });
          }, 1000);
        });
      },
      getAsyncContent2: function (model, element) {
        // Should be returned Promise of object with structure as below (for both resolve and reject).
        // In practice network request to web api contains inside.
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              content: '<i data-toggle="tooltip" title data-original-title="Apple" class="fab fa-apple fa-1x has-tooltip"></i>&nbsp;',
              element: element
            });
          }, 5000);
        });
      },
      getAsyncContent: function (model, element) {
        // Should be returned Promise of object with structure as below (for both resolve and reject).
        // In practice network request to web api contains inside.
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              content: ', office ' + model.id,
              element: element
            });
          }, 2000);
        });
      }
    }
  }
</script>

<style>
  #app {
    font-family: 'Avenir', Helvetica, Arial, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    color: #2c3e50;
    margin-top: 60px;
  }
</style>
