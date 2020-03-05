<template>
    <div>
        <div class="alert alert-success fade in" v-if="value && type=='success'">
            <i class="fa-fw fa fa-check"></i>
            {{value}}
        </div>
        <div class="alert alert-danger fade in" v-if="value && type=='danger'">
            <i class="fa-fw fa fa-times"></i>
            {{value}}
        </div>
        <div class="alert alert-info fade in" v-if="value && type=='info'">
            <i class="fa-fw fa fa-info"></i>
            {{value}}
        </div>
        <div class="alert alert-warning fade in" v-if="value && type=='warning'">
            <i class="fa-fw fa fa-warning"></i>
            {{value}}
        </div>
    </div>
</template>

<script>
    export default {
        name: "MspAlert",
        props: {
            value: String,
            type: String
        }
    }
</script>

<style scoped>

</style>