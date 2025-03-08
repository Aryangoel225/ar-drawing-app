export default defineNuxtPlugin(() => {
    if (typeof window !== "undefined" && !customElements.get("a-scene")) {
        import("aframe");
        import("@ar-js-org/ar.js");
    }
});
