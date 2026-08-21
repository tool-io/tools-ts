import type { ToolExample } from "../../core/example.js";
import { createSimpleTool } from "../../core/simple.js";

export const urlComponentExample = {
  input: { text: "hello world & more" },
  output: { encoded: "hello%20world%20%26%20more" },
} satisfies ToolExample<
  { readonly text: string },
  { readonly encoded: string }
>;

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
