import type { ToolExample } from "../../core/example.js";
import { createSimpleTool, type SimpleField } from "../../core/simple.js";
import * as H from "../../core/batch59-shared.js";
export type Input = Readonly<{ cdfLeft: number; cdfAt: number }>;
export type Output = { readonly result: Readonly<Record<string, unknown>> };
const fields = [
  { id: "cdfLeft", label: "Cdf left", kind: "number" },
  { id: "cdfAt", label: "Cdf at", kind: "number" },
] as const satisfies readonly SimpleField[];
export const calculate = (i: Input): Output => {
  H.validate(i, fields);
  H.bounded(i.cdfLeft, 0, 1);
  H.bounded(i.cdfAt, i.cdfLeft, 1);
  return H.finish({ atomMass: i.cdfAt - i.cdfLeft });
};
export const example = {
  input: { cdfLeft: 0.2, cdfAt: 0.5 },
  output: { result: { atomMass: 0.3 } },
} satisfies ToolExample<Input, Output>;
export const tool = createSimpleTool({
  id: "probability/discrete-cdf-jump-size",
  title: "Probability: Discrete Cdf Jump Size Tool",
  description:
    "Recover a discrete atom probability from one supplied left limit and right-continuous CDF value, enforcing monotonic probability bounds.",
  inputs: fields,
  outputs: [
    {
      id: "result",
      label: "Calculated result",
      kind: "object",
      schema: {
        type: "object",
        additionalProperties: false,
        properties: { atomMass: { type: "number" } },
        required: ["atomMass"],
      },
    },
  ],
  calculate: (v) => calculate(v as unknown as Input),
});
export const run = tool.execute;
export default tool;
