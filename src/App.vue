<template>
  <div id="app" style="padding: 5px;">
    <msp-data-table ref="dataTable" id="dt1" data-source-url="data/objects.txt"
                    refresh-button-icon="<i class='fas fa-sync'></i>"
                    search-button-icon="<i class='fas fa-search'></i>"
                    class-name="table table-striped table-bordered"
                    v-on:row-selected="rowSelected">
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
      <msp-column header="" class-name="text-right">
        <msp-column-action
                :on-action="onEmail"
                template="<i class='fas fa-envelope'></i>">
        </msp-column-action>
        <msp-column-action
                :on-action="onDelete"
                confirm-message="Are you sure for delete?"
                template="<i class='fas fa-trash-alt'></i>">
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
    <label>External things:</label>
    <br/>
    <span>Selected Ids: {{selectedIds}}</span>
    <br/>
    <button v-on:click="refresh">refresh</button>
  </div>
</template>

<script>
  import '@fortawesome/fontawesome-free/css/all.css'
  import MspColumnTemplate from "./components/MspColumnTemplate.vue";
  import MspColumnAction from "./components/MspColumnAction.vue";
  import MspAsyncContent from "./components/MspAsyncContent.vue";
  import MspColumn from "./components/MspColumn.vue";
  import MspDataTable from "./components/MspDataTable.vue";

  export default {
    name: 'app',
    components: {
      MspColumnTemplate,
      MspColumnAction,
      MspAsyncContent,
      MspColumn,
      MspDataTable
    },
    data: function() {
        return {
          selectedIds: ''
        }
      },
    methods: {
      refresh: function(){
        this.$refs.dataTable.refresh();
      },
      rowSelected: function(ids){
        this.selectedIds = ids.join(',');
      },
      onEmail: function (id) {
        alert('EMailed to ' + id);
      },
      onDelete: function (id) {
        alert('Deleted ' + id);
      },
      getAsyncContent1: function (id, element) {
        // Should be returned Promise for object with structure as below (for both resolve and reject).
        // In practice network request to web api contains inside.
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              content: '<i class="fas fa-apple-alt fa-1x"></i>&nbsp;',
              element: element
            });
          }, 1000);
        });
      },
      getAsyncContent2: function (id, element) {
        // Should be returned Promise for object with structure as below (for both resolve and reject).
        // In practice network request to web api contains inside.
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              content: '<i class="far fa-smile fa-1x"></i>&nbsp;',
              element: element
            });
          }, 5000);
        });
      },
      getAsyncContent: function (id, element) {
        // Should be returned Promise for object with structure as below (for both resolve and reject).
        // In practice network request to web api contains inside.
        return new Promise(function (resolve) {
          setTimeout(function () {
            resolve({
              content: ', office ' + id,
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
