import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{
  value: number;
  center: number;
  spread: number;
  zeroSpreadPolicy: string;
}>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "value", label: "Value", kind: "number" },
  { id: "center", label: "Center", kind: "number" },
  { id: "spread", label: "Spread", kind: "number" },
  {
    id: "zeroSpreadPolicy",
    label: "Zero spread policy",
    kind: "string",
    enum: ["zero", "reject"],
  },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.check(i.spread >= 0);
  H.choice(i.zeroSpreadPolicy, ["zero", "reject"]);
  H.check(i.spread !== 0 || i.zeroSpreadPolicy === "zero");
  return H.finish({
    defined: i.spread !== 0,
    normalized: i.spread !== 0 ? (i.value - i.center) / i.spread : 0,
  });
};
export const example = {
  input: { value: 3, center: 2, spread: 0, zeroSpreadPolicy: "zero" },
  output: { result: { defined: false, normalized: 0 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "normalize/robust-scaler-zero-spread-policy",
  title: "Normalization: Robust Scaler Zero Spread Policy Tool",
  description:
    "Compute one robust-reference normalized scalar with an explicit reject/zero policy for a supplied zero spread, preserving defined status.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: {
          defined: { type: "boolean" },
          normalized: { type: "number" },
        },
        required: ["defined", "normalized"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
