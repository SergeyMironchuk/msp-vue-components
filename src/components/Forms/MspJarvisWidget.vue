<template>
    <section id="widget-grid" class="" style="padding: 5px;">
        <!-- Widget ID (each widget will need unique ID)-->
        <div class="jarviswidget" id="wid-id-1" data-widget-colorbutton="false" data-widget-editbutton="false"
             data-widget-deletebutton="false" data-widget-togglebutton="false">
            <!-- widget options:
            usage: <div class="jarviswidget" id="wid-id-0" data-widget-editbutton="false">

            data-widget-colorbutton="false"
            data-widget-editbutton="false"
            data-widget-togglebutton="false"
            data-widget-deletebutton="false"
            data-widget-fullscreenbutton="false"
            data-widget-custombutton="false"
            data-widget-collapsed="true"
            data-widget-sortable="false"

            -->
            <header>
                <span class="widget-icon"> <i v-bind:class="iconClass"></i> </span>
                <h2>{{caption}}</h2>
            </header>
            <!-- widget div-->
            <div>
                <!-- widget edit box -->
                <div class="jarviswidget-editbox">
                    <!-- This area used as dropdown edit box -->
                </div>
                <!-- end widget edit box -->
                <!-- widget content -->
                <div class="widget-body">
                    <slot></slot>
                </div>
            </div>
        </div>
    </section>
</template>

<script>
    export default {
        name: "MspJarvisWidget",
        props: {
            caption: String,
            iconClass: String
        }
    }
</script>

<style scoped>

</style>