export default {
  optimizeDeps: {
    // avoids loading deps multiple time
    exclude: ['prosemirror-model', 'y-prosemirror', 'y-websocket'],
    // root: "demo"
  }
};
