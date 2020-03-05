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
        selectedItem: "7"
      }
    },
    methods: {
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
</style>
