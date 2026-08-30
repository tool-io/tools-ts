import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, simpleError } from "../../core/simple.js";

export type HeaderNameNormalizerInput = Readonly<{
  readonly headerName: string;
}>;
export type HeaderNameNormalizerOutput = Readonly<{
  readonly normalizedName: string;
}>;

export const calculateHeaderNameNormalizer = (
  x: HeaderNameNormalizerInput,
): HeaderNameNormalizerOutput => {
  if (typeof x.headerName !== "string")
    simpleError("headerName", "Provide a string.");
  if (!/^[!#$%&'*+.^_`|~0-9A-Za-z-]+$/.test(x.headerName))
    simpleError("headerName", "Header name must be a nonempty HTTP token.");
  return { normalizedName: x.headerName.toLowerCase() };
};

export const example = {
  input: { headerName: "Content-Type" },
  output: { normalizedName: "content-type" },
} satisfies ToolExample<HeaderNameNormalizerInput, HeaderNameNormalizerOutput>;

export const tool = createSimpleTool({
  id: "http/header-name-normalizer",
  title: "HTTP Header Name Normalizer",
  description:
    "Validate an HTTP field name as an RFC token and convert it to lowercase for case-insensitive lookup.",
  inputs: [{ id: "headerName", kind: "string", label: "Field name" }],
  outputs: [
    { id: "normalizedName", kind: "string", label: "Lowercase field name" },
  ],
  calculate: (input) =>
    calculateHeaderNameNormalizer({
      headerName: input.headerName as string,
    }),
});
export const headerNameNormalizerTool = tool;
export const runHeaderNameNormalizer = tool.execute;
export default tool;
