<template>
    <a href="#" v-bind:class="'btn btn-labeled btn-'+(buttonType ? buttonType : 'default')"
       v-on:click="$emit('click')">
        <span class="btn-label"><i v-bind:class="iconClass"/></span>
        <slot/>
    </a>
</template>

<script>
    export default {
        name: "MspButton",
        props: {
            'iconClass': String,
            'buttonType': String
        }
    }
</script>

<style scoped>

</style>