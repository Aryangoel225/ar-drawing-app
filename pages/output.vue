<template>
    <div>
        <a-scene embedded arjs>
            <!-- AR Camera -->
            <a-marker preset="hiro">
                <a-entity gltf-model="/models/sample-model.glb" scale="0.5 0.5 0.5" position="0 0 0">
                </a-entity>
            </a-marker>
            <a-entity camera></a-entity>
        </a-scene>
    </div>
</template>

<script>
export default {
    name: "ARView"
};
</script>

<style>

a-scene {
    width: 100vw;
    height: 100vh;
}
</style>