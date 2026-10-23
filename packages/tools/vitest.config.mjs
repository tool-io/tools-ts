export default {
  // Vite's SSR JSON shortcut requires explicit true/false values. The default
  // "auto" setting still sends the large catalog through the SSR AST transform.
  json: { stringify: true, namedExports: false },
};
