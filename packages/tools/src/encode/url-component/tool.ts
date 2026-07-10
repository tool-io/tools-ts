import { createSimpleTool } from "../../core/simple.js";
export const urlComponentTool = createSimpleTool({
  id: "encode/url-component",
  title: "URL Component Encoder",
  description: "Percent-encode text for use as one URL component.",
  inputs: [{ id: "text", label: "Text", kind: "string" }],
  outputs: [
    {
      id: "encoded",
      label: "Encoded component",
      kind: "string",
      format: "url-component",
    },
  ],
  calculate: (input) => {
    return { encoded: encodeURIComponent(input.text as string) };
  },
});
export const runUrlComponent = urlComponentTool.execute;
export default urlComponentTool;
