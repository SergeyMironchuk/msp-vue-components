<template>
    <div>
        <input
                :value="value"
                @input="$emit('input', $event.target.value)"
        >
        <slot></slot>
    </div>
</template>

<script>
    export default {
        name: "TrainingComponent",
        props: ['value']
    }
</script>

<style scoped>

</style>