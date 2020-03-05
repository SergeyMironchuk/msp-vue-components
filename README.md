### `mspDataTables` — Vue.js components for [DataTables.net](https://datatables.net/)

Cover subset of DataTables.net features according example below.

Result you can see here: [mspdatatables.azurewebsites.net](https://mspdatatables.azurewebsites.net)

```HTML
<div id="app" style="padding: 5px;">
  <msp-data-table ref="dataTable" data-source-url="data/objects.txt"
                  refresh-button-icon="<i class='fas fa-sync'></i>"
                  search-button-icon="<i class='fas fa-search'></i>"
                  class-name="table table-striped table-bordered"
                  selectable-rows
                  selected-row-icon="<i class='far fa-check-square'>"
                  unselected-row-icon="<i class='far fa-square'>"
                  exists-selected-rows-icon="<i class='fas fa-square'></i>"
                  v-on:row-selected="onRowSelected">
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
  <p>
    <label>External things:</label>
    <br/>
    <span>Selected Ids: {{selectedIds}}</span>
  </p>

  <p>
    <button type="button" class="btn btn-primary"
            v-on:click="displaySelectedIds">
      <i class="fas fa-list-ol"></i> Get Selected IDs
    </button>
  </p>

  <button id="refreshButton" type="button" class="btn btn-primary"
          v-on:click="refresh">
    <i class='fas fa-sync'></i> Refresh (this button is configured externally)
  </button>
</div>
```

Nothing more required. And beautiful and powerful data table appear in your form ([mspdatatables.azurewebsites.net](https://mspdatatables.azurewebsites.net)).

Support client and server-side dataSource control. 

Functions related to your domain logic is placed to Vue.component.

#### Vue Component code example:

```JavaScript
<script type="text/javascript">
  let dt = MspDataTables;
  let app = new Vue ({
    el: '#app',
    components: {
      'msp-column-template': dt.MspColumnTemplate,
      'msp-column-action': dt.MspColumnAction,
      'msp-async-content': dt.MspAsyncContent,
      'msp-column': dt.MspColumn,
      'msp-data-table': dt.MspDataTables
    },
    data: function() {
      return {
        selectedIds: ''
      }
    },
    mounted: function(){
      this.$refs.dataTable.addActionElement($("#refreshButton"));
    },
    methods: {
      refresh: function(){
        this.$refs.dataTable.refresh();
      },
      onRowSelected: function(items){
        this.selectedIds = items.map(i => i.id).join(',');
      },
      displaySelectedIds: function() {
        let ids = this.$refs.dataTable.getSelectedIds();
        alert(ids.join(','));
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
              content: '<i class="fas fa-apple-alt fa-1x"></i>&nbsp;',
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
              content: '<i class="far fa-smile fa-1x"></i>&nbsp;',
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
  })
</script>
```

#### Code examples
Example of using components on usual HTML page you can see in **/www** folder. 

**/www/msp-vue** is result of this project build. Look **index.html** for details.
