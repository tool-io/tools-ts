import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export const urlComponentExample = {
  input: { encoded: "hello%20world%20%26%20more" },
  output: { decoded: "hello world & more" },
} satisfies ToolExample<
  { readonly encoded: string },
  { readonly decoded: string }
>;

export const urlComponentTool = createSimpleTool({
  id: "decode/url-component",
  title: "URL Component Decoder",
  description: "Decode percent escapes in one URL component.",
  inputs: [
    {
      id: "encoded",
      label: "Encoded component",
      kind: "string",
      format: "url-component",
    },
  ],
  outputs: [{ id: "decoded", label: "Decoded text", kind: "string" }],
  calculate: (input) => {
    try {
      return { decoded: decodeURIComponent(input.encoded as string) };
    } catch {
      return simpleError(
        "encoded",
        "Enter a valid percent-encoded URL component.",
      );
    }
  },
});
export const runUrlComponent = urlComponentTool.execute;
export default urlComponentTool;
