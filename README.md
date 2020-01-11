### `mspDataTables` — Vue.js components for [DataTables.net](https://datatables.net/)

Cover subset of DataTables.net features according example below.

Result you can see here: [mspdatatables.azurewebsites.net](https://mspdatatables.azurewebsites.net)

```HTML
<div id="app" style="padding: 5px;">
  <msp-data-table ref="dataTable" id="dt1" data-source-url="data/objects.txt"
              refresh-button-icon="<i class='fas fa-sync'></i>"
              search-button-icon="<i class='fas fa-search'></i>"
              class-name="table table-striped table-bordered"
              v-on:row-selected="rowSelected">
    <msp-column header="name" model-property="name" sortable>
      <msp-column-template>
        [[if(model.name)?]]<i class="fas fa-user-circle fa-1x"></i> [[model.name]] (<b> [[model.id]] </b>)[[:]]
      </msp-column-template>
    </msp-column>
    <msp-column header="position" model-property="position" sortable></msp-column>
    <msp-column header="office" model-property="office" sortable>
      <msp-async-content
              :get-async-content="getAsyncContent"
              spin-template=" <i class='fas fa-spinner fa-spin'></i>">
      </msp-async-content>
    </msp-column>
    <msp-column header="salary" model-property="salary" sortable class-name="text-right"></msp-column>
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
```

Nothing more required. And beautiful and enough powerful data table appear in your form ([mspdatatables.azurewebsites.net](https://mspdatatables.azurewebsites.net)).

Support client and server-side dataSource control. 

Functions related your domain logic is placed to Vue.component.

#### Vue Component code example:

```JavaScript
  let msp = MspVueComponents;
  let app = new Vue ({
    el: '#app',
    components: {
      'msp-column-template': msp.MspColumnTemplate,
      'msp-column-action': msp.MspColumnAction,
      'msp-async-content': msp.MspAsyncContent,
      'msp-column': msp.MspColumn,
      'msp-data-table': msp.MspDataTable
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
        alert('Delete ' + id);
      },
      getAsyncContent1: function (id, element) {
        return new Promise(function (resolve, reject) {
            ...
        });
      },
      getAsyncContent2: function (id, element) {
        return new Promise(function (resolve, reject) {
            ...
        });
      },
      getAsyncContent: function (id, element) {
        return new Promise(function (resolve, reject) {
            ...
        });
      }
    }
  })
```

#### Code examples
Example of using published components on simple HTML page you can see in **_/www_** folder. 

**_/www/msp-vue_** is result of this project **build**. Look **_index.html_** for details of using.
