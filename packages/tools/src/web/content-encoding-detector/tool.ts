import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import { validateInput, finish, parseHttpTokens } from "../batch50-shared.js";
export type Input = Readonly<{ readonly actualContentEncodingHeader: string }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  {
    id: "actualContentEncodingHeader",
    label: "Actual content encoding header",
    kind: "string",
  },
] as const satisfies readonly SimpleField[];
const compute = (input: Input): Readonly<Record<string, unknown>> => {
  const a = parseHttpTokens(input.actualContentEncodingHeader);
  return {
    declaredContentCodings: a,
    unknownDeclaredCodings: a.filter(
      (v) =>
        !["gzip", "compress", "deflate", "br", "zstd", "identity"].includes(v),
    ),
  };
};
export const calculate = (input: Input): Output => {
  validateInput(input, fields);
  return finish({ result: compute(input) });
};
export const example = {
  input: { actualContentEncodingHeader: "gzip, br" },
  output: {
    result: {
      declaredContentCodings: ["gzip", "br"],
      unknownDeclaredCodings: [],
    },
  },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "web/content-encoding-detector",
  title: "Content Encoding Detector",
  description:
    "Parse actual DECLAREDC ontent-Encoding coding list in applied order, knowncodinginventorygzip/compress/deflate/br/zstd/identity. Does not detect bytes, sniff encoding, decompress or accept header as proof content. Empty header means none, no request.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Actual calculation or qualified reference",
      kind: "object",
    },
  ],
  calculate: (value) => calculate(value as unknown as Input),
});
export const run = tool.execute;
export default tool;
