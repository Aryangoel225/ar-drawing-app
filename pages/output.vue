<template>
    <client-only>
        <a-scene embedded arjs>
            <a-marker preset="hiro">
                <a-box position="0 0.5 0" material="color: red"></a-box>
            </a-marker>
            <a-entity camera></a-entity>
        </a-scene>
    </client-only>
</template>

<script setup>
definePageMeta({ ssr: false });
</script>

<style scoped>
a-scene {
    width: 100%;
    height: 100vh;
}
</style>