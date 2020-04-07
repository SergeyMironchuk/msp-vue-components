<template>
  <div>
  <msp-jarvis-widget caption="Msp Controls examples" icon-class="fas fa-apple-alt">
    <form class="form-horizontal">
      <fieldset>
        <msp-chosen data-placeholder="Select Cities..."
                    label-text="Multiply chosen"
                    multiple
                    v-model="selectedCities"
                    v-on:item-selected="onCitySelected"
                    :get-list-data="getCities">
        </msp-chosen>
        <div class="form-group">
          <label class="col-md-2 control-label"></label>
          <div class="col-md-10">
            <msp-button icon-class="fas fa-list-ol"
                        type="success"
                        v-on:click="clickButton">
              Button
            </msp-button>
          </div>
        </div>
      </fieldset>
    </form>
    <p>
      {{ selectedItem }}
    </p>
    <p>
      {{ selectedCities }}
    </p>
    <p>
      {{ selectedCity }}
    </p>
  </msp-jarvis-widget>

    <span style="margin-left: 5px; margin-right: 5px;"><i class="far fa-copy" @click="doCopyAll"></i></span>
    <i v-if="loading" class='fas fa-spinner fa-spin' />
    <div style="width: 100%; height: 300px; overflow: auto; padding: 5px; margin-bottom: 5px;">
      <table style="width: 100%;" class="table table-hover table-bordered">
        <tbody>
        <tr v-for="logItem in logItems" v-bind:key="logItem.id">
          <td style="width: 30px;">{{ logItem.id }}</td>
          <td>{{ logItem.text }}</td>
          <td style="width: 30px; text-align: center;" title="Copy row to clipboard"><i class="far fa-copy" @click="doCopy(logItem.text)"></i></td>
        </tr>
        </tbody>
      </table>
    </div>

  <button class="btn btn-primary btn-default" data-toggle="modal" data-target="#myModal">
    Launch demo modal
  </button>

  <msp-modal-dialog id="myModal" caption="Modal dialog" v-on:ok="saveFormData">

    <form class="form-horizontal">
      <fieldset>
        <msp-dropdown-list :get-list-data="getListData"
                           label-text="Dropdown List"
                           type="success"
                           v-model="selectedItem"
                           v-on:item-selected="onItemSelected">
        </msp-dropdown-list>
        <msp-chosen data-placeholder="Select Cities..."
                    label-text="Multiply chosen"
                    multiple
                    v-model="selectedCities"
                    v-on:item-selected="onCitySelected"
                    :get-list-data="getCities">
        </msp-chosen>
        <msp-chosen data-placeholder="Select City..."
                    label-text="Chosen"
                    v-model="selectedCity"
                    :get-list-data="getCities">
        </msp-chosen>
      </fieldset>
    </form>

  </msp-modal-dialog>

  </div>
</template>

<script>
  //import '@fortawesome/fontawesome-free/css/all.css'
  import MspDropdownList from "./components/Forms/MspDropdownList.vue";
  import MspButton from "./components/Forms/MspButton.vue";
  import MspChosen from "./components/Forms/MspChosen";
  import MspJarvisWidget from "./components/Forms/MspJarvisWidget";
  import MspModalDialog from "./components/Forms/MspModalDialog";
  // eslint-disable-next-line no-unused-vars
  import Vue from 'vue';
  import VueClipboard from 'vue-clipboard2';

  VueClipboard.config.autoSetContainer = true;
  Vue.use(VueClipboard);
  export default {
    name: 'app',
    components: {
      MspChosen,
      MspDropdownList,
      MspButton,
      MspJarvisWidget,
      MspModalDialog
    },
    data: function(){
      return {
        selectedCities: ["2"],
        selectedCity: "3",
        selectedItem: "7",
        logItems: [
          {id: 3, text: "log3"},
          {id: 2, text: "log2"},
          {id: 1, text: "log1"},
        ],
        loading: false
      }
    },
    mounted: function() {
      this.genLogList();
    },
    methods: {
      doCopy: function (text) {
        this.$copyText(text).then(function (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        }, function (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      },
      doCopyAll: function () {
        let text = '<table>';
        for (let item of this.logItems){
          text += `<tr><td>${item.id}</td><td>${item.text}</td></tr>`
        }
        text += '</table>';
        this.$copyText(text).then(function () {
          // eslint-disable-next-line no-console
          console.log(text)
        }, function (e) {
          // eslint-disable-next-line no-console
          console.log(e)
        })
      },
      genLogList: function(){
        let logId = 3;
        let items = this.logItems;
        let component = this;
        setInterval(function(){
          component.loading = true;
          setTimeout(function(){
            items.unshift({id: ++logId, text: "log"+logId});
            component.loading = false;
          }, 1000)
        }, 4000);
      },
      clickButton: function() {
        alert('Button clicked');
      },
      saveFormData: function(){
        alert("OK");
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
      onCitySelected: function(item) {
        alert(item)
      },
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

  .main-header{
    position:-webkit-sticky;
    position:sticky;
    top:0;
    text-align: right;
    height: 10px;
  }
</style>
