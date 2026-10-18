import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../binary/batch54-shared.js";
export type Input = Readonly<{ decimals: readonly string[] }>;
export type Output = ReturnType<typeof calculate>;
const fields = [
  { id: "decimals", kind: "stringList", label: "decimals" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input) => {
  H.validate(i, fields);
  const d = i.decimals.map(H.decimal),
    scale = d.length ? Math.max(...d.map((x) => x.scale)) : 0;
  return H.finish({
    scale,
    coefficients: d.map((x) => String(x.n * H.pow10(scale - x.scale))),
  });
};
export const example = {
  input: { decimals: ["1.2", "0.003"] },
  output: { result: { scale: 3, coefficients: ["1200", "3"] } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "number/decimal-spelling-align-scales",
  title: "Decimal Spelling Scale Aligner",
  description:
    "Align a list of decimal spellings to a common exact coefficient scale; no precision loss or rounding.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Explicit result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          scale: { type: "number" },
          coefficients: { type: "array", items: { type: "string" } },
        },
        required: ["scale", "coefficients"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
