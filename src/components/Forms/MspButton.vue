<template>
    <a href="#" v-bind:class="'btn waves-effect waves-themed btn-'+(buttonType ? buttonType : 'default')"
       v-on:click="$emit('click')">
        <span v-bind:class="'mr-2 '+iconClass"></span>
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